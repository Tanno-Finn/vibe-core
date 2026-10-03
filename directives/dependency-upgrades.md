<!-- base -->
# dependency-upgrades — directive

How to take a dependency through a **major version** without importing a surprise. The
lesson behind it is concrete: the upgrade of 2026-08-23 moved the kit's UI library one
major up, five commits, build and tests green, twenty lines of session notes — and
not one word about the fact that the new major had changed its license from MIT to a
per-deployer commercial license with a banner in every unkeyed clone. The build could
not tell. Only reading could. ([ADR-0014](../docs/adr/0014-leave-primeng-22-for-optimus-ui.md)
is the bill for that omission.)

## Before building: read, then decide

For every package that moves a major (and for any minor that a changelog calls a
"new chapter", "relicensing", "sunset" or similar), **before** the first `npm install`:

1. **License.** Open the new version's `LICENSE`/`LICENSE.md` in the tarball
   (`npm pack <pkg>@<version>`, or `npm view <pkg>@<version> license` as the first,
   never the only, check) and compare it with the version you are leaving. A changed
   SPDX identifier, a new "community"/"commercial" split, a key or activation
   mechanism, an eligibility list, an OEM clause — each is a **stop**. Say what it
   means for the kit's own license and for the people who clone it, in one plain
   sentence, and let the owner decide ([stewardship](stewardship.md), license radar).
2. **Maintenance status.** Is the previous major still maintained, for how long, by
   whom? Is the repository archived? Does an open "supports framework version X" issue
   have an answer? Write the answer down — it is what the fallback plan is made of.
3. **Peer ranges.** What does the new version peer on (`npm view <pkg> peerDependencies`)?
   If the answer is "a patch of the framework you do not have yet", the framework moves
   first, in its own commit, and `--legacy-peer-deps` is not a solution but a symptom.
4. **Companion packages.** Themes, icons, utilities that version together with the
   package move together — and their licenses are read the same way (a fork may carry
   two copyright lines; the Impressum must show both).

## While building

- One major per branch, one concern per commit: framework, library, tooling. The
  reviewer of a five-commit upgrade should be able to say which commit changed what.
- Formatting churn a schematic produces goes in its own commit before the semantic
  one, or the diff is unreadable.
- Everything the docs pin (`measured-against`, provenance line numbers, the Impressum's
  versions) is part of the upgrade, not a follow-up.

## Watch list

- **Optimus UI** (`@openng/optimus-ui`, since ADR-0014): a community fork. At every
  Angular major, before the framework moves, measure the fork — `npm view
  @openng/optimus-ui dist-tags peerDependencies time`, release cadence, open-issue trend —
  and put the numbers in the journal. Rule decided 2026-09-02: if no release peers on the
  new Angular major within 8 weeks of its stable release, the kit stays on the old major
  and an option-E probe (Angular Material) starts, so the re-platforming cost is measured
  before it is needed.

## In the journal entry

Name the license of what you installed, in words, even when it did not change ("still
MIT"). An upgrade entry that says nothing about the license is the gap this directive
closes.
