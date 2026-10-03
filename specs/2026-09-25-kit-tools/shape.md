# Kit tools — one tested helper-script set instead of improvised tooling

**Status:** in progress: must items (§3, §5) built in B2a, should items (§4) in B2b; second review done (C2, see plan "Second review"); build and tests of plan §7 green 2026-09-26, NVDA pass skipped by the user; opening the docx output in Word once is open · **Date:** 2026-09-25

The per-tool contracts, acceptance checks and build order are in [`plan.md`](plan.md).

## What

A small set of command-line helpers ("kit tools") that ship with the kit in one folder,
`tools/`. They cover the jobs agents kept solving from scratch: turn an HTML handout into a
PDF and check that it fits, write a real Word file with headings and a document language,
run an accessibility check on a single file or one portal route, take screenshots in
several viewports and color schemes, and a few more. Every tool has `--help`, fixed exit
codes and a test. Each tool is registered in `kit.json`, so the kit-blind packs and base
skills can find it through the contract and fall back when a kit has no such tool.

## Why (the evidence)

A simulated teacher run on 2026-09-25 (in a scratch copy of the kit) produced
three tools of its own in one session and left them in `out/teacher/_werkzeug/` next to the
teacher's files:

- `baue-blaetter.mjs`: wraps body fragments with `packs/teacher/assets/print.css`, prints them
  to PDF with Puppeteer and counts the pages with a regex over the PDF bytes. Output paths are
  hard-coded; it overwrites without asking; there is no fit check beyond the page count it prints.
- `baue-word.py`: writes a `.docx` by hand in **Python** (zip + OOXML strings) so the
  screen-reader pupils get real heading styles and the document language. The content is
  retyped as Python tuples, so the Word file and the HTML sheet are two copies of one text.
  The kit is Node-only; a teacher's machine may have no Python at all.
- `_pruefung.mjs`: injects axe-core into a local HTML file, clicks the two language-mode radio
  buttons, runs axe per state, takes a screenshot per state and prints the first six tab stops.
  It never maps a finding to the kit's A11Y rules, so its verdict is not the kit's verdict.

All three reuse what the kit already has (Puppeteer, axe-core, the print stylesheet), which
is the point: the kit had the ingredients and no tool, so every session rebuilds the tool,
differently, untested, in a place where it pollutes the deliverables. A second simulation (a
teacher building a learning website with interactive demos inside the portal) needs the same
checks on portal routes: see the demo in each language, light and dark, desktop and mobile,
and know whether it passes the kit's accessibility rules. Today `scripts/check-a11y.mjs`
does that only for a fixed list of eight built pages, and `scripts/render-og.mjs` is the only
screenshot code, hard-wired to two SVGs.

## In scope

- The designated folder `tools/` with a shared CLI convention (below).
- **Must** tools: `pdf`, `docx`, `a11y`, `shot`, plus the tool list `npm run tools`.
- **Should** tools: `preview`, `bundle`, `export-site`, `reading-level`, `lang-status`,
  `doctor`, `new-page`.
- Registration in `kit.json` (new `tools` array, new capability ids), the schema change that
  allows it, a harness check that keeps registry and folder in step both ways.
- A Node test runner for the tools (`npm run test:tools`), wired into CI and `/health`.
- Docs: a human how-to (EN + DE mirror), an agent-facing reference `tools/README.md`, a
  directive that says "use the kit tool, do not improvise", the AGENTS.md map row.
- Edits to the pack and base skills that currently improvise (list in `plan.md` §6).
- Moving the axe-to-A11Y mapping, the static server and the browser launch out of
  `scripts/check-a11y.mjs` into `scripts/lib/`, so the gate and the `a11y` tool share one
  verdict.

## Explicitly out of scope

- Where teacher material lives and whether it is versioned. The pack outputs (`out/teacher/`,
  `out/editor/`, `out/researcher/`) are tracked on purpose, so git is the user's safety net
  (onboarding change of 2026-09-25); what the tools write for the agent (`out/tools/`) and the site export
  (`out/site/`) stay gitignored (see `.gitignore`). The tools write where they are
  told and change nothing about that policy.
- Publishing anything. `export-site` builds a zip on disk; uploading it is the human's Red
  step (SEC-005). No tool opens a network connection beyond `127.0.0.1`.
- A single-file bundle of a **portal** page. The Angular app is many chunks plus hydration;
  inlining it is not a sane artifact. A portal page leaves the kit as a site export.
- A new-language scaffold (adding Italian to the portal). `lang-status` measures the gap;
  the how-to for adding a language is separate work.
- Python, new npm dependencies, a GUI, any telemetry.

## Decisions

1. **Folder: `tools/` at the repo root, not `scripts/tools/`.** `scripts/` is the build and
   gate pipeline: 40 files that `package.json` chains together and that nobody runs by hand.
   The tools are the opposite: meant to be called by an agent or a person, one at a time, with
   arguments. A root folder named `tools` is where both look first, and it keeps the gate
   pipeline free of user-facing entry points. Shared internals the gates also need (browser
   launch, static server, axe verdict, zip writer) go to `scripts/lib/`, the existing home for
   shared helpers, so gates never import from `tools/`. One-off helpers for a single piece of
   shaped work keep living in `specs/<slug>/tools/` (the existing convention, e.g.
   `specs/2026-09-02-optimus-ui-migration/tools/`); `tools/` holds only reusable ones.

2. **Registration through the contract, discovery through one list.**
   - `kit.json` gets a `tools` array: `{ "id", "run", "provides": [capability ids],
     "description" }`, `description` in plain language like the health checks. `run` is the
     full command (`node tools/pdf.mjs`), so a skill never guesses a path.
   - Capabilities say *what* a kit can do; the `tools` entry says *how*. A kit-blind skill
     reads `capabilities`, and if `file:pdf` is present it looks up the `tools` entry whose
     `provides` holds `file:pdf`, runs it with `--help` first, then for real. Absent → the
     pack's declared fallback. This keeps packs and base skills free of kit paths.
   - New capability ids: `file:pdf`, `file:docx`, `file:html-single`, `file:site-export`,
     `check:a11y`, `check:screenshot`, `check:reading-level`, `check:lang-coverage`. The
     capability pattern gains the prefix `check:` (a verification a kit can run, as opposed
     to an artifact it can produce). That is an additive base-contract change in
     `base/kit.schema.json`, `base/pack.schema.json` and `scripts/check-packs.mjs` (`CAP_RE`).
     `baseVersion` stays `0.1.0`: nothing that validated before stops validating.
     Resolved 2026-09-25 (B2a): the default shipped, the `check:` prefix is in the contract,
     because the alternative (checks as `file:` ids) mislabels a check as an artifact and packs
     could not tell them apart. It can still be reversed before a release.
   - A capability appears in `kit.json` only once the tool that provides it has shipped.
   - `npm run tools` prints the registered tools with their description, read from
     `kit.json`, so a human or an agent gets the list in one command.
   - No per-tool npm scripts: `node tools/<name>.mjs …` works the same in PowerShell, cmd,
     bash and zsh, while `npm run x -- --flag` quoting differs between them.

3. **One CLI convention for every tool** (details in `plan.md` §1): `--help`, `--json`,
   exit codes 0 ok / 1 finding / 2 usage or unsafe input / 3 environment missing; inputs and
   outputs must resolve inside the project, `.git/`, `.claude/` and `node_modules/` refused;
   an existing output is replaced only with `--force`; the browser loads nothing but the input
   file's folder, the loopback origin and `data:`; no timestamps in outputs.

4. **Default output places.** An artifact built from an input (`pdf`, `docx`, `bundle`) goes
   next to that input with the new extension, because that is where the person is looking.
   Evidence that only serves the agent (screenshots, JSON reports) goes to `out/tools/<tool>/`
   and the site export to `out/site/`, both gitignored, never next to deliverables: the
   simulation's `_werkzeug/` folder and `_shot-*.png` files sitting in the teacher's topic
   folder are the failure this avoids.

5. **Tests: Node's built-in runner, not Vitest.** The Angular test target's allowlist
   (`angular.json` → `test.include`) holds `.spec.ts` files that run inside the Angular
   builder; the tools are plain Node ESM and need no TypeScript, no DOM shim, no builder.
   `node --test` is in Node 22+, adds no dependency, and runs the same on all three systems.
   Tests live in `tools/test/*.test.mjs` with synthetic fixtures in `tools/test/fixtures/`
   (PRIV-001). Browser tests fail, not skip, when no browser can start, unless
   `TOOLS_TEST_SKIP_BROWSER=1` is set, which prints every skipped test by name: a test that
   silently inspects nothing reports green for an absence (the harness rule).
   `test:tools` runs in CI and as a `kit.json` health check, **not** inside `build:prod`: it
   needs a browser and a few seconds per test file, and the build chain is already long.

6. **Documentation.** Human how-to `docs/how-to/use-the-kit-tools.md` with the German mirror
   `docs/de/how-to/use-the-kit-tools.md` (registered in `docs/translation-manifest.json`, per
   `docs/DOC-TRANSLATION.MD`), written for a non-programmer: what each tool is for, one
   copy-paste example each, what the exit tells you. The agent reference is
   `tools/README.md` (English only, like every agent-facing file): the CLI convention and one
   block per tool. The rule for agents is a new base directive `directives/kit-tools.md`.
   AGENTS.md gets one map row (it has room under the 150-line cap).

7. **The `a11y` tool and `check:a11y` gate share one verdict.** The axe rule → A11Y rule
   mapping, the tag reading from `base/standards/A11Y.md` and the override lookup move to
   `scripts/lib/a11y-verdict.mjs`; `scripts/check-a11y.mjs` imports them unchanged in
   behavior. The gate's `KNOWN` list stays in the gate: it parks site findings, not findings
   in a teacher's file.

## Priorities

Ranked by how much improvisation a tool removes, weighted by the evidence.

**Must** (the three tools the simulation built, plus screenshots for the portal case):

- `pdf`: HTML → A4 PDF, page count, `--max-pages` fit check, overflow warnings. The
  simulation needed it for every handout; the page count by regex was its own invention.
- `docx`: Markdown or HTML → `.docx` with real heading styles, lists, tables and document
  language, Node only. Removes the Python writer and the retyped second copy of the text.
- `a11y`: axe on a standalone file or a portal route, per state (clicks, open `<details>`),
  both color schemes, with the kit's own A11Y verdict and an optional tab-order list.
  Every handout and every new demo needs it; today only eight fixed built pages get it.
- `shot`: screenshots of a file or route, desktop/mobile × light/dark × easy. An agent that
  cannot see what it built guesses; both simulations need it.
- The infrastructure: `tools/` convention, `kit.json` registration, schema, harness check,
  `npm run tools`, `npm run test:tools`, directive, docs, skill edits.

**Should:**

- `preview`: serve the built site (or any folder inside the project) on a free local port.
  The teacher only ever saw `localhost:2000` of the dev server; the built site is what pupils
  would get.
- `bundle`: one offline HTML file from a local HTML file (CSS, images, fonts inlined) for
  e-mail or an LMS such as Moodle. The simulation hand-wrote its learning page as one file;
  a page with an image would already have broken that.
- `export-site`: a deterministic zip of a verified build plus server notes, for a school
  server. The simulation found nobody knew how material reaches pupils.
- `reading-level`: sentence length, word length, LIX and Easy-Language flags per section, as
  advice. The kit ships four languages incl. two Easy-Language ones and has no measure.
- `lang-status`: key and content coverage for one language code, incl. one not yet
  configured. Turns "adding Italian takes several days" into counted keys and words.
- `doctor`: can the tools run here (Node, deps, browser, build, write access), each with the
  fix in one sentence. Every browser tool fails with exit 3 on a teacher's laptop otherwise.
- `new-page`: scaffold a portal page or demo from `docs/how-to/add-a-page.md` (component,
  spec + allowlist entry, i18n modules for every configured language, demo index entry). The
  gates already catch the misses; this removes the reconstruction.

**Could** (not in this spec's build, recorded so nobody rebuilds the thinking):

- `links`: internal links and anchors of local HTML files or the build; external links listed,
  never fetched.
- `handout`: one call that runs `pdf`, `docx` and `a11y` on a handout and prints one summary.
- `export-site --base-path`: deployment into a subfolder of a school server.
  [NEEDS CLARIFICATION: how common are subfolder deployments on school servers? Default: v1
  supports the site root only and `SERVER-SETUP.md` says so.]
- `pdf`/`shot` flows through several clicks with a visual diff between two runs.

## Standards that apply (by reference)

- QUAL-001, QUAL-002, QUAL-004 (each tool ships with a test that fails without it), QUAL-005
  (match `scripts/*.mjs` idiom: header comment with WHAT/HOW/Run, Node core first), QUAL-006
  (no option nobody needs), QUAL-007 (a tool reports what it did not check).
- A11Y-001 … A11Y-007: the `a11y` tool's verdict; `docx` exists for A11Y-002/003-like needs
  of screen-reader users (headings, language).
- PRIV-001 (synthetic fixtures only), PRIV-003/PRIV-004 (no telemetry, nothing leaves the
  machine), PRIV-006 (tools never read pupil data on their own; they process the file named).
- SEC-005 (no publishing), SEC-006 (no tool loosens a gate; the shared verdict keeps the
  gate's rules).
