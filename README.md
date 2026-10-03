**Deutsch:** [Diese Seite auf Deutsch](docs/de/README.md)

# vibecore

**An agent-first starter kit for building an educational companion portal** — interactive
demos, a glossary, a timeline, and didactic article pages — in Angular. In plain words: you get
a finished learning website as a template; an AI coding agent that reads this repo learns its
house rules and fills it with your topic, while you decide what goes in. The rules the agent
follows — what it may do on its own, what it must ask about, what it must never touch — ship
with the kit and are checked mechanically, not just written down.

> **Scope in one breath.** This is a *frontend* kit: an Angular app plus an agent operating
> system around it. It is **not** a backend, a CMS, or a hosted service — there is no server,
> no database, no login. Content lives in files; you deploy the built site as static assets.

---

## Start in 60 seconds — pick the door that fits you

- **You already use an AI coding agent** (Claude Code, or another) → just point it at this repo.
  It reads [`AGENTS.md`](AGENTS.md) (Claude Code reads [`CLAUDE.md`](CLAUDE.md), which imports it)
  and learns the standards, skills, and safety rules on its own. Try saying *"help"* or
  *"onboarding"*. New to working with an agent?
  [Your first session](docs/tutorial/first-session.md) walks you through it end to end.
- **You don't have an agent yet, or aren't sure which to pick** → first read
  [Choosing an AI coding agent](docs/explanation/choosing-an-ai-agent.md) (five minutes,
  criteria not brands) and install the one that fits. Then open
  [`docs/onboarding.html`](docs/onboarding.html) in your browser (double-click — it works
  offline), answer a few questions, click **Export**, and paste the result to your new agent so
  it can set you up.
- **You just want to run the app** → the Getting-started below gets a dev server up.

---

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org) (this repo pins **24** in `.nvmrc`, at least 24.15;
it also runs on 22.22.3+ within 22.x, or on 26+) and [git](https://git-scm.com). New to git? See
[What is git, and why](docs/explanation/what-is-git.md).

```bash
npm install      # install dependencies (once)
npm start        # dev server → http://localhost:2000
```

The first `npm start` also builds the content bundles and then watches them, so give it a moment
before the browser page fills in.

The kit's helpers for PDFs, screenshots and the accessibility check need a browser. Newer npm
versions no longer download it on their own; `node tools/doctor.mjs` tells you whether one is
there, and if not, `npx puppeteer browsers install chrome` fetches it once.

**Per operating system:**

- **Windows** — use PowerShell or Git Bash. If `npm` is not found, install Node from the link
  above and reopen the terminal. Long-path support should be on (Windows 11 default).
- **macOS** — if you don't have Node, the simplest route is the installer from nodejs.org, or
  `brew install node@24` if you use Homebrew.
- **Linux** — install Node via your distro or [nvm](https://github.com/nvm-sh/nvm)
  (`nvm install` reads `.nvmrc`). Then the two commands above.
- **"I have no development environment at all"** — you don't need to install anything. Open this
  repository in **GitHub Codespaces** (green *Code* button → *Codespaces* → *Create*), then run
  `npm install && npm run start:codespaces`. Codespaces forwards port 2000 to a browser tab for
  you. This is the recommended path on a locked-down or low-powered machine.

Full step-by-step walkthrough: [Getting started](docs/tutorial/getting-started.md).

---

## What's in the box

- **A layered architecture.** *base* (the agent operating system — standards, safety,
  bookkeeping, generic skills) depends only on the kit **contract**
  ([`kit.json`](kit.json)); the *kit* is this concrete Angular app; optional *packs* add
  role-specific jobs. See [The pack layer](docs/explanation/the-pack-layer.md).
- **Task-skills** the agent runs on request — `/onboarding`, `/help`, `/status`, `/new-content`,
  `/new-component`, `/research`, `/ship`, and more, each a `SKILL.md` under `.claude/skills/`.
- **A safety model** — every action is Green (just do it), Yellow (do it, mention it), or Red
  (stop and ask), with one consistent warning format. See [`base/SAFETY.md`](base/SAFETY.md); a
  PreToolUse hook backs the hard rules mechanically.
- **A duty of care** — the agent watches out for you unprompted, across seven topics you tune
  one by one during onboarding (`quiet` · `normal` · `active`): security and secrets, privacy,
  accessibility, technical debt, cost, findability, and speed — plus a license check on every
  dependency that is never tunable. Before
  anything goes public it states the honest security/accessibility posture, big decisions get
  recorded as ADRs, and it checks for existing libraries before building from scratch. It
  *raises* things — it never rebuilds your project uninvited. See
  [`directives/stewardship.md`](directives/stewardship.md).
- **A design-system workshop** at `/dev` (development builds only, stripped from production) —
  a filterable component gallery where each component's live demo sits next to the exact
  canonical doc the agent reads.
- **A teacher pack** ([`packs/teacher/`](packs/teacher/)) — worksheet, quiz, differentiation,
  cover-lesson, and teaching-unit jobs, with classroom guardrails. Activate it by talking
  (*"switch to teacher mode"*).
- **An editor pack** ([`packs/editor/`](packs/editor/)) — the editorial chain for filling the
  kit with your own subject: article-draft, glossary-entry, source-wiring, style-pass,
  variants-brief, and release-check, with guardrails that keep an invented source, an unstamped
  draft and someone else's text out of your content (*"switch to editor mode"*).
- **A researcher pack** ([`packs/researcher/`](packs/researcher/)) — the evidence layer the
  editor hands its claims to: source-dossier, claim-check, reading-map, dated-event, and
  conflict-log, each with fixed provenance fields and no date without the sentence that carries
  it (*"switch to researcher mode"*).
- **Bilingual & accessible** — content and UI are structured for multiple languages and Easy-
  Language variants, and the components are built to WCAG AA.

---

## Documentation

Organized along the four [Diátaxis](https://diataxis.fr) modes:

| Mode | For | Start here |
|---|---|---|
| **Tutorial** (learning) | Getting the app running, and your first agent session | [Getting started](docs/tutorial/getting-started.md) · [Your first session](docs/tutorial/first-session.md) |
| **How-to** (a task) | Deploying, adding a page, a source, or a backend | [How-to guides](docs/how-to/) · [Deploy](docs/how-to/deploy.md) · [Add a page](docs/how-to/add-a-page.md) · [Add a source](docs/how-to/add-a-source.md) · [Add a backend](docs/how-to/add-a-backend.md) |
| **Explanation** (understanding) | Why the kit is shaped this way | [Directives & skills](docs/explanation/directives-and-skills.md) · [The pack layer](docs/explanation/the-pack-layer.md) · [What is where](docs/explanation/repo-map.md) · [Choosing an agent](docs/explanation/choosing-an-ai-agent.md) · [What is git](docs/explanation/what-is-git.md) |
| **Reference** (facts) | The contract and the rules | [`AGENTS.md`](AGENTS.md) · [`docs/CONSTITUTION.MD`](docs/CONSTITUTION.MD) · [`kit.json`](kit.json) · [Decision records](docs/adr/) |

---

## Requirements & scripts

**Node** `^22.22.3 || ^24.15.0 || >=26` — the range Angular itself requires (see `.nvmrc`). No other global tooling required.

| Command | What it does |
|---|---|
| `npm start` | Dev server on port 2000 (with content watch) |
| `npm run start:codespaces` | Same, bound to `0.0.0.0` for Codespaces/remote |
| `npm run build:prod` | Production build → `dist/vibecore/browser/` (with integrity checks) |
| `npm test` / `npm run test:ci` | Unit tests (Vitest) |
| `npm run lint` | ESLint (a green tree — this is a CI gate) |
| `npm run check:a11y` | Automated accessibility pass (axe-core in headless Chrome) over the built pages — run after `build:prod` |
> Use `npm run build:prod`, not a bare `ng build` — a raw build skips the content steps and the
> integrity pipeline. A guard refuses `npm run ng -- build`, but an `ng build` typed directly
> gets through, so the habit is what protects you.

**Nothing here reaches the internet.** Installing, building, testing, and every gate run
offline once dependencies are installed. The one exception is `scripts/corpus-measure.mjs`,
a hand-run research tool for language-guide work: it downloads pages from hosts you name,
it uploads nothing, and no npm script or build step invokes it.

---

## Building & deploying

`npm run build:prod` emits a static site to `dist/vibecore/browser/`. Host it anywhere that
serves static files, with one rule: unknown routes must fall back to `index.html` (it's a
single-page app). How you host — static host, object storage, your own web server — is your
choice; the kit makes no assumption about it.

---

## Status, contributing & license

Released and versioned. Every version, and what changed in it, is in
[`CHANGELOG.md`](CHANGELOG.md); versions follow [Semantic Versioning](https://semver.org), so a
breaking change only ever arrives with a major bump.

- **Contributing:** see [`CONTRIBUTING.md`](CONTRIBUTING.md). A change is done when it builds
  green, passes the checks, and its docs travel in the same commit.
- **Security:** report vulnerabilities privately — see [`SECURITY.md`](SECURITY.md).
- **Role packs — reviewed, not yet used in anger:** the editor and researcher packs
  ([`packs/editor/`](packs/editor/), [`packs/researcher/`](packs/researcher/)) ship with worked
  examples of every job, but have not yet been run through a real editorial or research week.
- **Teacher pack — not yet piloted:** the five jobs in [`packs/teacher/`](packs/teacher/) have
  not been tried with real teachers. A pilot kit (moderation guide, questionnaires, observer
  sheet, consent form, evaluation template; German, with English translations) is ready in
  [`packs/teacher/pilot/`](packs/teacher/pilot/). This line is replaced by a measured statement
  once an evaluation exists — not before.
- **License:** source code under **MIT** ([`LICENSE`](LICENSE)); documentation and content under
  **CC BY 4.0**. Details in [`LICENSING.md`](LICENSING.md).
