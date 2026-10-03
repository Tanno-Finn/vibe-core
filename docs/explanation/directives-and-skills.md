<!-- base -->
# Directives & skills

This kit instructs its agent in two very different ways, and keeping them separate is what
stops the whole thing from turning into one giant unreadable rulebook. If you ever wonder
*"how does the agent know to do that?"*, the answer is almost always one of these two:
a **directive** or a **skill**.

The one-line mental model:

> **A directive is knowledge. A skill is a verb.**
> A directive is something the agent *knows* and applies to everything it does. A skill is
> something you *ask it to do*.

## Directives — the durable knowledge

A **directive** is a piece of lasting know-how the agent carries into every task: a coding
standard, a safety habit, a quality bar, a way of communicating. Directives don't get "run" —
they're the background rules that shape *how* the agent works on whatever it's doing. Written
down once, they stop living in one agent's head and apply consistently every time.

They live in [`../../directives/`](../../directives/), and the map to them is
[`../../directives/index.yml`](../../directives/index.yml) — one row per directive so the agent
can find the right one without reading them all. A few real ones from that index:

- **`core-principles`** — evidence before claims, "a question is not an order", make the
  smallest change that works, the user owns the method.
- **`verification`** — a self-report is not proof; a fresh skeptic re-checks the builder's
  work, and "reproduce it or it didn't happen".
- **`communication`** — the house style: no hyperbole, honest status, point at `file:line`,
  keep a budget on superlatives.
- **`translation-quality`** — the quality model, terminology hierarchy, and human-approved
  term sheets used when content is translated.

Notice none of these is a *task* — they're standing rules that color everything.

## Skills — the jobs you ask for

A **skill** is a discrete job the agent runs when you ask for it — often by name, like a
command. Each one has a clear start and finish and a clear thing it produces. Real ones this
kit ships:

- **`/onboarding`** — a first-contact interview that learns enough about you to help well, and
  writes it to your manifest: how you want things explained (including the world you know
  best, so it can use pictures rather than jargon), what to build for from day one, and the
  seven topics it watches for you — each at `quiet`, `normal` or `active`. Stop halfway and
  it picks up where you left off instead of starting over.
- **`/help`** — lists the available skills in your own language and invites you to pick one.
- **`/status`** — an honest, current picture of the project: what's in progress, what's done,
  what's next, what needs you.
- **`/new-content`** — create one piece of content (an article, glossary entry, timeline event,
  or plain document), shaped to what the kit can actually produce.
- **`/new-component`** — add a reusable UI component the right way: gallery check first, then
  the component, its registry entry, its doc, and its live demo in one pass.
- **`/ship`** — the "are we done?" gate: green build, green tests, docs in the same commit, a
  second review for non-trivial work. It prepares and asks — it never publishes on its own.

Each skill is a `SKILL.md` file under [`../../.claude/skills/`](../../.claude/skills/) (one
folder per skill). Optional [**packs**](the-pack-layer.md) add more skills the same way, under
`packs/*/skills/` — for example the teacher pack's `worksheet`, `practice-quiz`, and
`differentiation` jobs, which appear only when you switch that mode on.

## How the skills ship — and travel to other tools

There is nothing to install. A skill is just a `SKILL.md` file in a committed folder under
`.claude/skills/` (packs add more under `packs/*/skills/`) — plain Markdown, versioned in git
like the rest of the repo, not gitignored and not a build artifact. Clone the repo and the
skills come with it.

That plain-Markdown-in-git choice is what makes them portable across tools:

- **Claude Code loads them natively.** It discovers each folder and offers the skill by name
  (`/new-component`), running the steps as written.
- **Other tools read them as documentation.** A tool that doesn't run skills natively still
  reads their Markdown as plain instructions — pointed at the repo's conventions by
  [`../../AGENTS.md`](../../AGENTS.md), the canonical instruction file other agents
  (Copilot, Cursor, Gemini) read directly.

So the same committed files are an executable command in one tool and a readable playbook in
the next — no export step, no second copy to keep in sync. (The same is true of directives:
Markdown under `directives/`, mapped by `directives/index.yml`.)

## Why keep them separate?

Because they answer different questions. Knowledge should always be on — you never want to
*remember to ask* the agent to respect the safety rules. Jobs should be on demand — you don't
want every rule in the book firing on every request. Mixing the two would mean either drowning
each task in rules it doesn't need, or burying the rules inside individual jobs where they only
half-apply. Splitting them keeps each side short, findable, and honest.

## The switch between them: `/new-directive`

When you want to teach the agent something new, you don't have to decide which bucket it goes
in — there's a skill for exactly that decision. **`/new-directive`** is the *switch*: describe
the pattern, workaround, or opinion you keep repeating, and it works out where it belongs. If
it's really a repeatable *job*, that becomes a new skill; if it's *knowledge or a rule* that
should shape everything, that becomes a new directive. Either way it only ever writes with your
explicit go-ahead, so knowledge stops living in one conversation and becomes part of the kit.

## Where to look next

- [`../../AGENTS.md`](../../AGENTS.md) — the reference file the agent actually reads first: a
  map pointing at the standards, directives, skills, and safety model.
- [The pack layer](the-pack-layer.md) — how optional packs add whole bundles of role-specific
  skills (like the teacher pack) without touching the base or the kit.
