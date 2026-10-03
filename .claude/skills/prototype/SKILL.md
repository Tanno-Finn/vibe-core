---
name: prototype
description: >
  Quickly prototype an interactive idea so the user can feel it before it's built for real.
  Renders an interactive page when the kit supports it, otherwise a written prototype spec.
  Run it when the user says "prototyp" / "mock this up" / "let me try the idea" and wants
  something to react to, fast.
layer: base
capabilitiesUsed: ["page:interactive", "check:screenshot", "check:a11y", "file:html-print", "file:markdown"]
---

# /prototype — feel the idea, fast

Your job: take a rough interactive idea and produce the quickest thing the user can
actually try or react to. Speed and clarity over polish — a prototype exists to answer
"does this work / feel right?" before anyone invests in building it properly.

Be warm and plain. Say out loud what the prototype does and does not cover, so nobody
mistakes a sketch for the finished thing.

## How to run it

1. Pin down the **one interaction** the prototype is meant to test — the core loop, not the
   whole product. A prototype that tries to do everything tests nothing.
2. Build the smallest version that makes that interaction real (or realistically faked).
3. Hand it over with a one-line "here's what to try" and a note on what's stubbed.

## Output — capability-aware, always with a fallback

Check `kit.json` **before** deciding how to render:

- If `kit.json` declares **`page:interactive`**, build the prototype as an interactive
  page — the user can click and feel it.
- **If `page:interactive` is not declared, fall back to `file:markdown` (or
  `file:html-print` for a laid-out, printable spec) describing the prototype: the screens,
  the interaction, the states, and what a user would do at each step.** `file:markdown` is
  the guaranteed base capability, so this fallback always works.

Never assume `page:interactive` is present — read `kit.json` and degrade gracefully.

**Before handing an interactive prototype over, look at it and check it.** If `kit.json`
declares `check:screenshot`, take screenshots of the page in each language it has (desktop and
mobile, light and dark) and look at them yourself. If it declares `check:a11y`, run it on the
page in each language, with one click per state the prototype has. Find each tool through the
`kit.json` → `tools` entry that provides the capability, `--help` first. Unless the user opted
out (below), fix blocking findings before the handover. Without these capabilities, say that
you could not look at or check the page, and list what the user should try by hand.

## Accessibility — on by default, opt-out only for a throwaway

By default a prototype **honors the A11Y standard**, same as shipped work:
`A11Y-001` (keyboard-reachable, visible focus), `A11Y-002` (text alternatives),
`A11Y-003` (custom/canvas widgets expose a keyboard path + ARIA role/label),
`A11Y-004` (AA contrast) and `A11Y-006` (never color alone). Building it accessible from
the start is cheaper than retrofitting, so this is the path unless the user asks otherwise.

**The opt-out — mirrors the onboarding / overrides pattern:** the user may switch
accessibility **off for a throwaway prototype only**. When they do, it must be **recorded,
not silent** (exactly as `/onboarding` records `accessibility.needed: false` with a
one-line reason):

- Confirm out loud that this is a throwaway, not shipped, prototype.
- Record the opt-out where the prototype lives — a top-of-file note:
  `Accessibility: OFF (throwaway prototype) — reason: <one line> — decided: <date>` — and,
  if a profile exists, the `accessibility.needed: false` + reason line the onboarding skill
  writes. An undocumented opt-out does not exist; no note → accessibility stays on.
- **State clearly that the prototype is not shippable until accessibility is restored.**
  The moment it stops being a throwaway, the A11Y rules re-apply in full.

**What the opt-out is *not*:** it is not an `overrides/` entry. The core A11Y rules above
are `[hard]` and **cannot be overridden** for real or shipped work — the `overrides/`
mechanic only relaxes `[overridable]` rules (`A11Y-005` Easy-Language, `A11Y-007`
reduced-motion) into advisory warnings, never `[hard]` ones (see `overrides/README.md`).
The prototype opt-out is narrower: a documented, prototype-only exemption that expires the
instant the work heads toward shipping.

## Boundaries

- Writing the prototype file / page locally is a reversible (Green) action — tell the user
  where it is.
- **Ask first** before anything Red: publishing or deploying the prototype, sending it
  anywhere, or wiring it to real data or credentials (see `AGENTS.md` → Boundaries).
- A prototype with accessibility opted out is a dead end by design — never promote it to
  shipped work without redoing it against the full A11Y standard.
