<!-- base -->
# Safety model — Green / Yellow / Red

Every action the agent takes falls into one of three tiers. The tier decides how much
the agent warns before acting. This is the canonical model that `AGENTS.md` → Boundaries,
`/ship`, and `/status` all point at. Red-tier prohibitions overlap the
[`SECURITY`](standards/SECURITY.md) standard. The ones a tool call can be *recognized* by
are enforced **twice** — by instruction here and by a `PreToolUse` hook (see
`.claude/hooks/`); the rest are carried by instruction alone. Which is which:
[Why doubled](#why-doubled--and-how-far-it-reaches).

## The three tiers

| Tier | What it covers | How the agent behaves |
|---|---|---|
| 🟢 **Green** | Local and reversible: reading, editing files in the working tree, a local checkpoint commit, running a build/test. | **Never warns.** Just does it (and says what it did). Warning on Green is noise. |
| 🟡 **Yellow** | Bigger but still recoverable: deleting/overwriting local files you didn't just create, a broad refactor, anything you'd want a moment to reconsider. | **Checkpoint first, then one plain heads-up**, then proceeds. Leaves a way back (the checkpoint commit). |
| 🔴 **Red** | Irreversible or reaching outside the machine: push, deploy, publish, send, delete data, change access, make a repo public, staging the whole tree (`git add -A` — unverifiable), killing shared dev/agent processes, writing or deleting **outside the project directory** (below), anything that spends money or touches someone else's data. | **Never without explicit, informed go-ahead.** Not delegable to a sub-agent. A subset is hard-forbidden entirely (below). |

Red is a shape, not a list of binaries. The three that reach furthest in this repo, spelled
out because they are the ones an agent actually has to hand:

- **Publishing the repository.** `gh repo edit --visibility public`, `gh repo create
  --public`, or the same thing as a REST call (`gh api -X PATCH …`). Practically
  irreversible: once the code has been visible it can have been cloned.
- **Deploying.** Not `npm run deploy` as a name — the CLI that actually moves bytes to a
  live target: `vercel`, `netlify deploy`, `firebase deploy`, `wrangler`, `aws s3 sync`,
  `gh-pages`, `scp` to a server, `docker push`, `kubectl apply`, `terraform apply`.
- **Changing access or CI.** `gh secret set`, `gh auth login`, `gh workflow run`,
  `gh pr merge`, `git remote set-url`.

## The project directory is the edge of the working area

Reading, writing, deleting: all of it stays **inside the project directory**. Anything
that lands outside it — `~/Documents`, `../another-repo`, an absolute path somewhere on
the disk — is **Red**, and needs the same explicit go-ahead as a push or a deploy.

Why Red and not Yellow, given that deleting a local file is normally Yellow: Yellow's
whole promise is *"checkpoint first, so there's a way back"*, and that promise is git's.
Git stops at the project root. Outside it there is no checkpoint to make and no history to
restore from, so the mechanism Yellow relies on simply is not there — and the file is
quite likely someone else's: another project, a parallel worker's tree, the user's own
documents. Irreversible plus not-yours is the Red definition.

Not hard-forbidden, though: "write into the sibling repo next door" is a perfectly
reasonable thing to be asked to do. It just has to be *asked* for, in that specific
session, rather than assumed.

Two practical notes:

- **Relative paths count.** `../` that climbs out of the project is outside, however it
  is spelled. The hook resolves every path against the directory the command actually
  runs in (the tool call's `cwd`), and takes the nearest folder with a `.git` as the
  project — so an agent worktree under `.claude/worktrees/<name>/` is its own project.
- **Two scratch areas are exempt, and only those two.** The OS temp directory
  (`os.tmpdir()`, which Git Bash on Windows also mounts as `/tmp`) and this repository's
  own `tmp/`. Scratch files are disposable by definition and belong to no one; treating
  them as Red would be exactly the cry-wolf this model warns about. A folder that is
  merely *called* `tmp` or `temp` elsewhere (`C:/temp/important`,
  `../other-project/tmp`) is somebody's, and is Red like any other path outside. Deleting
  the OS temp directory itself is Red too.

## Hard-forbidden (never, even with a go-ahead)

Force-push / rewriting published history / moving a branch ref backwards (SEC-003);
committing or transmitting a secret (SEC-001/002); exfiltrating or exposing personal data
(SEC-004); disabling a security gate to get unblocked (SEC-006). These are not "Red you
can approve" — they are off the table.

`git rebase` and `git pull --rebase` are in here for the same reason as force-push: both
replay and rewrite commits, and in a repo where several agents work at once the commits
they rewrite are somebody else's. So is `gh repo delete` — destroying the published
repository is the most complete form of "destroy published history" there is. And so is
deleting the project itself, a folder above it, or its `.git` — by any path that resolves
there — and `git checkout -f` / `git switch -f`, which discard the whole working tree.

## The one warning format

When the agent must warn (Yellow heads-up, or asking for a Red go-ahead), it uses **one
recognizable shape**, every time:

> **What could happen:** <the concrete outcome, in plain language>
> **How bad:** <reversible? who/what is affected? can it be undone, and how?>
> **My suggestion:** <the safer path or the specific go/no-go being asked for>

No other warning styles. One shape means the user learns to read it at a glance.

## Cry-wolf prevention (a design duty, not a nicety)

- Warn **once per thing per session.** Record the decision; don't re-ask the same
  question you already got an answer to.
- Never warn on Green. If everything is a warning, nothing is.
- The user's profile modulates **only the communication layer** — how gently or tersely
  the warning is phrased — never *whether* a Red action needs a go-ahead. That is what the
  manifest's `watch` levels tune (`quiet | normal | active`, defined in
  [stewardship](../directives/stewardship.md)): the volume of routine nudges, never a
  warning, a `[hard]` rule, or a go-ahead. Safety is not a profile setting.

This applies to the hook as much as to the prose. A gate that refuses `grep -n '=>' …`
or `gh pr list` teaches every agent in the repo to treat its refusals as noise, and the
one refusal that mattered goes past unread. Read-only commands are ALLOW, and that is a
requirement of the design, not a convenience: the hook's own test suite carries a
must-not-block case for every rule that has one.

### What runs without a confirmation click

`.claude/settings.json` carries a short `permissions.allow` list, so Claude Code does not
ask the person before the kit's routine Green steps:

- `npm start`, `npm run tools`, `npm run test:ci`, `npm run test:tools`, `npm run lint`,
  `npm run build:prod`;
- read-only git without arguments: `git status`, `git diff`, `git log`;
- edits inside `out/` and `src/assets/`, and of `profile/USER-MANIFEST.MD`, `JOURNAL.md`
  and `OPEN-QUESTIONS.md`.

The command entries hold for Bash and PowerShell and carry no wildcards on purpose: a
pattern such as `git diff*` would also match `git difftool -x <any command>`, and
`node tools/*` would match `node tools/../out/x.mjs`. A rule without `*` matches one exact
command. For Bash, Claude Code compares it only after stripping a fixed set of wrappers
(`timeout`, `time`, `nice`, `nohup`, `stdbuf`, `command`, `builtin`) and a leading
assignment of certain known-safe environment variables, so `timeout 600 npm run build:prod`
counts as the listed line; a compound command needs every part to be allowed on its own. The
same command with other arguments, a script started with `node`, and every commit still
ask. The git entries change little: Claude Code already runs read-only forms of git
(`git log --oneline`, `git diff --stat`) without a prompt, as built-in read-only commands.
The list only saves the click; it lifts no rule. The `PreToolUse` hook still runs
on every call, and `permissions.deny` wins over `allow`, so the gate's own files stay closed
to edits. Everything not on the list asks as before.

As a second line, the hook refuses the known ways a plain-looking, pre-approved command
could still run code or write a gate file. That keeps today's exact entries from being
turned into something else; it does not make a future wildcard entry safe, because the
hook only knows the routes listed here: `git difftool`/`git mergetool` (they launch an
external program, with `-x`/`--extcmd` one you name); `git … --output=<file>` and
`git format-patch -o <dir>` and `GIT_TRACE*=<path>` (they write a file named in the command,
past the redirect and protected-path checks); a git config value that makes git run a program (`-c core.pager=…`,
`diff.external`, `textconv`, `interactive.diffFilter`, `*tool.*.cmd`/`.path`, a filter
driver, `credential.helper`, `include.path`, … via `-c`, `--config-env` or
`git clone --config`), the environment variables that do the same (`GIT_EXTERNAL_DIFF`,
`GIT_PAGER`, `PAGER`, `GIT_SSH_COMMAND`, `GIT_EDITOR`, `GIT_EXEC_PATH`, and the config
injectors `GIT_CONFIG_PARAMETERS`, `GIT_CONFIG_COUNT`/`_KEY_n`/`_VALUE_n`,
`GIT_CONFIG_GLOBAL`/`_SYSTEM`), `--ext-diff`/`--textconv`, `--template`, `--upload-pack`
and `--exec-path=` directly after `git` (behind `-C` it is not caught, so such a call
asks first unless an allow rule matches it); git pointed at another repository under
`out/`, `src/assets/`, a temp folder or `..` outside the project (`git -C`, `--git-dir`,
`--work-tree`, `GIT_DIR`, `GIT_WORK_TREE`), whose own config could run code; `NODE_OPTIONS` (or npm's
`--node-options`) carrying `--require`/`--import`/`-r`/`--loader`/`--experimental-loader`,
which every node process of the command would load first; `node`/`tsx`/`ts-node` running a
script that escapes its folder via `..`, lives under `out/` or `src/assets/`, or sits in a
temp/scratch dir, also when `npx`, `npm exec`, `pnpm dlx`, `yarn` or `env` starts it (a
project that itself lives in the temp folder still runs its own scripts); and
`git commit -a`/`-am`/`--all`, the same unverifiable stage-all as `git add -A`.

In **auto mode** — the built-in starting mode for interactive terminal and VS Code
sessions since Claude Code v2.1.283 — a classifier reviews actions in place of the person.
Per the Claude Code docs, on entering auto mode the broad allow rules that grant arbitrary
code execution are dropped (a blanket `Bash(*)`/`PowerShell(*)`, wildcarded interpreters
like `Bash(python*)`, package-manager run commands, `Agent` and `Monitor` allow rules);
narrow rules such as `Bash(npm test)` stay in effect, and the dropped rules return when the
session leaves auto mode. An action an allow rule matches resolves immediately, except that
writes to protected paths (`.git`, `.claude`, …) route to the classifier even when a rule
matches, and no allow rule approves an `rm`/`rmdir` of a critical path. A `PreToolUse`
hook that denies a call (the kit's hook answers with a JSON `deny` decision and exit code 0,
not with exit code 2) takes precedence over allow rules in every mode, and `permissions.deny`
blocks in every mode including `bypassPermissions`; allow rules have no effect under
`bypassPermissions`. `defaultMode: "auto"` set in a project's `.claude/settings.json` does
not take effect — Claude Code reads it only from `~/.claude/settings.json`.

## Why doubled — and how far it reaches

Red prohibitions live in instruction (this file + SECURITY) **and** in a `PreToolUse`
hook, because a single layer fails silently. If the hook and the instruction ever
disagree, the stricter one wins.

"Doubled" is a claim about particular rules, not a blanket one. The hook sees a tool call
and nothing else — a command string, a file path — so it can only catch what is visible
there:

| Rule | Second layer? | What the hook actually sees |
|---|---|---|
| SEC-001 — commit a secret | **yes** | `git add`/`commit` of a secret path, also by wildcard (`.env*`, `.e?v`, `*.pem`); `Write`/`Edit`/`MultiEdit`/`NotebookEdit` (and MCP write and patch tools) of `.env`, `*.pem`, `*.key`, `id_rsa`, `.deploy-credentials`, and a file *named* like a credential store (`secrets.json`, `credentials.yml`, `.aws/credentials`, `client_secret.json`, `prod.secrets.env`: the word is the whole name, plus at most a config extension) — the path checked as Windows opens it (`..` applied, trailing dots/spaces and `::$DATA` stream suffixes dropped, case ignored); creating, copying or deleting one of those from the shell, including `>.env` with no space. A file that only has the word in its name (`articleSecretsSecurity.json`, `docs/credentials-howto.md`) is ordinary content. Text that only *names* a secret file (a commit message, a heredoc or here-string body) is not a write to it. `git rm --cached <secret>` — the remediation — stays open |
| SEC-002 — send a secret out | **partly** | reading a real secret file (`.env`, `.env.*`, `*.pem`, `*.key`, `id_rsa`, `.deploy-credentials` — never `.env.example`) through `Read`, an MCP read tool, or `cat`/`Get-Content`/`base64`/`Copy-Item`, also by wildcard; handing one to `curl` (`-d@`, `-T.env`, `-F f=@.env`, `--data-binary=@…`), `wget --post-file` or `Invoke-WebRequest -InFile`; `gh secret set`, `gh auth token`. A request that builds the value some other way passes |
| SEC-003 — rewrite history | **yes** | force-push (`--force`, `-f`, `--force-with-lease`, `--mirror`, `+refspec`), deleting a published branch (`--delete`, `:ref`), `reset --hard/--merge/--keep`, `rebase`, `pull --rebase`/`-r`, `--amend`, `update-ref`, `symbolic-ref`, `branch -f`, `filter-branch`, `clean -fdx`, `checkout/restore .`, `checkout -f`/`switch -f`, expiring the reflog, deleting `.git`, `gh repo delete`. Long options are matched as git's **unique prefixes** (`--har`, `--am`, `--fo`). The same verbs are recognized through git's global options (`-c`, `-C`, `--config-env[=]`, …; an unknown global in front of a protected subcommand is itself Red), line continuations (`\`, `` ` ``, `^`), cmd `^` and PowerShell `` ` `` escapes inside a word, `& ('gi'+'t')`, `Start-Process git -ArgumentList …`, and `cmd /c` / `pwsh -Command` payloads |
| SEC-004 — exfiltrate personal data | **no** | nothing. No gate inspects outbound traffic or what a request carries |
| SEC-005 — irreversible / outward | **yes** | `git push` (also `send-pack`, `subtree push`), `npm/yarn/pnpm publish`, `gh` mutations — visibility, `repo create/delete/transfer`, `release`, `secret`/`variable`, `workflow run`, `pr merge`, `issue`, `auth`, and `gh api` with POST/PUT/PATCH/DELETE or `-f` fields — deployment CLIs (`vercel`, `netlify`, `firebase`, `wrangler`, `surge`, `fly`, `heroku`, `serverless`, `gh-pages`, `aws s3 sync`, `gcloud`/`az` deploys, `docker push`, `kubectl apply`, `helm`, `terraform apply`, `pulumi`, `ansible-playbook`, `scp`/`rsync`/`sftp` to a server), `npm run deploy*` and a script it RUNS whose name says deploy (`./deploy.sh`, `python deploy.py` — not `git grep deploy.py`); killing node/agent processes; `git add -A` and `git commit -a`/`-am`/`--all` (stage-all); changing the remote; `rsync --delete`; code piped from the network into a shell; registry code run unasked (`npx --yes`, `npm exec --yes`, `pnpm dlx`, `yarn dlx`, `pnpx`) |
| SEC-006 — disable a gate | **partly** | writes to a `.claude` hook, `.claude/settings*.json`, a `.git/hooks/` file or `.git/config` (from `Write`/`Edit`, from the shell, through an MCP write tool, or as a target inside an MCP patch body — paths normalized as for SEC-001); deleting `.claude`, its hooks or settings, a worktree's own hooks and settings, or a whole worktree; moving or renaming `.claude`, `.claude/hooks`, a settings file or `.git/hooks` (`mv`, `git mv`, `Move-Item`/`mi`, `Rename-Item`/`rni`, `ren`, cmd `move`, `fs.rename`), because a hook file that no longer exists fails to start and Claude Code then lets every call through; MCP tools that execute something unreadable (`execute_run_configuration`, `execute_tool`, `run_inspection_kts`); `--no-verify` / `core.hooksPath`; defining **any** git alias (`git config alias.*`, `git -c alias.*=…`), which is the last point at which what it runs is visible; a git config value or environment variable that makes a plain `git diff`/`git log` run an external program (`-c core.pager=…`/`diff.external`/`*.textconv`/`interactive.diffFilter`/`*tool.*.cmd`/filter driver/`credential.helper`/`include.path`/… via `-c`, `--config-env` or `clone --config`, the `GIT_EXTERNAL_DIFF`/`GIT_PAGER`/`PAGER`/`GIT_SSH_COMMAND`/`GIT_EDITOR`/`GIT_EXEC_PATH` env vars and the config injectors `GIT_CONFIG_PARAMETERS`/`GIT_CONFIG_COUNT`/`_KEY_n`/`_VALUE_n`/`GIT_CONFIG_GLOBAL`/`_SYSTEM`, also as PowerShell `$env:`/`Set-Item env:`, `--ext-diff`/`--textconv`, `--template`, `--upload-pack`, `--exec-path=` directly after `git`); git pointed at a repository under `out/`, `src/assets/`, a temp dir or `..` outside the project (`-C`, `--git-dir`, `--work-tree`, `GIT_DIR`, `GIT_WORK_TREE`); `NODE_OPTIONS` or npm's `--node-options` with `--require`/`--import`/`-r`/`--loader`/`--experimental-loader`; `git difftool`/`git mergetool` (external program per changed file); `git … --output=<file>`/`format-patch -o <dir>`/`GIT_TRACE*=<path>` (writes a file as an argument, past the redirect and protected-path checks, so it can overwrite a gate file); `node`/`tsx`/`ts-node` running a script that escapes via `..`, lives under `out/` or `src/assets/` (the folders agents may edit without a click), or sits in a temp dir, also behind `npx`/`npm exec`/`pnpm dlx`/`yarn`/`env`; a command word built at run time (`$c push`, `& $x`, `& (…)`, `Invoke-Expression`, `eval`). Behind the hook, `permissions.deny` in `.claude/settings.json` refuses `Edit` (and so `Write`) of the hook folder, both settings files, `.git/config` and `.git/hooks/**`. Any other route around a gate is invisible |
| Project boundary (above) | **yes** | delete targets and `Write`/`Edit` paths resolved against the call's `cwd` — `~/…`, `../…`, foreign absolute paths are Red; the project root itself or any folder above it is hard-forbidden; a target the hook cannot resolve (`"$(pwd)/x"`, `$VAR`, `(Get-Location)`, `{a,b}`, a glob that could reach `.git` or `.claude`) is Red. Covers `rm`, `Remove-Item` and its aliases (`ri`, `rd`, `rmdir`, `del`, `erase`) and `Get-ChildItem … \| Remove-Item` |

Read that table the honest way round: **instruction is the load-bearing layer.** The hook
narrows the blast radius of the rules it can pattern-match, and does nothing whatsoever
for SEC-004. On exfiltration, an agent that has read this file is the only thing between a
secret and an outbound request.

### What the hook cannot see, stated plainly

An undocumented hole in a safety model is worse than a documented one, so:

- **It fails closed where it can, and open where it cannot.** Input that is not a JSON
  object, or an error inside a rule, produces a deny marked `BLOCKED (fail-closed …)` with
  the reason. No environment variable switches the hook off. What the hook's own process
  cannot catch still fails open, silently: if it is killed by its timeout, or `node` is
  not on the PATH, Claude Code proceeds as if no hook were configured. The
  `permissions.deny` rules still hold then, for the gate's own files only; for everything
  else instruction is what is left.
- **An alias that already exists is invisible.** The hook refuses every alias
  definition, because that is the last moment the command is legible. If the alias was
  defined in an earlier session or in the user's global config, `git yolo origin main` is
  just a word to the hook.
- **A script is only as visible as its command line.** `bash tools/x.sh`, `node s.mjs`,
  an npm script: the hook sees the call, not the file's contents. A `git push` written
  into a script and then run is not caught — except by name, for scripts called `deploy*`.
- **MCP tools are covered only where their input has a shape it can read.** The matcher
  includes every `mcp__` tool. A `command`-style field is classified like Bash (the
  stricter of the bash and PowerShell readings, since the shell is unknown); a
  `path`-style field (`file_path`, `path`, `pathInProject`, `pathInFile`, `notebook_path`)
  is classified like `Write` when the tool's name says it writes and like `Read` when it
  says it reads. A tool whose name says patch or diff has every file named in its patch
  text (`*** Add/Update/Delete File:`, `*** Move to:`, `---`/`+++`, `diff --git`,
  `rename from/to`) classified like `Write`. IDE tools that run something the hook cannot
  read (`execute_run_configuration`, `execute_tool`, `run_inspection_kts`) are Red. A
  tool that carries risk in some other field, such as a structured edit or a SQL
  statement, is not classified at all.
- **Not every tool is in the matcher.** `Grep` and `Glob` are not: `Grep` over `.env`
  prints matching lines of it, and the hook never sees that call.
- **Windows names the hook does not fold.** An 8.3 short name (`SETTIN~1.JSO`,
  `CLAUDE~1`) reaches the same file as the long name and is not recognized. Neither is a
  symlink or junction that points into `.claude/` or `.git/` from elsewhere: paths are
  compared as strings, never resolved on disk. Inside `.git/`, only `config` and
  `hooks/` are protected from `Write`/`Edit` — not `HEAD` or `refs/`.
- **A heredoc is read as text unless something runs it.** The body of `<<EOF … EOF` or a
  PowerShell here-string is blanked before the rules look, unless the opening line hands
  it to an interpreter (`bash`, `sh`, `node`, `python`, `ssh`, `| iex`, …). A body fed to
  a program the hook does not know as an interpreter is not inspected.
- **Only tool calls.** Nothing here inspects network traffic, a request body, or what an
  agent decides to say. SEC-004, and SEC-002 beyond the shapes in the table, rest on
  instruction alone.

### And it only exists for one harness

The hook is a `PreToolUse` hook wired in `.claude/settings.json` — a Claude Code mechanism.
`AGENTS.md` invites other tools (Copilot, Cursor, Gemini, anything that reads an agent
instruction file) to work in this repo, and **for all of them there is exactly one layer:
this file.** They never see the hook.

So if you are reading this in a tool that does not run `PreToolUse` hooks: nothing
mechanical is watching. Every Red rule here is yours to keep. And if you are writing a
rule, write it to work as instruction alone — the hook is a local reinforcement, never the
guarantee. Recorded as an amendment to
[ADR-0003](../docs/adr/0003-double-enforce-irreversible-actions.md).
