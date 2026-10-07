<!-- base -->
# kit-tools — directive

Use the kit's tested helper tools instead of writing your own converter, checker or
screenshot script. A kit declares what it can do in `kit.json` → `capabilities` and how in
`kit.json` → `tools`; this directive is the rule for reaching for them. It does not describe
the tools. Each one explains itself with `--help`, and the kit documents them in its own
tools reference.

**Occasion.** A simulated teacher run on 2026-09-25 built three helpers in one session (a
Python Word writer, a Puppeteer PDF script with a regex page count, an axe script whose
verdict was not the kit's) and left them in the teacher's output folder next to the
worksheets. Untested, rebuilt differently every session, and in the wrong place.

## The rule

1. **Before writing a helper script, look at the tool list.** Read `kit.json` → `tools` (or
   run the kit's list command, `npm run tools` in this kit). If a capability you need is
   there, find the entry whose `provides` holds it, run its `run` command with `--help`, then
   for real.
2. **Use the registered tool.** Its verdict is the kit's verdict (the accessibility tool
   judges by the same A11Y rules as the gate), its outputs are deterministic, and it stays
   inside the project and offline. Pass on what it reports under `notChecked`. Do not claim
   more than the tool checked (QUAL-007).
3. **Read the exit code.** 0 done, 1 a finding (fix and rerun), 2 a usage or input problem
   (fix the call), 3 the environment is missing something. Tell the person the fix the tool
   printed, in plain words. Do not route around it with a script of your own.
4. **A missing tool: say so, then decide by recurrence.** If the kit lacks the capability, use
   the fallback the pack or skill declares and tell the person what is missing. If the need
   will come back, add the tool to the kit's tools folder with a test and its registration,
   as its own commit. A one-off helper for one piece of shaped work goes into that spec's
   `tools/` folder (`specs/<date-slug>/tools/`).
5. **Never put helpers, screenshots or reports into output or deliverable folders.** Material
   a person hands out lives there. Scratch goes to the kit's git-ignored scratch folder; the
   tools already write their evidence (screenshots) to a git-ignored folder of their own.

## Every shell command can cost the person a click

A person who has not switched off permission prompts confirms every shell command the agent
runs, unless the project allows it in advance. In the simulation of 2026-09-25, about 190 of
227 tool calls were shell commands (mostly `sed -n`, `grep`, `cat >`, ad-hoc `node -e`), and
each would have been a confirmation for the teacher (counted afterwards from the logged tool
calls; an estimate). So:

- **Read, search and edit with the built-in file tools** (Read, Grep, Glob, Edit, Write), not
  with `cat`, `sed`, `grep`, `head` or heredocs. Reading never asks; an edit asks at most once.
- **Run the kit's registered tools and `npm run` commands** as they are listed. The same
  line comes back every time, so a person can allow it once ("don't ask again"); an ad-hoc
  `node -e` is new each time and asks every time, and the safety hook refuses a script in
  the temp folder outright. (The kit's `.claude/settings.json` allows a short list in
  advance: the `npm` commands for start, tools, tests, lint and build, plain
  `git status`/`diff`/`log`, and edits in `out/`, `src/assets/` and the books; each command
  only as written (in Bash a wrapper such as `timeout` in front does not matter), the full
  list is in [SAFETY](../base/SAFETY.md#what-runs-without-a-confirmation-click).
  Everything else asks, and the person can widen or narrow the list.)
- **One command per job.** Do not chain several steps into one line to save a prompt; the
  person cannot judge a long line, and each part is checked on its own anyway.

## Why

A tool written in the middle of a task is untested, is rewritten differently next session,
and its verdict drifts from the gate's. A person then gets two answers to "is this
accessible?", and nobody knows which one to trust. One tested tool per job, found through the
contract, gives the same answer every time and keeps the person's folder clean.
