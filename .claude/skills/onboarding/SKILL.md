---
name: onboarding
description: >
  First-contact interview that builds the user manifest. Run it on a fresh checkout, when
  no profile/USER-MANIFEST.MD exists yet, when the user says "onboarding" / "start over",
  or to finish a declined or paused interview (it asks only the gaps).
layer: base
capabilitiesUsed: ["site:make-it-yours"]
---

# /onboarding — first contact

Your job: learn enough about this person to help them well, and write it to
`profile/USER-MANIFEST.MD`. This is the first thing they experience — be warm, brief, and
never make them feel tested. One question at a time. They can skip anything.

Read `profile/USER-MANIFEST.template.md` first — it is the exact shape you will fill in.

## The offer: prominent, with the reason, never forced

At first contact (no manifest yet) the offer is the **first thing you say**, in its own
short paragraph — never a parenthesis after something else, never a footnote under the
answer to their first request. Say in one or two plain sentences why it pays off for *this*
person, then let them choose. Something like:

> "Before we start: may I ask you a few short questions (about five minutes)? Then I'll
> answer in your language, at your level and length, build for your pupils or audience,
> their devices and the way material reaches them — fewer wrong turns, less wasted time
> and cost. You can skip any question, or say 'just start'."

Ask the language line (below) in the same breath if their first message didn't already
show the language.

**If they decline** ("not now", "just start", or they simply go on with their task):
respect it at once and start working. Write the manifest anyway — the language you
observed, every round's defaults with the `(default)` marker, and in **Zone 3** the line
`interview: declined <date>; reminder: pending` — and say so in one sentence ("I've
saved a starter profile with defaults; you can fill it in any time"). That file is what
stops every later session from offering again.

**Remind once, later, briefly.** At the first natural pause *after you have delivered a
first result* — not mid-task, not in the same turn as the decline — offer once more in a
single sentence, tied to what just happened where you can ("That worksheet came out
generic; three quick questions about your class would fit the next one better — want
them?"). Then change the Zone 3 line to `reminder: given` and **never raise it again**;
from then on only the user starts the interview.

**Record what they tell you anyway — openly.** Interview or not, whenever the user states
a fact that belongs in the manifest (role, experience, language(s), audience, an
accessibility need, how material reaches learners, their devices, a preference), write it
into the matching Zone 1 field right away and say so in one sentence: *"I'm noting in
your profile that your pupils use school iPads."* A stated fact replaces its `(default)`
marker; that is what lets a later interview skip it. What you merely *observe* (they never
ask about git, they always want it shorter) still goes to Zone 3 as before — see "Writing
the manifest".

**Partial interview.** When the interview does run and the manifest already holds real
answers, ask only the gaps — the table under "Stopping early" says how to find them.

## The one hard rule: language first

**Before anything else, ask which language they'd like to work in** — and ask it in a
short bilingual line so anyone can answer:

> "Welche Sprache möchtest du? / Which language would you prefer?"

From their answer on, **speak only that language** for the rest of the interview and
every session after. Everything below is *what* to ask; you phrase it live in their
language, plainly. Match their register: if they write like a beginner, drop the jargon;
if they write like a developer, be terse.

## Say why it's worth it (before the first real question)

If the offer above already said why, don't say it twice. If the user came in with
"onboarding" and heard no offer, give the reason right after the language answer, in one
or two sentences — then start. Something like: *"Five minutes of questions, and I'll know
what to explain, what to just do, and what to watch for you without being asked. Nothing
is a test, and you can skip anything."* Don't oversell; one breath, then Round 1.

## Ask scenarios, not self-assessments

Don't ask people to rate themselves ("What's your background?") — most people can't, and
beginners undersell. Put them in a small, concrete situation and let their choice tell
you what you need. The questions below are written as scenarios; deliver them in their
language, in your own words.

## How to run it

- One question per turn. Offer 2–4 concrete example answers where it helps — but always
  allow a free answer or **"skip"**.
- Group the questions into the rounds below. After each round, one sentence of
  acknowledgment, then on. Aim for 8–12 questions total and **stay under five minutes**
  when the user answers briskly — that is the promise made in the opening sentence, and
  Rounds 3 and 5 keep it by offering one blanket answer instead of many. Skipping is fine
  and common. Don't interrogate.
- **Skipping never leaves a hole.** Each round names its defaults. If a round is skipped,
  write those defaults into the manifest marked `(default)` — so a later session knows
  they were assumed, not stated. "Skip everything" / "just start" → language + all round
  defaults, done. That's a valid profile.

### Round 1 — Working together (4 questions)

1. Their goal, in their words: what do they want to build or learn here? — and **for
   whom**: if the answer names an audience (pupils, a club, colleagues), take age, level
   and languages from it into `audience`; ask one follow-up only if the audience is
   unclear and it matters for the goal.
2. **Scenario — repair style:** "Something just broke. Should I fix it with you, step by
   step, explaining as I go — or just fix it and show you the result?" (Reveals
   experience and how much explaining they want, without asking for a CV.)
3. **Scenario — explanation depth:** "I have to tell you about a technical decision. Do
   you want the plain-words version with a small example — or the short, technical one?"
   (Sets `reading_level` and your register.)
4. **The world they know best** — one light question, explicitly skippable: *"One more
   question, and it only helps me explain things: what do you do for a living — or what
   are you really good at? I'll try to explain technical things with pictures from your
   world instead of jargon. You can skip this one."*

> **Why this sits in Round 1, not at the end:** its answer improves every explanation that
> follows — above all the watch menu in Round 3, which you can then deliver in the user's
> own world. It is one question, not a CV form.

Its answer fills the `communication` block in Zone 1: the world itself, plus the **three
to five strongest analogy mappings as keywords, never an essay**. How to derive them is in
[`directives/communication.md`](../../../directives/communication.md), "Explaining in the
user's own world": find that world's routine artifacts — what gets handed over, what gets
checked before something may go out — and map them onto the kit's recurring concepts
(journal, checkpoint, check-in, technical debt, test and gate, publish, backup, spec). The
same section sets the limits that keep it honest. Do not invent a profession table; derive
live.

Say the limit in the same breath you take the answer: the pictures are an offer, at most
one per explanation, and if one misses or gets annoying they say so and you drop it. In a
safety warning the precise sentence always comes first.

> **Skip-defaults:** `experience: "(default) unknown — start plain, step by step"`,
> `reading_level: standard`, goal and audience noted as "(not stated yet)",
> `communication.profession: "(default) not stated"` with `analogy_domains` empty — which means
> you explain plainly and reach for no pictures at all. Adjust later via Zone 3.

### Round 2 — Accessibility (1–2 questions)

1. **Scenario:** "Picture your finished page being used by someone without a mouse, with
   a screen reader, or who needs very plain words. Is any of that you, or your audience —
   something I should build for from day one?"
2. Would they like an **Easy-Language** (simplified) path for the content?

> **Opt-out is only for a throwaway prototype.** If they want to switch accessibility
> "off", confirm it's a prototype, record `accessibility.needed: false` with a one-line
> reason, and note that shipped work re-enables it (A11Y standard is `[overridable]`
> only in the open — see `overrides/`). Never silently drop it.

> **Skip-defaults:** `accessibility.needed: true` (it's the standard, not an add-on),
> `easy_language: false`, notes empty.

### Round 3 — Trust & the watch deal (2–3 questions)

What may you do unasked — and what do you watch for them. This round carries the kit's
core promise; if you deliver only one round well, make it this one. It is also where the
**explain-first rule** matters most: give the one-sentence reason *before* the choice,
never a bare list, and offer the longer version only if they ask for it. Depth comes when
they ask for it, never before — no seven-topic lecture.

1. **Scenario — delegation:** "I've finished a small change and it works. May I save a
   checkpoint (a commit) on my own and tell you afterwards — or would you rather look
   first, every time?" Optionally the same for installing well-known packages. Record the
   answer as a short "Working agreements" note in Zone 2.

2. **The watch menu.** Seven topics, each with its one-sentence pitch — then one sentence
   on where the decision sits, and one on the safety limit:

   - **Security & secrets** — so that passwords and access keys never end up published.
   - **Privacy** — so your site doesn't collect data about its visitors without you
     knowing and wanting it.
   - **Accessibility** — so the page works without a mouse and with a screen reader.
   - **Technical debt** — the shortcuts taken while building, and the interest they
     charge later.
   - **Findability (SEO)** — whether your page turns up when someone searches for what it
     is about.
   - **Cost** — anything that spends money or can grow into a running bill, told to you
     *before* it happens.
   - **Speed** — so the page stays usable on a five-year-old phone.

   > "I keep these in view and speak up — deciding is always yours." · "Real safety
   > warnings can't be switched off by anything you choose here; these levels only decide
   > how often I mention routine things."

   **Where those sentences come from — don't improvise them.** Every topic has a playbook
   at `directives/watch/<topic>.md`: `security.md`, `privacy.md`, `accessibility.md`,
   `tech-debt.md`, `seo.md`, `cost.md`, `performance.md`. Its **"Why this matters"**
   paragraph is the source; the pitch above is that paragraph's first sentence, said in
   your own words and in the user's language. If they ask *"why should that matter to
   me?"*, read that paragraph out in plain words — with a picture from Round 1's world if
   you have one — and then return to the choice. Interview and later behavior must quote
   the same source, or the promise you make here drifts from what you actually do.

3. **The levels.** Each topic runs at `quiet`, `normal`, or `active`. Explain them in one
   line each, taken from [`directives/stewardship.md`](../../../directives/stewardship.md)
   → "How loud each level is" — that table is canonical, so quote it rather than inventing
   a second wording:

   - `quiet` — the radar still runs; findings are recorded, not raised. You see them when
     you ask, or on `/status`.
   - `normal` — one plain sentence the moment something trips, plus a check-in at natural
     pauses when something has accumulated.
   - `active` — as `normal`, and I also offer to look over things without an acute
     finding, with the effort said up front.

   **One answer is enough.** Offer *"keep everything at its default"* out loud as a
   complete, valid answer — never click them through seven separate questions. Say
   "default", not "normal": the defaults are five `normal` and two `quiet`
   (`performance` and `seo`), and that split is a decision, not an oversight —
   protection runs, optimization is offered ([stewardship](../../../directives/stewardship.md)).
   Offering "everything at normal" would silently overwrite it. Whoever wants to
   differentiate says so freely ("findability doesn't matter to me, but tell me about
   money immediately"); you map that onto the three levels and read the result back once,
   in a single line.

   **Defaults if they choose nothing:** `normal` for security, privacy, accessibility,
   tech debt and cost; `quiet` for findability and speed. Say why in half a sentence if it
   comes up: the five older topics protect against damage, the two newer ones improve a
   result — protection is the default, optimization is an offer.

   **Mapping the level to experience** (from Round 1's repair scenario — a proposal you
   say out loud, never a silent setting): someone who wanted the result rather than the
   steps keeps the defaults as they stand. Someone who wanted to repair *together* and
   learn along the way gets `active` offered on the topics they will actually meet while
   building — accessibility and tech debt — because `active` is the level that explains
   without being asked. Never move a topic *down* because somebody sounds experienced;
   experience changes how much you explain, not what you watch.

   **Findability is the project-dependent one** — the single topic you *propose* instead
   of defaulting. If Round 1's goal is a public site ("a page for my club"), propose
   `seo: normal` and say why in the same sentence. For a private, learning or
   shared-by-link project it stays `quiet`, and you say that too. Either way the user
   decides.

> **Guardrail (non-negotiable):** the levels tune the *tone* and frequency of routine
> nudges, never *whether* a Yellow/Red warning happens — and never the `[hard]` rules, the
> pre-announcement of anything that costs money, or the posture report before publishing
> (`base/SAFETY.md`, `directives/stewardship.md`). Say this in one plain sentence; don't
> let anyone believe they just switched off safety.

> **Skip-defaults:** the seven catalog defaults above, each written with a `(default)`
> marker; checkpoint commits allowed (they're Green tier), everything Red still asks first.

### Round 4 — Environment (the "before the agent" round)

This decides how your setup instructions read. Ask only what you can't already see, and
**confirm rather than re-ask what you can see yourself**:

- If you can inspect the machine (OS, whether Node is installed, the shell, whether git
  is installed and whether this folder is a git repository), say what you observe and ask
  them to confirm — don't quiz them on it.
- Otherwise ask: **which operating system** (Windows / macOS / Linux), **hardware**
  (a capable machine · an old/low-spec one · "I only have a browser"), and **whether they
  already use an AI coding agent**. Hosting is not asked here — Round 5's first question
  covers it.
- **The git safety net.** If the folder is not a git repository, or git is missing, make
  the offer from [`base/BOOKKEEPING.md`](../../../base/BOOKKEEPING.md) → "No repository
  yet" here, in plain words and once. Record the state in `environment.git`.

> **Environment law:** never assume an OS, hardware, server, or existing dev setup. When
> you later give setup steps, give them for *their* OS. If they have no setup or weak
> hardware, steer toward the zero-install cloud path (Codespaces) as the first option —
> not as a fallback.

> **Skip-defaults:** record what you can *observe*, marked `(observed)`. For the rest:
> `hardware: "(default) assume modest"`,
> `dev_setup: "(default) assume nothing installed — offer the cloud path first"`.

### Round 5 — How your work reaches people (the infrastructure round)

What you build is only useful if it arrives. This round tells you what "done" means for
this person: a file they can upload to Moodle, a folder for the school's web server, a
page that works offline from a USB stick. Keep it short and plain — most people here are
not technical, and "I don't know" is a good answer (it tells you to pick the simplest
route and to explain it). **Open with one question; ask the follow-ups only where the
answer opens them.** Offer *"skip this round"* out loud as a complete answer.

1. **The route:** "When something is finished — how does it get to your pupils (or your
   audience)?" Example answers: *through the school platform (Moodle, itslearning, Teams)*
   · *on the school's own web server* · *on a free website service (GitHub Pages,
   Netlify)* · *on paper or offline (printed, USB stick, files on the classroom PCs)* ·
   *only on my own computer for now* · *I don't know yet*. Fills `delivery.route`, and
   `environment.hosting` when the answer names a host.
2. **Their devices:** "What will they open it on?" — school tablets, their own phones,
   the computer room; which browser if they know. → `delivery.devices`
3. **Assistive technology:** "Does anyone use a screen reader, magnifier, or read-aloud
   tool?" Skip it if Round 2 already answered it. → `delivery.assistive_tech`
4. **Internet at school:** reliable · patchy · none in the classroom. → `delivery.internet`
5. **Who can help technically:** an IT admin, a colleague, nobody. → `delivery.tech_help`
6. **Data-protection rules:** "Are there rules about where things may be stored — for
   example no outside services, only school servers?" → `delivery.data_rules`

Say in one sentence what the answer changes: *"Moodle → I'll hand you single files you
can upload, no web server needed."* When the route is a web server or a hosting service,
point to [`docs/how-to/deploy.md`](../../../docs/how-to/deploy.md) as the step-by-step
guide for later — don't walk through it now. A data-protection rule is a constraint, not
a preference: note it and honor it (no external service, CDN, or upload it forbids).

> **Skip-defaults:** `delivery.route: "(default) not known — deliver self-contained files
> that open offline, and ask before anything needs a server"`, `devices: "(default) assume
> mixed, including old phones"`, `assistive_tech: "(default) not known — build for screen
> readers anyway"`, `internet: "(default) assume patchy"`, `tech_help: "(default) assume
> nobody"`, `data_rules: "(default) assume strict — no external services without asking"`,
> `environment.hosting: "none yet (default)"`.

## Stopping early — and picking it up later

"Later", "that's enough", "let's just start" are valid answers at any point, and none of
them leaves a broken profile behind.

**When they stop:** close cleanly in the same turn. Every round not yet asked gets its
named defaults with the `(default)` marker, the manifest is written, and a line
`interview: paused after round N` goes into **Zone 3**. Say in one sentence what you
assumed and that they can pick it up whenever they like. A manifest that stopped after
Round 2 is a working manifest: language, goal, register, and accessibility are set, the
watch topics run at their catalog defaults, and every later session reads it and runs.

**When they come back** — `/onboarding` again, or "let's finish that thing" — do not start
over. Read `profile/USER-MANIFEST.MD` first and let the file tell you what is open:

| What you find | What it means | What you ask |
|---|---|---|
| `interview: paused after round N` in Zone 3 | the rounds after N were never asked | offer to continue at round N+1 |
| `interview: declined …` in Zone 3 | the whole interview was skipped; only defaults and facts recorded along the way | every field still carrying `(default)`, round by round |
| no `delivery` block, or all of it `(default)` | Round 5 was never asked (or the manifest predates it) | Round 5's first question, then only the follow-ups it opens |
| a field carrying `(default)` | assumed, not stated | that field's question — one question, not the whole round again |
| `communication` empty or `(default)` | Round 1's world question is still open | that one question |
| `watch` entries all at catalog defaults *and* marked `(default)` | Round 3's menu was never shown | the menu, once |
| a field with a real value | answered | nothing. Never re-ask it. |
| a `compensation` block instead of `watch` | an older manifest | nothing yet — apply the reading rule below, then ask only about the two topics it cannot contain |

Open the return with what you already know, and say how much is left: *"We stopped after
the accessibility question last time — three things are still open, about two minutes."*
Ask only those, then remove the pause or decline note and write the file. **"Start over" stays the
explicit restart** and is the only thing that discards answered fields.

## Writing the manifest

Copy `profile/USER-MANIFEST.template.md` to `profile/USER-MANIFEST.MD` and fill **Zone 1**
from the answers. Skipped items get their round's **named default with a `(default)`
marker** — never invented detail, never a silent blank. Freeform context and the working
agreements go to Zone 2. Leave **Zone 3 (Inferred)** as shipped — it's yours to maintain
from here on: when you later observe them working differently from what Zone 1 says,
append a dated note there and, once the pattern is solid, *propose* the Zone 1 update in
conversation. Never silently edit Zone 1. The one exception is a fact the user *states*
(see "Record what they tell you anyway"): it goes straight into its Zone 1 field, said out
loud in the same turn — that is open, not silent.

Three named blocks come out of this interview. **`communication`** (Round 1): the world,
the three to five derived analogy domains as keywords, `analogies: offer`. **`watch`** (Round
3): the seven topics, each with its level. **`delivery`** (Round 5): the route to the
learners and the five follow-ups, as short phrases. Write those and **never a `compensation`
block** — that is the previous shape of the watch block, and this interview no longer
produces it. If you find one in an existing manifest, the template's reading rule applies:
`true` reads as `normal`, `false` as `quiet`, findability and speed come in at their
catalog defaults, and you offer to rewrite the block and say what you did — you never
rewrite Zone 1 silently (ADR-0017).

The file is gitignored (it describes a person — PRIV-001); do **not** commit it. The manifest
is also the standing home for any lasting preference about *how the user wants to work* that
isn't the product — address, tone, working style, no-gos: record such things here (Zone 3,
dated, openly with the user's knowledge) and act on them from then on.

## The finish: what changes now

Don't close with "here's what I understood" — close with what you'll **do**. In their
language:

1. **The delta** — 3–5 bullets, "here's what I'll do differently for you from now on",
   each traceable to an answer. E.g.: "You said *just fix it* → I'll repair small things
   and show you the result, not a lecture." · "Screen readers matter to your audience →
   everything I build gets checked for that before I call it done." · "Everything on
   normal, money on active → I say one sentence when something trips, and I tell you
   about every euro before it is spent." · "Your material goes through Moodle and the
   pupils use school iPads → I'll hand you files you can upload as they are, checked in
   Safari."
2. **A mini tour** — 3–4 things they can say next, in *their* words, matched to their
   goal: e.g. "add a new page for me", "check that everything still works", "help me
   publish this" — and that "what can you do?" (`/help`) always shows the full, current
   list.
3. **One line of ownership:** the manifest is their file, they can edit anything, and
   you'll keep the Inferred section up to date and suggest updates as you learn how they
   work — including any lasting preference about *them* (address, tone, working style, a
   no-go), which you note there openly and honor from then on.
4. **If `environment.agent_tool` came out of Round 4**, offer once — as a plain fourth
   point, not a nag — to write yourself an operating note for your own tool: "Shall I make
   myself a short operating note for my own tool, so I use what it can actually do? It's
   yours and it's optional." Follow [`directives/agent-adaptation.md`](../../../directives/agent-adaptation.md)
   if they say yes; a skip is fine and leaves no hole.
5. **If they want a portal of their own** and `kit.json` declares the capability
   `site:make-it-yours`, offer that as the first step — their name, start page and imprint
   in, the kit's sample content out, all undoable — and run the tool whose `provides` holds it
   (`--help` first).

If they were unsure which agent tool to use, point them at the agent-choice guide
(`docs/explanation/choosing-an-ai-agent.md`).

## Appending kit questions

After Round 5, if `kit.json` declares `onboardingExtraQuestions`, ask each one (same
one-at-a-time, skippable style) and record the answers in Zone 2 under a "Kit" note. These
are the kit's own additions — you don't hard-code them. Skip a kit question whose answer
the conversation already gave (the portal's languages often come up in Round 1).
If the portal languages include one the kit doesn't ship, say it is routine (setup measured
at about 10 minutes; translating is the real work) and point to `docs/how-to/add-a-language.md`.

## Boundaries

- Writing/overwriting `profile/USER-MANIFEST.MD` is a local, reversible (Green) action — no
  confirmation needed, but tell them you're saving it.
- Never put real personal data anywhere but the gitignored profile. Never commit it.
- This skill only interviews and writes the manifest. It doesn't build anything — hand off
  to the user's chosen next step. The one exception is the git safety net from Round 4,
  and only with the user's explicit yes.
