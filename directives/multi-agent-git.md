<!-- base -->
# multi-agent-git — directive

When several agents work at once, they usually share **one working tree and one staging
index**. Git's index is global mutable state: the moment two agents stage and commit near
each other, one can sweep the other's work into its commit — or erase it. This directive is
the tactical git plumbing for that shared tree.

It does **not** restate the safety model. *Which tier* a git action sits in, and *which
history operations are hard-forbidden*, live in [SAFETY](../base/SAFETY.md) and in
[SECURITY](../base/standards/SECURITY.md) (SEC-003, forward-only history). Read those for
"why it's off the table"; this is the "how to share a tree without clobbering a sibling."
For fanning work out to those siblings in the first place, see
[orchestration](orchestration.md).

## Stage only your own files

`git add -A` / `git add .` is Red-tier in [SAFETY](../base/SAFETY.md) because staging the
whole tree is unverifiable. In a shared tree it is also actively destructive: it scoops up
**every other agent's unstaged work** and lands it in *your* commit, wrecking authorship and
dragging in junk. So:

- Stage **explicit pathspecs** only — `git add <path>`, never a bare `-A`/`.`.
- Run **`git diff --cached --name-only` before every commit.** A quick sanity check that the
  index holds only what you meant. If a stranger's file appears, unstage that one path
  (`git restore --staged <path>`) — never `git reset`, which can unravel far more.
- Bind the commit's scope explicitly: `git commit --only <path> -m "…"` (or
  `git commit -- <path>`). *Reason: the index is shared — a sibling can stage its own
  files between your `git add` and your `git commit`, and a bare commit would sweep them
  into yours. Pinning the paths makes the commit immune to whatever else is staged.*

## Co-committing a sibling's change is fine

If your commit ends up carrying another agent's uncommitted edit to the same file, **let it
ride.** A commit with two of your files plus a few strangers' is the smaller evil. Do **not**
reach for fine-grained hunk isolation, a temporary index, or a stash to "clean it up" — the
cleanup is riskier than the mess. Just make your *next* commit correctly scoped with
`--only`.

## Never roll a shared tree backwards

These rewrite or discard history that other agents may be standing on. In a shared tree they
mean **real data loss for someone else**:

- `git reset --hard`, `git rebase`, `git merge --abort`, `git commit --amend`, and moving a
  branch ref backwards — all forbidden.
- `--amend` to retro-remove a stranger's file is a disguised `reset`; don't.

Branch-rewind and history-rewrite are hard-forbidden by **SEC-003** even with a go-ahead.
Fix a broken commit of your **own** by going *forward* — a new commit that corrects it —
never by rolling back.

## Commit early so a stash can't eat your work

Any agent — or the user — can run `git stash` at any time, and it silently pockets **all**
unstaged changes across the whole tree, yours included, resetting your file to HEAD. Leave
nothing loose:

- Commit after each logical unit; when in doubt, a `chore: savepoint` commit is enough.
- *Recovery if a stray stash caught you:* find it with `git stash list`, then restore only
  your own path from the stash blob with `git checkout <stash-sha> -- <your-path>` — leaving
  everyone else's files untouched.

## Never push

The human pushes. Push is Red-tier (it reaches outside the machine); in a shared multi-agent
tree, agents simply **do not push at all** — you commit locally and the human decides when
anything leaves. Likewise, don't bypass hooks or signing (`--no-verify`, `--no-gpg-sign`);
if a hook fails, fix the cause and commit again.
