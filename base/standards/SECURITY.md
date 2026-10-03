<!-- base -->
# SECURITY — base standard

The non-negotiable core. **Every rule here is `[hard]` and can never be overridden** —
not by a kit, not by a pack, not by a project override, not by the user. This is the
one place the two-tier override mechanic does not apply. See
[`../../overrides/README.md`](../../overrides/README.md).

Why so absolute: a leaked credential or an exfiltrated user record cannot be un-leaked.
Convenience never outweighs an irreversible breach.

| ID | Rule | Tag | Why (plain language) |
|---|---|---|---|
| SEC-001 | Never commit secrets — API keys, passwords, tokens, connection strings, `.env` files, credential files. Use `.env.example` with placeholder values only. | `[hard]` | A secret in git history is public forever, even after you delete the file. Rotating a leaked key is painful; not leaking it is free. |
| SEC-002 | Never print, log, or send a secret to any external service (including when debugging or asking for help). | `[hard]` | Logs and chat transcripts get stored and indexed. A key pasted "just to debug" is a leaked key. |
| SEC-003 | Never force-push, rewrite published history, or move a branch ref backwards. Fix mistakes with a new commit (forward-only). | `[hard]` | Rewriting shared history destroys other people's work with no recovery. Forward fixes are always reversible. |
| SEC-004 | Never exfiltrate or expose personal / user data. Do not send real user records to third-party services or commit them to the repo. | `[hard]` | Once personal data leaves your control it cannot be recalled. This is both an ethical and a legal line (see PRIVACY). |
| SEC-005 | Treat any irreversible or externally-visible action (publish, deploy, delete data, send, change access) as **Red**: never without explicit, informed human go-ahead. Not delegable to a sub-agent. | `[hard]` | The whole safety model rests on a human owning irreversible decisions. An agent that ships on its own can cause harm no revert can undo. |
| SEC-006 | Never disable, skip, or work around a security gate (secret scan, the Red-action confirmation) to "get unblocked". | `[hard]` | A gate you bypass once is a gate that protects nothing. If a gate is wrong, fix the gate in the open, don't route around it. |

**Enforcement is doubled where a rule is command-recognizable** (defense in depth) — and
only there. A `PreToolUse` hook (`.claude/hooks/guard-red-actions.mjs`) reads a tool call:
a command string, a file path, the directory it runs in. That is all it can judge by. It
sees `Bash`, `PowerShell`, `Write`, `Edit`, `MultiEdit`, `NotebookEdit`, `Read` and every
`mcp__` tool; when it cannot read its input or throws, it denies rather than allows.

- **Doubled:** SEC-001 — a secret path, also by wildcard (`.env*`), in `git add`/`commit`,
  in a `Write`/`Edit` or an MCP patch, or created/copied/deleted from the shell. A secret
  path is `.env*` (never `.env.example`), a key file, or a file *named* like a credential
  store (`secrets.json`, `credentials.yml`, `.aws/credentials`); a file that only mentions
  the word (`articleSecretsSecurity.json`) is not, and neither is text such as a commit
  message or a heredoc body that names one. SEC-003 — force-push,
  `reset --hard`, `rebase`, `--amend`, `update-ref`, `branch -f`, `filter-branch`,
  `checkout -f`, deleting `.git`, through git's global options, abbreviated long options,
  line continuations, shell escapes and `Start-Process`. CI additionally runs a secret scan
  (gitleaks) — over the pushed commits on every push and pull request, and over the whole
  history weekly and on demand.
- **Partly doubled:** SEC-002 — reading a real secret file (`Read`, `cat`, an MCP read
  tool) and handing one to `curl`/`wget`/`Invoke-WebRequest` upload flags are refused;
  a value built or sent any other way is not seen. SEC-005 — `git push`, `npm publish`,
  hosting and deployment CLIs (`vercel`, `netlify`, `firebase`, `wrangler`, `surge`,
  `aws s3 sync`, `scp`, …), mutating `gh` subcommands including
  `gh repo edit --visibility`, `gh repo delete` and `gh release create`, and registry code
  run unasked (`npx --yes`, `pnpm dlx`); a push or deploy written into a script and then
  run is not seen. SEC-006 — writes to the hook, `.claude/settings*.json`, `.git/hooks/`
  and `.git/config` (also inside an MCP patch body), deleting, moving or renaming any of
  them or the `.claude` and `.claude/hooks` folders, any git alias definition, a command
  word built at run time, and MCP tools that run something unreadable (IDE run
  configurations, `execute_tool`) are refused, and `permissions.deny` in
  `.claude/settings.json` refuses `Edit`/`Write` of the same files a second time; every
  other way to route around a gate is invisible to the tool layer.
- **Instruction-only:** SEC-004. Nothing inspects outbound network traffic or what a
  request carries.
- **Known gaps, stated so nobody assumes otherwise:** Windows 8.3 short names
  (`SETTIN~1.JSO`) and symlinks/junctions into `.claude/` or `.git/` are not recognized —
  paths are compared as strings, never resolved on disk. A hook that times out or cannot
  start (`node` missing) lets the call through: Claude Code treats that as "no hook". An
  alias defined before this session is just a word. `Grep` and `Glob` are not in the
  matcher. Tools other than Claude Code never run the hook at all.

So instruction is the load-bearing layer, not the backup one. The hook narrows the blast
radius of the rules it can see, and buys nothing at all for SEC-004. See
[`../SAFETY.md`](../SAFETY.md) → "Why doubled" for the full coverage table.
