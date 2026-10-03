<!-- base -->
# agent-adaptation — directive

This kit is deliberately **tool-agnostic**: the standards, safety model, skills, and the
other directives are written for *any* agent that reads `AGENTS.md`, and they never name a
vendor or a model. That portability is a feature — but it leaves a gap. A specific agent
usually has capabilities the generic rules can't assume: it can spawn sub-agents, choose a
model tier per job, run hooks, hold memory across sessions, load skills natively. When the
running agent has such powers, the generic directives under-use them; when it *lacks* one the
generic rules quietly assume, a rule can misfire.

This directive closes that gap **downstream, in the user's own clone** — never by putting a
tool name into the shipped kit. The kit ships the *mechanic*; the vendor names come into
existence only in a file the user's agent writes for itself.

## The operating companion

When the running agent recognizes capabilities the generic directives don't map — and **with
the user's explicit go-ahead** — it creates and maintains a committed **operating companion**:

```
directives/agents/<tool>.md
```

One file per tool, `layer: project`. It maps the generic rules onto this concrete agent: what
[orchestration](orchestration.md)'s tier and wave rules mean when *this* tool picks models
per sub-agent; whether hooks actually execute here or the Red-tier rules hold by instruction
alone; whether sub-agents are available or the work must run serially in stages. It carries a
`Stand:` (as-of) header in the style of the dated box in
`docs/explanation/choosing-an-ai-agent.md` — the tool-specific facts age; the generic
directives they point back to don't.

## How to make one

1. **Establish which tool you are.** You usually know. If not, ask, and reconcile with
   `profile/USER-MANIFEST.MD` → `environment.agent_tool` (raised in onboarding Round 4).
2. **Take stock of your capabilities** in plain terms: sub-agents? per-job model choice?
   hooks? persistent memory? native skill loading?
3. **Create the companion via the `/new-directive` mechanic** (route "knowledge → directive
   doc"): it scaffolds the file and adds the registry row, and nothing is written without the
   user's approval of the shape first. Create `directives/agents/` if it doesn't exist yet —
   name the new folder out loud before making it.
4. **Tell the user, plainly:** "I've written myself an operating note for my own tool — here
   it is, it's yours." It's project governance (like `overrides/`), so it's **committed** — it
   holds no personal data, unlike the gitignored profile.

## The rules that keep it safe

- **It adds, it never overrides.** A companion maps and specializes the generic rules; it can
  never relax SAFETY tiers or a `[hard]` standard. Anything that would *change* a rule is an
  override or an ADR, not a companion note.
- **One per tool.** Don't fold two tools into one file.
- **On a tool switch, offer a fresh companion** for the new tool — don't rewrite the old one
  into something it isn't. The old file can stay as history or be removed; that's the user's
  call.
- **Offer, don't push.** This is a one-time offer (onboarding finish, or first contact when
  the tool is known); a skip is fine and leaves no hole — the generic rules already work.
