# Path resolver widget (`app-path-resolver`) — shape

**Status:** implemented · **Date:** 2026-08-24

Shipped: `src/app/components/didactic/path-resolver/` (component + engine, both with
specs), embedded in the terminal article.

## What

A small embedded widget for the *Paths* section of the terminal article
(`src/app/pages/articles/art-terminal-intro/`). The reader sets two parameters — **which
directory they are standing in** and **the path they type** — and the widget resolves the
second against the first, live, on every keystroke: it says whether the path is absolute or
relative, shows the resolved absolute path, traces it segment by segment, and marks where
it lands in a small fixed file tree (or that it lands nowhere).

## Why this page, this section, these two parameters

The article already states the misconception the widget makes touchable. Verbatim from
`articleTerminalIntro.paths.pitfalls.text` (en and de alike):

> Don't confuse absolute and relative paths: `/data/file.csv` is something entirely
> different from `data/file.csv`.

and, one sentence earlier: *"Never lose track of your working directory — use `pwd`
frequently."* Those two sentences are exactly a two-parameter claim — the path string and
the working directory — and the article currently only asserts it in prose. The widget
turns the assertion into something the reader can falsify in two seconds:

- keep the working directory, drop a leading `/` → the same name resolves somewhere else;
- keep the path, change the working directory → the same string resolves somewhere else.

The section's existing blocks are a definition, a scripted `cd`/`mkdir` walkthrough and a
warning box; none of them is interactive. The article's other interactive block
(`app-flashcard-deck`, in `#enrichment`) drills command *vocabulary*, so a path resolver
adds a mechanic the page does not already have rather than a second deck.

Placement: inside `#paths`, **after** the scripted walkthrough and **before** the pitfalls
box — the reader follows the script, then drives it, and the warning box then names the
traps they have just met.

## In scope

- `src/app/components/didactic/path-resolver/path-resolver.engine.ts` — the pure
  resolution logic (framework-free, unit-tested in isolation, same split as
  `tfidf.engine.ts` / `rag-vector.engine.ts`).
- `src/app/components/didactic/path-resolver/path-resolver.component.ts` — standalone,
  `OnPush`, config-driven, chrome strings in its own `pathResolver.*` namespace.
- Two controls: a `<select>` of every directory in the tree (the working directory) and a
  text `<input>` (the path). A reset button restores both to the configured defaults.
- Live output: kind badge (absolute / relative / home-relative), the resolved absolute
  path, a per-segment trace, the tree with "you are here" and the target marked, and a
  one-line spoken summary in a polite live region.
- Path syntax the engine understands, all of it named by the article's own prose:
  `/` root, `.`, `..`, `~` (the tree is rooted in a home directory), and `\` accepted as a
  separator because the article states that *"most modern tools accept both separators"*.
- i18n for `pathResolver.*` and the new `articleTerminalIntro.paths.resolver.*` keys in all
  four variants (`de`, `en`, `de-easy`, `en-easy`).

## Explicitly out of scope

- **Executing anything.** No `mkdir`, no `rm`, no command parsing — the widget resolves an
  address, it does not run a shell. The article's own warning that the terminal has no undo
  is the reason not to build a fake one that does.
- **A configurable or editable tree.** The tree is a constant in the article component,
  deliberately the same `/home/user/project/{data,src}` the walkthrough above it builds, so
  the widget continues the scene instead of opening a new one.
- **Shell-accurate `..` semantics.** The walk is purely lexical, so
  `../notes.txt/..` resolves to `/home/user` and reports a folder, where a real shell
  errors because `notes.txt` is not a directory. That is the right trade for a widget
  about *addressing* — the alternative is an error state whose lesson is a different one —
  but it means the widget models path arithmetic, not the filesystem call.
- **Symlinks, globs, quoting, Windows drive letters.** The article names symlinks only to
  break its own analogy; modelling them would teach a second lesson badly. `C:\` is
  mentioned in the definition but the tree is a Unix tree, and a resolver that switched
  root shape on input would be a puzzle rather than a demonstration.
- **A design-system gallery entry.** Article widgets under `components/didactic/` are not
  in `design-registry.ts` (nor are `scaling-slider`, `flashcard-deck`, `http-request-flow`);
  adding one would be the first of its kind and is not this change's decision to make.
  They are not simply absent, though: `check-design-system.mjs` fails on a component that
  is in neither registry, so the widget is listed in `design-registry.exclusions.json`
  with a one-line reason, exactly as its neighbours are.
- **A new ToC entry.** The widget lives inside an existing section.

## Decisions worth recording

1. **The working directory is a `<select>`, not free text.** Both parameters as free text
   would make every "not found" ambiguous — typo, or genuinely elsewhere? Pinning the
   *from* to a real directory means every miss is attributable to the path the reader
   typed, which is the lesson.
2. **The list of working directories is derived from the tree, not configured.** Every
   directory in the tree is offered. A second list would be a second source of truth that
   can silently disagree with the first.
3. **"Not found" is a first-class, correct answer — not an error.** `/data/file.csv` in a
   tree that has no top-level `data` is the article's own example of a *valid* path that
   points at nothing. It is rendered as a plain factual verdict, never as a failure state
   with a retry.
4. **The trace is the visualisation.** No canvas, no animation: a list of steps plus a tree
   whose current and target rows are marked with text *and* an icon. A canvas would need
   its own keyboard path (A11Y-003) to teach what a list already teaches.
5. **Element ids from a module-scoped instance counter**, as `scaling-slider` does. This
   is deterministic *within* a render, not across them: the prerender numbers instances in
   route order (`de` got `…-cwd-1`, `en` `…-cwd-2`) while the client always restarts at 1.
   That is harmless only because the label's `for` and the control's `id` come from the
   same counter and Angular rewrites both together, so the association never breaks — but
   the ids themselves are not stable from server to client, and nothing may depend on them.
6. **`translate(...)`, not `t(...)`.** Follows the neighbouring didactic widgets (QUAL-005);
   the repo-wide choice is parked in `OPEN-QUESTIONS.md` and this change does not pre-empt it.

## Standards this answers to

By reference, not copied — `base/standards/`:

- `A11Y-001` — both controls and the reset button are native elements with a bound label
  and an explicit `:focus-visible` rule (the kit's family rules cover PrimeNG controls
  only; these are plain HTML).
- `A11Y-003` — the widget is not a canvas, but the same duty applies: it is fully operable
  from the keyboard and its result is announced, not only drawn.
- `A11Y-006` — found / not-found is carried by text and an icon, never by colour alone.
- `A11Y-005` — `de-easy` / `en-easy` copy authored alongside `de` / `en`.
- `A11Y-007` — no animation is introduced at all, so there is nothing for reduced motion
  to suppress.
- `QUAL-004` — the engine ships with unit tests whose cases are hand-computed, including
  `..` past the root, `.`, a trailing separator, an empty input and `~`.
- `QUAL-005`, `QUAL-006` — the component follows the shape of the didactic widgets already
  in the folder (config `input.required`, own chrome namespace, print styles) and adds no
  abstraction beyond the one article that uses it.
