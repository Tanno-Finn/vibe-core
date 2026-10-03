# Kit tools — plan

**Status:** in progress: must items (§3, §5) built in B2a, should items (§4) in B2b; second review done (C2, see plan "Second review"); build and tests of plan §7 green 2026-09-26, NVDA pass skipped by the user; opening the docx output in Word once is open · **Date:** 2026-09-25

What and why: [`shape.md`](shape.md). This file is the implementer's contract: the shared
CLI convention (§1), the shared internals (§2), one block per tool (§3 must, §4 should),
registration and gates (§5), where skills and docs change (§6), build order (§7).

Dependencies available today, and the only ones a tool may use: Node core (incl.
`zlib.crc32`, `node:test`), `puppeteer` and `axe-core` (devDependencies), `jsdom`
(devDependency), `marked` (dependency). No new package. A teacher's `npm install` installs
devDependencies, so they are present on every working checkout.

## 1 · The CLI convention (every tool)

- File `tools/<id>.mjs`, ESM, `#!/usr/bin/env node`, header comment in the style of
  `scripts/check-a11y.mjs` (WHAT / HOW / WHAT IT CANNOT SEE / Run).
- Argument parsing with `node:util` `parseArgs` (strict; an unknown flag is exit 2 with the
  usage line). Shared helpers in `tools/lib/cli.mjs`: usage rendering, `--help`, `--json`,
  exit codes, path checks, `--force`, the summary printer.
- `--help` / `-h`: usage, every option with its default, one example, the exit codes. Exit 0,
  no file touched, no browser started (the harness calls it on every tool, §5).
- `--json`: stdout carries exactly one JSON object (`{ tool, ok, exitCode, outputs: [...],
  findings: [...], warnings: [...], notChecked: [...] }`, keys in this order); human text goes
  to stderr. Without `--json`, human text on stdout, errors on stderr.
- Exit codes: **0** done, nothing blocking · **1** the check found a problem or a limit was
  exceeded (`--max-pages`, a blocking A11Y violation, `--strict` warnings) · **2** usage
  error, missing or unsafe input, output exists without `--force` · **3** environment
  missing (no browser, no build, dependency not installed), with the fix in one sentence.
- Paths: every input and output is resolved (`realpath` for existing ones) and must lie inside
  the project root; `.git/`, `.claude/`, `node_modules/` refused as outputs. Violation → 2,
  message names the path and the rule. Project root = the folder holding `kit.json`, found
  upward from the tool file; tests may set `KIT_TOOLS_ROOT` to a fixture root (the only use
  of that variable, documented as test-only).
- Outputs: an existing file is replaced only with `--force`; the tool prints the absolute
  path of everything it wrote (agents then open PNGs and PDFs by that path). Parent folders
  are created.
- Browser (shared, §2): offline by request interception, reduced motion, transitions and
  animations disabled, `document.fonts.ready` awaited, two animation frames before
  measuring. Every aborted request is counted and reported as a warning with its URL.
- Determinism: same input, same machine, same browser → same bytes. No timestamps, no
  absolute paths, no user names inside outputs; zip entries sorted with a fixed DOS date
  (1980-01-01 00:00); JSON keys in fixed order.
- Every tool states in its output what it did **not** check (`notChecked`), e.g. "meaning of
  alt texts", "whether the Easy Language is actually easy".

## 2 · Shared internals (`scripts/lib/`, used by tools and gates)

- `scripts/lib/browser.mjs`: `launchBrowser()` = the launch in `scripts/check-a11y.mjs`
  (honors `PUPPETEER_EXECUTABLE_PATH`, `--no-sandbox` only when `CI` is set) plus
  `--disable-background-networking`, `--disable-component-update`, `--no-first-run`,
  `--disable-sync`; throws a typed error the tools turn into exit 3.
  `openOffline(browser, { origin | fileDir, viewport, scheme, easy })` returns a page with
  interception, media emulation and the settle steps from §1.
- `scripts/lib/static-server.mjs`: the static server from `check-a11y.mjs` (`serve()`),
  parameterized by root folder and SPA fallback on/off, listening on `127.0.0.1`, port 0 or a
  given one.
- `scripts/lib/a11y-verdict.mjs`: `AXE_TO_A11Y`, `readTags()`, and a
  `verdict(violations, { tags })` that returns `{ blocking, advisory }` using
  `scripts/lib/overrides.mjs` exactly as the gate does today.
- `scripts/lib/zip.mjs`: a minimal ZIP writer (deflate via `zlib.deflateRawSync`, CRC via
  `zlib.crc32`, fixed dates, sorted entries, optional "first entry" for `[Content_Types].xml`)
  and a minimal reader for tests.
- `scripts/check-a11y.mjs` imports `browser.mjs`, `static-server.mjs` and `a11y-verdict.mjs`;
  its `KNOWN` list, `PAGES` and output stay. Acceptance: on the same build its output and
  exit code are identical before and after (the lead diffs the two runs).

## 3 · Must tools

### 3.1 `pdf` — HTML → PDF with fit check

```
node tools/pdf.mjs <input.html> [--out <file.pdf>] [--format A4|Letter] [--landscape]
                   [--max-pages <n>] [--bw-check] [--strict] [--force] [--json]
```

- Input: a self-contained HTML file inside the project (the teacher pack's print pages are
  exactly this). Loaded as `file://`; the browser may read files in the input's folder only.
- Output: `<input>.pdf` next to the input unless `--out`. `page.pdf({ preferCSSPageSize: true,
  printBackground: true, format })` with print media emulation, so an `@page` rule wins and
  `--format` (default A4) is the fallback.
- Page count: read from the PDF (root `/Pages` `/Count`, cross-checked by counting `/Type
  /Page` objects; a mismatch is exit 3 "cannot read page count" rather than a guess).
  Printed as "3 pages (A4)".
- `--max-pages n`: more pages than `n` → exit 1, message says by how many.
- Overflow warnings (always on): in print emulation, elements whose box extends past the
  content width of the page, and images wider than it, listed with a selector. `--strict`
  turns warnings into exit 1.
- `--bw-check` (advisory): lists elements whose text, border or background color is
  chromatic (HSL saturation > 0.15 and lightness between 0.1 and 0.95) and text on tinted
  backgrounds (background luminance < 0.9) that may turn into grey dots on a black-and-white
  copier; images listed as "check by eye". It works on computed styles, not pixels.
- Determinism: Chrome writes `/CreationDate` and `/ModDate`; replace both values in place
  with a fixed value of equal byte length (offsets in the xref table stay valid). If Chrome
  varies other bytes, document which in the tool header and in the test; the acceptance check
  then compares the PDF with those fields masked.
- Acceptance:
  - `tools/test/fixtures/pdf/one-page.html` → 1 page; `three-pages.html` (forced breaks) → 3;
    `--max-pages 2` on it → exit 1.
  - `overflow.html` (a 300 mm wide table) → a warning naming the table; with `--strict` exit 1.
  - `color.html` with `--bw-check` → names the colored element, not the black text.
  - Two runs → identical SHA-256 (or identical after the documented mask).
  - Output exists without `--force` → exit 2; input outside the project → exit 2.
  - An `<img src="https://…">` in the input → the request is aborted and reported.

### 3.2 `docx` — Markdown or HTML → Word, accessible

```
node tools/docx.mjs <input.md|input.html> [--out <file.docx>] [--lang <bcp47>]
                    [--title <text>] [--select <css>] [--font <name>] [--size <pt>]
                    [--force] [--json]
```

- Markdown goes through `marked` to HTML; HTML is parsed with `jsdom`. Content root:
  `--select`, else `<main>`, else `<body>`.
- Language (required, it is why the tool exists): `--lang`, else `<html lang>`, else exit 2.
  A bare primary subtag gets a region from a small table (`de`→`de-DE`, `it`→`it-IT`,
  `en`→`en-US`, `fr`→`fr-FR`, `es`→`es-ES`, `lld`→`it-IT` with a warning); anything else is
  used as given with a warning. Written to `docDefaults` (`w:lang`, `w:eastAsia`, `w:bidi`)
  and `dc:language`. An element with its own `lang` gets that language on its runs.
- Title: `--title`, else `<title>`, else the first `h1`. Written to `dc:title`. No author, no
  dates, no revision count in `docProps` (privacy and determinism).
- Mapping (must): `h1`–`h6` → built-in styles "heading 1" … "heading 6" with `outlineLvl`
  (Word's navigation pane and screen readers list them); `p`; `strong`/`b`, `em`/`i`, `u`,
  `code`, `br`; `a[href^=http|mailto]` → real hyperlink (relationship, `TargetMode="External"`,
  character style "Hyperlink"), other `a` → plain text; `ul`/`ol` nested up to three levels
  via `numbering.xml` (bullet and decimal), style "List Paragraph"; `table` → `w:tbl` with
  borders, `thead` rows or `th`-only rows marked `w:tblHeader`, `th` bold; `blockquote` →
  style "Quote"; `hr` → paragraph with a bottom border; an element with `break-before: page`
  or `page-break-before: always` (inline style or class `page-break`) → page break;
  `img` → a paragraph "[Bild: <alt>]" / "[Image: <alt>]" in the document language plus a
  warning (embedding is a later step); elements with `aria-hidden="true"`, `script`, `style`,
  `template` are skipped; any other element contributes its text, and the count of unmapped
  element types is a warning.
- Page: A4, margins 2 cm; default font `--font` (default Verdana) at `--size` (default 12 pt);
  line spacing 1.5.
- Output: `<input>.docx` next to the input unless `--out`. Written with `scripts/lib/zip.mjs`,
  `[Content_Types].xml` first.
- Acceptance:
  - `tools/test/fixtures/docx/all-elements.md` and `worksheet.html` (a synthetic sheet shaped
    like the teacher pack's, incl. `span.box[aria-hidden]` and a `lang="it"` paragraph) →
    every part parses as XML (jsdom, `contentType: 'application/xml'`, no `parsererror`);
    `document.xml` has `Heading1`…`Heading3` in source order, `numPr` on list items, one
    `w:tbl` with `w:tblHeader`, one hyperlink whose relationship exists, `w:lang w:val="it-IT"`
    on the Italian run; `styles.xml` has `w:lang w:val="de-DE"`; `core.xml` has the title and
    no `dcterms:created`.
  - The `aria-hidden` boxes are absent from the text.
  - No language anywhere → exit 2 with "set --lang or <html lang>".
  - Two runs → identical bytes.
  - Manual, once, recorded by the lead in `JOURNAL.md`: the fixture opens in Word and in
    LibreOffice without a repair prompt, and NVDA announces the headings and reads the
    Italian paragraph with the Italian voice.

### 3.3 `a11y` — accessibility check of a file or a route

```
node tools/a11y.mjs <input.html> | --route </de/…> [--dist <dir> | --base <url>]
                    [--scheme light|dark|both] [--viewport desktop|mobile] [--easy]
                    [--open-details] [--click <selector>]… [--tab-order <n>] [--json]
```

- Target: a local HTML file, or a route served either from the build (`--dist`, default
  `dist/vibecore/browser`, via `static-server.mjs` with SPA fallback) or from a running dev
  server (`--base`, which must be a loopback URL: `127.0.0.1`, `localhost`, `[::1]`;
  anything else exit 2). No build and no `--base` → exit 3 "run `npm run build:prod` or
  start `npm start` and pass --base http://localhost:2000".
- States: the initial page, then one more state per `--click` (in order, cumulative), each
  audited. `--open-details` opens every `<details>` before each audit. `--easy` sets the
  kit's Easy-Language preference before load (the same storage key the gate uses). Default
  scheme `both`.
- Verdict: `a11y-verdict.mjs`, so a violation mapped to a `[hard]` A11Y rule blocks (exit 1)
  exactly as in `check:a11y`; unmapped axe rules and overridden ones are advisory. axe's
  `incomplete` results are listed as "check by hand" with rule id and node count.
- `--tab-order n`: presses Tab `n` times from the top and lists each stop (tag, role,
  accessible name cut to 60 characters); a stop on `body`, on an element of zero size or on
  one outside the viewport after scrolling is a warning.
- Always printed: what axe cannot see (from the gate's header: meaningful alt text, a sensible
  keyboard path through a canvas demo, meaning by color in images, whether Easy Language is
  easy).
- Acceptance:
  - Fixtures `clean.html` (exit 0), `missing-alt.html` (exit 1, names A11Y-002 and the node),
    `low-contrast-dark.html` (passes light, fails dark → exit 1, the dark run named),
    `toggle.html` (a violation visible only after `--click #b` → found only with the click).
  - `--route` against a fixture folder served with `--dist tools/test/fixtures/site` (a tiny
    static "site", no Angular build needed) → audits and reports.
  - `--base https://example.org` → exit 2.
  - `--tab-order 3` on `clean.html` → three stops in document order.
  - `scripts/check-a11y.mjs` verdict unchanged on the current build (§2).

### 3.4 `shot` — screenshots

```
node tools/shot.mjs <input.html> | --route </de/…> [--dist <dir> | --base <url>]
                    [--viewport desktop|mobile|both] [--scheme light|dark|both] [--easy]
                    [--full-page] [--click <selector>]… [--out-dir <dir>] [--force] [--json]
```

- Viewports: desktop 1280×800 at device scale 1; mobile 390×844 at scale 2 with `isMobile`
  and touch. Defaults: `--viewport both --scheme light`.
- Names: `<slug>-<viewport>-<scheme>[-easy][-click<k>].png`; slug = file basename or the
  route with `/` → `-` (`/de/example-demo` → `de-example-demo`). Default folder
  `out/tools/shot/`. After each `--click` one more shot.
- Prints the absolute path of every PNG, so an agent can open it.
- Acceptance: fixture `clean.html` → 2 PNGs whose sizes, read from the PNG header, are
  1280×800 (desktop) and 780×1688 (mobile); `--full-page` on a long fixture → height above the
  viewport; `--scheme both` on a fixture with a dark `prefers-color-scheme` rule → the light
  and dark files differ (hash); two runs → identical bytes; an existing file without
  `--force` → exit 2.

### 3.5 The list — `npm run tools`

`tools/index.mjs` reads `kit.json` → `tools` and prints `id`, `description` and the `run`
command, then "Every tool explains itself: <run> --help". Acceptance: its output lists every
registered id; with `--json`, the array.

## 4 · Should tools

### 4.1 `preview` — look at the built site or a folder

`node tools/preview.mjs [<dir>] [--port <n>] [--no-spa]` — serves `dist/vibecore/browser`
(default, SPA fallback on) or any folder inside the project on `127.0.0.1`. Without `--port`
it takes the first free port from 2100 to 2199 (a remembered number beats a random one),
with `--port` it fails with exit 2 if taken. Prints the URL, runs until Ctrl+C. No browser is
opened. Acceptance: the test starts it on a fixture folder, reads the URL from stdout, fetches
`/` and a deep route (SPA fallback returns `index.html`), then stops it; a path outside the
folder (`/../kit.json`) → 403.

### 4.2 `bundle` — one offline HTML file (e-mail, Moodle)

`node tools/bundle.mjs <input.html> [--out <file.html>] [--strict] [--force] [--json]` —
inlines local stylesheets, scripts, images (`src`, `srcset` first candidate, CSS `url()`),
and fonts as `data:` URIs; remote references stay and are listed as warnings (`--strict` →
exit 1). Default output `<input>.single.html`. Reports the final size and warns above 10 MB.
The how-to says how to add it to Moodle (as a "File" resource, because a Moodle "Page" strips
scripts). Acceptance: fixture with a linked CSS, a PNG, a font and a script → output has no
relative reference left, renders the same (`shot` hashes equal), remote image → warning.

### 4.3 `export-site` — the built site as a zip for a school server

`node tools/export-site.mjs [--dist <dir>] [--out <file.zip>] [--apache]
[--allow-unverified] [--force] [--json]` — refuses a build whose
`.build-manifest.json` lacks `verification.passed: true` (exit 1) unless
`--allow-unverified`, which is printed in the summary. Writes a deterministic zip (default
`out/site/vibecore-<kitVersion>.zip`) and next to it `SERVER-SETUP.md` (German and English
sections): copy the contents to the web root, why routes that were not prerendered need a
fallback to `index.html`, the Apache and nginx lines for it, and that v1 supports the site
root only. `--apache` also puts a `.htaccess` with `FallbackResource /index.html` into the
zip. Acceptance: fixture dist → zip lists every file with forward slashes; two runs identical
bytes; unverified manifest → exit 1.

### 4.4 `reading-level` — advice on readability

`node tools/reading-level.mjs <file.md|file.html> | --i18n <namespace> --lang <code>
[--easy] [--max-sentence <n>] [--json]` — per section (heading): sentences, words per
sentence (mean, max), LIX, share of long words (> 6 letters), and a list of sentences over
the limit (default 15 words with `--easy`, else 25). With `--easy` and German, words over 12
letters without Mediopunkt or hyphen are listed (the kit's `de-easy` house style uses the
Mediopunkt). `--i18n` reads `src/assets/i18n/modules/<lang>/<namespace>.json` strings. Exit 0
(advice) unless `--max-sentence` is exceeded. Prints that heuristics do not prove Easy
Language; people from the target group do. Acceptance: fixture texts with known counts
(hand-counted in the test), the German compound rule, `--max-sentence` exit 1.

### 4.5 `lang-status` — how far is a language

`node tools/lang-status.mjs <code> [--json]` — for `<code>` and `<code>-easy`: UI keys of the
key-source language (`src/config/languages.json` → `keySourceLanguage`) present and non-empty
per module; keys whose value equals the source text (probably untranslated); words in the
source strings still missing; content entries per collection with a translation file for the
code (the chain in `scripts/lib/locale-fallback.mjs`); whether the code is configured in
`languages.json`. Counts only, no time estimate. Acceptance: a fixture root
(`KIT_TOOLS_ROOT`) with two modules and a half-translated `it` → exact counts; an unconfigured
code → every key missing and "not configured" stated.

### 4.6 `doctor` — can the tools run here

`node tools/doctor.mjs [--json]` — one line per check with ok/missing and the fix: Node
version against `package.json` → `engines`; `puppeteer`, `axe-core`, `jsdom`, `marked`
resolvable; a browser starts and closes (≈2 s); a build exists and is verified; `out/` is
writable. Exit 0 if all tools can run, 3 otherwise. Acceptance: with
`PUPPETEER_EXECUTABLE_PATH` pointing at a missing file → the browser line fails with the fix,
exit 3.

### 4.7 `new-page` — scaffold a portal page or demo

`node tools/new-page.mjs <slug> --kind page|demo --strings <file.json> [--page-id <xxxx>]
[--group <nav-group>] [--dry-run] [--json]` — follows `docs/how-to/add-a-page.md`:
creates the standalone component (template with `@if`, a `isPlatformBrowser` guard and the
`t()` helper as in the existing pages), its `.spec.ts` and the `angular.json` allowlist entry,
one i18n module per configured language **and** its Easy variant from `--strings` (a JSON
object `{ "<code>": { "title": …, "description": … }, … }`; a configured language missing →
exit 2, because a placeholder in the wrong language ships silently), the `app.nav.<key>` entry
in every `app.json`, and for `--kind demo` the `demos/index.json` entry. The edits to
`src/app/app.routes.ts`, `src/app/app.routes.server.ts` (`RenderMode.Client` for demos) and
`scripts/generate-prerender-routes.js` are **printed** as exact snippets with file and
anchor, not applied: inserting into hand-maintained TypeScript without an AST is the fragile
part, and the agent pastes them. `--page-id` checked for uniqueness against `app.routes.ts`;
without it one is derived and checked. `--dry-run` prints the plan only. Acceptance: on a
fixture root, the created files match expected snapshots; a duplicate page id → exit 2; a
missing language in `--strings` → exit 2; on the real repo in a scratch worktree, after
pasting the snippets, `node scripts/check-i18n-keys.mjs` and harness check 11 pass.

## 5 · Registration and gates

- `base/kit.schema.json`: optional `tools` array, items `{ id (kebab), run (string),
  provides (array of capability ids, may be empty), description (string) }`,
  `additionalProperties: false`; capability pattern `^(file|content|page|check):[a-z0-9-]+$`.
  Same pattern in `base/pack.schema.json` (both places) and `CAP_RE` in
  `scripts/check-packs.mjs`, whose `--selftest` gains a `check:` fixture.
- `base/README.md`: one paragraph on `tools` and the `check:` prefix (kit-blind wording).
- `kit.json`: the `tools` entries and, per shipped tool, its capabilities; a health check
  `{ "id": "tools-work", "run": "npm run test:tools", "description": "Do the kit's helper
  tools (PDF, Word, accessibility check, screenshots …) still work? Needs a browser, like the
  accessibility check." }`; the `/health` skill's table (`.claude/skills/health/SKILL.md`)
  gets the row.
- `package.json`: `"tools": "node tools/index.mjs"`, `"test:tools": "node --test
  --test-concurrency=1 \"tools/test/*.test.mjs\""` (check the glob on Windows cmd and
  PowerShell; if Node's glob does not expand there, use a small `tools/test/run.mjs` that
  lists the files).
- `eslint.config.js`: add `tools/**/*.mjs` to the Node scripts block.
- `scripts/verify-harness.mjs`, new check 17 "kit tools registered both ways": every
  `tools/*.mjs` except `index.mjs` has a `kit.json` entry and vice versa; each entry's `run`
  file exists; each `provides` id is in `capabilities`; each tool answers `--help` with exit 0
  within 5 s; every tool has at least one `tools/test/<id>.test.mjs`; `tools/README.md` names
  every id. Empty `tools/` with entries in `kit.json` is a failure, not a pass.
- `.github/workflows/ci.yml`: step "Kit tools (test:tools)" after the harness step in the job
  that runs `npm ci` with the browser.

## 6 · Where skills and docs change

Skills refer to capabilities and to "the `kit.json` → `tools` entry that provides it", never
to `tools/<file>`; `docs/how-to/` and `tools/README.md` name the files (they are kit docs).

- `packs/teacher/pack.json`: add `file:pdf` (fallback `file:html-print`: "print from the
  browser"), `file:docx` (fallback `file:markdown`), `check:a11y` (fallback `file:markdown`:
  a manual checklist in the handover note), each with a `purpose`.
- `packs/teacher/skills/worksheet`, `practice-quiz`, `cover-lesson` → Step 4: after writing
  the HTML, if `file:pdf` → run the tool with `--max-pages` (1 for a worksheet unless the
  teacher said otherwise), fix and rerun on exit 1; if `check:a11y` → run it on the HTML
  with the states the page has; if the manifest or preset mentions screen-reader users, or
  the teacher asks for Word → `file:docx`. Add: "Never write your own converter or check
  script; never put helper files in the teacher's folder. If a tool is missing, say so."
- `packs/teacher/skills/differentiation`, `teaching-unit`: output Markdown → offer `file:docx`.
- `packs/teacher/skills/README.md`: the table's capability column.
- `packs/editor/skills/style-pass`, `release-check` and `.claude/skills/new-content`: run
  `check:reading-level` on Easy-Language variants when present (advice, not a gate).
- `.claude/skills/prototype`: with `page:interactive` → `check:screenshot` and `check:a11y`
  on the route in each language before handing over.
- `directives/kit-tools.md` (layer base, registered in `directives/index.yml`): before
  writing a helper script, run the kit's tool list; use a registered tool; if one is missing
  and the need will recur, add it to the kit's tools folder with a test and registration, as
  its own commit; one-off helpers for a spec go to that spec's `tools/`; never into output or
  deliverable folders. Occasion: the teacher simulation of 2026-09-25.
- `directives/accessibility-workflow.md` ("verify in both themes with screenshots") and
  `directives/debugging.md` ("look at the rendered result"): one clause each pointing at
  `check:screenshot`.
- `AGENTS.md` map: one row "`tools/` — tested helpers (PDF, Word, a11y, screenshots …);
  `npm run tools` lists them".
- `docs/how-to/use-the-kit-tools.md` + `docs/de/how-to/use-the-kit-tools.md`, entry in
  `docs/translation-manifest.json`, both `how-to/README.md` indexes.
- `tools/README.md` (agent reference, English, exempt from mirroring because it is outside
  the user-facing paths).
- `CHANGELOG.md` under `[Unreleased]`, `JOURNAL.md` entry.

## 7 · Build order (one commit each, docs in the same commit)

1. Shared internals (§2) + refactor of `check-a11y.mjs` + `tools/lib/cli.mjs` + test runner +
   schema, `check-packs`, harness check 17, `npm run tools`, `tools/README.md` skeleton,
   directive, AGENTS.md row. Verify: harness, `check-packs --selftest`, the gate's output
   unchanged on the existing build.
2. `pdf` + `docx` with tests, `kit.json` entries and capabilities, teacher pack edits.
3. `a11y` + `shot` with tests, `kit.json`, prototype and directive clauses, the how-to (EN +
   DE) now that the must set is complete.
4. Should tools, one commit each in the order `doctor`, `preview`, `export-site`, `bundle`,
   `reading-level`, `lang-status`, `new-page`, each extending the how-to and `tools/README.md`.

Done for this spec = §3 and §5 shipped and green (`test:tools`, harness, `check-packs`,
`check-doc-drift`, lint, format, `build:prod`, `check:a11y`), the manual Word/NVDA check in
the journal, a second review (QUAL-003), status line moved to `implemented`.

## Deviations (B2a, 2026-09-25)

The must set (§3), the registration (§5) and the §6 edits for these four tools are built. Where
the build departs from the text above:

- **Exit 3 also covers a crash of the tool itself** (stack printed). §1 reserves 3 for a
  missing environment; an unexpected failure needed a code, and 1 or 2 would blame the input.
- **`docx` images:** an `img` inside a paragraph becomes "[Bild: alt]" inside that paragraph;
  only a standalone image gets its own paragraph. The bracket word exists for de, it, en, fr, es
  (else "Image"). No `docProps/app.xml` is written (optional, and it would name an application).
- **`docx` page breaks** become `w:pageBreakBefore` on the next paragraph (the empty
  `.page-break` div of the teacher pack has no paragraph of its own); before a table, a
  page-break paragraph.
- **`a11y` / `shot` targets:** `--click` on a selector that matches nothing is exit 2;
  `--dist`/`--base` without `--route` is exit 2. Git Bash rewrites `/de/…` into a Windows path;
  the tools detect that and say to use PowerShell or `MSYS_NO_PATHCONV=1`.
- **`a11y --tab-order`** runs on a fresh load in the first colour scheme, before any click.
  Focus on `body` ends the list ("the keyboard path ends after k stops") instead of being a
  warning: in a real run on the teacher pack's example worksheet, which has no focusable
  element, the spec's rule printed five identical warnings for what is simply the end of the
  path. Zero-size and off-screen stops stay warnings.
- **`pdf` determinism:** only `/CreationDate` and `/ModDate` vary between runs (checked with a
  byte diff of two runs); masking them gives identical SHA-256, no further mask is needed.
- **`check:a11y` refactor:** the gate's output on the current build was diffed before and after
  (51 lines, identical, both exit 1: the build on disk has one real contrast finding on
  `/de|en/user-settings`, 4.48:1, which predates this work).
- **Not done in B2a:** the should tools (§4) and their skill edits (editor pack
  `check:reading-level`, `new-content`); the `JOURNAL.md` entry and the manual Word/LibreOffice/
  NVDA check (no Word or LibreOffice on the build machine; left to the lead).

## Deviations (B2b, 2026-09-25)

The should set (§4) and its §6 edits are built, each tool with a test in `tools/test/`, a
`kit.json` entry, a block in `tools/README.md` and a section in the how-to (EN + DE). Where the
build departs from the text above:

- **Output places.** Evidence goes to `out/tools/<tool>/`, the site export to `out/site/` (both
  gitignored); an artifact made from one input file (`pdf`, `docx`, `bundle`) still goes next
  to that input, as decision 4 in `shape.md` says, because it is the deliverable. `doctor`
  writes one empty probe file in `out/tools/` and removes it.
- **`doctor`:** the build line is information, not exit 3: only `--route`, `preview` and
  `export-site` need a build, and a fresh checkout has none. JSON `checks` carries `blocking`.
- **`preview --json`** prints its one object as soon as the server listens (it runs until
  Ctrl+C, so an object at the end would never reach an agent). For that, `Report.finish()` in
  `tools/lib/cli.mjs` became idempotent.
- **`export-site`:** `.build-manifest.json` stays out of the zip (build evidence, not site);
  a missing manifest counts as unverified. `--force` covers the zip and `SERVER-SETUP.md`.
  Real run on the current build: 471 files, 8.4 MB, verified.
- **`bundle`:** jsdom writes the page back, so markup is normalised (`<head>`/`<body>` present,
  attribute quoting) beyond the inlining. A `srcset` keeps its first candidate as a bare
  `data:` URI (no descriptor, so a `2x` candidate is not shown at half size). Also inlined:
  icons, `video`/`audio`/`track`/`poster`, SVG `<image>`, `@import` (recursively, a media
  query becomes `@media`). Links to other local files and root-relative `/paths` are warnings.
- **`reading-level`:** headings name sections and are not counted; two sibling elements are
  separated by a space (a real run on the teacher pack's worksheet glued `<span>` labels of a
  flex row into one word). Findings `long-sentence` / `long-compound`.
- **`lang-status`:** a UI "key" is a string leaf (array items count on their own), so the kit
  shows 4,037 keys where `check-i18n-keys` counts 3,869. It also reports the redirect list of
  `src/index.html` (step 2 of the add-a-language how-to). Real run for `it`: 4,037 keys and
  about 64,700 words (UI), 49,300 for `it-easy`, 175 content entries.
- **`new-page`:** `--strings` must hold every configured locale including the Easy variants,
  and only `title` and `description`: the scaffold references exactly those two keys, and any
  other key would fail the orphan check of `check-i18n-keys`. The namespace is the slug in
  camelCase (`waterCycle.json`), like every existing module; the route's `titleKey` is
  `app.nav.<namespace>` per `add-a-page.md`. Two snippets are printed per kind, not three: a
  page gets its `TIER_1_ROUTES` line, a demo its `RenderMode.Client` line (add-a-page §4). A
  demo entry gets `category: fundamentals`, `estimatedTime: 10min`, `difficulty: beginner`.
  There is no `--force`: an existing page, module, nav key, route or demo is exit 2.
  Acceptance on the real repo, in a scratch worktree (page
  `water-cycle`, snippets pasted): `check-i18n-keys` PASS, harness check 11 PASS (the only
  harness failure was the copied, unregistered tool file itself), eslint and prettier clean,
  the generated spec 2/2 under `ng test`. `build:prod` was not run there.
- **Skills:** besides the §6 list, the teacher jobs that produce an HTML handout (worksheet,
  practice-quiz, cover-lesson) offer `file:html-single` when the manifest's `delivery.route`
  names a school platform or e-mail; `differentiation` runs `check:reading-level` on the
  easier level. Both capabilities are declared with fallbacks in `packs/teacher/pack.json`,
  `check:reading-level` in `packs/editor/pack.json`.

## Second review (C2, 2026-09-25)

Every tool was run on a real input (the teacher pack's examples, the current build) and on bad
ones, from PowerShell; `test:tools` ran green before and after (64 tests, then 87). Fixed, each
with a test that fails without the fix (five commits on
2026-09-25):

- A UTF-8 byte-order mark broke `new-page --strings`, the first Markdown heading in `docx` and
  `reading-level`, and `bundle`'s doctype; `readText()` in `tools/lib/cli.mjs` strips it.
- Offline: the request filter compared URL prefixes (`http://127.0.0.1:P@elsewhere/` passed);
  WebSockets, pop-ups and Chrome's own calls to Google were never intercepted. The browser now
  runs with a proxy on `127.0.0.1:1` (`DEAD_PROXY` in `scripts/lib/browser.mjs`); the `check:a11y`
  gate's output on the current build is unchanged.
- Containment: links (symlinks, junctions) led the static server, `export-site`, `bundle` and
  the browser's file filter outside the project; `bundle` packed hidden files (`.env`, `.git/`);
  the static server answered any `Host` (DNS rebinding); `outputPath()` wrote through a dangling
  link and let `--out <input> --force` replace the input.
- `export-site` trusted `verification.passed` alone, which the manifest records even when the
  test gate then fails the build; it now asks what `verify-build.js` asks.
- `shot --route` hung when a picture name was refused; `docx` wrote XML-forbidden control
  characters; `--json` printed no object on a usage error; `inputDir()` resolved from the
  project root while every other path resolves from the current folder; `new-page` let a `*/`
  in the title become code, left half-written files, broke an empty `test.include` and accepted
  `--group constructor`; `doctor.mjs` was double-encoded and could leave its browser open;
  `lang-status en` counted the reference language as untranslated. Dead code removed.

The review's leftovers, closed 2026-09-26 on the user's go-ahead: the example worksheet prints
on 2 pages (sheet + answer key; the `<p>` margins inside the input box and a wrapping task line
were cut, the answer key names "Rückfluss ins Meer" like the task). `reading-level` counts
`No.` as an abbreviation only before a number and `42.` as an ordinal only in a language with
dotted ordinals (`DOTTED_ORDINALS`) or with no language given. `lang-status` and the coverage
gate share `scripts/lib/content-entries.mjs`; the Easy reference in `lang-status` stays its own
on purpose, because it names the text to translate from, while `locale-fallback.mjs` names what
a reader sees when a file is missing (comment at the call). `shot` buffers its pictures and
writes them after the last click; `a11y` writes no files, so it had nothing to leave behind.
Kept as tested: a missing `--dist` is exit 3, not 2. Each change has a test that fails without it
(89 tool tests).

Done criteria (§7), 2026-09-26: lint clean, `test:tools` 87/87 before the leftovers and 89/89
after, `build:prod` green with every gate (58 files / 697 tests). The NVDA pass was
skipped (`check:a11y` covers the automatic part); the one manual step left is opening
`docx` output in Word once.
