# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html); the first tagged release was
1.0.0.

Day-to-day working history lives in a project's [`JOURNAL.md`](JOURNAL.md), which the kit
ships as an empty template; this file is the curated,
user-facing summary that begins at the first release.

## [Unreleased]

## [1.0.0] — 2026-10-03

The first release: a working Angular portal for an educational companion site, in German
and English with an Easy-Language variant of each, plus the agent system an AI coding agent
reads and follows when it works on the portal with you. Checked for this release: 775 tests,
110 helper-tool checks, and the accessibility check on every built page, all green.

### Added

- **The portal.** Articles with quizzes and checkpoints, a glossary, an AI timeline,
  interactive demos, learning paths with progress kept in the browser, a sources page, a
  catalog, news and a roadmap, a settings page, an imprint and an accessibility statement — in
  four locales (`de`, `en`, `de-easy`, `en-easy`). The production build prerenders the pages
  into a static site that any web host can serve; there is no server, no database and no
  login, and the analytics hooks send nothing until you wire them to an endpoint of your own.
- **UI library and design system.** Optimus UI 2.0.2 on Angular 22, both under MIT. A
  design-system workshop at `/dev` (development builds only, stripped from production) holds
  a shelf of 61 measured guides covering 88 of the library's 99 components; each live demo
  sits next to the canonical doc the agent reads.
- **Styles and display modes.** Four visual styles (Lernwerkstatt as the default, Werkbund,
  Skizzenbuch, Blaupause), a choice of colors, and the display modes Light, Dark and System,
  which follows the operating system live. Every color pair is measured against the WCAG
  minimum in [`docs/generated/CONTRAST.MD`](docs/generated/CONTRAST.MD).
- **The agent system.** [`AGENTS.md`](AGENTS.md) as a short map (Claude Code reads it through
  `CLAUDE.md`); a versioned constitution; four standards — accessibility, privacy, security,
  quality — with 26 rules, each tagged hard or overridable, and an override that is a
  committed file and makes a gate advisory, never off; the Green / Yellow / Red safety model
  with one warning format, backed for Claude Code by a hook that blocks the hard-forbidden and
  Red actions; checkpoint commits and the books (`JOURNAL.md` and `OPEN-QUESTIONS.md` as empty
  templates for your own history); directives for how work is done, including language guides
  for 33 languages.
- **Skills the agent runs on request.** `/onboarding`, `/help`, `/status`, `/health`, `/ship`,
  `/new-content`, `/new-component`, `/new-guide`, `/new-directive`, `/research`, `/prototype`,
  `/variants`, `/adr` and `/translate` (a handout or page into other languages, as HTML, Word
  and PDF, right-to-left scripts included).
- **Three packs**, activated by talking: `teacher` (worksheet, quiz, differentiation,
  cover lesson, teaching unit), `editor` (the editorial chain for filling the kit with your
  own subject) and `researcher` (the evidence layer behind the editor's claims).
- **Twelve helper tools** under [`tools/`](tools/README.md), offline and tested: PDF, Word
  (also right to left), screenshots, the accessibility check, reading level, language status,
  a single-file bundle, a site export for a school web server, a local preview, a new-page
  scaffold, a setup doctor, and `make-it-yours`, which turns the kit into your own portal —
  name, start page, switched-off features, the operator for the imprint, and the removal of
  the sample content — without committing anything, every step undoable.
- **Quality gates.** `npm run build:prod` runs the content, i18n, design-system, contrast,
  house-style, genericity and harness checks and refuses to finish over a test suite that is
  red, missing or stale; `scripts/verify-harness.mjs` checks the agent system itself; the
  doc-translation gate keeps every bilingual document in step with its mirror; lint enforces
  guarded browser globals. CI runs a secret scan, the harness, the tool tests, the safety-hook
  self-test, the test baseline, the production build, the accessibility pass on the built
  pages, lint and formatting.
- **Documentation** along the four Diátaxis modes, in English with German mirrors: getting
  started, your first agent session, deploying, making the kit yours, adding a page, a
  source, a language or a backend, and the decision records behind the architecture.

[unreleased]: https://github.com/Tanno-Finn/vibe-core/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Tanno-Finn/vibe-core/releases/tag/v1.0.0
