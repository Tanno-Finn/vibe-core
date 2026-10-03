<!-- base -->
# watch: privacy — playbook

Data about real people: whether the project is about to collect, store, or hand over more
of it than anyone intended. Tuned by `watch.privacy` in the user manifest; the level
semantics live in [stewardship](../stewardship.md), not here. The bar itself is
[PRIVACY](../../base/standards/PRIVACY.md) — this playbook says when and how the agent
raises it, and never replaces it.

## Why this matters (the plain-words pitch)

**The moment real people visit your site or appear in your project, data about them exists
— and most of the time nobody decided that it should.**

An embedded video calls home the second the page opens, before anyone clicks play. A
typeface loaded from someone else's server hands that server every visitor's address and
what page they were on. A measurement tool follows people from page to page. Real names
slip into test data because they were the easiest names to hand. None of that was chosen;
it arrived as a side effect of a convenience.

There are laws about this — in Europe the GDPR — but the more useful frame is simpler:
trust. Someone building a page for relatives, for pupils, or for customers does not want
to be quietly collecting data about them, and would be embarrassed to learn they were.
Almost every privacy problem in a small project is an accident, which is exactly the kind
that can be caught while building, at the moment the convenience is added, for the cost of
one sentence.

Two honesties belong in the same breath. This is not legal advice and never will be — the
agent can name a risk in plain words and say what a data-frugal version would look like,
but a real legal question needs a real lawyer. And "collect nothing" is a genuine answer:
data that was never gathered cannot leak, cannot be requested, and needs no consent
banner.

## Radar — what trips it

Evidence, not vibes: name the file and line, or the count.

**While working** (fires in the moment, every level for the hard rules — PRIV-001, PRIV-004,
and PRIV-006 do not go quiet):

- Something is about to be embedded that loads from a host outside the project: a video,
  a map, a typeface, a script, an icon set. Any new external URL under `src/` is both a
  security and a privacy finding — this kit ships with **zero** external requests, and
  today it declares no `@font-face` and links no font host at all (`src/styles.scss`).
  Losing that property is a decision, not a detail.
- Real personal data appears anywhere tracked: names, email addresses, identifiers, or
  free text about identifiable people, in code, in test fixtures, in content, in a commit
  message (PRIV-001, hard). Synthetic examples carry the same lesson with none of the risk.
- Something is added that sends user content to a third party — an interface call, an
  upload, an error reporter. It counts even when it "just goes to an API" (PRIV-004, hard).
- Analytics, a measurement pixel, or any page-to-page tracking is added, or an existing one
  is switched from off to on by default. Off by default and consent-gated is the shape
  (PRIV-003); the kit's own consent state lives in
  `src/app/services/privacy-consent.service.ts`.
- A new field is added to something the user fills in, or to something stored in the
  browser, that the feature does not actually need (PRIV-002). The question is not "is this
  allowed" but "does anything break if we simply don't ask for it".
- Anything touching pupil or child data, in an education context, is a hard stop, not a
  question of style (PRIV-006): no automatic processing, storage, or transmission without
  an explicit, informed human decision.
- A page is about to be made public that was not meant to be found. "Findable" and
  "public" are the same thing; this is a privacy finding regardless of the findability
  level.

**At natural pauses** (accumulate, raise at a pause, `normal` and above):

- The list of things stored in the visitor's browser has grown — which keys, set by what,
  and whether each one still earns its place (the registry in
  `src/app/utils/storage-keys.ts` lists every key; a key written but missing there is
  itself a finding, because reset and the privacy page read from that list).
- Storage that has no way to be cleared, or content kept longer than the feature needs
  (PRIV-005).
- The project has become something that needs a plain statement of what it collects — and
  there isn't one, or the one that exists no longer matches what the code does.
- Screenshots, logs, or example data committed during the session that contain someone
  real.

**On `quiet`:** the soft half stops — storage housekeeping, minimization nudges, statement
drift. The hard rules do not move: personal data in the repo, user content leaving to a
third party, pupil data, and anything private about to become public are said at every
level. Ask the user before assuming the softer half is unwanted; on this topic the usual
reason for `quiet` is "nothing here touches real people", and that is worth confirming
rather than inferring.

**On `active`:** additionally offer, at a pause, a full inventory pass — every outbound
request, every stored key, every place data enters, listed once so the user can see the
whole surface at a glance.

## Check-in — how to raise it

The shape, adapted to the moment — never read out as a template:

> *finding, with its location* — the video you want on the start page loads from an
> outside host, and it does that the moment the page opens, before anyone presses play.
> *what it costs, in plain words* — that host then learns the address of every visitor and
> which page they were on, and it usually sets a cookie; you would be collecting something
> you never chose to collect, and would probably have to say so on the page.
> *the options* — I can embed it as a click-to-play preview, so nothing reaches that host
> until someone actually starts the video (about fifteen minutes), host the file with the
> site if you have the rights to it, or embed it the normal way if that is fine with you.
> *then wait.* The user picks.

Cadence follows [stewardship](../stewardship.md): once per topic per session, at a natural
pause, never mid-task — with the standing exception that a hard finding interrupts, because
after the commit or the deploy it is no longer preventable. A waved-off soft nudge goes to
`OPEN-QUESTIONS.md` with the reason and does not come back until the facts change; a
hard-rule finding is stated once more, plainly, and recorded either way.

Before `/ship`, one short finding as part of the posture report, at every level: what
leaves the site and to whom, what is stored in the visitor's browser, whether anything
personal is in the repo, whether a statement about it exists and matches. Facts, counted.

## Paydown — how to actually fix it

The standard sets the bar; these are the moves that meet it.

1. **Embed data-frugally.** Replace a live third-party embed with a click-to-play preview:
   a local still image plus a play control, and the real embed inserted only after a
   deliberate click. Nothing reaches the outside host until the visitor decides. Where the
   rights allow it, hosting the file with the site removes the outside party entirely.
2. **Keep typefaces local.** A font loaded from an outside host reports every page view to
   that host. Ship the font files with the site, or use the ones the operating system
   already provides — which is what this kit does today: no `@font-face`, no font host,
   the stack resolves against what the device has.
3. **Synthetic test data, always.** Invented names, `example.com` addresses, made-up
   identifiers. Never a real address book, never a real customer export, never a screenshot
   of a real inbox — not even "just locally", because local is one `git add` from
   permanent (PRIV-001).
4. **Collect nothing by default.** Every field and every stored key has to justify itself:
   what breaks if it is not there? Prefer a value derived at the moment it is needed over
   one kept around. Where something must be stored, store it in the visitor's own browser
   rather than sending it anywhere, and say which key holds what.
5. **Measurement off until chosen.** Analytics ships off, is switched on only by an
   explicit choice, and the choice is revocable — the consent state and its keys belong in
   one place (`src/app/services/privacy-consent.service.ts`), not sprinkled across
   components. A build that sends nothing anywhere may need no banner at all; say so
   plainly rather than adding a ritual one.
6. **A way out.** Anything stored gets a way to be cleared, reachable by the person it
   belongs to, and anything kept has a reason for how long (PRIV-005).
7. **Say what you do, in the site's own words.** One short passage naming what is
   collected, by what, and why, kept in step with the code — a statement that has drifted
   is worse than none, because it is a promise the project is breaking.
8. **When it is about children, stop and ask.** In an education context, pupil data is a
   hard stop: no processing, storage, or transmission without an explicit, informed human
   decision (PRIV-006).

Order to work in when several are open: personal data already in the repo, then anything
sending data out, then default-on collection, then storage hygiene, then the statement.
That is the order of irreversibility.

## Limits

- **No legal advice, ever.** Name the risk in plain words, describe the data-frugal
  version, and say plainly that a binding answer needs professional advice. Never
  characterize anything as "compliant" or "legally fine".
- **Nothing silent.** Findings are said, options are offered, the user decides
  ([stewardship](../stewardship.md)). Removing an embed, dropping a field, or turning off
  a measurement tool is the user's call, not a side effect.
- **No relaxing the hard rules by watch level.** PRIV-001, PRIV-004, and PRIV-006 are hard;
  the level tunes talkativeness about the rest and nothing more. Softening an
  `[overridable]` rule happens in the open through `overrides/`, where the gate warns
  instead of blocking — never quietly.
- **No safety-tier changes.** This playbook never softens or triggers a Yellow or Red
  warning ([SAFETY](../../base/SAFETY.md)).
- **Never reproduce what was found.** A real name, address, or identifier discovered in the
  repo is reported by location and kind, not by value — not in the report, not in the
  commit message.
