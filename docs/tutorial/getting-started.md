<!-- base -->
# Getting started

This is a first-run walkthrough: from a fresh copy of the repository to the app open in your
browser. It takes about ten minutes the first time. You do **not** need to be a developer — every
command is written out, and there's a no-install path at the end if you'd rather not set anything
up on your own machine.

By the end you'll have the development server running at `http://localhost:2000` and know the
handful of commands you'll use day to day.

---

## Before you start

You need two things installed:

1. **Node.js** — the runtime the app is built with. This repository pins version **24** (in a
   file called `.nvmrc`), and it needs at least 24.15; it also works on 22.22.3+ or 26+. If
   you're not sure whether you have it, open a terminal and run `node --version`. If that prints
   a version number in the supported range, you're set. If it says "command not found", install Node from
   [nodejs.org](https://nodejs.org) (the "LTS" download is fine).
2. **git** — the tool used to copy the repository to your machine. Check with `git --version`.
   Never used git and wondering what it even is? Read
   [What is git, and why](../explanation/what-is-git.md) first — it's short. Downloaded the
   project as a ZIP instead? That works too; the agent notices the missing history and offers to
   set git up locally, with your yes and without uploading anything.

> **The no-install path:** if you can't or don't want to install anything, skip to
> [Option B: GitHub Codespaces](#option-b-github-codespaces) below. You'll run the whole thing in
> the browser.

---

## Option A: run it on your own machine

### 1. Get the code

```bash
git clone <repository-url>
cd vibecore   # (or whatever folder git clone created)
```

Replace `<repository-url>` with the address of the repository (the green *Code* button on the
project page shows it).

### 2. Install the dependencies

```bash
npm install
```

This reads the project's dependency list and downloads it into a local `node_modules` folder. It
can take a few minutes the first time and prints a lot of progress text — that's normal. You only
need to do this again when the dependencies change.

### 3. Start the development server

```bash
npm start
```

Two things happen: the app compiles the content bundles once, then starts a live server that
rebuilds whenever you change a file. When you see a line like `➜ Local: http://localhost:2000/`,
open that address in your browser.

The very first load can take a moment while the content finishes building. If the page looks
empty for a few seconds, give it time and refresh once.

To stop the server, press **Ctrl + C** in the terminal.

### Per-operating-system notes

- **Windows** — use **PowerShell** or **Git Bash** (both come with git). If `npm` isn't
  recognized right after installing Node, close and reopen the terminal so it picks up the new
  program. Windows 11 has long-path support on by default, which this project needs.
- **macOS** — the installer from nodejs.org is the simplest route. If you use Homebrew,
  `brew install node@24` works too. The built-in Terminal app is all you need.
- **Linux** — install Node through your distribution's package manager, or use
  [nvm](https://github.com/nvm-sh/nvm); with nvm, running `nvm install` inside the project folder
  reads `.nvmrc` and picks the right version automatically.

---

## Option B: GitHub Codespaces

If installing Node and git feels like too much, or your machine is locked down or underpowered,
you can run everything in the cloud from your browser — nothing is installed locally.

1. On the repository's GitHub page, click the green **Code** button.
2. Choose the **Codespaces** tab, then **Create codespace**.
3. Wait for the editor to open in your browser. It runs `npm install` for you automatically.
4. In the terminal at the bottom, run:

   ```bash
   npm run start:codespaces
   ```

5. Codespaces detects port 2000 and offers to open it — click **Open in Browser**.

This is the recommended path for a first look without any local setup.

---

## The commands you'll actually use

| Command | When |
|---|---|
| `npm start` | Every time you want to work on the app locally |
| `npm run build:prod` | To produce the deployable static site (in `dist/vibecore/browser/`) |
| `npm test` | To run the unit tests |
| `npm run lint` | To check the code style (the project keeps this at zero problems) |

> Always build with `npm run build:prod`, not a bare `ng build` — a raw build skips the integrity
> checks. The project refuses `npm run ng -- build`, but it cannot stop an `ng build` typed
> directly.

---

## What next?

- **Working with an AI agent in this repo?** It reads [`AGENTS.md`](../../AGENTS.md) and can take
  it from here. Ask it *"help"* to see what it can do.
- **Want to understand how the project is organized?**
  [Directives & skills](../explanation/directives-and-skills.md) explains the two kinds of
  instruction the agent follows, and [The pack layer](../explanation/the-pack-layer.md) covers
  optional role bundles like the teacher pack.
- **Ready for your first working session?** [Your first session](first-session.md) walks you
  through onboarding, one small real change, and your first checkpoint.
- **Ready to publish it?** See the how-to guides under [`docs/how-to/`](../how-to/).

Stuck? The most common first-run hiccup is an old Node version — re-check `node --version` against
the supported range at the top of this page.
