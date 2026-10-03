**Deutsch:** [Diese Seite auf Deutsch](docs/de/CONTRIBUTING.md)

# Contributing

Thanks for considering a contribution. This project is an agent-first starter kit, so it
holds itself to the same bar it asks its agent to meet: a change is done when it builds
green, passes its checks, and its documentation travels in the same commit.

By participating in this project, you agree to abide by its
[Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to help

- **Report a bug** or **suggest a feature** — open an issue (templates guide you).
- **Improve the docs** — the documentation is part of the product; corrections and clearer
  explanations are as welcome as code.
- **Send a change** — see the pull-request flow below.

## Before you start a code change

1. Fork the repository and create a branch off the default branch.
2. Make sure you can build it first: `npm install`, then `npm start` (see
   [Getting started](docs/tutorial/getting-started.md)).

## The checks a change must pass

These are exactly the gates CI runs (`.github/workflows/ci.yml`), so run them locally before
you open a pull request:

| Check | Command | Must be |
|---|---|---|
| Lint | `npm run lint` | zero problems |
| Formatting | `npm run format:check` | no file out of Prettier style |
| Agent-system integrity | `node scripts/verify-harness.mjs` | all checks green |
| Safety hook self-test | `node .claude/hooks/guard-red-actions.test.mjs` | all cases pass |
| Unit tests (CI's baseline gate) | `npm run test:baseline` | green, at or above baseline |
| Production build (incl. integrity) | `npm run build:prod` | passes |
| Accessibility on the built pages | `npm run check:a11y` (after `build:prod`) | no new `[hard]` violation |
| Secret scan | gitleaks — CI only (your commits on each push and PR, the whole history weekly); locally `gitleaks git` if you have it installed | no finding |

Both test commands run the same specs: the curated Vitest set listed in `angular.json`'s
`test.include` — a spec not listed there never runs under either. `npm run test:ci`
(`ng test --watch=false`) runs them and fails on a red test. `npm run test:baseline`
(`scripts/check-test-baseline.mjs`) runs them the same way and additionally fails if the
number of green files or tests drops below the recorded floor, or if any test is skipped or
marked todo. The baseline gate is what CI invokes directly, and `npm run build:prod` runs it
too — after the compile and the integrity checks, before the build manifest is written and
`scripts/verify-build.js` verifies the result as the build's final step. So a change that is
green under `test:ci` can still fail the baseline gate if it removed or skipped a test.
Run on its own (`node scripts/verify-build.js`), that final check is the one to make before
publishing a `dist/`: it fails when the build manifest is missing or older than the build
output, as it is after a raw `ng build`.

## What "done" means here

- **Docs travel with code.** If you change behavior, update the affected doc in the same
  change — a design-system component's canonical doc, a skill's `SKILL.md`, a how-to guide.
  The kit treats out-of-date docs as a defect.
- **No debt hidden behind suppressions.** Don't silence lint with `eslint-disable`, `as any`,
  or `@ts-ignore`; fix the underlying issue. The tree is kept at zero lint problems on purpose.
- **Keep it timeless and scrubbed.** User-facing prose avoids naming specific vendors, prices,
  or pinned versions except in a clearly dated box, and never carries personal names, private
  domains, or credentials.
- **Small, reviewable commits.** Commit messages say what changed and why.
- **Comments are bilingual today.** Identifiers and documentation are English; a share of the
  inline code comments is German (the kit's origin). Either language is fine in contributions,
  and translating a German comment to English while you're editing a file is welcome.

## Pull requests

Open a pull request against the default branch and fill in the template. Describe what changed,
why, and how you verified it. A maintainer reviews non-trivial changes before merge; expect a
second pair of eyes on anything beyond a typo fix.

## License of contributions

By contributing, you agree that your contributions are licensed under the same terms as the
project: code under MIT and content under CC BY 4.0 (see [`LICENSING.md`](LICENSING.md)).
You confirm that you wrote the contribution yourself, or that you otherwise hold the rights
to license it on these terms. Do not paste in text, images, or code that is under a
share-alike or copyleft license (CC BY-SA, GPL, and similar) — this project's licenses
cannot carry those conditions. Third-party material may only be included under a license
compatible with MIT (code) or CC BY 4.0 (content), and must be attributed.

## A note on the agent tooling

Much of this repo is scaffolding for an AI coding agent (see [`AGENTS.md`](AGENTS.md)). You do
not have to use an agent to contribute — every command above works by hand — but if you do, it
already knows these rules and can run the checks for you.
