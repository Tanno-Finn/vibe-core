<!-- base -->
# What is git, and why

You were probably told to run `git clone`, or you saw "git" listed as something this kit
needs, and you're not sure what it is. Good news: the idea is simple, and you don't have to
become an expert to use this kit. This page explains *what git is* and *why the kit leans on
it* — not how to type every command. For that, the official docs are the friendliest map:
<https://git-scm.com>.

## The one-sentence version

**Git is a tool that remembers every saved version of a folder of files.** Every time you (or
the agent) tell it "save the current state", it tucks away a complete snapshot. Later you can
look back at any snapshot, compare two of them, or return to one — and nothing is ever quietly
lost along the way.

Two everyday pictures, if they help:

- **Save-points in a video game.** You play forward, and at good moments you make a save. If
  the next stretch goes badly, you reload the last save and try again. Git is a save-point
  system for a folder of files — except it keeps *all* the saves, not just the latest one.
- **Track-changes that never forgets.** Like the revision history in a word processor, but for
  a whole project, and permanent: you can always see what changed, when, and why.

## Why this kit leans on it

This kit is built to be worked on by an AI agent, and git is what makes that safe to watch.

- **The agent works in small checkpoints.** As it does a task, it saves its progress in little
  labeled snapshots ("checkpoint commits") rather than one big mystery change at the end.
  Because each step is its own save-point, any step can be undone on its own without throwing
  away the good work around it.
- **It's how you experiment without fear.** Want to let the agent try a bold idea? The current
  state is already saved. If you don't like where it went, you go back to the last good
  snapshot. Nothing you had before is gone. That safety net is what lets you say "go ahead and
  try" instead of "please don't break anything".
- **It's how the project ships and grows.** When the kit is published, or when someone else
  wants to contribute an improvement, git is the shared language for "here is exactly what I
  changed." The same tool that protects your local experiments is what lets many people build
  on the same project without stepping on each other.

## The handful of words you'll actually meet

You can use this kit knowing just these four. Everything else you can learn later, or never.

- **Repository** (or "repo") — the folder git is watching, together with its whole saved
  history. This kit *is* a repository. When you copy it to your machine, you get the files
  *and* their history.
- **Commit** — one saved snapshot, with a short message describing it (like *"add glossary
  page"*). A commit is a save-point. The agent makes these as it works so the history reads
  like a labeled trail of what happened.
- **Clone** — make your own copy of a repository, history and all. `git clone` is simply "give
  me my own copy to work in." That's the command you were probably handed.
- **Push** — the *separate*, later step that shares your commits with the outside world.

That last one carries the reassurance worth repeating:

> **Committing is local, private, and undoable.** Making a commit only writes to the copy on
> your own machine — it publishes nothing. Nothing leaves your computer until a *separate*
> "push" step, and in this kit that step is never taken without you. So the agent can save as
> often as it likes while you decide, at your own pace, whether anything is ever shared.

## No git yet? (for example, you downloaded a ZIP)

If you got the kit as a ZIP download, or someone copied the folder for you, the folder has the
files but no history — git isn't watching it yet, so there is no safety net. The agent notices
this and **offers** to set one up; it does nothing until you say yes. What it does then is small
and stays on your machine:

- `git init` turns the folder into a repository — git creates one hidden `.git` folder inside it
  where it keeps the snapshots.
- A **first commit** saves everything as it is right now, so there is a point to return to.

**Nothing is uploaded.** There is no account, no server, no GitHub involved; that only happens
with a push, which the agent never does without you. Your own material is covered too: the
worksheets, drafts and notes the packs save under `out/` go into the same snapshots as
everything else.

**git not installed at all?** The agent tells you how to get it for your computer:

- **Windows** — the installer from <https://git-scm.com/downloads/win> (keep the suggested
  settings), or in PowerShell: `winget install --id Git.Git -e`.
- **macOS** — run `xcode-select --install` in the Terminal, or use the installer linked on
  <https://git-scm.com/downloads/mac>.
- **Linux** — your package manager, for example `sudo apt install git`.

Afterwards close and reopen the terminal (and the agent) so it finds git. If you would rather
not install anything, the cloud path in [Getting started](../tutorial/getting-started.md) comes
with git built in.

## Nothing to be intimidated by

If this is your first time near version control, hold on to two things and let the rest come
later: git is *remembering* work, not risking it; and every save is *undoable* and *stays on
your machine*. You don't need to memorize commands to benefit from that — the agent handles the
day-to-day, and when you're curious about the mechanics, <https://git-scm.com> is the place to
go.
