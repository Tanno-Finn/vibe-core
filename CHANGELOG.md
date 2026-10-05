# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html); the first tagged release was
1.0.0.

Day-to-day working history lives in a project's [`JOURNAL.md`](JOURNAL.md), which the kit
ships as an empty template; this file is the curated,
user-facing summary that begins at the first release.

## [Unreleased]

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
  Aura or another kit hue; class names are not type-checked, so search your templates. The `purple` value of component inputs is renamed: `app-stat-card`, `app-icon-grid`
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
  Optimus bridge; the Card guide's history records the changed dark outline of the
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

[Unreleased]: https://github.com/Tanno-Finn/vibe-core/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/Tanno-Finn/vibe-core/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Tanno-Finn/vibe-core/releases/tag/v1.0.0
