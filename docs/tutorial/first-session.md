<!-- base -->
# Your first session with the agent

This is a walkthrough of your **first real conversation with an AI agent** in this repo —
from a fresh clone to your first genuine change, committed and visible. It takes about
fifteen minutes. You do **not** need to be a developer: you will be talking to the agent in
plain language the whole way, and it does the typing.

If you haven't got the code onto your machine yet, do
[Getting started](getting-started.md) first — that walkthrough ends with a running app; this
one begins with a running agent. The two are companions: one gets the *app* going, the other
gets the *agent* going.

By the end you'll have met the agent, seen what it can do, made one small real change, and
watched it write that change into the project's books — so nothing you do here is ever a
mystery you can't retrace.

---

## Before you start

Two things:

1. **The code, on your machine or in the cloud.** Either a local clone (from
   [Getting started](getting-started.md)) or the repo open in GitHub Codespaces. You don't
   need the app *running* for this — the agent works on the files, not the live page.
2. **An AI coding agent.** If you don't have one yet, read
   [Choosing an AI coding agent](../explanation/choosing-an-ai-agent.md) (five minutes,
   criteria not brands), install one, and point it at this repo's folder. Not sure what an
   "agent" even is? That page opens by explaining it.

That's it. No extra setup — the agent reads its own instructions from
[`AGENTS.md`](../../AGENTS.md) the moment it looks at the repo.

---

## 1. Start the agent and say hello

Open the agent in the project folder and just greet it — *"hi"*, or tell it in one line
what you'd like to do. You don't need a command or any special phrasing.

On a fresh repo, one of two things happens:

- **You have no profile yet.** The agent notices `profile/USER-MANIFEST.MD` is missing and
  *offers* a short onboarding interview first, with a sentence on why: afterwards it answers
  in your language, at your level and length, and builds for your audience, their devices and
  the way material reaches them — fewer wrong turns, less cost. It offers; it never forces.
  We recommend saying yes. If you'd rather start straight away, it does, saves a starter
  profile with defaults, and reminds you **once**, briefly, after your first result.
  Either way, when you mention something about yourself along the way ("I teach year 8",
  "my pupils use iPads"), it says it's noting that in your profile, so a later interview
  skips what it already knows.
- **You already filled in the browser form.** If you did the
  [`docs/onboarding.html`](../onboarding.html) form and clicked **Export**, paste that text
  block as your first message instead. It asks exactly what the interview asks — the same
  questions, the same seven watch topics and levels — so both routes end at the same
  manifest, and it sets yours up from that.

### The onboarding conversation

If you take the interview, it's a handful of friendly questions in five short rounds — your
language first, then:

- **Working together** — what you want to build, whether a broken thing should be repaired
  *with* you step by step or simply fixed and shown to you, how deep you want explanations,
  and one light question about what you do for a living, or what you know inside out. That
  last one isn't a CV question: the agent uses it to explain technical things with pictures
  from a world you already know instead of jargon, and it's the most skippable question in
  the whole interview. (Pictures are an offer — at most one per explanation, and in a
  warning the precise sentence always comes first. "Drop the analogies" ends them for good.)
- **Accessibility** — whether you or the people you're building for need the page to work
  without a mouse, with a screen reader, or in very plain words. Switching accessibility
  off is only offered for a throwaway prototype.
- **What the agent watches for you** — seven topics it keeps in view unprompted: security
  and secrets, privacy, accessibility, technical debt, cost, findability (SEO) and speed.
  Each runs at one of three levels: `quiet` (it still watches and records, you see the
  findings when you ask or on `status`), `normal` (one plain sentence the moment something
  trips, plus a check-in at natural pauses), or `active` (the same, and it offers to look
  things over without an acute finding). Five start at `normal` and two — findability and
  speed — at `quiet`, because the older five protect against damage while the newer two
  improve a result. *"Just keep everything at the default"* is a complete answer to this
  whole round. And the levels only tune how chatty the agent is about routine things: real
  safety warnings, the hard rules, and being told before anything costs money are never
  affected by them.
- **Your setup** — operating system, what kind of machine, and whether git is there, so
  that any instructions you get later fit the computer you actually have. If the folder has
  no git yet (for example you downloaded a ZIP), the agent offers to set up that safety net
  and waits for your yes — [What is git, and why](../explanation/what-is-git.md) explains it.
- **How your work reaches people** — how finished material gets to your learners or audience
  (the school platform such as Moodle, a web server, a website service, on paper or a USB
  stick, or only your own computer), what devices they use, whether anyone uses a screen
  reader, how the internet is, who can help you technically, and any data-protection rules.
  It opens with one question and asks the rest only where they matter; *"I don't know"* is a
  good answer. For the web routes, [Deploy the built site](../how-to/deploy.md) is the guide
  for later.

**Every question is skippable**, and skipping never leaves a hole: each round has named
defaults, and a skipped answer is written into the manifest *marked* as a default, so a
later session knows it was assumed rather than stated. You can also stop halfway — *"that's
enough for now"* is a valid answer. The agent closes the profile with those defaults and
notes where you stopped; when you come back and say `onboarding` again it doesn't start
over, it reads what you already answered and asks only what's still open. ("Start over" is
the one phrase that does discard your answers.)

At the end the agent tells you *what changes now* rather than reciting your answers back —
a short "here's how I'll work with you", each line traceable to something you said, and a
suggestion for your next step.

Whichever route you took, the agent now has a `profile/USER-MANIFEST.MD` and will speak your
language and respect your preferences from here on.

---

## 2. Discover what it can do — say "help"

Type **`help`** (or *"what can you do?"*). The agent lists its **skills** — the named jobs
it knows how to run — each with a one-line purpose, in your language. You'll see things like:

- **`/onboarding`** — the interview you may have just done.
- **`/help`** — this list.
- **`/status`** — where the project stands, in plain language.
- **`/new-content`** — make an article, a glossary entry, a timeline event, or a page.
- **`/ship`** — run the "is this really done?" checks before finishing a change.

Don't memorize them. `help` is always there to remind you; think of it as a map of the
doors, not a manual you have to read. Pick whatever matches what you want to do and say so.

---

## 3. Make one small, real change

The fastest way to trust an agent is to watch it change something real and safe. This kit
ships with a few **placeholder glossary entries** (`seed-term-1`, `seed-term-2`, …) so there's
something harmless to practice on. Let's replace one with a genuine term.

Say something like:

> *"Use /new-content to replace one of the glossary seed terms with a real one — the term
> 'prompt', explained for a beginner."*

The `/new-content` skill will:

1. **Check what this kit can actually make** (it reads `kit.json` rather than guessing) and
   confirm a glossary entry is one of them.
2. **Read the shape back to you** in a sentence — *"a beginner-level glossary entry for
   'prompt', in English"* — and wait for your yes before writing anything.
3. **Write the entry** in the right place, following the kit's own conventions, and tell you
   where it saved it.

You picked the term and approved the shape; the agent did the file-wrangling. That division
— you decide, it types — is the whole point. Nothing here is published or sent anywhere:
writing a file locally is a safe, reversible action.

> **Something felt off?** Tell it. *"Make it simpler,"* *"that's too long,"* *"undo that."*
> The agent expects to iterate, and because the change is local you can always step back.

---

## 4. Watch it write the change into the books

This is the part that makes the kit trustworthy for non-developers: the agent doesn't just
change files, it **keeps a legible record** so you can always see what happened without
reading code. Two things you'll notice after a real change:

- **A checkpoint commit.** When something works — a clean build after a genuine change — the
  agent saves a checkpoint: a git commit whose message is written in *your* language, telling
  the story of what changed, with a short machine-readable trailer for tooling. You didn't
  have to ask; committing its own work as it goes is one of the agent's standing habits. (It
  never `git push`es, though — sending anything outward is yours to decide.)
- **An account statement** (*"Kontoauszug"*). After a block of work the agent gives you a
  two-to-four-line plain-language summary: what changed, whether the build is green, and
  what's next. It's the running receipt you skim instead of reading diffs.

You'll also find a new entry in **[`JOURNAL.md`](../../JOURNAL.md)** at the repo root — the
project's append-only diary, a short section per session: what was done, how it was
verified, anything left open. Open it and read the entry for the session you just did. That
file, plus the commits, means a *different* agent (or you, next week) can pick the project up
and know exactly where things stand.

To see all of this pulled together at any time, just say **`status`**.

---

## 5. Where your questions and its questions go

Sometimes the agent hits a decision that's really yours to make — *"should this stay in both
languages?"*, *"which of these two layouts do you prefer?"* — but one that shouldn't stop the
work right now. Those don't vanish into the chat scrollback. The agent writes them, dated,
into **[`OPEN-QUESTIONS.md`](../../OPEN-QUESTIONS.md)** at the repo root: the context, a
couple of options, and its suggested default.

It's a small, shared to-do list of decisions waiting for you. You can answer right in the
file or just tell the agent in conversation; answered questions get marked resolved so the
list stays honest. When you run `status`, anything open there is surfaced for your attention.
Think of it as the place the agent politely taps you on the shoulder — later, not mid-task.

---

## What next?

You've done a full loop: start → onboarding → help → a real change → the books → open
questions. From here:

- **Want to know what every folder is for?** [What is where](../explanation/repo-map.md) is a
  plain-language map of the repository — what you own, what the agent reads, what you can
  safely ignore.
- **Want to get the app running in the browser?** If you haven't yet,
  [Getting started](getting-started.md) does exactly that.
- **Ready to build something bigger?** Just tell the agent, or say `help` and pick a door.
  For anything you publish or deploy, it will stop and ask first — that's a decision it
  always leaves to you.

Stuck, or the agent did something you didn't expect? Say `status` to get your bearings, and
remember every change it made is a commit you can retrace or undo.
