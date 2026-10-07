# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html); the first tagged release was
1.0.0.

Day-to-day working history lives in a project's [`JOURNAL.md`](JOURNAL.md), which the kit
ships as an empty template; this file is the curated,
user-facing summary that begins at the first release.

## [Unreleased]

## [1.0.2] — 2026-10-06

Security updates of the dependencies, a pre-approved list of routine commands for Claude
Code, and small corrections from the review of 1.0.1.

### Added

- **Routine commands run without a confirmation click.** `.claude/settings.json` now carries
  a short `permissions.allow` list, so Claude Code no longer asks before the kit's routine
  steps: `npm start`, `npm run tools`, `npm run test:ci`, `npm run test:tools`,
  `npm run lint`, `npm run build:prod` and plain `git status`, `git diff`, `git log`, each
  as written (in Bash a wrapper such as `timeout` in front does not matter) and from Bash
  and PowerShell, plus edits in `out/`, `src/assets/`, `profile/USER-MANIFEST.MD`,
  `JOURNAL.md` and `OPEN-QUESTIONS.md`. The command entries carry no wildcards, so a
  different command line still asks, unless Claude Code already counts it as read-only, as
  it does for `git log --oneline`; the safety hook still checks every call and the deny list
  still wins. [`base/SAFETY.md`](base/SAFETY.md) lists the entries, and
  `directives/kit-tools.md` no longer says that nothing is allowed in advance.

### Fixed

- **Easy-language note on the agents page.** The easy-language versions of `/dev/agents`
  (German and English) still said the guides are in English on purpose, while the guide
  articles are German on German pages since 1.0.1. The note now says that the building-block
  docs and the agent guides stay English and that the long guides also come in German.
- **Wording.** ADR-0018 speaks of a third guide language being added, not ordered; the
  1.0.1 entry below names `OptimusA11yService` instead of an "Optimus bridge" and wraps an
  overlong line; a stylesheet comment no longer lists a purple palette.

### Security

- **The safety hook was hardened.** Alongside the pre-approved command list, the
  `PreToolUse` hook (`.claude/hooks/guard-red-actions.mjs`) now refuses the few ways a
  plain-looking git or `node` command could still run code or write a protected file
  without review: `git difftool`/`git mergetool` and a git config value or environment
  variable that makes `git diff`/`git log` run an external program (pager, editor,
  `diff.external`, `textconv`, `interactive.diffFilter`, a merge/diff tool command, a
  filter driver, `credential.helper`, an included config file,
  `GIT_EXTERNAL_DIFF`/`GIT_PAGER`/`GIT_SSH_COMMAND`, config injected through
  `GIT_CONFIG_PARAMETERS`/`GIT_CONFIG_COUNT`/`GIT_CONFIG_GLOBAL`, `--ext-diff`,
  `--textconv`); git pointed with `-C`, `--git-dir`, `--work-tree` or `GIT_DIR` at a
  repository under `out/`, `src/assets/`, a temp folder or outside the project via `..`;
  `NODE_OPTIONS` carrying `--require`/`--import`/`--loader`, which every node process of
  the command would load; `git … --output=<file>`, `git format-patch -o <dir>` and
  `GIT_TRACE*=<path>`, which write a file named in the command past the usual redirect checks; `node`/`tsx`/`ts-node`
  running a script that escapes its folder with `..`, lives under `out/` or `src/assets/`,
  or sits in a temp directory, also when `npx`, `npm exec`, `pnpm dlx` or `yarn` starts it;
  and `git commit -a`/`-am`/`--all`, the same stage-all as `git add -A`. Each is refused with a
  reason, so a person runs it themselves if it is wanted; the kit's own `node tools/…` and
  `node scripts/…` commands are unaffected, also when the project itself lives in the temp
  folder. [`base/SAFETY.md`](base/SAFETY.md) lists them.
- **No known vulnerabilities left.** All 16 open security advisories against the kit's
  dependencies are fixed, and so are two that were published while this release was being
  prepared: `shell-quote` (critical, used by `concurrently` for `npm start`) and
  `source-map-js` (high, used by the build's CSS tooling). On the release date `npm audit`
  reports 0 vulnerabilities, for production and development dependencies alike. The current
  releases of `concurrently` pin an affected `shell-quote` version, so `package.json` now
  overrides it to 1.12 (`overrides`); remove that line once `concurrently` ships a fixed
  version.
- **Major versions.** No direct dependency of version 1.x or later moved to a new major
  version. Some packages they pull in did, inside the ranges those dependencies declare:
  the parser packages of the build's CSS inliner (`htmlparser2` 10→12, `css-select` 6→7
  and their helpers) and `@inquirer/core` 11→12 behind the Angular CLI's prompts. The
  kit's full test suite and build pass on them.
- **Angular 22.2.1** (from 22.1.x) fixes the advisories in `@angular/router` and
  `@angular/platform-server`, and brings `piscina` 5.3.2, which fixes a critical advisory in
  the build tooling.
- **Development tooling refreshed** within the allowed ranges: `undici`, `fast-uri` and
  `brace-expansion`; `ip-address` is no longer installed at all.
- **Further updates:** cytoscape 3.34.3, prettier 3.9.9, puppeteer 25.12.0,
  typescript-eslint 8.71.1, angular-eslint 22.5.0, and zone.js 0.16.3 (from 0.15; a 0.x
  step, which may change behaviour, but the kit's full test suite passes on it).

### Upgrading

- Puppeteer 25.12 uses a newer Chrome. If the PDF, screenshot or accessibility tools report
  a missing browser after updating, run `npx puppeteer browsers install chrome` once.

## [1.0.1] — 2026-10-05

The design-system workshop speaks German: all 61 design guides come in a full German
version. Plus a few corrections in the English guides, and no purple left anywhere in the
kit: color variants, tokens, components, pages and the guides that name them.

### Added

- **German design guides.** Every guide article in the design-system workshop
  (`/dev/design/guide/…`) now comes in German too: on `de` and `de-easy` a guide shows its
  German version, on `en` and `en-easy` the English original; a guide added later without a
  German version falls back to English instead of looking broken. All 61 guides are
  translated in full — prose, tables, demo labels, live readouts and accessible names — while
  code samples, API names and measured values stay exactly as in English. Guide titles and
  one-line summaries are German on the German pages — guide header, related guides, gallery,
  quick-switch and the agents index. The Agent tab stays English, because it is the contract
  AI agents read, and tells German readers so in one line. A new gate,
  `scripts/check-guide-translations.mjs`, keeps every German guide in step with its English
  original (same tabs, same structure, code left untouched) and runs in
  `npm run build:prod` and the harness; the house-style check now reads the German guides as
  well. How it is built and why: [ADR-0018](docs/adr/0018-german-guide-twins-by-inheritance.md).

### Changed

- **Guide articles share their imports and styles.** Each English guide component now takes
  `imports: ARTICLE_IMPORTS` and `styles: [ARTICLE_STYLES]` from two exported constants, so
  its German twin renders with the same rules; members that hold visible text are
  `protected` instead of `private`, and text fields are typed `string`, so a twin can
  replace them. The guide registry carries `titleDe` and `summaryDe` for every entry.
  `/new-guide` and `directives/guide-authoring.md` describe the new shape: a new guide ships
  in both languages.
- **Upgrading from 1.0.0.** A guide you added yourself needs `titleDe` and `summaryDe` in
  its registry entry, or `check-design-guides` fails the build; a German twin is optional and
  the guide falls back to English without one. Purple tokens and variants are renamed or
  gone (see below), so search your own code for them: `--semantic-purple-fg` is now
  `--semantic-cyan-fg`, `--style-candy-purple` is now `--style-candy-blue`, and the palette
  `--purple-50` … `--purple-900` (with the `purple-*` keys of `$colors` in
  `src/styles/design-tokens.scss`, and with them `--color-purple-*` and the utility classes
  `.text-purple-*`, `.bg-purple-*` and `.border-purple-*`) is removed — use `--p-pink-*` from
  Aura or another kit hue; class names are not type-checked, so search your templates. The
  `purple` value of component inputs is renamed: `app-stat-card`, `app-icon-grid`
  and `app-circular-progress` take `'pink'`, a `PromptTag` takes `'yellow'`, a registered
  floating button takes `FabColor` `'blue'` (CSS class `.fab-blue` instead of `.fab-purple`);
  TypeScript flags every old value when you build. `--rarity-epic`, `--neural-network` and
  `--unsupervised` keep their names with new values (`#db2777`, `#ec4899`, `#14b8a6`).
- **No purple left in the kit.** The `mystic` color runs from magenta
  (`#b8147f`) to a red-leaning rose (`#d0174a`) instead of purple to magenta; in dark mode its
  fills are `#9a116a` / `#af133e` and its text colors pink and rose (`#f9a8d4`, `#fda4af`). The
  name `mystic` is unchanged, so a saved choice keeps working. All 392 gated mystic pairs pass
  (`docs/generated/CONTRAST.MD`); the tightest are the accent text on the page background,
  4.93:1 in light mode, and the focus ring on a selected table row, 4.78:1 in dark mode. The
  glossary card on the home page takes a green button (`#15803d`, 5.02:1 with white text)
  instead of indigo, and the confetti dot of the Lernwerkstatt style is blue: the token
  `--style-candy-purple` is now `--style-candy-blue` (`#4a85e6`, dark `#8fb3f5`).
  The sixth semantic ink is cyan instead of purple: `--semantic-cyan-fg` is `#0e7490` in light
  mode (4.91:1 on the page background, 5.36:1 on a card) and `#67e8f9` in dark mode (9.06:1 at
  the lowest across the four styles); it also colors the `help` text button. The filled
  `help` button is cyan in the Lernwerkstatt style (`#0e7490`, 5.36:1 with white text), a
  teal watercolor in Skizzenbuch (ink `#2b6169`, 5.73:1) and burnt orange in Blaupause
  (`#a4470c`, 6.03:1), where cyan would look like its info button; Skizzenbuch's fourth
  page wash is a soft blue instead of lavender. Everywhere else purple, violet and indigo
  give way to a hue the neighbours do not use: the `definition` variant of
  `app-standard-container` and the icon of `app-definition` are pink, the glossary chip of
  the related references is pink, the glossary in the ontology map is pink, the compare
  button among the floating buttons is blue, the mystery card on the roadmap is rose, the
  glossary tag "NLP" is amber, the home page glows use blue,
  cyan, yellow and slate, the news types "launch" and "language" glow rose and sky, and the
  catalog, the source cards, a learning path and the content thumbnails use teal, pink,
  rose, blue or slate. All contrast pairs pass (`docs/generated/CONTRAST.MD`), and the
  color-system, chart, design-tokens and progress guides and their German versions name
  the new values.

### Fixed

- **Tags without color.** The glossary's "ethics" and "Applications" tags, the `pink` tag of
  the prompt example and three framework-card colors named palette tokens the kit never
  defined (`--pink-*`, `--cyan-*`, `--indigo-*`) and rendered without color; they take the
  theme library's pink, cyan and slate (`--p-pink-*`, `--p-cyan-*`, `--p-slate-*`) or the
  kit's red now.
- **Guide corrections found while translating.** Skeleton counts seven inputs, as its
  table does; the Chart guide's unnamed chart is announced in four words, not six; the
  Rating guide says that the per-star names follow the page language through the kit's
  `OptimusA11yService`; the Card guide's history records the changed dark outline of the
  Lernwerkstatt style; the Accessibility guide gives 3.52:1 as the lowest inset focus ring on
  a selected row and no longer calls the workshop English-only.

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

[Unreleased]: https://github.com/Tanno-Finn/vibe-core/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/Tanno-Finn/vibe-core/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Tanno-Finn/vibe-core/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Tanno-Finn/vibe-core/releases/tag/v1.0.0
