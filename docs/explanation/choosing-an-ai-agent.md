# Choosing an AI coding agent

This kit is built to be used *with* an AI coding agent — a program that reads and writes
your files, and often runs commands, on your behalf. If you're new to this, the first
real decision is which one to use. This page gives you criteria, not a winner: which
agent is "best" changes every few months, but what you should weigh when picking one
doesn't.

## What is an AI coding agent?

An AI coding agent is a program built on a language model that can read your project,
propose or make changes to your files, and — depending on the tool — run commands like
installing packages or starting a test suite, all from plain-language instructions. It's
different from plain chat with an AI: an agent acts *inside* your project instead of just
describing what you should type.

## The criteria that matter

No single criterion decides it alone; they trade off against each other and against your
situation.

| Criterion | What it means | The trade-off |
|---|---|---|
| **Cost model** | Flat subscription, pay-per-use, or a free tier | Subscriptions pay off with heavy use; usage-based pricing suits occasional use but can surprise you; free tiers usually cap volume or model quality |
| **Where it runs** | In your editor, in a terminal, in a browser tab, or fully in the cloud | Editor/terminal tools need installing and decent hardware; browser or cloud tools need no local setup and work on weak machines, at the cost of your code passing through someone else's server |
| **Whole-repo vs single-file** | Can it reason across your whole project, or mostly one file? | Repo-wide understanding matters once a change touches multiple files, which most real changes do; single-file tools are lighter but you do the wiring yourself |
| **Autonomy** | Can it edit files and run commands on its own, or only suggest text? | More autonomy means faster iteration but more trust extended per step; suggest-only is slower but keeps you reviewing every change |
| **Privacy / data handling** | Does your code leave your machine, and is it used to train future models? | Sensitive codebases (client data, unpublished work, anything under contract) may need a tool that keeps code local or excludes it from training |
| **Convention support** | Does it read your project's own instructions file before acting? | An agent that ignores your conventions fights you on every change; most modern agents read `AGENTS.md`, an emerging open convention for this — this kit ships one at its root |
| **Ecosystem / lock-in** | How much of your setup is tool-specific? | Tools that lean on open, shared conventions are cheap to leave later; proprietary config or workflows raise the cost of switching |
| **Language / framework support** | Does it work well with the stack you're actually using? | General-purpose agents cover most mainstream stacks reasonably; niche stacks can see uneven quality between tools |

## Matching criteria to your situation

You don't need to weigh all eight criteria equally — your situation should tell you which
ones to prioritize:

- **No local setup, or an old/underpowered machine** → weight "where it runs" heavily. A
  browser- or cloud-based agent needs nothing installed and does the heavy computation
  elsewhere.
- **Privacy-sensitive context** (school data, pupil records, unpublished work, anything
  under NDA) → weight "privacy / data handling" heavily. Check whether the provider
  states your code isn't used for training, and whether it can run against a local model
  if that matters to you.
- **Tight or zero budget** → weight "cost model" heavily, and read the free tier's actual
  limits (requests per day, context size, which model) rather than assuming "free" means
  "unlimited."
- **Working across many files at once** (most real work in this kit, since a convention
  change often touches several routes and services) → weight "whole-repo understanding"
  and "autonomy" heavily; single-file suggestion tools will slow you down.
- **Just trying this out, low stakes** → weight "cost" and "ease of setup" over anything
  else; you can always switch once you know what you actually need.

> **As of 2026-07-17 — this box ages, the rest doesn't.** This kit is written to work
> with any agent that reads an `AGENTS.md` file, which is most current mainstream coding
> agents. It was originally authored against **Claude Code**, Anthropic's terminal-based
> agent, which reads a `CLAUDE.md` file that in turn imports `AGENTS.md` — a detail of
> this kit's history, not a requirement to use it. If you delete this box, the rest of
> this page stays true.

## How to decide and move on

Pick the agent that clearly clears your top two or three criteria and start using it.
Don't try to find the objectively best one — by the time you've finished comparing every
option, the landscape will have shifted anyway. This kit isn't locked to a specific
agent: because it keeps its conventions in the open, standard `AGENTS.md` file, switching
tools later mostly means changing which program reads that file, not rebuilding your
setup from scratch. Treat your first choice as a starting point, not a commitment.
