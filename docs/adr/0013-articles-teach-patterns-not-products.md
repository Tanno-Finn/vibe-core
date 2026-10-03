# ADR-0013 — Teaching articles stay vendor-neutral; products live in dated boxes

**Status:** accepted · **Date:** 2026-08-05

## Context

The kit's upcoming educational articles (the "Toolbox" series in particular) teach
readers how to work with AI coding agents. Two of them — the agent-CLI article and,
to a lesser degree, the editor/tooling article — face the question whether the
teaching text may name concrete products.

What is actually at stake is not the genericity gate: `scripts/check-genericity.mjs`
is deliberately narrow and blocks only origin branding, not AI vendor names. Vendor
names already exist in the kit in three sanctioned forms: infrastructure named
freely in the README, historical facts in the notification seeds, and — the
relevant precedent — `docs/explanation/choosing-an-ai-agent.md`, which keeps its
teaching text strictly "criteria, not brands" and confines product names to a
single dated box marked *"this box ages, the rest doesn't"*.

At stake is the editorial neutrality promise: the README states the kit "works with
any agent that reads AGENTS.md" and "isn't locked to a specific agent". An article
that *teaches* one product would erode that promise and would start aging the day
it ships, because the product landscape turns over every few months.

Three options were considered:

- **A — Vendor-neutral pattern article:** teach the patterns shared by all agent
  CLIs (terminal loop, permission prompts, instruction file, sessions, cost
  models); concrete products at most in one dated aging box, alphabetical, no
  ranking.
- **B — Declared editorial exception zone:** articles may teach named products in
  marked sections; requires a README footnote weakening the neutrality claim, a
  gate extension, and recurring maintenance.
- **C — Downstream instantiation:** kit ships the generic article only; the
  onboarding skill generates a locally tailored version naming the user's own
  agent.

## Decision

**Option A.** Teaching and recommending text names no products. Concrete products
appear at most in one dated aging box per article, following the
`choosing-an-ai-agent.md` pattern: alphabetical, no ranking, self-declared expiry
("this box ages, the rest doesn't").

Unchanged by this decision:

- **Infrastructure naming stays free** (established by the README's own usage) —
  version-control hosts, runtimes, editors as plumbing, not as recommendations.
- **Historical facts stay free** — timeline-style events ("product X shipped on
  date Y") are facts, not endorsements, and are already precedented by the seeds.
  Timeline events: see [ADR-0015](0015-timeline-events-are-dated-facts.md), which
  turns this line into a rule (body may name the vendor, title may not) and puts it
  under the genericity gate.

## Consequences

- The genericity gate needs no extension; the README neutrality claim needs no
  footnote; maintenance stays minimal — only the boxes age, and they say so
  themselves.
- The price is one level of abstraction: a reader sitting in front of a specific
  product must translate the patterns to their own screen. Article authors should
  compensate with recognizable, concrete pattern descriptions (what a permission
  prompt looks like, what an instruction file does), not with product walkthroughs.
- Option C remains open as a later, additive enhancement: a downstream onboarding
  step may generate a locally tailored companion section in the user's clone. That
  would not conflict with this decision, because the shipped kit stays neutral.
- Article reviews must check for vendor names in teaching text as an editorial
  criterion, not via the gate.
