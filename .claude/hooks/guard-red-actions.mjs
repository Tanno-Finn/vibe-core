#!/usr/bin/env node
// =============================================================================
// guard-red-actions.mjs — PreToolUse safety hook for the vibecore starter kit
// =============================================================================
//
// SECOND enforcement layer ("doubled") for the Red / hard-forbidden actions
// defined in base/SAFETY.md (Green/Yellow/Red model) and base/standards/SECURITY.md
// (SEC-001..006). The FIRST layer is instruction; this hook is the tool gate.
// If hook and instruction ever disagree, the stricter one wins — so this hook is
// deliberately conservative.
//
// CONTRACT (Claude Code PreToolUse hook — verified against
// https://code.claude.com/docs/en/hooks):
//   * Input : a single JSON object on STDIN. Relevant fields:
//               tool_name   -> "Bash" | "PowerShell" | "Write" | "Edit" | ...
//               tool_input  -> { command } for Bash/PowerShell,
//                              { file_path } for Write/Edit
//               cwd         -> where relative paths resolve (fallback:
//                              CLAUDE_PROJECT_DIR, then process.cwd())
//   * FAIL  : input that is not a JSON object, or any internal error, is a
//             DENY with a reason — never a silent allow (see main()).
//   * BLOCK : exit 0 and print to STDOUT:
//               { "hookSpecificOutput": {
//                    "hookEventName": "PreToolUse",
//                    "permissionDecision": "deny",
//                    "permissionDecisionReason": "<why>" } }
//   * ALLOW : print nothing, exit 0 -> the tool proceeds through the normal
//             permission flow (we do NOT emit "allow", so we never override the
//             user's own prompts for otherwise-normal actions).
//
// Dependency-free: Node core only, runs with no install.
//
// -----------------------------------------------------------------------------
// POLICY TABLE — the MECHANICALLY-CHECKABLE SUBSET of base/SAFETY.md.
// -----------------------------------------------------------------------------
// This hook enforces the parts of the hard-forbidden / Red tiers that can be
// recognised from a command string. It does NOT (and cannot) cover instruction-
// only rules like SEC-004 (exfiltrate personal data) or SEC-006 (disable a gate);
// those live in the instruction layer.
//
// A command is NORMALISED before any rule looks at it (see "Command normalisation"
// below), because the same act has many spellings: git's own global options
// (`-c k=v`, `-C dir`), quotes inside a word, a binary's full path, a variable
// holding the verb, a payload handed to `sh -c`, invisible Unicode. One folding pass
// closes those families at once, so the rules only know the plain spelling. Data is
// deliberately NOT unfolded: a commit message and a search pattern keep their quotes,
// so writing about a rule never trips it.
//
//  TIER            | EXAMPLES                                        | DECISION
//  ----------------|------------------------------------------------|---------
//  HARD-FORBIDDEN  | git push --force / -f / --force-with-lease /    | deny
//  (never, even    |   --mirror / +refspec / --delete / :refspec;    |
//   with approval; |   git reset --hard/--merge/--keep; git rebase;  |
//   SEC-003/001/   |   git commit --amend; git update-ref;           |
//   002)           |   git symbolic-ref <name> <ref>; git branch -f; |
//                  |   git filter-branch; git clean -fdx;            |
//                  |   git checkout/restore . (whole tree);          |
//                  |   git reflog expire / gc --prune=now;           |
//                  |   write/edit/commit/copy of a real secret file  |
//                  |   (.env, *.pem, *.key, id_rsa, .deploy-         |
//                  |    credentials, a credential store by name:     |
//                  |    secrets.json, credentials.yml, .aws/         |
//                  |    credentials — not articleSecrets*.json);     |
//                  |   recursive delete of / ~ . * — rm, Remove-Item,|
//                  |   rd /s /q, del;                                |
//                  |   find … -delete / -exec rm; … | xargs rm       |
//  ----------------|------------------------------------------------|---------
//  RED             | git push (non-force); git add -A / .            | deny +
//  (needs the      |   (stage-all, tree unverifiable); deploy;       | "human
//   human or a     |   npm/yarn/pnpm publish; kill/pkill node|claude | performs
//   confirmation;  |   (may kill sibling sessions); writing to a     |  this /
//   SEC-005/006)   |   .claude hook, .claude/settings*.json or a     |  confirm"
//                  |   .git/hook (gate off / runs on every commit);  |
//                  |   moving/renaming .claude, .claude/hooks or a   |
//                  |   settings file (the hook then fails to start); |
//                  |   an MCP patch touching any of those; MCP run   |
//                  |   configurations / execute_tool (unreadable);   |
//                  |   git branch -D; stash drop/clear; worktree     |
//                  |   remove --force; --no-verify / core.hooksPath; |
//                  |   git remote set-url; git config --global;      |
//                  |   reading a real secret file into the log;      |
//                  |   curl|bash, npx --yes, node -e that deletes,   |
//                  |   a command word from a variable/substitution;  |
//                  |   rsync --delete;                               |
//                  |   rm / write / edit OUTSIDE the project dir     |
//                  |   (~/…, ../…, absolute foreign path) — no       |
//                  |   checkpoint can reach there                    |
//  ----------------|------------------------------------------------|---------
//  ALLOW           | git checkout -b / switch -c / branch / branch   | (silent,
//  (must NOT       |   -d / commit / add <path> / checkout <file> /  |  defer)
//   false-block)   |   revert / status / diff / log / reflog /       |
//                  |   stash / stash pop / reset --soft / gc;        |
//                  |   single-file rm; rm under the OS temp dir or   |
//                  |   the repo's own tmp/; .env.example;           |
//                  |   npm run build/test/install; npx <local bin>;  |
//                  |   grepping or writing ABOUT a forbidden command;|
//                  |   normal source/doc writes                      |
//
// Ambiguity rule (from the task): where the block/allow line is genuinely
// unclear, prefer a Red block-with-explanation over a silent hard block, and
// NEVER false-block anything on the ALLOW list.
// =============================================================================

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Tier tags — the test runner keys off these substrings to distinguish tiers.
const TAG_HARD = 'BLOCKED (hard-forbidden):';
const TAG_RED  = 'BLOCKED (Red — a human performs this):';
// The guard could not evaluate the call at all (unreadable input, an internal error).
// A gate that cannot see is closed, not open.
const TAG_FAIL = 'BLOCKED (fail-closed — the guard could not evaluate this call):';

// ---------------------------------------------------------------------------
// Secret-file detection (shared by Write/Edit and by git add/commit inspection)
// ---------------------------------------------------------------------------
function basename(p) {
  // Trailing whitespace matters on Windows: `.env ` is written as `.env`, so a
  // trailing space must not smuggle a secret path past isSecretPath.
  const norm = String(p).replace(/\\/g, '/').replace(/[\s/]+$/, '');
  const idx = norm.lastIndexOf('/');
  return idx === -1 ? norm : norm.slice(idx + 1);
}

// Strip git's GLOBAL options (`-c k=v`, `-C dir`, `--git-dir=…`, `-p`, …) that sit
// between `git` and the subcommand, so `git -c core.pager=cat push --force` (an
// ordinary idiom) can't hide the verb from every rule below. Loop until stable to
// peel off several stacked globals (`git -c a=b -C dir push`).
function normalizeGit(cmd) {
  // Windows resolves executables case-insensitively, so `Git push` / `GIT push`
  // runs git — canonicalise the binary name first. (Subcommands stay untouched:
  // git itself rejects `git PUSH`, so only the binary name needs this.)
  let out = String(cmd || '').replace(/(^|[\s;&|()])[Gg][Ii][Tt](?=\s)/g, '$1git');
  // A global option's value may be (partially) quoted and contain spaces
  // (`git -c user.name="a b" push`, `git -C "my dir" push`) — match a sequence
  // of quoted-or-bare segments, not just \S+.
  const V = `(?:"[^"]*"|'[^']*'|[^\\s"'])+`;
  const GLOBAL = new RegExp(
    `\\bgit\\s+(?:-c\\s*${V}|-C\\s+${V}|--git-dir(?:=${V}|\\s+${V})|--work-tree(?:=${V}|\\s+${V})|--namespace(?:=${V}|\\s+${V})|--exec-path(?:=${V})?|--config-env(?:=${V}|\\s+${V})|--attr-source(?:=${V}|\\s+${V})|-p|--paginate|-P|--no-pager|--bare|--no-replace-objects|--literal-pathspecs|--glob-pathspecs|--noglob-pathspecs|--icase-pathspecs|--no-optional-locks|--no-lazy-fetch|--no-advice)\\s+`,
    'g',
  );
  let prev;
  do { prev = out; out = out.replace(GLOBAL, 'git '); } while (out !== prev);
  return out;
}

// What git does with an option it does not know is its own business; what matters here
// is that no UNKNOWN option between `git` and the subcommand can hide the verb. After
// the known globals are gone, any option still sitting directly after `git` is peeled
// off too (`git --future-flag push --force` -> `git push --force`). An unknown option
// that might take a value (`git --future-flag val push`) is caught separately — see
// UNKNOWN_GLOBAL in classifyBash.
function stripUnknownGitGlobals(cmd) {
  let out = String(cmd || ''), prev;
  do {
    prev = out;
    out = out.replace(/\bgit\s+-{1,2}[A-Za-z][\w-]*(?:=(?:"[^"]*"|'[^']*'|\S)*)?\s+/g, 'git ');
  } while (out !== prev);
  return out;
}

// Subcommands that carry a hard-forbidden or Red form. An unknown global in front of one
// of these is suspicious in itself.
const PROTECTED_GIT_SUB = '(?:push|send-pack|receive-pack|reset|rebase|commit|update-ref|symbolic-ref|filter-branch|filter-repo|clean|checkout|restore|switch|reflog|gc|prune|config|remote|branch|stash|worktree|subtree|pull|rm|tag)';
const UNKNOWN_GLOBAL = new RegExp(`\\bgit\\s+-{1,2}[A-Za-z][\\w-]*(?:=\\S*)?\\s+(?:[^\\s;&|-]\\S*\\s+)?${PROTECTED_GIT_SUB}\\b`);

// git accepts any UNAMBIGUOUS PREFIX of a long option: `git reset --har HEAD~5` is
// `--hard`, and `git push --mir` is `--mirror`. A rule that only knows the full
// spelling is one keystroke away from being walked past, so long options are matched
// as "this prefix, or any longer one". `min` is the shortest prefix git itself can
// still resolve unambiguously for that command (`--m` is ambiguous for reset —
// --mixed vs --merge — so merge starts at 3).
function opt(word, min) {
  let tail = '';
  for (let i = word.length; i > min; i--) tail = `(?:${word[i - 1]}${tail})?`;
  return `--${word.slice(0, min)}${tail}`;
}

// A file NAMED like a credential store: `secrets.json`, `credentials`, `.aws/credentials`,
// `client_secret.json`, `prod.secrets.env`, `.secrets`. The word has to BE the name (after
// an optional `prefix.`/`prefix-`/`prefix_`), followed by nothing or one config-file
// extension. A name that merely CONTAINS the word is ordinary content —
// `articleSecretsSecurity.json`, `art-secrets-security.component.ts`,
// `gitguardian-secrets-sprawl-2026.json`, `docs/credentials-howto.md` — and matching
// "secret anywhere in the name" hard-blocked 16 legitimate files of this very repo.
const SECRET_STORE_NAME = /^(?:.*[._-])?(?:secrets?|credentials?)(?:\.(?:json|ya?ml|toml|ini|txt|env|properties|xml|conf|cfg))?$/i;

// `strict` narrows the check to files that unambiguously CONTAIN credentials, and
// drops the by-name heuristic (SECRET_STORE_NAME). Writing a file named like a
// credential store is still refused; merely READING it is not.
function isSecretPath(p, strict = false) {
  if (!p) return false;
  const base = basename(p);
  if (!base) return false;
  // Templates are always safe — the whole point of *.example is a committable stub.
  if (/\.example$/i.test(base)) return false;

  // .env and any real variant (.env.local, .env.production) — but .env.example
  // was already excluded above.
  if (/^\.env(\..+)?$/i.test(base)) return true;
  // Private key material.
  if (/\.pem$/i.test(base)) return true;
  if (/\.key$/i.test(base)) return true;
  // id_rsa (private) but not id_rsa.pub (public).
  if (/^id_rsa/i.test(base) && !/\.pub$/i.test(base)) return true;
  // Named credential files.
  if (base === '.deploy-credentials') return true;
  // Named like a credential store (see SECRET_STORE_NAME) — not merely mentioning one.
  if (strict) return false;
  return SECRET_STORE_NAME.test(base);
}

// A WILDCARD can name a secret without spelling it: `git add .env*`, `cat .e?v`,
// `cp *.pem x`. The wildcard's last segment is tried against representative secret
// names; a pure wildcard (`*`, `src/*`) says nothing about secrets and is left alone,
// so is one that can only match a template (`.env.ex*` reaching `.env.example`).
const SECRET_SAMPLES = ['.env', '.env.local', '.env.production', '.env.development', 'server.pem',
  'private.key', 'id_rsa', '.deploy-credentials', 'app-secret.json', 'credentials.json'];
function mayBeSecret(p, strict = false) {
  const base = basename(p);
  if (!/[*?[]/.test(base)) return isSecretPath(p, strict);
  if (!/[A-Za-z0-9]/.test(base)) return false;
  let re;
  try { re = globSegmentRegex(base, true); } catch { return false; }
  // The by-NAME samples only count when the wildcard itself spells the word — `*.json`
  // is every JSON file, not a reference to `credentials.json`.
  const byName = /secret|credential/i.test(base);
  return SECRET_SAMPLES.some((s) => re.test(s) && isSecretPath(s, strict) &&
    (byName || isSecretPath(s, true)));
}

// ---------------------------------------------------------------------------
// Repo boundary — the project directory is the agent's reach
// ---------------------------------------------------------------------------
// Everything the Yellow tier promises ("checkpoint first, there's a way back") is
// git's promise, and git stops at the project directory. A file deleted or
// overwritten outside it has no checkpoint, no history, and probably belongs to
// something the user never put in the agent's remit — another project, another
// worker's tree, their Documents folder. So: outside the project = Red.
//
// Not hard-forbidden: writing to a sibling repo is a legitimate thing to ask for,
// it just has to be asked for.

// The directory relative paths are resolved against: the `cwd` Claude Code sends with
// every hook input (the shell's CURRENT directory, which may be a subfolder or an
// agent worktree), then CLAUDE_PROJECT_DIR, then this process's own cwd for a bare
// `node hook.mjs` invocation. Set per evaluation by evaluate().
let CALL_CWD = null;
function baseDir() {
  return CALL_CWD || process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

// The project root is the nearest ancestor of the base dir that has a `.git` entry —
// a directory in a normal checkout, a FILE in a git worktree. So an agent working in
// `<repo>/.claude/worktrees/<name>/` has that worktree as its project. No `.git`
// anywhere above: the base dir itself is the best answer there is.
const rootCache = new Map();
function findGitRoot(start) {
  const from = path.resolve(start);
  if (rootCache.has(from)) return rootCache.get(from);
  let dir = from, found = from;
  for (let i = 0; i < 64; i++) {
    let hit = false;
    try { hit = fs.existsSync(path.join(dir, '.git')); } catch { hit = false; }
    if (hit) { found = dir; break; }
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  rootCache.set(from, found);
  return found;
}

// Memoised per evaluation (evaluate() resets it): a long command asks for the root once
// per delete target, and resolving it again each time was most of the cost.
let ROOT_MEMO = null;
function projectRoot() {
  const base = baseDir();
  if (ROOT_MEMO && ROOT_MEMO.base === base) return ROOT_MEMO.root;
  const root = findGitRoot(base);
  ROOT_MEMO = { base, root, canon: canonical(root) };
  return root;
}
function projectRootCanon() {
  projectRoot();
  return ROOT_MEMO.canon;
}

// Windows compares paths case-insensitively and accepts both separators.
function canonical(p) {
  let s = path.resolve(p).replace(/\\/g, '/').replace(/\/+$/, '');
  if (process.platform === 'win32') s = s.toLowerCase();
  return s;
}

// ---------------------------------------------------------------------------
// Path normalisation — what the filesystem will actually open
// ---------------------------------------------------------------------------
// Windows forgives a lot that a string comparison does not: `settings.json.` and
// `settings.json ` open `settings.json`; `settings.json::$DATA` is the file's main
// stream; `\\?\C:\…` is `C:\…`; `a\..\b` is `b`. A protected-path check that compares
// the raw string walks straight past every one of those, so each segment is cleaned
// the way Windows cleans it before anything is compared. (On POSIX these are distinct
// names; folding them there too only ever makes the check stricter.)
function cleanSegments(p) {
  let s = String(p || '').trim().replace(/^["']|["']$/g, '').replace(/\\/g, '/');
  s = s.replace(/^\/\/[?.]\//, '');                        // \\?\C:\… and \\.\C:\…
  const lead = s.startsWith('/') ? '/' : '';
  const segs = s.split('/').filter((x, i) => x !== '' || i === 0);
  const out = [];
  segs.forEach((seg, i) => {
    if (seg === '' && i === 0) return;
    let t = seg;
    if (!(i === 0 && /^[A-Za-z]:$/.test(t))) {
      const colon = t.indexOf(':');
      if (colon !== -1) t = t.slice(0, colon);                  // NTFS stream suffix
      if (t !== '.' && t !== '..') t = t.replace(/[. ]+$/, '');  // trailing dots/spaces
    }
    if (t !== '') out.push(t);
  });
  return lead + out.join('/');
}

// Cleaned AND resolved: an absolute, forward-slash path with every `..` applied.
function resolvePath(p, base = baseDir()) {
  const cleaned = cleanSegments(expandHome(p));
  if (process.platform !== 'win32' && /^[A-Za-z]:\//.test(cleaned)) return cleaned;
  return path.resolve(base, cleaned).replace(/\\/g, '/');
}

// `~`, `$HOME`, `%USERPROFILE%` are the ordinary ways to leave the project without
// typing an absolute path — resolve them before the comparison, or they slip past.
function expandHome(p) {
  let s = String(p)
    .replace(/^~(?=$|[/\\])/, os.homedir())
    .replace(/^\$\{?HOME\}?(?=$|[/\\])/, os.homedir())
    .replace(/^%USERPROFILE%(?=$|[/\\])/i, os.homedir());
  // Git Bash on Windows (MSYS) spells `C:\x` as `/c/x`, and mounts the user's temp dir —
  // the same folder as os.tmpdir() (`mount` shows `…/AppData/Local/Temp on /tmp`,
  // "usertemp") — at `/tmp`. Node would read both as folders on the current drive
  // (`C:\c\x`, `C:\tmp`), so a bash command's paths are translated first. Only for the
  // Bash tool: in PowerShell and for Write/Edit, `/tmp` really is `C:\tmp`.
  if (process.platform === 'win32' && CALL_SHELL === 'bash') {
    s = s.replace(/^\/tmp(?=$|[/\\])/i, () => os.tmpdir().replace(/\\/g, '/'))
         .replace(/^\/([A-Za-z])(?:$|[/\\])/, (_m, d) => `${d.toUpperCase()}:/`);
  }
  return s;
}

// The system scratch area is exempt: it is disposable by definition, it holds nothing
// of the user's, and the policy table above lists "temp/scratch rm" as ALLOW. Blocking
// it would cry wolf on routine agent housekeeping. Exactly two places count, both as a
// path PREFIX, never as a segment found anywhere:
//   * the OS temp dir (os.tmpdir(); on POSIX also `/tmp`), strictly BELOW it — deleting
//     the temp dir itself is not housekeeping;
//   * this repository's own `tmp/` (the project root's, and the main checkout's when the
//     project is an agent worktree).
// Any other `tmp`/`temp` folder is somebody's: `C:/temp/important`, or
// `../other-project/tmp`. Those used to be exempt because of their NAME.
let TMP_CANON = null;
function isScratch(canonPath) {
  TMP_CANON ??= [canonical(os.tmpdir()), ...(process.platform === 'win32' ? [] : ['/tmp'])];
  const roots = [...TMP_CANON, ...repoRoots().map((r) => `${r}/tmp`)];
  return roots.some((r) => canonPath.startsWith(r + '/') ||
    (canonPath === r && !TMP_CANON.includes(r)));
}

// Which shell the command being classified runs in ('bash', 'powershell', 'unknown'),
// or null for a non-shell tool. Set per evaluation by classifyBash().
let CALL_SHELL = null;

// Does this path land outside the project directory?
function isOutsideProject(rawPath) {
  const raw = String(rawPath || '').trim().replace(/^["']/, '').replace(/["']$/, '');
  if (!raw) return false;
  let root, target;
  try {
    root = projectRootCanon();
    const expanded = expandHome(raw);
    if (process.platform !== 'win32' && /^[A-Za-z]:[\\/]/.test(expanded)) {
      // A Windows-style absolute path on a POSIX runner: path.resolve would glue it
      // under the project root and call it "inside". It is an absolute path on another
      // machine layout — outside is the honest answer, and it keeps CI (Linux) and a
      // developer's box (Windows) agreeing on the same test cases.
      target = expanded.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
      return !isScratch(target);
    }
    // A posix-absolute path on Windows (`/etc/passwd`) resolves onto the current
    // drive — still outside the project, which is the answer we need. Relative paths
    // resolve against the call's cwd, not the root: `../x` from a subfolder is inside.
    target = canonical(resolvePath(raw));
  } catch {
    return false; // Unparseable path: defer rather than false-block.
  }
  if (target === root) return false;               // the root itself: covered by the rm rules above
  if (target.startsWith(root + '/')) return false; // inside
  return !isScratch(target);
}

// ---------------------------------------------------------------------------
// Command normalisation — one pass that closes whole families of disguises
// ---------------------------------------------------------------------------
// Every rule below matches on a command STRING, and a shell offers a dozen ways to
// spell the same call: `"rm"`, `r''m`, `\rm`, `/bin/rm`, `X=rm; $X -rf`,
// `sh -c 'rm …'`, a zero-width space wedged into `git push`. Growing one regex per
// disguise is a losing game, so the command is folded to a canonical form FIRST and
// the rules only have to know the plain spelling.

const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF\u00AD]/g;
const UNICODE_SPACE = /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;

// Binaries the rules below look for by name. Only these get their directory, their
// `.exe` suffix and the alias-defeating leading backslash peeled off, so a stray
// `docs/git.md` in an unrelated command is not rewritten into something else.
const BIN_NAMES = 'rm|git|node|npm|npx|find|xargs|chmod|chown|truncate|tee|sed|mv|cp|kill|pkill|killall|taskkill|rsync|shred|curl|wget|unlink';

// Zero-width joiners, bidi overrides and non-breaking spaces render as nothing (or
// as a space) but break every \s and \b in the rules. They have no business in a
// command line, so they are removed before anything else looks at it.
function stripInvisible(s) {
  return String(s || '').replace(INVISIBLE, '').replace(UNICODE_SPACE, ' ')
    // A line continuation is one command on two lines: `git \⏎ push`, PowerShell's
    // `git `⏎ push`, cmd's `git ^⏎ push`. Joined first, or `git` and `push` never meet.
    .replace(/[\\`^]\r?\n/g, ' ');
}

// Escapes INSIDE a word only ever spell the same word. cmd drops a caret (`g^it`), and
// PowerShell drops a backtick in front of an ordinary character (`g`it`). The caret is
// folded for every shell (in bash `g^it` is simply not a command, so folding costs
// nothing); the backtick only in the PowerShell reading — in bash it is a substitution.
function foldCaretEscapes(s) {
  return String(s || '').replace(/(?<=[\w.-])\^(?=[\w.-])/g, '');
}
function foldPowerShellBackticks(s) {
  return String(s || '').replace(/`(?=[\w.-])/g, '');
}

// `& ('gi'+'t') push` and `& ("gi" + "t")` build the command word from string literals.
// Literal-only concatenation is folded back into the word it spells; anything that is
// not literal-only stays opaque and is caught as a computed command word later.
function foldStringConcat(s) {
  return String(s || '').replace(
    /\(\s*((?:'[^']*'|"[^"$`]*")(?:\s*\+\s*(?:'[^']*'|"[^"$`]*"))+)\s*\)/g,
    (_m, inner) => inner.split(/\s*\+\s*/).map((p) => p.slice(1, -1)).join(''),
  );
}

// `Start-Process git -ArgumentList 'push','--force'` runs `git push --force`. The
// program and its argument list are spliced back into one plain command line.
const SP_PARAM = /^-(?:nonewwindow|wait|passthru|workingdirectory|wd|verb|windowstyle|redirectstandard\w*|credential|loaduserprofile|lup|usenewenvironment|environment)$/i;
function unwrapStartProcess(s) {
  const split = splitQuoteAware(s);
  if (!split) return String(s || '');
  return split.map(({ text, sep }) => {
    const m = text.match(/^(\s*)(?:start-process|saps|start)\s+(.*)$/is);
    if (!m) return text + sep;
    const words = shellWords(m[2]);
    let prog = null;
    const args = [];
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (/^-(?:filepath|fp)$/i.test(w)) { prog = words[++i] ?? prog; continue; }
      const al = w.match(/^-(?:argumentlist|args|al)(?::(.*))?$/i);
      if (al) {
        if (al[1]) args.push(al[1]);
        while (i + 1 < words.length && !SP_PARAM.test(words[i + 1]) && !/^-(?:filepath|fp)$/i.test(words[i + 1])) args.push(words[++i]);
        continue;
      }
      if (SP_PARAM.test(w)) { if (/^-(?:verb|windowstyle|workingdirectory|wd|redirectstandard\w*|credential|environment)$/i.test(w)) i++; continue; }
      if (prog === null) { prog = w; continue; }
      args.push(w);
    }
    if (!prog) return text + sep;
    const flat = args.flatMap((a) => a.split(',')).map((a) => a.trim()).filter(Boolean);
    return `${m[1]} ${prog} ${flat.join(' ')} ${sep}`;
  }).join('');
}

// Quotes wrapping a run WITHOUT whitespace (`"rm"`, `r''m`, `--fo""rce`, `"."`) are
// pure obfuscation — the shell drops them and the word means what it always meant.
// Quotes around a phrase are left intact: their content is data (a commit message, a
// grep pattern), and unquoting it would turn documentation into a forbidden verb.
// …with one exception. A quoted run that CARRIES a shell metacharacter (`'a|b'`,
// `'\$x'`) is being quoted precisely so the shell does NOT act on it. Unquoting it
// invents a pipe or a variable that never existed — the phantom-segment false
// positive again, one layer down. Those runs keep their quotes.
const SHELL_META = /[|;&$`()<>]/;

function stripWordQuotes(s) {
  let out = String(s || ''), prev;
  do {
    prev = out;
    out = out.replace(/"([^"\s]*)"/g, (m, w) => (SHELL_META.test(w) ? m : w))
             .replace(/'([^'\s]*)'/g, (m, w) => (SHELL_META.test(w) ? m : w));
  } while (out !== prev);
  return out;
}

// `/bin/rm`, `/usr/bin/git`, `./node_modules/.bin/npm`, `git.exe`, `\rm` (the leading
// backslash that defeats a shell alias) all invoke the plain binary.
function stripBinaryPaths(s) {
  return String(s || '')
    .replace(new RegExp(`(^|[\\s;&|(])\\\\?(?:[A-Za-z]:)?[^\\s;&|()]*[/\\\\](${BIN_NAMES})(?:\\.exe)?\\b`, 'g'), '$1$2')
    .replace(new RegExp(`(^|[\\s;&|(])(${BIN_NAMES})\\.exe\\b`, 'gi'), '$1$2')
    .replace(new RegExp(`(^|[\\s;&|(])\\\\(${BIN_NAMES})\\b`, 'g'), '$1$2');
}

// `sh -c '<payload>'`, `bash -lc "<payload>"`, `cmd /c "<payload>"`,
// `powershell -Command "<payload>"` and PowerShell's base64 `-EncodedCommand` all run
// the payload as a command. Splice it back into the line (bounded recursion) so the
// rules see the real verb rather than an opaque string argument.
function unwrapShellPayloads(s) {
  const RE = /\b(?:sh|bash|zsh|dash|ksh|cmd|powershell|pwsh)(?:\s+-[A-Za-z][\w-]*)*\s+(?:-[A-Za-z]*[cC][A-Za-z]*|--command|\/[cCkK])\s+(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  const ENC = /\b(?:powershell|pwsh)(?:\s+-[A-Za-z][\w-]*)*\s+-[Ee]ncoded[Cc]ommand\s+(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  // cmd's `/c` and PowerShell's `-Command` take the REST of the line as the command when
  // it is not quoted (`cmd /c git push --force`), unlike `sh -c word`, whose later words
  // are only $0/$1. Those payloads run to the end of the segment.
  const REST = /\b(?:cmd|powershell|pwsh)(?:\.exe)?(?:\s+-[A-Za-z][\w-]*)*\s+(?:\/[cCkK]|-[Cc](?:ommand)?)\s+([^\s"'][^\n;&|]*)/g;
  let out = String(s || '').replace(REST, (_m, rest) => ` ; ${rest} ; `), prev, depth = 0;
  do {
    prev = out;
    out = out.replace(ENC, (_m, a, b, c) => {
      const encoded = a ?? b ?? c ?? '';
      try { return ` ; ${Buffer.from(encoded, 'base64').toString('utf16le')} ; `; }
      catch { return ` ; ${encoded} ; `; }
    });
    out = out.replace(RE, (_m, a, b, c) => ` ; ${a ?? b ?? c ?? ''} ; `);
  } while (out !== prev && ++depth < 4);
  return out;
}

// `X=rm; $X -rf /` and `F=--force; git push $F` hide the dangerous token in a
// variable. Assignments made in the same command line are resolved back into their
// uses — a substitution the shell would make anyway.
function inlineAssignments(s) {
  const src = String(s || '');
  const vars = new Map();
  const RE = /(?:^|[\s;&|(])([A-Za-z_]\w*)=(?:"([^"]*)"|'([^']*)'|([^\s;&|]*))/g;
  let m;
  while ((m = RE.exec(src)) !== null) {
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    if (!/\s/.test(value)) vars.set(m[1], value);
  }
  if (vars.size === 0) return src;
  let out = src;
  for (const [name, value] of vars) {
    out = out.split(`\${${name}}`).join(value);
    // Function replacement: a `$`-pattern inside the VALUE must stay literal.
    out = out.replace(new RegExp(`\\$${name}\\b`, 'g'), () => value);
  }
  return out;
}

// A search pattern is data. `grep -r "git push --force" docs/` is somebody reading
// the documentation about the rule, not breaking it — so quoted arguments to the
// search tools are dropped before any verb is looked for.
function neutraliseSearchPatterns(s) {
  return String(s || '')
    .split(/(&&|\|\||[;|\n])/)
    .map((part) =>
      /^\s*(?:sudo\s+|command\s+|env\s+)*(?:grep|egrep|fgrep|rg|ack|ag)\b/.test(part)
        ? part.replace(/"[^"]*"/g, ' ').replace(/'[^']*'/g, ' ')
        : part,
    )
    .join('');
}

// Tools whose arguments are a PATTERN, never a verb. `grep -n '=>' f`, `awk '/=>/' f`,
// `rg 'a|b' f` all carry shell metacharacters as data — and `=>` inside a pattern was
// reading as a `>` redirection, so merely SEARCHING the safety hook was refused.
// Their quoted arguments are dropped on the RAW command, before normalisation unquotes
// short runs like '=>' and makes them indistinguishable from a real redirect.
//
// Note what is deliberately NOT here: `cat`, `head`, `ls`. Their arguments are paths,
// so blanking them would hide `cat x > .claude/settings.json` — a real write behind a
// read-only-looking verb. Only PATTERN-bearing tools qualify, and `sed -i` is excluded
// because it edits in place.
const PATTERN_TOOL =
  /^\s*(?:sudo\s+|command\s+|env\s+|time\s+|npx\s+)*(?:grep|egrep|fgrep|rg|ripgrep|ack|ag|awk|nawk|gawk|mawk|sed|findstr|select-string|sls|git\s+(?:grep|log|shortlog))\b/i;

// Verbs that only PRINT their arguments. A quoted PHRASE they are given is text
// (`echo "git push is Red"`), never a command. Only phrases — a quoted run without
// whitespace may still be a path (`echo x > ".claude/settings.json"`) and stays visible.
const PRINT_TOOL = /^\s*(?:echo|printf|write-host|write-output|write-verbose|write-warning|write-information|write-error)\b/i;
const QUOTED_PHRASE = /"[^"]*\s[^"]*"|'[^']*\s[^']*'/g;
// A sed script (`'s/a b/c/'`, `"y/ab/cd/"`) is text as well, even under `-i`: only the
// FILE it edits matters, and that stays visible.
const SED_SCRIPT = /(["'])(?:[sy](.)(?:(?!\1).)*?\2(?:(?!\1).)*?\2[gimpIeM0-9]*|[^"']*\s[^"']*)\1/g;
// PowerShell's `-replace 'from','to'` / `.Replace("from", "to")`: both sides are text.
const PS_REPLACE = /(-[ci]?replace\s+|\.replace\(\s*)("[^"]*"|'[^']*')(\s*,\s*("[^"]*"|'[^']*'))?/gi;

// Leading verbs that only ever READ. Used to decide whether a segment can possibly be
// a deploy/publish invocation — `grep netlify docs/` must not read as a deployment.
const READ_ONLY_TOOL =
  /^\s*(?:sudo\s+|command\s+|env\s+|time\s+)*(?:grep|egrep|fgrep|rg|ripgrep|ack|ag|awk|nawk|gawk|mawk|findstr|select-string|sls|cat|bat|head|tail|wc|ls|dir|less|more|type|get-content|echo|printf|which|where)\b/i;

function neutralisePatternArgs(cmd) {
  const split = splitQuoteAware(cmd);
  if (!split) return String(cmd || '');
  return split
    .map(({ text, sep }, idx) => {
      // …unless the printed text is piped straight into something that RUNS it.
      const feedsInterpreter = sep === '|' && split[idx + 1] &&
        /^\s*(?:sudo\s+)?(?:sh|bash|zsh|dash|ksh|cmd|powershell|pwsh|iex|invoke-expression|node|python[23]?|perl|ruby|xargs)\b/i.test(split[idx + 1].text);
      if (feedsInterpreter) return text + sep;
      const inPlaceSed = /^\s*sed\b/i.test(text) && /(?:^|\s)-\w*i/.test(text);
      let neutral = PATTERN_TOOL.test(text) && !inPlaceSed
        ? text.replace(/"[^"]*"/g, ' ').replace(/'[^']*'/g, ' ')
        : text;
      if (inPlaceSed) neutral = neutral.replace(SED_SCRIPT, ' ');
      if (PRINT_TOOL.test(neutral)) neutral = neutral.replace(QUOTED_PHRASE, ' ');
      neutral = neutral.replace(PS_REPLACE, (_m, op) => `${op} `);
      return neutral + sep;
    })
    .join('');
}

// A commit message is data too (`git commit -m "explain why not to force push"`).
function scrubMessages(cmd) {
  return String(cmd || '').replace(/(?:-m|--message)(?:=|\s+)(?:"[^"]*"|'[^']*'|\S+)/g, ' ');
}

// Fold a command into one spelling — everything except git's own global options.
// `psBackticks`: also fold PowerShell's in-word backtick escapes (see classifyBash).
function normalizeShell(cmd, psBackticks = false) {
  let out = foldCaretEscapes(stripInvisible(cmd));
  if (psBackticks) out = foldPowerShellBackticks(out);
  out = unwrapShellPayloads(out);
  out = foldStringConcat(out);
  out = unwrapStartProcess(out);
  out = stripWordQuotes(out);
  out = inlineAssignments(out);
  return stripBinaryPaths(out);
}

// The single entry point: the canonical form the rules below are written against.
function normalizeCommand(cmd, psBackticks = false) {
  return stripUnknownGitGlobals(normalizeGit(normalizeShell(cmd, psBackticks)));
}

// ---------------------------------------------------------------------------
// Delete verbs — POSIX and Windows spell the same act differently
// ---------------------------------------------------------------------------
// `ri` is PowerShell's own alias for Remove-Item, next to rm/rd/rmdir/del/erase.
const DELETE_VERB = /^(?:\w+=\S+\s+|sudo\s+|command\s+|env\s+|time\s+|nohup\s+|xargs\s+(?:-\S+\s+)*)*(?:rm|unlink|shred|remove-item|ri|rmdir|rd|del|erase)(?=$|[\s;&|()])/i;
const DELETE_WORD = /(^|[\s;&|(])(?:rm|unlink|shred|remove-item|ri|rmdir|rd|del|erase)\b/i;
// cmd.exe's own verbs take `/s /q` switches; for them a short `/x` token is a flag.
const CMD_DELETE_VERB = /(?:^|\s)(?:rmdir|rd|del|erase)$/i;

// cmd.exe switches (`/s`, `/q`, `/f`) look like absolute paths; they are flags.
function isFlagToken(t) {
  return t.startsWith('-') || /^\/[A-Za-z]{1,3}$/.test(t);
}

// Split a command line into the parts a shell would run separately, so
// `rm build/x && cd /etc` does not attribute `/etc` to the rm.
//
// QUOTE-AWARE. A `|`, `;` or `&` INSIDE a quoted string is data — a grep
// alternation (`grep -nE '^(a|$b)' f`), an echoed pipe character — not a separator.
// Splitting on it invented a phantom segment whose first word looked like a variable,
// which made the guard refuse ordinary read-only commands. base/SAFETY.md calls that
// out as a design failure in its own right: a gate that cries wolf gets ignored.
// If the quotes do not balance we cannot trust the scan, so we fall back to the naive
// split — which OVER-splits, i.e. errs toward more rules firing, never fewer.
//   -> [{ text, sep }, …] or null when the quoting is unbalanced.
// Many rules split the same (normalised) command line; the result is read-only, so the
// last few splits are remembered.
const SPLIT_MEMO = new Map();
function splitQuoteAware(cmd) {
  const key = String(cmd || '');
  if (SPLIT_MEMO.has(key)) return SPLIT_MEMO.get(key);
  const result = splitQuoteAwareUncached(key);
  if (SPLIT_MEMO.size >= 8) SPLIT_MEMO.delete(SPLIT_MEMO.keys().next().value);
  SPLIT_MEMO.set(key, result);
  return result;
}

function splitQuoteAwareUncached(cmd) {
  const s = String(cmd || '');
  const parts = [];
  let buf = '', quote = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quote) {
      if (ch === quote) quote = null;
      buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === '&' || ch === '|' || ch === ';' || ch === '\n') {
      let sep = ch;
      if ((ch === '&' || ch === '|') && s[i + 1] === ch) { sep += ch; i++; }
      parts.push({ text: buf, sep });
      buf = '';
      continue;
    }
    buf += ch;
  }
  parts.push({ text: buf, sep: '' });
  return quote === null ? parts : null;
}

function segments(cmd) {
  const split = splitQuoteAware(cmd);
  return split ? split.map((p) => p.text) : String(cmd || '').split(/&&|\|\||[;&|\n]/);
}

// `git rm` is not a filesystem delete. It only ever touches TRACKED files, every one
// of which is recoverable from the index or HEAD, and `git rm --cached` removes
// nothing from disk at all. Masking it keeps the recursive-delete rules from claiming
// `git rm -r --cached .` — a legitimate, fully reversible un-tracking — as a tree wipe.
// (The secret-file rules still see it: they match on WRITE_VERB, not on this.)
function maskGitRm(cmd) {
  return String(cmd || '').replace(/\bgit\s+rm\b/gi, 'git untrack');
}

// Whitespace split that keeps a quoted run together (`rm -rf "my dir"` is one target).
// Quotes are dropped; `raw` keeps them for anyone who needs to know.
function shellWords(s) {
  const words = [];
  let buf = '', quote = null, any = false;
  for (const ch of String(s || '')) {
    if (quote) { if (ch === quote) quote = null; else buf += ch; continue; }
    if (ch === '"' || ch === "'") { quote = ch; any = true; continue; }
    if (/\s/.test(ch)) { if (buf || any) words.push(buf); buf = ''; any = false; continue; }
    buf += ch;
  }
  if (buf || any) words.push(buf);
  return words;
}

// PowerShell parameters that take a VALUE which is not a path to delete.
const PS_VALUE_PARAM = /^-(?:include|exclude|filter|credential|stream|depth|attributes|erroraction|ea|warningaction|wa|informationaction|infa|outvariable|ov|errorvariable|ev)$/i;
// …and the ones whose value IS the path (`-Path:x`, `-LiteralPath=x`, `-lp x`).
const PS_PATH_PARAM = /^-(?:path|literalpath|lp|pspath)(?:[:=](.+))?$/i;
// Listing verbs whose output a pipeline can feed into Remove-Item.
const LIST_VERB = /^(?:get-childitem|gci|ls|dir|get-item|gi)$/i;

// The arguments of one command segment, split into targets and the filter a listing
// verb was given: `Get-ChildItem src -Recurse -Filter *.tmp` -> (['src'], '*.tmp', true).
function segmentArgs(words, cmdVerb) {
  const targets = [];
  let filter = null, recurse = false, force = false;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w) continue;
    if (/^-fo(?:r(?:ce?)?)?$/i.test(w)) force = true;
    const pathParam = w.match(PS_PATH_PARAM);
    if (pathParam) { if (pathParam[1]) targets.push(pathParam[1]); continue; }
    if (/^-(?:filter|include)$/i.test(w)) { filter = words[++i] ?? null; continue; }
    if (/^-(?:r|recurse)$/i.test(w) || /^-[a-z]*r[a-z]*$/.test(w)) recurse = true;
    if (PS_VALUE_PARAM.test(w)) { i++; continue; }
    if (w === '--' || w.startsWith('-')) continue;
    if (cmdVerb && /^(?:\/[A-Za-z?]{1,3})+$/.test(w)) continue;
    // PowerShell takes a comma-separated list of paths; splitting is only ever stricter.
    // A brace list (`{a,b}`) is kept whole, so the unresolvable check still sees it.
    if (/[{}]/.test(w)) { targets.push(w); continue; }
    for (const part of w.split(',')) if (part) targets.push(part);
  }
  return { targets, filter, recurse, force };
}

// Get-ChildItem -Recurse without -Force does not descend into hidden items, and git
// marks `.git` hidden on Windows — so that recursion is spelled with a marker segment
// that may be anything EXCEPT `.git`. With -Force it is a plain `**`.
const RECURSE_NO_HIDDEN = '**~nohidden';

// Every delete in the command line and the paths it will remove. A Remove-Item with no
// path of its own, fed by `Get-ChildItem X |`, deletes X's children — spelled as the glob
// `X/*` (or `X/**/<filter>` when the listing recursed), so the glob check can see it.
function deleteTargets(cmd) {
  const targets = [];
  const split = splitQuoteAware(maskGitRm(cmd)) ||
    segments(maskGitRm(cmd)).map((text) => ({ text, sep: ';' }));
  split.forEach(({ text }, idx) => {
    const trimmed = text.trim();
    const verb = trimmed.match(DELETE_VERB);
    if (!verb) return;
    const own = segmentArgs(shellWords(trimmed.slice(verb[0].length)), CMD_DELETE_VERB.test(verb[0]));
    targets.push(...own.targets);
    if (own.targets.length === 0 && idx > 0 && split[idx - 1].sep === '|') {
      const src = shellWords(split[idx - 1].text.trim());
      if (LIST_VERB.test(src[0] || '')) {
        const from = segmentArgs(src.slice(1), false);
        const leaf = from.filter || '*';
        for (const dir of from.targets.length ? from.targets : ['.'])
          targets.push(from.recurse ? `${dir}/${from.force ? '**' : RECURSE_NO_HIDDEN}/${leaf}` : `${dir}/${leaf}`);
      }
    }
  });
  return targets;
}

// Kept for the repo-boundary rule below: plain targets, flags already dropped.
function rmTargets(cmd) {
  return deleteTargets(cmd);
}

// ---------------------------------------------------------------------------
// Protected delete targets — resolved, not pattern-matched
// ---------------------------------------------------------------------------
// `rm -rf .` was always refused; `rm -rf C:/…/my-project`, `rm -rf ../my-project`,
// `rm -rf src/..` and `Remove-Item -Recurse "$(pwd)"` are the same act and were not. So
// each target is RESOLVED against the call's cwd and compared with what it would
// actually remove.
//
// Protected, relative to the project root R (and, when R is an agent worktree at
// `<M>/.claude/worktrees/<n>`, relative to the main checkout M too):
//   R itself, or any ancestor of it                 -> HARD (the whole project)
//   .git, or anything inside it                     -> HARD (the history itself)
//   .claude, .claude/hooks[/…], .claude/settings*.json,
//   .claude/worktrees, and a worktree's root        -> RED  (the gate, SEC-006;
//                                                            worktrees: `git worktree remove`)
// Inside every worktree the same rules apply to its own .git and .claude, while its
// ordinary files (`.claude/worktrees/<n>/src/…`) stay freely deletable.
function repoRoots() {
  const R = projectRoot().replace(/\\/g, '/');
  const roots = [R];
  const wt = R.match(/^(.*)\/\.claude\/worktrees\/[^/]+$/i);
  if (wt) roots.push(wt[1]);
  return roots.map((r) => canonical(r));
}

const REL_HARD = /^(?:\.claude\/worktrees\/[^/]+\/)?\.git(?:\/|$)/;
const REL_RED  = /^(?:\.claude\/worktrees\/[^/]+\/)?\.claude(?:$|\/hooks(?:\/|$)|\/settings[^/]*\.json$)|^\.claude\/worktrees(?:\/[^/]+)?$/;

// -> { tier: 'HARD'|'RED', what } or null, for one resolved, canonical path.
function protectedKind(target, roots) {
  const t = target === '' ? '/' : target;
  for (const root of roots) {
    if (t === root || root.startsWith(t.endsWith('/') ? t : t + '/'))
      return { tier: 'HARD', what: t === root ? 'the project root itself' : 'an ancestor of the project root' };
    if (!t.startsWith(root + '/')) continue;
    const rel = t.slice(root.length + 1);
    if (REL_HARD.test(rel)) return { tier: 'HARD', what: `\`${rel}\` (git's own history)` };
    if (REL_RED.test(rel)) return { tier: 'RED', what: `\`${rel}\` (the safety hook, its wiring, or an agent worktree)` };
  }
  return null;
}

// A target whose value only exists at run time. `$(pwd)`, `$PWD`, `(Get-Location)`,
// `%CD%`, a backtick, a brace list — the hook cannot know what they expand to.
const CWD_SUBST = /^(?:\$\(\s*pwd\s*\)|`pwd`|\$\{?pwd\}?|\(\s*(?:get-location|gl|pwd)\s*\)(?:\.path)?|%cd%)/i;
function isUnresolvable(t) {
  return /\$|`|%[A-Za-z_]\w*%/.test(t) || /^\(/.test(t) ||
         /\{[^{}]*,[^{}]*\}|\{[^{}]*\.\.[^{}]*\}/.test(t) || /^~[^/\\]/.test(t);
}

// Globs: every name a wildcard segment COULD match, drawn from the names that matter,
// plus one neutral stand-in for "anything else". Each combination is then checked like
// a literal path — `*` can be `.git`, `.claude/*` can be `.claude/hooks`, and
// `.claude/worktrees/*/src` can only ever be somebody's source.
// (`..` is deliberately absent: no shell's wildcard expands to it — bash skips it,
// GNU rm refuses it, PowerShell never lists it.)
const GLOB_NAMES = ['.git', '.claude', 'hooks', 'settings.json', 'settings.local.json', 'worktrees'];
const GLOB_STANDIN = 'zz-any-name';
const hasGlob = (s) => /[*?[]/.test(s);

function globSegmentRegex(seg, ignoreCase = process.platform === 'win32') {
  let re = '';
  for (let i = 0; i < seg.length; i++) {
    const ch = seg[i];
    if (ch === '*') re += '.*';
    else if (ch === '?') re += '.';
    else if (ch === '[') {
      const end = seg.indexOf(']', i + 1);
      if (end === -1) { re += '\\['; continue; }
      let body = seg.slice(i + 1, end).replace(/\\/g, '\\\\');
      if (body.startsWith('!')) body = '^' + body.slice(1);
      re += `[${body}]`;
      i = end;
    } else re += ch.replace(/[.+^${}()|\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`, ignoreCase ? 'i' : '');
}

// -> an array of concrete candidate paths, or null when there are too many to check.
function expandGlob(resolved) {
  const segs = resolved.split('/');
  let combos = [[]];
  for (const seg of segs) {
    let options;
    if (!hasGlob(seg)) options = [seg];
    else if (seg === '**') options = [null, ...GLOB_NAMES, GLOB_STANDIN];
    else if (seg === RECURSE_NO_HIDDEN) options = [null, ...GLOB_NAMES.filter((n) => n !== '.git'), GLOB_STANDIN];
    else {
      const re = globSegmentRegex(seg);
      options = [...GLOB_NAMES.filter((n) => re.test(n)), GLOB_STANDIN];
    }
    const next = [];
    for (const c of combos) for (const o of options) next.push(o === null ? c : [...c, o]);
    combos = next;
    if (combos.length > 4096) return null;
  }
  return combos.map((c) => c.join('/'));
}

// The verdict for every delete target in the command line, or null when none of them
// touches anything protected.
function classifyDeleteTargets(cmd) {
  const targets = deleteTargets(cmd);
  if (targets.length === 0) return null;
  const roots = repoRoots();
  let redHit = null;
  for (const raw of targets) {
    let t = String(raw).trim();
    if (!t) continue;
    let unresolvable = false;
    if (isUnresolvable(t)) {
      // A cwd substitution is `.` in disguise — resolve it as such, and if that is the
      // project root the verdict is the same as for `rm -rf .`.
      if (CWD_SUBST.test(t)) t = t.replace(CWD_SUBST, '.');
      unresolvable = true;
    }
    const expanded = expandHome(t);
    let candidates;
    try {
      const resolved = resolvePath(expanded).replace(/\/+$/, '');
      candidates = hasGlob(resolved) ? expandGlob(resolved) : [resolved];
    } catch {
      candidates = null;
    }
    if (!candidates) {
      redHit ??= `\`${raw}\` is a glob with too many possible expansions to check`;
      continue;
    }
    for (const c of candidates) {
      // Already absolute and `..`-free (resolvePath ran, and no glob name is `..`), so
      // only the separator/case folding of canonical() is needed — not another resolve.
      const folded = c.replace(/\/+$/, '');
      const kind = protectedKind(process.platform === 'win32' ? folded.toLowerCase() : folded, roots);
      if (!kind) continue;
      if (kind.tier === 'HARD')
        return hard(`this deletes ${kind.what} — \`${raw}\` resolves to \`${c}\`. Recursive deletion of the project, its parents or its git history is off the table. Delete a specific subpath instead.`);
      redHit ??= `\`${raw}\` reaches ${kind.what}`;
    }
    if (unresolvable)
      redHit ??= `\`${raw}\` only gets its value at run time (a variable, a substitution, a brace list), so nobody can check what it deletes`;
  }
  if (redHit)
    return red(`${redHit}. Deleting the safety hook, its wiring, a worktree, or a path the guard cannot resolve can switch the gate off or take a sibling's work with it (SEC-006). Name a literal path inside the project, use \`git worktree remove\` for a worktree, or confirm explicitly.`);
  return null;
}

// ---------------------------------------------------------------------------
// Moves and renames — the source stops existing under its old name
// ---------------------------------------------------------------------------
// `mv .claude/hooks x`, `Rename-Item .claude\settings.json s.bak`, `ren hooks h2` from
// inside `.claude`: the hook command in settings.json then names a file that is not
// there, node exits 1, and Claude Code treats a failed hook as non-blocking — the gate
// is off. The GUARD_PATH text check sees the plain spellings; this one RESOLVES every
// source and destination against the cwd (like the delete rules), so `..`, absolute
// paths, `./` prefixes, a cwd inside `.claude` and globs are seen too.
const MOVE_VERB = /^(?:sudo\s+|command\s+|env\s+|time\s+|nohup\s+)*(mv|move|move-item|mi|rename-item|rni|ren|rename|git\s+mv)(?=$|[\s;&|()])/i;
const RENAME_ONLY = /^(?:rename-item|rni|ren|rename)$/i;

function moveOperands(rest, verb) {
  const words = shellWords(rest);
  const sources = [], positional = [];
  let dest = null, newName = null;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w) continue;
    const pathParam = w.match(PS_PATH_PARAM);
    if (pathParam) { const v = pathParam[1] ?? words[++i]; if (v) sources.push(v); continue; }
    const destParam = w.match(/^-(?:destination|t)(?:[:=](.+))?$|^--target-directory(?:=(.+))?$/i);
    if (destParam) { dest = destParam[1] ?? destParam[2] ?? words[++i] ?? null; continue; }
    const nn = w.match(/^-newname(?:[:=](.+))?$/i);
    if (nn) { newName = nn[1] ?? words[++i] ?? null; continue; }
    if (PS_VALUE_PARAM.test(w)) { i++; continue; }
    if (w === '--' || w.startsWith('-')) continue;
    if (/^\/[A-Za-z?]{1,3}$/.test(w) && /^(?:move|ren|rename)$/i.test(verb)) continue; // cmd switches
    positional.push(w);
  }
  if (RENAME_ONLY.test(verb)) {
    if (!sources.length && positional.length) sources.push(positional.shift());
    if (newName === null && positional.length) newName = positional.shift();
  } else if (dest === null && positional.length >= (sources.length ? 1 : 2)) {
    // The last positional word is the destination (`mv a b dir`, `Move-Item -Path a b`).
    dest = positional.pop();
    sources.push(...positional);
  } else {
    sources.push(...positional);
  }
  // A rename's new name lives next to its source, whatever the cwd is.
  const dests = [];
  if (dest) dests.push(dest);
  if (newName) for (const s of sources) dests.push(`${s.replace(/[/\\]+$/, '').replace(/[^/\\]*$/, '')}${basename(newName)}`);
  return { sources, dests };
}

function classifyMoves(cmd) {
  const roots = repoRoots();
  for (const seg of segments(cmd)) {
    const m = seg.trim().match(MOVE_VERB);
    if (!m) continue;
    const verb = m[1].replace(/\s+/g, ' ').toLowerCase();
    const { sources, dests } = moveOperands(seg.trim().slice(m[0].length), verb === 'git mv' ? 'mv' : verb);
    const operands = [...sources.map((p) => [p, true]), ...dests.map((p) => [p, false])];
    for (const [raw, isSource] of operands) {
      let t = String(raw).trim();
      if (!t) continue;
      if (isUnresolvable(t)) {
        if (!CWD_SUBST.test(t)) continue; // a run-time value: the text check above is all there is
        t = t.replace(CWD_SUBST, '.');
      }
      let candidates;
      try {
        const resolved = resolvePath(expandHome(t)).replace(/\/+$/, '');
        candidates = hasGlob(resolved) ? expandGlob(resolved) : [resolved];
      } catch { candidates = null; }
      if (!candidates) {
        if (isSource) return red(`\`${raw}\` is a glob with too many possible expansions to check what it moves. Name the files, or confirm explicitly.`);
        continue;
      }
      for (const c of candidates) {
        const folded = c.replace(/\/+$/, '');
        const kind = protectedKind(process.platform === 'win32' ? folded.toLowerCase() : folded, roots);
        if (!kind) continue;
        // Moving something INTO the project root (`mv dist/x .`) is ordinary; moving the
        // root itself away, or anything into or out of `.git`/`.claude`, is not.
        if (!isSource && /project root/.test(kind.what)) continue;
        return red(`this ${isSource ? 'moves or renames' : 'moves something onto'} ${kind.what} — \`${raw}\` resolves to \`${c}\`. A renamed hook or settings file switches the safety gate off without deleting anything (SEC-006). The human makes or explicitly approves this change.`);
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Bash command classification
// ---------------------------------------------------------------------------

// Remove quoted strings and -m/--message arguments so a commit *message*
// containing the word "secret" or "push" is never mistaken for a real path/verb.
function scrubForPaths(cmd) {
  return scrubMessages(cmd)
    .replace(/"[^"]*"/g, ' ')
    .replace(/'[^']*'/g, ' ');
}

// The dangerous delete targets: repo root, home, cwd-as-a-whole, or a top-level
// broad glob. A scoped path (dist/, build/artifact.js, dist/*.js) is NOT here —
// deleting one build artefact is fine; nuking the tree is not.
const DANGEROUS_RM_TARGETS = new Set([
  '/', '/*', '~', '~/', '~/*', '$home', '${home}', '$home/*',
  '.', './', './*', '..', '../', '../*', '*', '**', '.git',
  '$pwd', '${pwd}', '$pwd/*', '$(pwd)', '$(pwd)/*', '`pwd`', '`pwd`/*',
  '%cd%', '%userprofile%', '/..', '/../',
]);

// The same wipe wears several spellings: `rm -rf //`, `rm -rf /.`, `rm -rf ~/.`,
// `rm -rf .//` all resolve to the repo root or home. Fold repeated separators and
// trailing `/.` / `/` away before the lookup, or the tier comes out wrong.
function normalizeRmTarget(t) {
  let s = String(t).toLowerCase().replace(/\/{2,}/g, '/');
  let prev;
  do {
    prev = s;
    if (s.length > 1 && s.endsWith('/.')) s = s.slice(0, -2) || '/';
    if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1) || '/';
  } while (s !== prev);
  return s;
}

// A bare drive root on Windows (`C:\`, `d:/`) is the same act as `rm -rf /`.
const DRIVE_ROOT = /^[a-z]:[/\\]?$/;

function rmIsDangerous(cmd) {
  for (const seg of segments(maskGitRm(cmd))) {
    if (!DELETE_WORD.test(seg)) continue;
    let sawDelete = false;
    for (const rawToken of seg.split(/\s+/)) {
      const t = rawToken.replace(/[;&|()]+$/, '').replace(/^[;&|()]+/, '');
      if (/^(?:rm|unlink|shred|remove-item|ri|rmdir|rd|del|erase)$/i.test(t)) { sawDelete = true; continue; }
      if (!sawDelete || t === '' || isFlagToken(t)) continue;
      const lower = t.toLowerCase();
      const noSlash = lower.length > 1 ? lower.replace(/\/+$/, '') : lower;
      const folded = normalizeRmTarget(t);
      if (DANGEROUS_RM_TARGETS.has(lower) || DANGEROUS_RM_TARGETS.has(noSlash) ||
          DANGEROUS_RM_TARGETS.has(folded) || DRIVE_ROOT.test(folded)) return true;
    }
  }
  return false;
}

// Paths whose content IS the enforcement layer. Writing any of them can switch the
// gate off (SEC-006); a file under `.git/hooks/` additionally runs on every commit.
// The hook's own TEST file is deliberately not in here — tests verify, they do not
// enforce, and the suite has to stay editable.
// `.git/config` belongs here too: it can set `core.hooksPath`, `core.fsmonitor` or an
// alias, each of which runs or reroutes code on the next git call. The prefix class
// includes `>` and `<`, so a redirect with no space (`>.claude/settings.json`) is seen.
// The FOLDERS count too, as whole path segments: `mv .claude/hooks .claude/hooks.off` and
// `Rename-Item .claude hooks-off` leave the configured hook command pointing at a file
// that no longer exists — node exits 1, which Claude Code treats as a non-blocking
// error, and every later call passes unchecked. (`.claude/worktrees/…` is not the
// folder itself and stays out.)
const SEG_END = `(?=$|[/\\\\]?(?:$|[\\s"';&|)<>]))`;
const GUARD_PATH = new RegExp(
  `(?:^|[\\s"'=(/\\\\<>|;&])\\.claude(?:${SEG_END}|[/\\\\](?:settings(?:\\.local)?\\.json|hooks(?:${SEG_END}|[/\\\\][\\w.-]+)))` +
  `|(?:^|[\\s"'=(/\\\\<>|;&])\\.git[/\\\\](?:hooks(?:${SEG_END}|[/\\\\][\\w.-]+)|config\\b)`, 'i');
const GUARD_TEST_PATH = /\.claude[/\\]hooks[/\\][\w.-]*\.test\.mjs/gi;

// Expects a path already through cleanSegments/resolvePath (forward slashes, no
// `..`, no trailing dots or stream suffixes).
function isGuardPath(p) {
  const norm = String(p || '').replace(/\\/g, '/');
  if (/(^|\/)\.claude\/hooks\/[\w.-]*\.test\.mjs$/i.test(norm)) return false;
  return /(^|\/)\.claude\/settings[^/]*\.json$/i.test(norm) ||
         /(^|\/)\.claude\/hooks\/[^/]+$/i.test(norm) ||
         /(^|\/)\.git\/hooks\/[^/]+$/i.test(norm) ||
         /(^|\/)\.git\/(?:worktrees\/[^/]+\/)?config(?:\.worktree)?$/i.test(norm);
}

// Does the command name a guard path that is not just the (editable) test file?
function touchesGuardPath(cmd) {
  return GUARD_PATH.test(String(cmd || '').replace(GUARD_TEST_PATH, ' '));
}

// Anything that can change a file's content, its permissions, or its existence.
// The redirect: a `>` not preceded by `&`/`>` — and not by a file-descriptor number
// (`2>/dev/null`), which is a digit STARTING a word. A digit ending a word is data:
// `echo KEY=1>.env` writes `KEY=1` into `.env`.
// Renames count as writes: the old name stops existing (`ren`, `rename`, `Rename-Item`/
// `rni`, cmd's `move`, `Move-Item`/`mi`, `git mv` via `mv`, node's `fs.rename`).
const WRITE_VERB = /((?:^|[^0-9&>]|[^\s;&|(0-9]\d)>|\bsed\b[\s\S]*\s-i|\btee\b|\brm\b|\bmv\b|\bcp\b|\bunlink\b|\btruncate\b|\bchmod\b|\bchown\b|\battrib\b|\bicacls\b|\bln\b|\bmklink\b|\bremove-item\b|\bset-content\b|\badd-content\b|\bout-file\b|\bnew-item\b|\bcopy-item\b|\bmove-item\b|\brename-item\b|\brni\b|\bmi\b|\bren\b|\brename\b|\bmove\b|\bcopy\b|\bxcopy\b|\brobocopy\b|\bgit\s+(?:checkout|restore)\b|writeFileSync|appendFileSync|unlinkSync|rmSync|renameSync|copyFileSync|cpSync|symlinkSync|\b(?:writeFile|appendFile|copyFile|rmdir|cp|truncate|symlink)\s*\()/i;

// ---------------------------------------------------------------------------
// GitHub CLI — the Red actions this repo is most likely to actually reach
// ---------------------------------------------------------------------------
// `gh` is a remote control for the repository's public face: visibility, access,
// releases, secrets, CI runs, merges. base/SAFETY.md puts "make a repo public" and
// "change access" in the Red tier by name, and none of it was visible to this hook.
//
// Blanket-blocking `gh` would cry wolf on `gh pr list` a hundred times a day, so the
// split is by SUBCOMMAND: reads pass silently, mutations are Red.

// Flags that swallow the NEXT token, so a reordered `gh --repo o/r pr list` still
// yields (pr, list) as the command pair rather than (o/r, pr).
const GH_VALUE_FLAGS =
  /^(?:-R|--repo|--hostname|-X|--method|-H|--header|-f|-F|--field|--raw-field|--input|-q|--jq|-t|--template|--json|-L|--limit|-b|--body|--body-file|-F|--title|-B|--base|-c|--cache|-a|--assignee|-l|--label|-m|--milestone|-p|--project)$/i;

// group -> the subcommands that change something OUTSIDE this machine.
const GH_MUTATING = {
  repo:        /^(?:edit|delete|archive|unarchive|transfer|rename|create|fork|sync|set-default|deploy-key|autolink)$/,
  secret:      /^(?:set|delete|remove)$/,
  variable:    /^(?:set|delete|remove)$/,
  release:     /^(?:create|delete|edit|upload|delete-asset)$/,
  workflow:    /^(?:run|enable|disable)$/,
  run:         /^(?:cancel|rerun|delete)$/,
  pr:          /^(?:merge|create|close|reopen|edit|comment|review|ready|lock|unlock)$/,
  issue:       /^(?:create|close|reopen|edit|comment|delete|transfer|pin|unpin|lock|unlock|develop)$/,
  gist:        /^(?:create|delete|edit|rename)$/,
  auth:        /^(?:login|logout|refresh|token|setup-git)$/,
  alias:       /^(?:set|delete|import)$/,
  cache:       /^(?:delete)$/,
  label:       /^(?:create|delete|edit|clone)$/,
  project:     /^(?:create|delete|edit|copy|close|link|unlink|item-add|item-delete|item-edit|field-create|field-delete)$/,
  codespace:   /^(?:create|delete|edit|stop|rebuild|cp|ssh)$/,
  extension:   /^(?:install|upgrade|remove|create|exec)$/,
  ruleset:     /^(?:create|delete|edit)$/,
  'ssh-key':   /^(?:add|delete)$/,
  'gpg-key':   /^(?:add|delete)$/,
};

// `gh api` is the universal escape hatch: any REST route, any method. A GET is a read;
// a mutating method is not — and gh turns the request into a POST implicitly as soon as
// `-f`/`-F`/`--input` fields are present, so those count too.
const GH_MUTATING_METHOD = /(?:^|\s)(?:-X|--method)(?:=|\s+)(?:POST|PUT|PATCH|DELETE)\b/i;
const GH_API_FIELD = /(?:^|\s)(?:-f|-F|--field|--raw-field|--input)(?:=|\s+)\S/;

// The (group, subcommand) pair, skipping flags and the values they take — so the pair
// is found however the flags are ordered.
function ghWords(seg) {
  const toks = seg.trim().split(/\s+/).filter(Boolean);
  const words = [];
  for (let i = 1; i < toks.length; i++) {
    const t = toks[i];
    if (t.startsWith('-')) {
      if (!t.includes('=') && GH_VALUE_FLAGS.test(t)) i++;
      continue;
    }
    words.push(t);
  }
  return words;
}

function classifyGh(cmd) {
  for (const seg of segments(cmd)) {
    const s = seg.trim();
    if (!/^gh(?:\s|$)/.test(s)) continue;
    const [group = '', sub = ''] = ghWords(s);

    if (group === 'api') {
      if (GH_MUTATING_METHOD.test(s) || GH_API_FIELD.test(s))
        return red('`gh api` with a mutating method (POST/PUT/PATCH/DELETE) or `-f` fields writes to GitHub directly — that is the same door as repository visibility, access and releases, just spelled as a REST call. A Red action the human performs (SEC-005). `gh api` with GET stays open.');
      continue;
    }
    if (group === 'repo' && /(?:^|\s)--visibility(?:=|\s+)public\b/.test(s))
      return red('this makes the repository PUBLIC. base/SAFETY.md names that in the Red tier, and it is irreversible in practice — the moment the code is visible it can be cloned and mirrored. The human decides to publish, never an agent (SEC-005).');
    if (group === 'repo' && sub === 'delete')
      return hard('`gh repo delete` destroys the published repository and every commit, issue and release in it — the most complete form of "destroy published history" there is (SEC-003). Off the table.');

    const rule = GH_MUTATING[group];
    if (rule && rule.test(sub))
      return red(`\`gh ${group} ${sub}\` changes something outside this machine — the repository's visibility, access, releases, CI, or its public conversation. Red: the human performs it or explicitly overrides (SEC-005). Read-only \`gh\` (\`view\`, \`list\`, \`status\`, \`api\` with GET) stays open.`);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Deployment / publication CLIs (SEC-005)
// ---------------------------------------------------------------------------
// "Deploy" in base/SAFETY.md is not `npm run deploy` — it is the tool that actually
// moves bytes to a live target. The old rule matched only an npm script name, an
// interpreter-prefixed `*deploy*`, or `deploy.{py,sh,js,mjs}`, so every real
// deployment CLI walked straight through.
//
// Each entry is anchored on the CLI AS THE COMMAND WORD and on a mutating
// subcommand, so the read-only half of the same tool (`vercel ls`, `aws s3 ls`,
// `terraform plan`, `kubectl get`, `docker build`) stays open.
const RUNNER = /^(?:sudo\s+|env\s+|npx\s+|pnpm\s+dlx\s+|yarn\s+dlx\s+|bunx\s+|npm\s+exec\s+(?:--\s+)?)*/;
const DEPLOY_CLI_RULES = [
  ['vercel',            /^(?:vercel|now)\b(?![\s\S]*\b(?:ls|list|inspect|logs|whoami|help|login|link|pull|env|domains|teams|certs|bisect)\b)/],
  ['netlify deploy',    /^(?:netlify|ntl)\s+(?:deploy|sites:create|env:set|api)\b/],
  ['firebase deploy',   /^firebase\s+(?:deploy|hosting:channel:deploy|functions:delete|apps:create)\b/],
  ['wrangler deploy',   /^wrangler\s+(?:deploy|publish|secret\s+put|pages\s+(?:deploy|publish))\b/],
  ['surge',             /^surge\b/],
  ['fly deploy',        /^(?:flyctl|fly)\s+deploy\b/],
  ['heroku deploy',     /^heroku\s+(?:deploy|container:(?:push|release))\b/],
  ['serverless deploy', /^(?:serverless|sls)\s+deploy\b/],
  ['sam/eb/amplify/swa deploy', /^(?:sam|eb|amplify|swa)\s+(?:deploy|publish)\b/],
  ['gh-pages',          /^gh-pages\b/],
  ['pm2 deploy',        /^pm2\s+deploy\b/],
  ['aws s3',            /^aws\s+s3\s+(?:sync|rm|mb|website)\b/],
  ['aws s3 cp to a bucket', /^aws\s+s3\s+cp\b[\s\S]*\ss3:\/\//],
  ['aws service update', /^aws\s+(?:cloudfront|lambda|amplify|elasticbeanstalk|apigateway)\s+\S*(?:create|update|delete|deploy|publish|invalidat)/i],
  ['gcloud deploy',     /^gcloud\s+(?:app\s+deploy|run\s+deploy|functions\s+deploy|storage\s+(?:cp|rsync))\b/],
  ['az deploy',         /^az\s+(?:webapp|staticwebapp|containerapp|storage)\b[\s\S]*\b(?:deploy|up|upload|upload-batch)\b/],
  ['docker push',       /^(?:docker|podman|nerdctl)\s+(?:compose\s+)?push\b/],
  ['kubectl apply',     /^kubectl\s+(?:apply|create|delete|replace|rollout|set|patch)\b/],
  ['helm',              /^helm\s+(?:install|upgrade|uninstall|rollback)\b/],
  ['terraform apply',   /^terraform\s+(?:apply|destroy)\b/],
  ['pulumi up',         /^pulumi\s+(?:up|destroy)\b/],
  ['ansible-playbook',  /^ansible-playbook\b/],
  ['scp to a server',   /^scp\b[\s\S]*\s\S*@\S+:\S*\s*$/],
  ['rsync to a server', /^rsync\b[\s\S]*\s\S*@\S+:\S*\s*$/],
  ['sftp',              /^sftp\s+\S*@\S+/],
];

// A deploy SCRIPT counts when it is what the segment RUNS: `./deploy.sh`,
// `python scripts/deploy.py`, `node deploy-prod.mjs`. Naming one as data —
// `git grep deploy.py`, `cat scripts/deploy.py`, a commit message — does not.
const INTERPRETER = /^(?:python[23]?|py|node|bash|sh|zsh|pwsh|powershell|deno|bun|tsx|ts-node|ruby|perl)$/i;
function runsDeployScript(cmd) {
  for (const seg of segments(cmd)) {
    const words = seg.trim().replace(RUNNER, '').replace(/^(?:[A-Za-z_]\w*=\S*\s+)+/, '').split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    let script = words[0];
    if (INTERPRETER.test(script)) script = words.slice(1).find((w) => !w.startsWith('-')) || '';
    if (/(?:^|[/\\])[\w.-]*deploy[\w.-]*$/i.test(script) &&
        (script !== words[0] || /[/\\]|\.(?:py|sh|js|mjs|cjs|ts|ps1|cmd|bat)$/i.test(script)))
      return true;
  }
  return false;
}

function matchesDeployCli(cmd) {
  for (const seg of segments(cmd)) {
    const s = seg.trim().replace(RUNNER, '');
    // `grep netlify docs/` is reading about a deployment, not performing one.
    if (!s || READ_ONLY_TOOL.test(s)) continue;
    for (const [name, re] of DEPLOY_CLI_RULES) if (re.test(s)) return name;
  }
  return null;
}

// `shell` is 'bash', 'powershell' or 'unknown' (an MCP terminal tool). A backtick is a
// substitution in bash and an escape in PowerShell; where the shell is not known to be
// bash and a backtick is present, BOTH readings are classified and the stricter wins.
// A heredoc (`<<'EOF' … EOF`) or a PowerShell here-string (`@' … '@`, `@" … "@`) is TEXT
// handed to a command's stdin or to a parameter — a commit message, a file's new content.
// A file name or a verb in it is not a write or a call: `git commit -F - <<'EOF'` whose
// message mentions `secrets.json` does not add that file. The body is blanked… unless
// the line that opens it names something that would RUN it (`bash <<EOF`, `| sh`,
// `iex @' … '@`, `node -`), in which case the body is commands and stays visible.
const RUNS_TEXT = /(?:^|[\s;&|(])(?:sh|bash|zsh|dash|ksh|cmd|powershell|pwsh|node|deno|bun|python[23]?|py|perl|ruby|php|lua|osascript|ssh|sudo|su|iex|invoke-expression|eval|source|xargs|\.)(?:\.exe)?(?=$|[\s;&|)])/i;
function blankTextBlocks(cmd) {
  const lines = String(cmd || '').split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    out.push(line);
    const runs = RUNS_TEXT.test(line.replace(/<<-?\s*(["']?)[\w.-]+\1/g, ' ').replace(/@["']\s*$/, ' '));
    // Bash heredocs; a line may open several (`cmd <<A <<B`), consumed in order.
    const docs = [...line.matchAll(/<<(-?)\s*(["']?)([\w.-]+)\2/g)].map((d) => ({ strip: d[1] === '-', tag: d[3] }));
    for (const d of docs) {
      let j = i + 1;
      while (j < lines.length && (d.strip ? lines[j].replace(/^\t+/, '') : lines[j]).trim() !== d.tag) j++;
      if (j >= lines.length) break;                // unterminated: leave it all visible
      for (let k = i + 1; k < j; k++) out.push(runs ? lines[k] : '');
      out.push(lines[j]);
      i = j;
    }
    // PowerShell here-strings: `@'` / `@"` ends a line, the matching `'@` / `"@` starts one.
    const hs = !docs.length && line.match(/@(["'])\s*$/);
    if (hs) {
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith(`${hs[1]}@`)) j++;
      if (j >= lines.length) continue;
      for (let k = i + 1; k < j; k++) out.push(runs || /(?:^|\|)\s*(?:iex|invoke-expression)\b/i.test(lines[j]) ? lines[k] : '');
      out.push(lines[j]);
      i = j;
    }
  }
  return out.join('\n');
}

function classifyBash(command, shell = 'bash') {
  const raw = blankTextBlocks(String(command || ''));
  const prevShell = CALL_SHELL;
  CALL_SHELL = shell;
  try {
    const first = classifyShellReading(raw, false);
    if (shell === 'bash' || !raw.includes('`')) return first;
    const second = classifyShellReading(raw, true);
    const rank = (v) => (v.tier === 'HARD' ? 2 : v.block ? 1 : 0);
    return rank(second) > rank(first) ? second : first;
  } finally {
    CALL_SHELL = prevShell;
  }
}

// Every short spelling a path argument can hide in: `-T.env`, `-d@.env`, `-F file=@.env`,
// `--data-binary=@.env`. The remainder after the flag or `=@` is a path like any other.
function attachedPaths(tokens) {
  const out = [];
  for (const t of tokens) {
    const m = t.match(/^-(?:T|d|F)(.+)$/) || t.match(/^--[\w-]+=@?(.+)$/) || t.match(/=@(.+)$/) || t.match(/^[\w-]+=<(.+)$/);
    if (m && m[1]) out.push(m[1].replace(/^[@<]/, ''));
  }
  return out;
}

function classifyShellReading(raw, psBackticks) {
  // A search PATTERN is data, and it has to be recognised as data before normalisation
  // unquotes it — `grep -n '=>' file` must not become a redirection.
  const pre = neutralisePatternArgs(raw);
  // Fold every spelling of the same call into one canonical form, then drop commit
  // messages and search patterns — those carry data, not verbs.
  const gcmd = neutraliseSearchPatterns(scrubMessages(normalizeCommand(pre, psBackticks)));
  // Same folding, but with git's global options still in place: `-c core.hooksPath=…`
  // IS the payload of its rule, and normalizeGit deliberately strips `-c k=v`.
  const withGlobals = neutraliseSearchPatterns(scrubMessages(normalizeShell(pre, psBackticks)));
  // Known globals gone, unknown ones still in place — for UNKNOWN_GLOBAL.
  const knownStripped = normalizeGit(withGlobals);
  const scrub = scrubForPaths(gcmd);
  const rawTokens = scrub
    // A redirect needs no space: `echo k=1 >.env` and `x>.env` name `.env` as surely as
    // `> .env` does, so `<` and `>` split tokens too.
    .split(/[\s<>]+/)
    // A leading `@` is curl's "read the body from this file" sigil (`-d @.env`), not
    // part of the name — strip it, or the path hides from every check below.
    .map((t) => t.replace(/^[;&|()@]+/, '').replace(/[;&|()]+$/, ''));
  const pathTokens = rawTokens.filter((t) => t && !t.startsWith('-')).concat(attachedPaths(rawTokens));

  // ---- HARD-FORBIDDEN --------------------------------------------------
  // "Push" has more than one spelling, and the rule used to require the verb to sit
  // directly after `git`. `git send-pack` is the plumbing command push is built on,
  // and `git subtree push --prefix dist origin gh-pages` is THE gh-pages idiom —
  // both publish outward exactly as `git push` does (SEC-005).
  const isPush = /\bgit\s+(?:push|send-pack)\b/.test(gcmd) ||
    /\bgit\s+subtree\s+push\b/.test(gcmd);
  // Force covers: --force (and --force-with-lease, which starts with it), --mirror,
  // any short-flag cluster containing f (`-f`, `-fu`, `-uf`), and a `+refspec`
  // (`git push origin +main`) — long options as prefixes, see opt().
  const isForcePush = isPush &&
    // `--fo` already names only the force family, and `--mi` only --mirror.
    new RegExp(`(${opt('force', 2)}\\b|${opt('mirror', 2)}\\b|(?:^|\\s)-[a-zA-Z]*f[a-zA-Z]*\\b|\\s\\+\\S+)`).test(gcmd);

  if (isForcePush)
    return hard('force-push / mirror-push rewrites published history (SEC-003). Fix forward with a new commit; never force.');
  // Deleting a published branch destroys history as thoroughly as force-pushing over
  // it — `git push --delete main`, `git push origin :main`.
  if (isPush && new RegExp(`(${opt('delete', 2)}\\b|(?:^|\\s)-[a-zA-Z]*d[a-zA-Z]*\\b|\\s:\\S+)`).test(gcmd))
    return hard('`git push --delete` / `git push origin :ref` removes a published branch or tag (SEC-003). Off the table.');
  // --hard/--merge/--keep all throw the working tree away; --soft and a bare reset
  // only move the index, which is recoverable.
  // `[^\n;&|]*` rather than `[^\n]*`: the option belongs to THIS git call, and a scan to
  // the end of the line from every occurrence is quadratic on a long command.
  if (new RegExp(`\\bgit\\s+reset\\b[^\\n;&|]*(?:${opt('hard', 2)}|${opt('merge', 3)}|${opt('keep', 2)})\\b`).test(gcmd))
    return hard('`git reset --hard/--merge/--keep` discards work and can rewind shared history (SEC-003). Use forward-only fixes.');
  // `git pull --rebase` (or `-r`) is a rebase with a fetch in front of it: it replays
  // and rewrites local commits exactly the same way, and the rule that only knew the
  // bare `git rebase` spelling never saw it.
  if (/\bgit\s+rebase\b/.test(gcmd) ||
      new RegExp(`\\bgit\\s+pull\\b[^\\n;&|]*(?:(?:^|\\s)-[a-zA-Z]*r[a-zA-Z]*\\b|${opt('rebase', 3)}\\b)`).test(gcmd))
    return hard('`git rebase` / `git pull --rebase` rewrites history (SEC-003). Not allowed in a multi-agent repo — it destroys siblings’ commits. Use `git pull --no-rebase` (a merge) or `git fetch` + a forward-only fix.');
  // `--am` is already unambiguous for commit (`--a` is not: --all, --author, …).
  if (new RegExp(`\\bgit\\s+commit\\b[^\\n;&|]*${opt('amend', 2)}\\b`).test(gcmd))
    return hard('`git commit --amend` rewrites a published commit (SEC-003). Make a new commit instead.');
  if (/\bgit\s+update-ref\b/.test(gcmd))
    return hard('`git update-ref` hand-moves a branch ref and can move it backwards (SEC-003). Off the table.');
  // `git symbolic-ref <name> <ref>` repoints HEAD by hand — update-ref with a
  // different spelling. Reading one (`git symbolic-ref --short HEAD`) stays allowed.
  if (/\bgit\s+symbolic-ref\s+(?:-\S+\s+)*[^-\s]\S*\s+[^-\s]/.test(gcmd))
    return hard('`git symbolic-ref <name> <ref>` repoints a ref by hand, the same way `update-ref` does (SEC-003). Off the table.');
  // `git branch -f/--force <name> <commit>` force-moves a ref backwards — the
  // same forbidden act as update-ref, just a different spelling (SEC-003).
  if (/\bgit\s+branch\b/.test(gcmd) && new RegExp(`(?:^|\\s)(?:-f|${opt('force', 3)})\\b`).test(gcmd))
    return hard('`git branch -f` force-moves a branch ref and can move it backwards (SEC-003). Off the table.');
  if (/\bgit\s+filter-branch\b/.test(gcmd))
    return hard('`git filter-branch` rewrites entire history (SEC-003).');
  // git clean -fdx (force + remove-ignored) at repo root wipes untracked+ignored
  // files including .env — treat force+X as the forbidden combo.
  if (/\bgit\s+clean\b/.test(gcmd) && /(?:^|\s)-[a-z]*f[a-z]*\b/i.test(gcmd) && /(?:^|\s)-[a-z]*x[a-z]*\b/i.test(gcmd))
    return hard('`git clean -fdx` deletes untracked AND ignored files (incl. secrets/build) irreversibly.');
  // Discarding the whole working tree throws away every uncommitted change in it —
  // including a parallel worker's. A single named file stays allowed.
  if (/\bgit\s+(?:checkout|restore)\b[\s\S]*?(?:^|\s)(?:--\s+)?(?:\.|\*|:[/\\])(?:\s|$)/.test(gcmd) ||
      /\bgit\s+switch\b[^\n;&|]*--discard-changes\b/.test(gcmd))
    return hard('`git checkout/restore .` discards every uncommitted change in the tree — yours and any parallel worker\'s — with no way back. Name the single file you mean.');
  // `git checkout -f <rev>` / `git switch -f` throw away every local change on the way
  // to the other revision — the same whole-tree discard, spelled as a switch.
  if (new RegExp(`\\bgit\\s+(?:checkout|switch)\\b[^\\n;&|]*(?:(?:^|\\s)-[a-zA-Z]*f[a-zA-Z]*\\b|${opt('force', 2)}\\b)`).test(gcmd))
    return hard('`git checkout -f` / `git switch -f` discards every uncommitted change in the tree on the way to the other revision — yours and any parallel worker\'s. Commit or stash first, then switch without `-f`.');
  // Expiring the reflog / pruning now removes the last safety net that makes an
  // accidental reset or a bad commit recoverable at all.
  if (/\bgit\s+reflog\s+(?:expire|delete)\b/.test(gcmd) ||
      (/\bgit\s+gc\b/.test(gcmd) && /--prune\s*=\s*(?:now|all)/.test(gcmd)))
    return hard('expiring the reflog / `gc --prune=now` destroys the recovery net that makes a bad reset undoable (SEC-003).');

  // Committing/adding a real secret file (by explicit path).
  if (/\bgit\s+(add|commit)\b/.test(gcmd)) {
    for (const cand of pathTokens) {
      if (mayBeSecret(cand))
        return hard(`refusing to git add/commit a secret file (\`${cand}\`) — a secret in git history is public forever (SEC-001).`);
    }
  }
  // Creating, overwriting, copying or deleting a secret file from the shell is the
  // same act as a Write of one (`echo KEY=1 > .env`, `cp template .env`, `tee .env`).
  // `git rm --cached <path>` is the CORRECT remediation for a secret that got staged:
  // it un-tracks the file and touches nothing on disk. Refusing it would leave no way
  // to fix the very mistake SEC-001 is about.
  const secretWriteCmd = gcmd.replace(/\bgit\s+rm\b(?=[^\n;&|]*--cached\b)/gi, 'git untrack');
  if (WRITE_VERB.test(secretWriteCmd)) {
    for (const cand of pathTokens) {
      if (mayBeSecret(cand))
        return hard(`refusing to create, overwrite, copy or delete a secret file (\`${cand}\`) from the shell. Commit a \`.example\` stub with placeholder values instead (SEC-001).`);
    }
  }

  // Recursive delete of repo root / home / a broad glob (POSIX or Windows spelling).
  if (rmIsDangerous(gcmd))
    return hard('recursive delete targeting the repo root / home / a broad glob (`rm -rf . | ~ | / | *`, `Remove-Item -Recurse -Force .`, `rd /s /q .`). Delete a specific subpath instead.');
  // The same, for every other spelling of those targets: resolved against the cwd, so
  // an absolute path to the repo, `../<repo>`, `.git`, the hook, a worktree's own
  // gate files, a runtime substitution or a glob that could reach any of them.
  const deleteVerdict = classifyDeleteTargets(gcmd);
  if (deleteVerdict) return deleteVerdict;
  // Tree nukers that never name their targets: `find … -delete`, `… | xargs rm`.
  if (/\bfind\b/.test(gcmd) && /(-delete\b|-exec\s+rm\b)/.test(gcmd))
    return hard('`find … -delete` / `-exec rm` can recursively wipe a tree irreversibly. Scope the deletion to an explicit path instead.');
  if (/\|\s*(?:sudo\s+)?xargs\b[^|\n]*\brm\b/.test(gcmd))
    return hard('piping a file list into `xargs rm` deletes whatever the upstream command happened to print — the same unbounded wipe as `find … -delete`. Delete explicit paths instead.');

  // ---- RED (block, but explain it is a human-only / needs-confirmation action) --
  // Stage-all hides what's being committed — a repo with an untracked secret or a
  // sibling's WIP gets swept in unseen. Can't verify the tree from the command.
  if (/\bgit\s+add\b/.test(gcmd)) {
    const addArgs = gcmd.replace(/^[\s\S]*?\bgit\s+add\b/, '');
    if (/(?:^|\s)(?:-A|--all|--no-ignore-removal)\b/.test(addArgs) ||
        /(?:^|\s)\.(?:\s|$)/.test(addArgs) ||
        /(?:^|\s):[/\\](?:\s|$)/.test(addArgs))
      return red('`git add -A` / `git add .` stages the whole tree — I can\'t verify it doesn\'t sweep in a secret or another worker\'s WIP. Stage explicit paths (`git add <path>`), or override if you\'re sure.');
  }
  // Killing developer processes broadly can destroy parallel worker/agent
  // sessions. Red (not hard): a solo user restarting their own dev server may
  // legitimately do this, so it is confirm-able rather than off-the-table.
  if (/\b(pkill|killall|taskkill|kill|stop-process)\b/i.test(gcmd) && /(node|claude)/i.test(gcmd))
    return red('killing node/claude may take down parallel worker or agent sessions. Confirm no other session is running first (or override).');

  // Writing to the safety hook, its wiring, or a git hook can disable enforcement
  // (SEC-006) or install code that runs on every commit. Only WRITE-ish commands are
  // blocked — running the hook/tests (`node guard-red-actions.test.mjs`) stays allowed.
  if (touchesGuardPath(gcmd) && WRITE_VERB.test(gcmd))
    return red('this command writes to, moves or renames the safety hook, its folder, its wiring or a git hook — that can disable the enforcement layer (SEC-006). The human makes or explicitly approves this change.');
  // The same for moves and renames, with every operand resolved against the cwd.
  const moveVerdict = classifyMoves(gcmd);
  if (moveVerdict) return moveVerdict;

  // Deleting outside the project directory: no checkpoint can reach it, and it is
  // very likely someone else's tree (a sibling repo, a parallel worker, ~/Documents).
  for (const t of rmTargets(gcmd)) {
    if (isOutsideProject(t))
      return red(`\`rm\` targets \`${t}\`, which is OUTSIDE this project directory — a checkpoint commit cannot undo that, and it may be another project or worker's files. Delete inside the project, or confirm explicitly.`);
  }

  // Reading a real secret out of the file it lives in puts it in the transcript, and
  // from there everywhere the transcript goes (SEC-001). Only the unambiguous secret
  // files count here — a doc called `secrets.md` is readable.
  if (/\b(cat|less|more|head|tail|type|base64|xxd|od|strings|scp|get-content|gc|copy-item|cpi|copy)\b/i.test(gcmd) ||
      /\b(?:curl|wget|invoke-webrequest|iwr|invoke-restmethod|irm)\b[\s\S]*(?:-T|--upload-file\b|-d|--data|-F|--form|--post-file|-InFile)/i.test(gcmd)) {
    for (const cand of pathTokens) {
      if (mayBeSecret(cand, true))
        return red(`\`${cand}\` holds real credentials; reading or copying it puts them in the transcript. Use the \`.example\` stub, or confirm explicitly if you truly need the value (SEC-001).`);
    }
  }

  // A branch ref, a stash, a worktree with uncommitted work: deleting them throws
  // away commits that may exist nowhere else. `git branch -d` (the safe delete, which
  // refuses unmerged work) stays allowed.
  if (/\bgit\s+branch\b/.test(gcmd) && /(?:^|\s)-[a-zA-Z]*D[a-zA-Z]*\b/.test(gcmd))
    return red('`git branch -D` force-deletes a branch including unmerged commits, which may exist nowhere else. Use `git branch -d`, or confirm explicitly.');
  if (/\bgit\s+stash\s+(?:drop|clear)\b/.test(gcmd))
    return red('`git stash drop/clear` throws away stashed work that is in no commit. Confirm explicitly.');
  if (/\bgit\s+worktree\s+remove\b/.test(gcmd) && /(?:^|\s)(?:-f|--force)\b/.test(gcmd))
    return red('`git worktree remove --force` deletes a worktree that still has uncommitted changes — possibly another agent\'s. Confirm explicitly.');
  // Switching a verification step off is SEC-006 in shell form.
  if (new RegExp(`${opt('no-verify', 5)}\\b`).test(gcmd) || /core\.hooksPath/i.test(withGlobals))
    return red('this disables git\'s own hooks (`--no-verify` / `core.hooksPath`) — an agent does not switch a gate off (SEC-006). Fix what the hook is complaining about instead.');
  if (/\bgit\s+remote\s+(?:set-url|add)\b/.test(gcmd))
    return red('changing where this repository publishes to is a Red action — the human decides the remote (SEC-005).');
  // `--global` / `--system` config writes land in the user's home, outside anything
  // this project version-controls.
  if (/\bgit\s+config\b/.test(gcmd) && new RegExp(`(?:^|\\s)(?:${opt('global', 3)}|${opt('system', 3)})\\b`).test(gcmd))
    return red('`git config --global/--system` writes outside this project, where nothing version-controls it. The human changes their own git configuration.');

  // The GitHub CLI: visibility, access, releases, CI, merges.
  const ghVerdict = classifyGh(gcmd);
  if (ghVerdict) return ghVerdict;

  // An alias is a RENAME. `git config alias.yolo push` makes `git yolo origin main` a
  // push, and no rule that reads a command line can ever see that second half — so the
  // rename itself is where it has to be caught.
  // Any alias DEFINITION counts, not only one whose body looks dangerous today: the body
  // can be `!sh -c …`, a shell escape no rule reads. Reading (`--get`, `-l`) and
  // removing (`--unset`) an alias stay open. `git -c alias.x=… x` defines and runs one
  // in the same breath.
  if ((/\bgit\s+config\b[^\n;&|]*\balias\.[\w.-]+/i.test(gcmd) &&
       !/\bgit\s+config\b[^\n;&|]*(?:\s--get(?:-all|-regexp)?\b|\s-l\b|\s--list\b|\s--unset(?:-all)?\b)/i.test(gcmd)) ||
      /\bgit\b[^\n;&|]*?\s(?:-c\s*|--config-env[=\s])["']?alias\./i.test(withGlobals))
    return red('this defines a git ALIAS. Once the alias exists, `git <alias>` runs whatever it names — including a `!shell` escape — and no rule can see what it does; the definition is the last point where it is visible. Write the command out instead (SEC-005/SEC-006).');

  // An option git's own global list does not know, sitting in front of a subcommand
  // that has a forbidden form: whatever it is, it is between the reader and the verb.
  if (UNKNOWN_GLOBAL.test(knownStripped))
    return red('an unrecognised git global option sits in front of a protected subcommand (push, reset, commit, config, …). It could be a newer git option or a value that shifts which word is the subcommand — the guard cannot tell. Drop the option, or confirm explicitly.');

  // `git rm -r .` removes every tracked file from the working tree. Nothing is lost for
  // good (they are all in HEAD) so it is not hard-forbidden, but it empties the tree.
  // `git rm --cached` only un-stages and stays open.
  if (/\bgit\s+rm\b/.test(gcmd) && !/--cached\b/.test(gcmd) &&
      /(?:^|\s)-[a-zA-Z]*r[a-zA-Z]*\b/.test(gcmd) &&
      /(?:^|\s)(?:--\s+)?(?:\.|\*|:[/\\])(?:\s|$)/.test(gcmd))
    return red('`git rm -r .` deletes every tracked file from the working tree at once. They are recoverable from HEAD, but confirm this is really what you mean — or use `git rm --cached` if you only want to un-track.');

  if (isPush)
    return red('`git push` publishes outward. This is a Red action — the human performs it (or explicitly overrides). Not delegable to an agent (SEC-005).');
  if (/\b(npm|yarn|pnpm)\s+publish\b/.test(gcmd))
    return red('publishing a package is a Red action — the human performs it (or explicitly overrides) (SEC-005).');
  // An npm script whose name starts with `deploy` is presumed to deploy — EXCEPT this
  // kit's own `deploy:prepare*`, which is a local `copyFileSync` inside `build:prod`
  // and reaches nothing outside the machine. The cleaner fix is to rename that script in
  // package.json to `dist:prepare:prod`, so the allowlist is not needed at all; both
  // names are accepted until someone does.
  const npmScript = gcmd.match(/\b(?:npm|yarn|pnpm|bun)\s+run\s+([\w:.-]+)/);
  const LOCAL_ONLY_DEPLOY_SCRIPT = /^(?:deploy|dist):prepare(?::[\w.-]+)?$/;
  if ((npmScript && /^deploy/i.test(npmScript[1]) && !LOCAL_ONLY_DEPLOY_SCRIPT.test(npmScript[1])) ||
      runsDeployScript(gcmd))
    return red('deploying pushes changes to a live target — a Red action the human performs (or explicitly overrides) (SEC-005).');
  const deployCli = matchesDeployCli(gcmd);
  if (deployCli)
    return red(`\`${deployCli}\` publishes to a live target outside this machine — a Red action the human performs (or explicitly overrides) (SEC-005). The read-only half of the same CLI (\`ls\`, \`logs\`, \`plan\`, \`get\`, \`build\`) stays open.`);
  if (/\brsync\b[^\n;&|]*--delete\b/.test(gcmd))
    return red('`rsync --delete` mirrors a source over a target and removes everything the source does not have. Confirm the target explicitly.');

  // Code that arrives over the network and is executed unread cannot be reviewed by
  // either layer — not by the instruction layer, and not by this hook.
  if (/\b(curl|wget|iwr|invoke-webrequest)\b[\s\S]*\|\s*(?:sudo\s+)?(?:ba|z|da)?sh\b/i.test(gcmd) ||
      /\b(curl|wget)\b[\s\S]*\|\s*(?:sudo\s+)?(?:node|python[23]?|perl|ruby)\b/i.test(gcmd))
    return red('this pipes downloaded code straight into an interpreter — nothing reviews what actually runs. Download it, read it, then run it (or confirm explicitly).');
  // `npm exec --yes` is npx under its real name; `pnpm dlx`, `yarn dlx` and `pnpx`
  // always fetch and run without asking.
  if (/\b(?:npx|npm\s+(?:exec|x))\b[^\n;&|]*\s(?:-y|--yes)\b/.test(gcmd) ||
      /\b(?:pnpm|yarn)\s+dlx\b|(?:^|[\s;&|(])pnpx\b/.test(gcmd))
    return red('`npx --yes` / `npm exec --yes` / `pnpm dlx` / `yarn dlx` installs and runs a package from the registry without a prompt — unreviewed third-party code. Add the dependency deliberately, or confirm explicitly.');
  // `node -e` with a filesystem or process call is a shell in disguise.
  if (/\bnode\b[^\n]*(?:^|\s)(?:-e|--eval|-p|--print)\b/.test(gcmd) &&
      /(rmSync|unlinkSync|rmdirSync|writeFileSync|appendFileSync|renameSync|truncateSync|chmodSync|execSync|spawnSync|child_process)/.test(gcmd))
    return red('an inline `node -e` script that deletes, overwrites or executes bypasses every rule that reads a command line. Use the ordinary command, or confirm explicitly.');
  // A command word that only exists at runtime (`$(echo git) push`, `eval "$CMD"`)
  // cannot be classified by anything that reads the command line.
  const cwSplit = splitQuoteAware(gcmd) || segments(gcmd).map((text) => ({ text, sep: ';' }));
  for (let si = 0; si < cwSplit.length; si++) {
    const trimmedSeg = cwSplit[si].text.trim();
    // `(Get-Content f) -replace …` only EVALUATES an expression; it is a command word
    // only behind PowerShell's call operator `&` (split off as a separator) or `. `.
    const afterCallOp = si > 0 && cwSplit[si - 1].sep === '&';
    if (/^\(/.test(trimmedSeg) && !afterCallOp && !/^\.\s/.test(trimmedSeg)) continue;
    // A PowerShell variable ASSIGNMENT is not a command word: in
    // `$log = "out.txt"; npm run build:prod` the command word is `npm`, plainly
    // visible to every rule. Refusing it was pure cry-wolf.
    if (/^\$(?:env:|global:|script:|local:|using:)?[A-Za-z_][\w:]*\s*(?:\+?=)/i.test(trimmedSeg)) continue;
    // Bash `NAME=value cmd` / `export NAME=value`: the command word is what follows.
    const words = trimmedSeg.replace(/^(?:export\s+)?(?:[A-Za-z_]\w*=\S*\s+)+/, '').split(/\s+/);
    // PowerShell's call operator (`& $x`, `& (…)`) and dot-source are split off as a
    // separator or left in front; either way the word after them is the command word.
    const first = (words[0] === '.' ? words[1] : words[0]) || '';
    if (/^(?:\$\(|`|\$\{|\$[A-Za-z_]|\()/.test(first))
      return red('the command word itself comes from a variable, a substitution or an expression, so no rule can see what will actually run. Write the command out, or confirm explicitly.');
  }
  if (/(?:^|[\s;&|(])eval\b/.test(gcmd) && /(\$\(|`|\$\{?[A-Za-z_])/.test(gcmd))
    return red('`eval` of a variable or a substitution runs a command that does not exist yet, so no rule can see it. Write the command out, or confirm explicitly.');
  // PowerShell's eval: anything it is handed that is not a plain literal is invisible.
  if (/(?:^|[\s;&|(])(?:iex|invoke-expression)\b/i.test(gcmd) && /(\$|\(|`)/.test(gcmd.replace(/^[\s\S]*?\b(?:iex|invoke-expression)\b/i, '')))
    return red('`Invoke-Expression` of a variable or an expression runs a command that does not exist yet, so no rule can see it. Write the command out, or confirm explicitly.');
  if (/\|\s*(?:iex|invoke-expression)\b/i.test(gcmd))
    return red('piping text into `Invoke-Expression` runs it as a command no rule has read. Write the command out, or confirm explicitly.');

  // ---- ALLOW -----------------------------------------------------------
  return allow();
}

// ---------------------------------------------------------------------------
// Write / Edit classification (only the file_path matters here)
// ---------------------------------------------------------------------------
function classifyWrite(filePath) {
  // Self-protection: editing this hook or the settings that wire it in can
  // disable the enforcement layer (SEC-006). Red, not hard — legitimate guard
  // development exists, but the human makes or approves that change. The test
  // file stays editable (tests verify; they don't enforce).
  //
  // The path is checked the way the filesystem will open it: `..` applied, trailing
  // dots/spaces and `::$DATA`-style stream suffixes dropped, relative paths resolved
  // against the call's cwd. Both the cleaned spelling and the resolved absolute path
  // are checked, so neither `src/../.claude/settings.json` nor a cwd inside `.claude`
  // hides the target.
  const cleaned = path.posix.normalize(cleanSegments(filePath) || '.');
  let resolved = cleaned;
  try { resolved = resolvePath(filePath); } catch { /* keep the cleaned spelling */ }
  const anyGuard = [cleaned, resolved].some((p) => isGuardPath(p) || /(^|\/)guard-red-actions\.mjs$/i.test(p));
  if (anyGuard)
    return red('editing a safety hook, its wiring, a git hook or `.git/config` can disable the enforcement layer or run code on every commit (SEC-006). The human makes or explicitly approves this change.');

  if (isSecretPath(cleaned))
    return hard(`refusing to write/edit a secret file (\`${basename(cleaned)}\`). Commit a \`.example\` stub with placeholder values instead (SEC-001).`);

  // Outside the project directory there is no version control to undo this with, and
  // the file probably belongs to something else entirely. Checked AFTER the secret
  // rule so a secret outside the repo still reports as hard-forbidden, not merely Red.
  if (isOutsideProject(filePath))
    return red(`\`${filePath}\` is OUTSIDE this project directory. Nothing here version-controls that file, so the write cannot be undone, and it may belong to another project or worker. Write inside the project, or confirm explicitly.`);

  return allow();
}

// ---------------------------------------------------------------------------
// Result helpers
// ---------------------------------------------------------------------------
function hard(msg)  { return { block: true, tier: 'HARD', reason: `${TAG_HARD} ${msg}` }; }
function red(msg)   { return { block: true, tier: 'RED',  reason: `${TAG_RED} ${msg}` }; }
function allow()    { return { block: false, tier: 'ALLOW', reason: '' }; }

// Pure entry point — exported so tests could import it too (the shipped test
// still exercises the real stdin/stdout contract via a subprocess).
// MCP servers expose tools that run a shell and write files under names this hook
// cannot know in advance — a JetBrains/WebStorm server, for instance, ships
// `execute_terminal_command` and `apply_patch`. Those bypassed every rule above in a
// single call. We cannot parse an arbitrary MCP schema, but we can recognise the two
// shapes that carry risk: a command string, and a target path. What we cannot read is
// recorded as a gap in base/SAFETY.md rather than left implied.
const MCP_COMMAND_KEYS = ['command', 'cmd', 'commandLine', 'command_line', 'script', 'shellCommand', 'shell_command'];
const MCP_PATH_KEYS = ['file_path', 'filePath', 'path', 'pathInProject', 'pathInFile', 'notebook_path', 'absolute_path', 'targetFile', 'target_file'];
// …and one whose name says it READS gets the secret-file read rule.
const MCP_READ_NAME = /(read|get_file|file_text|open|view|cat|download|export)/i;
// Only a tool whose NAME says it changes something gets its path classified. A
// `read_file` naming the guard is a read, and refusing that would be the cry-wolf
// this guard is supposed to avoid.
const MCP_WRITE_NAME = /(write|edit|patch|create|new_file|delete|remove|rename|move|copy|save|apply|replace|reformat|format)/i;

// A PATCH tool carries its targets inside the patch text, not in a path field:
// `mcp__webstorm__apply_patch` takes `{ input }` (or `{ patch }`) in the Codex
// apply_patch format or as a unified git diff. Every file the patch adds, updates,
// deletes, moves to, or renames/copies from/to is pulled out and classified like a
// Write of that path.
const MCP_PATCH_NAME = /patch|diff/i;
const PATCH_TARGET_LINES = [
  /^\*\*\*\s+(?:Add|Update|Delete)\s+File:\s*(.+?)\s*$/gm,
  /^\*\*\*\s+Move\s+to:\s*(.+?)\s*$/gm,
  /^(?:---|\+\+\+)\s+(?!\/dev\/null\b)(?:"?[ab]\/)?(.+?)"?(?:\t.*)?\s*$/gm,
  /^(?:rename|copy)\s+(?:from|to)\s+(.+?)\s*$/gm,
];
function patchTargets(text) {
  const out = new Set();
  for (const re of PATCH_TARGET_LINES) for (const m of String(text).matchAll(re)) out.add(m[1]);
  for (const m of String(text).matchAll(/^diff\s+--git\s+"?a\/(.+?)"?\s+"?b\/(.+?)"?\s*$/gm)) { out.add(m[1]); out.add(m[2]); }
  return [...out].filter(Boolean);
}
// Every string anywhere in the input (bounded), so a patch in an unexpected field is
// still read.
function allStrings(v, out = [], depth = 0) {
  if (typeof v === 'string') out.push(v);
  else if (v && typeof v === 'object' && depth < 4 && out.length < 256)
    for (const x of Object.values(v)) allStrings(x, out, depth + 1);
  return out;
}

// IDE tools that EXECUTE something the hook cannot read: a run configuration (any
// program, any arguments, any environment), a dispatcher that calls any other IDE tool
// by name, a script compiled and run inside the IDE. Their input is a name or a code
// blob, never a command line — the same situation as a command word built at run time,
// so the same tier: Red, the human runs it or approves it.
const MCP_EXEC_NAME = /(?:^|__)(?:execute_run_configuration|execute_tool|run_inspection_kts)$/i;

function mcpStrings(input, keys) {
  const out = [];
  for (const k of keys) {
    const v = input?.[k];
    if (typeof v === 'string' && v.trim()) out.push(v);
  }
  return out;
}

// `context.cwd` is the hook input's `cwd` — where relative paths in this call resolve.
export function evaluate(toolName, toolInput = {}, context = {}) {
  CALL_CWD = typeof context?.cwd === 'string' && context.cwd.trim() ? context.cwd : null;
  ROOT_MEMO = null;
  try {
    return evaluateTool(toolName, toolInput ?? {});
  } finally {
    CALL_CWD = null;
    CALL_SHELL = null;
    ROOT_MEMO = null;
  }
}

function evaluateTool(toolName, toolInput) {
  const name = String(toolName || '');
  // PowerShell is the same surface as Bash on a Windows box: it runs git, it runs
  // `Remove-Item -Recurse -Force`, and it can overwrite this hook. Same classifier.
  if (name === 'Bash') return classifyBash(toolInput.command, 'bash');
  if (name === 'PowerShell') return classifyBash(toolInput.command, 'powershell');
  // NotebookEdit writes a file like any other editor; it just spells the field
  // `notebook_path`.
  if (name === 'Write' || name === 'Edit' || name === 'MultiEdit' || name === 'NotebookEdit')
    return classifyWrite(toolInput.file_path ?? toolInput.notebook_path);
  // Reading is open — except a file that unambiguously holds credentials, whose
  // content would land in the transcript (SEC-001). `.env.example` stays readable.
  if (name === 'Read') return classifyRead(toolInput.file_path);

  if (name.startsWith('mcp__')) {
    if (MCP_EXEC_NAME.test(name))
      return red(`\`${name}\` runs a program, a script or another IDE tool that this hook cannot read — a run configuration, a tool dispatcher, an inspection script. Nothing in the call shows what will actually execute. Run it yourself from the IDE, or use Bash/PowerShell with the command written out (which the hook can check), or confirm explicitly.`);
    if (MCP_PATCH_NAME.test(name)) {
      for (const text of allStrings(toolInput)) {
        for (const p of patchTargets(text)) {
          const verdict = classifyWrite(p);
          if (verdict.block) return verdict;
        }
      }
    }
    // A terminal-style MCP tool runs its `command` in a shell the hook cannot name, so
    // it gets the stricter of the bash and PowerShell readings.
    for (const cmd of mcpStrings(toolInput, MCP_COMMAND_KEYS)) {
      const verdict = classifyBash(cmd, 'unknown');
      if (verdict.block) return verdict;
    }
    if (MCP_WRITE_NAME.test(name)) {
      for (const p of mcpStrings(toolInput, MCP_PATH_KEYS)) {
        const verdict = classifyWrite(p);
        if (verdict.block) return verdict;
      }
    } else if (MCP_READ_NAME.test(name)) {
      for (const p of mcpStrings(toolInput, MCP_PATH_KEYS)) {
        const verdict = classifyRead(p);
        if (verdict.block) return verdict;
      }
    }
  }
  return allow();
}

function classifyRead(filePath) {
  if (!filePath || typeof filePath !== 'string') return allow();
  const cleaned = path.posix.normalize(cleanSegments(filePath) || '.');
  if (isSecretPath(cleaned, true))
    return red(`\`${basename(cleaned)}\` holds real credentials; reading it puts them in the transcript, and from there everywhere the transcript goes. Use the \`.example\` stub, or confirm explicitly if you truly need the value (SEC-001).`);
  return allow();
}

// ---------------------------------------------------------------------------
// Main — read stdin, decide, emit
// ---------------------------------------------------------------------------
// FAIL CLOSED. Whatever goes wrong inside this process — stdin that is not a JSON
// object, an exception in a rule, an unexpected rejection — the answer is a deny with
// the reason attached, never silence. Silence is "allow", and a guard that allows
// whatever it failed to understand is a guard anyone can walk past by confusing it.
// (What this process cannot catch — being killed by its timeout, `node` missing from
// the PATH — Claude Code still treats as "no hook". base/SAFETY.md says so.)
let decided = false;
function emitDeny(reason) {
  if (decided) return;
  decided = true;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
}
function failClosed(why) {
  emitDeny(`${TAG_FAIL} ${why} Nothing was run. If this repeats, the hook itself needs a look — tell the human.`);
  process.exit(0);
}

async function main() {
  process.on('uncaughtException', (e) => failClosed(`internal error: ${e?.message ?? e}.`));
  process.on('unhandledRejection', (e) => failClosed(`internal error: ${e?.message ?? e}.`));

  let data = '';
  try {
    process.stdin.setEncoding('utf8');
    for await (const chunk of process.stdin) data += chunk;
  } catch (e) {
    return failClosed(`could not read the hook input (${e?.message ?? e}).`);
  }

  let payload;
  try {
    payload = JSON.parse(data);
  } catch {
    return failClosed('the hook input on stdin is not valid JSON.');
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload))
    return failClosed('the hook input on stdin is not a JSON object.');

  let result;
  try {
    const input = payload.tool_input && typeof payload.tool_input === 'object' ? payload.tool_input : {};
    result = evaluate(payload.tool_name, input, { cwd: payload.cwd });
  } catch (e) {
    return failClosed(`evaluating this call threw (${e?.message ?? e}).`);
  }

  if (result?.block) emitDeny(result.reason);
  // Allow: emit nothing, exit 0 -> normal permission flow applies.
  process.exit(0);
}

// Claude Code spawns this file as `node <this file>`, so argv[1] IS this file. Only
// when argv[1] is something else — another script that imported `evaluate` — do we
// skip main() and leave stdin alone. Everything unresolvable counts as "spawned", so
// the failure mode of this check is the hook RUNNING, never silently not running.
//
// This deliberately replaces the older `GUARD_NO_MAIN=1` seam: an environment
// variable that switches the gate off is a switch reachable from an agent's own shell,
// which is exactly what SEC-006 forbids. A test that wants `evaluate` imports the
// module; nothing has to disable anything.
function invokedDirectly() {
  try {
    const self = fileURLToPath(import.meta.url);
    const entry = process.argv[1];
    if (!entry) return true;
    if (path.basename(entry).toLowerCase() === path.basename(self).toLowerCase()) return true;
    return canonical(entry) === canonical(self);
  } catch {
    return true;
  }
}

if (invokedDirectly()) {
  main().catch((e) => failClosed(`internal error: ${e?.message ?? e}.`));
}
