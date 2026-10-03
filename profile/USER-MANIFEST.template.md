<!-- base -->
# User Manifest

> Copy this file to `USER-MANIFEST.MD` (same folder) during `/onboarding`. The real
> manifest is **gitignored** — it describes a person, not the project (PRIV-001). This
> template ships; your filled-in copy does not.
>
> This is the home for everything about *how this person wants to work* that isn't the
> product itself — language, preferences, working style, no-gos. It is written openly,
> with the user's knowledge, and honoured every session.
>
> Three zones. **Zone 1** is read by the agent at the start of every session and kept
> short and structured. **Zone 2** is yours — freeform notes the agent only reads when
> relevant. **Zone 3** is agent-maintained — observations about how you actually work,
> always yours to read and correct.

---

## Zone 1 — Agent-read (keep short, structured)

```yaml
language: de              # manifest language the agent speaks (de | en | …)
easy_language: false      # prefer simplified / Easy-Language phrasing?
reading_level: standard   # standard | simplified — how much the agent unpacks jargon

# Who you are for this project (one line each, optional)
role: ""                  # e.g. teacher, hobbyist, developer, author
experience: ""            # e.g. "new to coding", "ships Angular apps"
goal: ""                  # what you want to build / achieve here
audience: ""              # who it is for, e.g. "pupils aged 12-14, German and Italian"

# How the agent should explain things to you. The profession is asked as a
# *communication world*, not as a CV entry: it is used to pick pictures you already
# know. Derivation and its limits: directives/communication.md.
communication:
  profession: ""          # what you do, or what you know inside out — optional
  analogy_domains: []     # derived from it, e.g. ["clinic: handover, patient file, rounds"]
  analogies: offer        # offer | off — offer means: try them, drop one on pushback
  notes: ""               # e.g. "my field's jargon needs no unpacking; IT jargon does"

# Accessibility needs the product and the agent should honour
accessibility:
  needed: true            # false ONLY for a throwaway prototype (documented opt-out)
  notes: ""               # e.g. "high-contrast", "keyboard-only", "screen reader"

# What the agent watches for you, unprompted — its side of the deal.
# Level per topic: quiet | normal | active. What each level means is defined in exactly
# one place: directives/stewardship.md ("How loud each level is"). Each topic has a
# playbook under directives/watch/<topic>.md — that is where the agent looks up why a
# topic matters and how it raises a finding.
watch:
  security:      { level: normal }   # risky patterns, exposed secrets, unsafe commands
  privacy:       { level: normal }   # personal data ending up where it shouldn't
  accessibility: { level: normal }   # barriers creeping into what you build
  tech_debt:     { level: normal }   # shortcuts that get expensive later — named, not hidden
  cost:          { level: normal }   # anything that spends money or grows a bill
  seo:           { level: quiet }    # whether people can find the site through a search engine
  performance:   { level: quiet }    # whether it stays quick on an old phone
# Any entry may carry a note: { level: active, notes: "tell me before every euro" }.
# Guardrail: these levels tune TONE and frequency of routine nudges only. Safety
# warnings (base/SAFETY.md — Yellow/Red) are never off; no manifest setting silences them.
#
# Migrating an older manifest: a `compensation:` block with five true/false flags is the
# previous shape of this block (ADR-0017). An agent that finds one reads true as `normal`
# and false as `quiet`, adds `seo` and `performance` at the defaults above, offers to
# rewrite the block — and never rewrites Zone 1 without saying so.

# Environment (what exists BEFORE the agent — the agent confirms only what it can see)
environment:
  os: ""                  # windows | macos | linux
  hardware: ""            # e.g. "modern laptop", "low-spec / old", "cloud only"
  hosting: ""             # "none yet" | provider name | "codespaces" (asked with delivery.route)
  dev_setup: ""           # "none" | "node installed" | "full IDE" — drives setup guidance
  agent_tool: ""          # already using an AI coding agent? which one (for /help)
  git: ""                 # "repo" | "installed, no repo yet" | "not installed" — the safety net

# Delivery — how what you make reaches your learners or audience. It decides what "done"
# means: a file for the school platform, a folder for a web server, a page that works
# offline. Every field may stay "not sure". Routes to the web: docs/how-to/deploy.md.
delivery:
  route: ""               # school platform (Moodle, itslearning, Teams) | school web server |
                          # hosting service (GitHub Pages, Netlify) | offline (print, USB) |
                          # only on my computer | not sure
  devices: ""             # e.g. "school iPads, Safari", "own phones", "computer room, Windows"
  assistive_tech: ""      # e.g. "one pupil uses a screen reader", "none known"
  internet: ""            # reliable | patchy | none in the classroom
  tech_help: ""           # who can help: "IT admin", "a colleague", "nobody"
  data_rules: ""          # e.g. "no outside services", "only school servers", "not sure"
```

## Zone 2 — Your notes (freeform, human-owned)

Anything you want the agent to remember but that doesn't belong in the structured block:
context, preferences, decisions, things to avoid. The agent reads this when it's relevant,
not every turn.

## Zone 3 — Inferred (agent-maintained)

The agent's notebook on how you actually work — kept *for* you, never behind your back.
The contract:

- **The agent writes here**, with a date, when it observes something that differs from
  Zone 1 (e.g. "hasn't needed a git explanation in weeks — Zone 1 still says 'new to
  coding'"). Observations only — it never guesses and never invents.
- **It proposes, you decide.** When a pattern is solid, the agent suggests the matching
  Zone 1 update in conversation ("You never ask about git basics anymore — shall I raise
  your experience level?"). It never silently edits Zone 1.
- **You may read, edit, or delete anything here.** Your corrections win.
- **Durable non-product preferences land here.** When the agent learns a lasting preference
  that is about *you*, not the product — how you're addressed, tone, working style, a no-go —
  it records it here (dated, and with your knowledge — never silently) and works to it from
  then on. Anything about the product belongs in the code and its docs, not here.
- **The interview's own status lives here too** — `interview: paused after round N` or
  `interview: declined <date>; reminder: pending|given` — so a later session asks only
  what is still open and reminds you at most once.

<!-- The agent appends dated observations below this line. -->
