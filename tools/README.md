# Kit tools — agent reference

Tested command-line helpers for the jobs agents otherwise improvise: PDF, Word, an
accessibility check, screenshots, a single-file bundle, a site export for a school server, a
local preview, a check that the tools can run here, reading-level advice, a count of how far
a language is, a scaffold for a new portal page, and the step from the kit's showcase to your
own portal (name, switches, sample content out). The rule for using them is
[`directives/kit-tools.md`](../directives/kit-tools.md); the human how-to is
[`docs/how-to/use-the-kit-tools.md`](../docs/how-to/use-the-kit-tools.md). Specification and
decisions: [`specs/2026-09-25-kit-tools/`](../specs/2026-09-25-kit-tools/).

`npm run tools` lists what is registered (read from `kit.json` → `tools`). Skills do not
hard-code the paths below: they read `kit.json` → `capabilities`, find the `tools` entry whose
`provides` holds the capability, and run its `run` command (`--help` first).

## The convention (every tool)

- `node tools/<id>.mjs …`: the same in PowerShell, cmd, bash and zsh. No per-tool npm scripts.
- `--help` / `-h`: usage, every option with its default, an example, the exit codes. Starts no
  browser and touches no file.
- `--json`: stdout carries exactly one JSON object, keys in this order:
  `{ tool, ok, exitCode, outputs, findings, warnings, notChecked, … }`; tool-specific keys
  (`pages`, `tabOrder` …) follow. Human text then goes to stderr. A usage error prints the
  object too (`exitCode: 2`).
- Exit codes: **0** done · **1** a finding or an exceeded limit (`--max-pages`, a blocking
  A11Y violation, `--strict` warnings) · **2** usage error, missing or unsafe input, output
  exists without `--force` · **3** environment missing (browser, build, dependency), with the
  fix in the message; also an unexpected failure of the tool itself (stack printed).
- Paths: relative to the current folder; inputs and outputs must lie inside the project (the
  folder holding `kit.json`), links resolved; `.git/`, `.claude/`, `node_modules/` are refused
  as outputs, and so are the input itself and a link that points at nothing. An existing output
  is replaced only with `--force`. Every written file is printed with its absolute path, so open PNGs and
  PDFs by that path.
- Offline: the browser loads only the input's folder (links resolved), the served build or a
  loopback dev server, and `data:`. Every blocked request is a warning with its URL. Behind
  that, the browser runs with a proxy on `127.0.0.1:1` where nothing listens, so anything
  that leaves the computer fails (WebSockets, pop-ups and Chrome's own background calls too).
- Deterministic: same input, machine and browser → same bytes (no timestamps, no user names,
  no absolute paths inside the files).
- `notChecked` says what the tool did not look at. Pass it on; do not claim more.
- Default places: an artifact built from one input file (`pdf`, `docx`, `bundle`) goes next to
  that input, because it is the deliverable the person is looking for; evidence for the agent
  (screenshots, reports) goes to `out/tools/<tool>/`, and the site export to `out/site/`. Both
  folders are git-ignored, unlike the pack outputs beside them; nothing a tool writes for the
  agent lands next to the material.
- `KIT_TOOLS_ROOT` replaces the project root. Test-only; do not set it in real use.

Shared internals live in `scripts/lib/` (`browser.mjs`, `static-server.mjs`,
`a11y-verdict.mjs`, `zip.mjs`, `samples.mjs`, `i18n-orphans.mjs`), so gates never import from
`tools/`. The CLI plumbing is `tools/lib/cli.mjs`; file-or-route targets are
`tools/lib/target.mjs`; the layout of the hand-kept config JSON is `tools/lib/config-json.mjs`.

## pdf — `file:pdf`

```
node tools/pdf.mjs <input.html> [--out <file.pdf>] [--format A4|Letter] [--landscape]
                   [--max-pages <n>] [--bw-check] [--strict] [--force] [--json]
```

HTML → PDF in print media; the file's `@page` rule wins, `--format` (A4) is the fallback.
Prints the page count (root `/Count`, cross-checked against the page objects; a mismatch is
exit 3). `--max-pages n` → exit 1 when longer. Always warns about elements wider than the
printable area (selector + mm). `--bw-check` lists coloured text, borders and backgrounds and
text on tinted backgrounds that may go grey on a black-and-white copier (advice, `findings`
with `kind: "bw"`). Output: next to the input, `.pdf`. JSON extras: `pages`, `paper`.

## docx — `file:docx`

```
node tools/docx.mjs <input.md|input.html> [--out <file.docx>] [--lang <bcp47>]
                    [--title <text>] [--select <css>] [--font <name>] [--size <pt>]
                    [--force] [--json]
```

Markdown (via `marked`) or HTML (via `jsdom`) → `.docx` with built-in heading styles, lists (3
levels), tables with a repeated header row, hyperlinks, quotes, rules, page breaks (class
`page-break` or an inline `break-before: page`) and the document language. Language:
`--lang`, else `<html lang>`, else exit 2; a bare subtag gets a region (`de` → `de-DE`,
`it` → `it-IT`, `tr` → `tr-TR`, `ar` → `ar-SA` …, `lld` → `it-IT` with a warning). An element
with its own `lang` marks its runs. Right to left: `<html dir="rtl">` (or `<body dir>`), else a
right-to-left language (`ar`, `fa`, `he`, `ur` …) mirrors paragraphs, tables and the page; an
element's own `dir` or `lang` does it for its part; such text gets Arial as its complex-script
font. `aria-hidden="true"`, `script`, `style`, `template` are skipped; images become
"[Bild: alt]" and a warning. Content root: `--select`, else `<main>`, else `<body>`.
Output: next to the input, `.docx`. JSON extras: `lang`, `rtl`, `title`. The `/translate` skill
uses it to hand over one Word file per language.

## a11y — `check:a11y`

```
node tools/a11y.mjs <input.html> | --route </de/…> [--dist <dir> | --base <url>]
                    [--scheme light|dark|both] [--viewport desktop|mobile] [--easy]
                    [--open-details] [--click <selector>]… [--tab-order <n>] [--json]
```

axe-core in both colour schemes (default), one more audit after each `--click` (cumulative),
judged by `scripts/lib/a11y-verdict.mjs`, the same verdict as the `check:a11y` gate: a
violation of a `[hard]` A11Y rule is exit 1; unmapped or overridden ones are advice. axe's
"incomplete" results are `findings` with `kind: "check-by-hand"`. `--route` serves
`dist/vibecore/browser` (or `--dist`) with the SPA fallback; `--base` uses a running loopback
dev server (`http://localhost:2000`); no build and no `--base` → exit 3. `--easy` sets the
portal's Easy-Language preference. `--tab-order n` → `tabOrder` in the JSON (role, accessible
name, problems). In Git Bash, prefix route calls with `MSYS_NO_PATHCONV=1`.

## shot — `check:screenshot`

```
node tools/shot.mjs <input.html> | --route </de/…> [--dist <dir> | --base <url>]
                    [--viewport desktop|mobile|both] [--scheme light|dark|both] [--easy]
                    [--full-page] [--click <selector>]… [--out-dir <dir>] [--force] [--json]
```

PNG per viewport × scheme (defaults: both viewports, light), one more after each `--click`.
Desktop 1280×800, mobile 390×844 at device scale 2 (PNG 780×1688). Names
`<slug>-<viewport>-<scheme>[-easy][-click<k>].png`; slug = file name or route with `/` → `-`.
Default folder `out/tools/shot/` (git-ignored). All names are checked before the browser starts,
and the pictures are written only when every `--click` matched: a refused click leaves none.

## doctor — (no capability)

```
node tools/doctor.mjs [--json]
```

Run it first when a browser tool ends with exit 3. One line per check: Node against
`package.json` → `engines`, the packages `puppeteer`, `axe-core`, `jsdom` and `marked`, a browser
start and close (about 2 s), write access to `out/tools/`, each with the fix when it is missing
(exit 3). A last line reports the portal build (verified or not). It is information only: a
missing build does not set exit 3, because only `--route`, `preview` and `export-site` need it.
JSON extra: `checks` (`id`, `ok`, `detail`, `fix`, `blocking`).

## preview — (no capability)

```
node tools/preview.mjs [<dir>] [--port <n>] [--no-spa] [--json]
```

Serves `dist/vibecore/browser` (default, SPA fallback on) or a folder inside the project on
`127.0.0.1`. Without `--port`, the first free port from 2100 to 2199; with `--port`, exactly
that one or exit 2. Prints the URL (`--json`: the object with `url` as soon as it listens) and
runs until Ctrl+C. It is a long-running process: start it in the background and stop it when
done. No browser is opened. A path outside the folder, a link inside it that points
elsewhere, and a request whose `Host` is not `127.0.0.1:<port>` or `localhost:<port>` (DNS
rebinding) are 403.

## export-site — `file:site-export`

```
node tools/export-site.mjs [--dist <dir>] [--out <file.zip>] [--apache]
                           [--allow-unverified] [--force] [--json]
```

Zips a verified build (default `dist/vibecore/browser`) into `out/site/vibecore-<kitVersion>.zip`
and writes `SERVER-SETUP.md` (German and English) next to it: web root, why deep routes need a
fallback to `index.html`, the Apache and nginx rules, site root only. The rules are those of
`docs/how-to/deploy.md` for the languages in `src/config/languages.json`: `/` and `/<lang>/`
redirect to the prerendered `/<lang>/home/`, and a folder without an `index.html` of its own
(`/de/articles/`) gets the app shell instead of a 403 (which `FallbackResource` and nginx's
`try_files $uri $uri/ …` both produce there). A build is packed only
when its `.build-manifest.json` says what `scripts/verify-build.js` demands: `verification.passed`,
`tests.gate: "passed"`, and the test verdict's `indexSha256` equal to the current `index.html`;
otherwise exit 1, unless `--allow-unverified` (then a warning). A link inside the build is exit 2. The manifest stays out of the zip. `--apache` adds
that `.htaccess` to the zip. Deterministic bytes. JSON extras: `files`, `bytes`, `verified`.
Uploading is the human's step (SEC-005).

## bundle — `file:html-single`

```
node tools/bundle.mjs <input.html> [--out <file.html>] [--strict] [--force] [--json]
```

One offline HTML file for e-mail or Moodle: local stylesheets (with `@import`) become `<style>`,
local scripts become inline scripts (`defer`/`async` ones a `data:` src, so they keep their
timing), images, icons, media and fonts become `data:` URIs (`src`, `poster`, the first `srcset`
candidate, `style` attributes, CSS `url()`). Web references stay and are warnings, as are
missing files, files outside the project (links resolved), hidden files and folders (`.env`,
`.git/`: never packed into a file meant to be sent away), root-relative `/paths` and links to
other files; `--strict` → exit 1. Warns above 10 MB. Output: next to the input,
`.single.html`. In Moodle, upload it as a **File** resource: a Moodle **Page** strips scripts.
JSON extras: `bytes`, `inlined` (references packed in).

## reading-level — `check:reading-level`

```
node tools/reading-level.mjs <file.md|file.html> | --i18n <namespace> --lang <code>
                             [--easy] [--max-sentence <n>] [--json]
```

Advice, not a gate. Per section (a heading starts one; headings are not counted): sentences,
words per sentence (mean, max), LIX (under 30 very easy … above 60 very hard), share of words
over 6 letters, and every sentence over the limit (15 words with `--easy`, else 25;
`--max-sentence n` sets it and makes a longer sentence exit 1). `--easy` with German (`--lang`
or `<html lang>`) also lists words over 12 letters with neither `·` nor `-`, the kit's `de-easy`
compound style. `--i18n home --lang de-easy` reads `src/assets/i18n/modules/de-easy/home.json`
(a section per top-level key); a `-easy` code turns on `--easy`. `z. B.`, `e.g.`, common
abbreviations and `No.` before a number do not end a sentence; neither does an ordinal (`3.`)
in a language that writes ordinals that way (German and some others) or when the language is
unknown, so in English "It is 42. Then …" is two sentences. A block without an end mark is one
sentence.
JSON extras: `lang`, `easy`, `limit`, `sections`, `total`; `findings` of `kind`
`long-sentence` and `long-compound`. Pass on its `notChecked`: numbers do not prove Easy
Language.

## lang-status — `check:lang-coverage`

```
node tools/lang-status.mjs <code> [--json]
```

Counts for `<code>` and `<code>-easy` (configured or not): UI keys of the key-source language
per module (translated, same as the source, missing, words to translate; the Easy variant is
compared with `en-easy`), content entries per collection with a translation file (words counted
in the content reference language), and whether the code is in `languages.json` and in the
redirect list of `src/index.html`. A collection without Easy folders (sources) is reported as
"no Easy files by design". For the key-source language itself the UI part says it is the
reference (`reference: true`, nothing to translate). Only what the site uses is counted: the
keys and collections of features that `src/config/site.json` switches off (ownership in
`src/config/features.json`) are left out, and so are the dev workshop's keys for a language
that has none of them; the output names the features that are off, each UI part says how many
keys it left out (`skipped: { offFeatures, devOnly }`) and each content part which collections
(`skipped`). Without site.json or features.json every feature counts as on. Counts only, no time
estimate, exit 0. The steps to add a language:
`docs/how-to/add-a-language.md`. JSON extras: `code`, `configured`, `redirect`, `features`
(`{ off: [...] }`), `ui`, `content`.
UI "keys" are string leaves (an array item counts on its own), so the totals run higher than
`check-i18n-keys`' key count.

## new-page — (no capability)

```
node tools/new-page.mjs <slug> --kind page|demo --strings <file.json> [--page-id <xxxx>]
                        [--group <nav-group>] [--dry-run] [--json]
```

Scaffolds a portal page by `docs/how-to/add-a-page.md`. Creates
`src/app/pages/<slug>/<slug>.component.ts` (standalone, `@if`, `isBrowser` from
`isPlatformBrowser`, the `t()` helper) and its `.spec.ts`, and `<namespace>.json` (slug in
camelCase) in every configured locale's i18n folder from `--strings`
(`{ "de": { "title", "description" }, "de-easy": …, … }`: every configured locale incl. Easy
variants, only those two keys; a missing locale is exit 2). Edits `angular.json` (the spec
into `test.include`), `app.nav.<namespace>` in every `app.json`, and for `--kind demo`
`src/assets/data/core/demos/index.json`. Prints (JSON: `snippets` with `file`, `anchor`,
`code`) the route for `src/app/app.routes.ts` and, for a page, its `TIER_1_ROUTES` entry in
`scripts/generate-prerender-routes.js`, for a demo its `RenderMode.Client` line in
`src/app/app.routes.server.ts`: paste them, then run `node scripts/check-i18n-keys.mjs` and
`node scripts/verify-harness.mjs` (the nav key counts as unused until the route is pasted).
Page id: `--page-id` or derived from the slug, never one already used as a page id or route
path. Default group `portal` (page) or `interaktiveDemos` (demo); must be a key of
`app.nav.group`. Refuses (exit 2) an existing folder, module, nav key, route or demo entry; all
checks run before the first write, and a write that fails undoes the earlier ones (exit 3).
`--dry-run` writes nothing. A demo's index entry gets `milestones` (one checkpoint
`<slug>-checkpoints`/`main`, what finishes it on /progress); the tool prints the
`<app-checkpoint>` line the demo must show. JSON extras: `slug`, `kind`,
`namespace`, `component`, `pageId`, `group`, `creates`, `edits`, `snippets`.

## make-it-yours — `site:make-it-yours`

```
node tools/make-it-yours.mjs [--json]
node tools/make-it-yours.mjs --site <answers.json> [--dry-run] [--json]
node tools/make-it-yours.mjs --remove-samples [--dry-run] [--json]
```

The first half hour of a new portal (`docs/how-to/make-it-yours.md`,
`specs/2026-09-28-make-it-yours/`). **No mode:** read-only status — name, start page, features
on/off (`src/config/site.json` against `src/config/features.json`), sample content left
(`src/config/samples.json`), imprint placeholders (the patterns of `scripts/check-imprint.mjs`
in site.json's operator and every configured locale's `impressum.json`), what a new language
would need (`tools/lang-status.mjs` on an unused code) and the next step. JSON extras: `mode`,
`site`, `features`, `samples`, `imprint`, `newLanguage`, `next`.

**`--site`:** answers `{ name, shortName?, logoIcon?, startPage?, features?, operator?,
description? }` (`null` removes `shortName`/`logoIcon`; `features` and `operator` are merged
into what is there). `description` holds one text per configured locale (Easy variants
included) and is required with a new name; it goes to `meta.description` of every
`meta.json`. Writes `site.json` in its own layout (notes and blank lines kept,
`tools/lib/config-json.mjs`), `src/index.html` (`<title>`, `og:site_name`, `og:title`,
`twitter:title`; the three description tags in the default language) and the first `<text>` of
`src/assets/images/og-image.svg` — the name tags and the image only when the answers give a
`name`, the description tags only with a `description`, so an answers file with just the
`operator` writes `site.json` alone. Unknown answers, an unknown feature, a start page that is no
page or is switched off, a missing locale: exit 2, nothing written (the rules of
`src/config/site-rules.mts` and `checkSite` of `scripts/check-site-config.mjs`, run on the
planned files). Only changed files are written. JSON extras: `mode`, `changed`, `site`.

**`--remove-samples`:** refuses a dirty git tree (exit 2; `--dry-run` only warns). Pre-checks,
each exit 3 with nothing written: the project's `scripts/check-i18n-keys.mjs` is green,
samples.json matches the files and the `// sample:begin <id>` / `// sample:end <id>` markers of
`src/app/app.routes.ts`, nothing that stays refers to a sample (`scripts/lib/samples.mjs`, the
same rules as `check-site-config`). Then, in memory first: deletes each sample article's folder,
core file and i18n module in every locale folder on disk (an unconfigured draft like `it`
too), the sample glossary terms' and sources' core and translation files; edits the three
indexes, `references.json`, `learning-paths.json`, the listed `i18nKeys` in every locale,
the marker blocks, `angular.json` → `test.include`; drops every key only the samples read
(`scripts/lib/i18n-orphans.mjs`, the gate's rule); regenerates
`src/config/easy-language-availability.json`; empties samples.json's lists. The planned
state must pass the orphan rule and the sample checks, else exit 3. Writes run in order with
undo: a failure restores every earlier delete and write (exit 3). Never commits: prints
`git add -u -- <top folders>` and `git revert HEAD` as the undo. A second run finds nothing
(exit 0). JSON extras: `mode`, `dryRun`, `removed`, `keys` (`namespaces`, `listed`,
`orphans`, counted in the key source), `deleted`, `edited`, `staging`, `undo`.

## Tests

`npm run test:tools` (Node's built-in runner, `tools/test/*.test.mjs`, synthetic fixtures in
`tools/test/fixtures/`). Browser tests fail when no browser starts; `TOOLS_TEST_SKIP_BROWSER=1`
skips them by name. Harness check 17 (`scripts/verify-harness.mjs`) keeps `tools/*.mjs`,
`kit.json` → `tools`, the tests and this file in step.

## Adding a tool

`tools/<id>.mjs` on `tools/lib/cli.mjs` (`runTool`), a `tools/test/<id>.test.mjs`, a
`kit.json` → `tools` entry (and its capability in `capabilities` once it ships), a section
here and one in the how-to (EN + DE mirror). One commit.
