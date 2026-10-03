# Progress page (`/progress`) — shape

**Status:** implemented · **Date:** 2026-08-24

Shipped: `src/app/pages/progress/progress.component.ts` (+ spec), routed at `/progress`
and listed in `TIER_1_ROUTES`.

## What

A routed portal page that answers one question: *how far have I got through the content
this kit ships?* One row per topic (the kit's example articles and its example demo), each
with a status — **not started · in progress · done** — and, above the list, a compact
summary: how many topics sit in each status and what share of the individual steps is
finished.

## Why

The kit already records progress: `app-quiz-container` writes a completed quiz id and
`app-checkpoint` writes a completed checkpoint into `UserProgressService`, which persists
to `localStorage`. Nothing ever reads that back as an overview. A learner can finish six
quizzes and has no page that says so; an author extending the kit has no worked example of
a read-only view over stored progress. `/learn` shows the *catalogue*, not the learner's
own standing in it.

## In scope

- Route `/progress`, page id `prgs`, nav group `portal` (next to Settings and Feedback).
- Topics = every visible entry of `articles/index.json` plus every visible entry of
  `demos/index.json` — the content the kit actually ships, resolved through
  `ArticlesService` / `DemosService` rather than a second copy of the list.
- Per topic: title (translated), kind, status, and `completed / total` steps.
- Summary: counts per status plus overall step completion as a percentage.
- Four rendered states in one region: **loading · error · empty · ready**, following the
  container-announces / skeletons-are-decoration pattern from the `skeleton` guide.
- Copy in a new `progress.*` i18n namespace, in all four variants (`de`, `en`, `de-easy`,
  `en-easy`), plus `app.nav.progress`.

## Explicitly out of scope

- Writing progress. The page reads; the quiz and checkpoint components stay the only
  writers. No "mark as done" button.
- Touching `UserProgressService`, `LearningPathService`, or `learning-paths.json`. Changing
  what a path counts as complete would move numbers on `/learn` for no gain here.
- A backend. `docs/how-to/add-a-backend.md` owns that story; this page names the seam.
- A sitemap entry. A personal progress view has nothing to rank.
- Per-row progress bars — the `progress` guide's "NEVER: render one indicator per row of a
  collection".

## Decisions worth recording

1. **The milestone catalogue lives in the service, and duplicates data — knowingly.**
   Status needs to know what "done" means per topic: which quiz id, which checkpoint key.
   `learning-paths.json` already carries exactly that for **six of the eight** topics, as
   step `parts` under the field names `checkpointStorageKey`/`checkpointId`. It does not
   carry it for the other two: `seed-article-1` ships `"parts": []` and the example demo
   belongs to no path. Deriving would therefore cover three quarters of the page and leave
   the rest unrepresentable. The components hold every id, but only as template attributes
   nothing can read at runtime. So the catalogue is written out once in
   `LearningProgressService` — with the duplication named rather than argued away.

   Two tests hold it in place, and the second is the important one: the first asserts the
   ids are exactly those the shipped content indexes contain (catches a topic nobody wrote
   a line for), the second that the six overlapping entries still say the same thing as
   `learning-paths.json` (catches a renamed checkpoint key — the failure that would leave
   `/learn` correct and this page reporting "not started" forever).

2. **Milestones are typed non-empty.** `readonly [Milestone, ...Milestone[]]` — every topic
   has at least one, so "zero steps" is unrepresentable rather than guarded against
   (QUAL-004: no defensive guards for inputs that can't occur).

3. **The error state is a real failure, not a dice roll.** Both content indexes are fetched
   over HTTP by services the app already uses. A failed fetch — offline, blocked request,
   an index missing from a deploy — surfaces as the error branch with a retry. The retry
   genuinely re-fetches: both services drop their cache on error precisely so a later
   subscriber is not served the stored failure forever. No simulated random failure; the
   `/feedback` page made the same call for the same reason.

4. **The empty state is reachable in a starter kit.** This is a kit meant to be forked and
   stripped. An author who deletes the seed content leaves both indexes as `[]`, and the
   page then has nothing to list. That is the empty branch — argued from the data flow, not
   invented.

5. **Latency is simulated, and injectable.** `PROGRESS_LOAD_LATENCY_MS` (default 700 ms)
   stands in for the round-trip a real progress endpoint would cost, so the loading state
   is a state the page genuinely passes through rather than a branch nobody ever sees.
   Tests set it to 0. Same shape as `FEEDBACK_SUBMIT_LATENCY_MS`.

6. **The load starts in `afterNextRender`, never at construction.** The page is prerendered
   (T1), and the stored progress lives in `localStorage`. Reading during bootstrap would
   make the first client render disagree with the server markup and hydration would throw
   the DOM away. The server therefore renders the loading branch; the browser takes it from
   there. This is also what makes the loading state honest under SSR.

7. **A plain `<table>`, not `p-table`.** The `table` guide's own test: `p-table` earns its
   state machinery only when sorting, selection or paging is real. None is. Eight rows of
   three columns are a plain table with a caption.

8. **Prerendered (T1), not in the sitemap.** Same reasoning as `/feedback`: prerendering is
   how `build:prod` proves the page survives Node, which matters most on a page that
   touches stored user data.

9. **The page says when the numbers are zero for a reason.** `UserProgressService` honours
   a "disable progress tracking" setting: with it on, it keeps only achievements and strips
   quizzes and checkpoints on every write. The page would then read 0 % and "not started"
   for every topic, permanently, while its own footnote said progress is being stored here.
   That is a falsehood, so `trackingDisabled` travels with the report and the page states
   it plainly above the storage note (QUAL-007 in the UI, not just in reports).

10. **The live region is a sibling of the branches, not a wrapper around them.** The
    `skeleton` guide asks for `role="status"` + `aria-busy` on *the region being replaced*.
    Followed literally here that region is the whole overview, so every arrival would read
    the entire table aloud. The kit's own `content-hub-template` already resolved this the
    other way — a small `sr-only role="status" aria-live="polite" aria-atomic="true"` block
    carrying one sentence per branch, next to the visual content — and this page follows
    the kit (QUAL-005). Four states, four sentences: loading, failed, empty, loaded.

11. **A retry does not tear down the branch the visitor is standing on.** The error branch
    stays mounted for the whole reload, marked `aria-disabled` with a spinner, and
    `reload()` ignores further presses. The obvious alternative — swap to the loading
    branch, then move focus when it settles — drops focus on `<body>` for the length of the
    wait, and `[disabled]` on a focused button does the same thing. Focus only moves when
    the reload actually replaced what was there (to the topic heading, or the empty note).

**Known and accepted:** `delay()` does not delay errors, so a failing load skips the
skeleton and goes straight to the error branch. The loading state is a state the page
genuinely passes through on the success path; on the failure path it is effectively
instant. Nothing is lost by it, and inventing a wait before bad news would be theatre.

## Standards this answers to

By reference, not copied — `base/standards/`:

- `A11Y-001` — the retry button and every topic link are keyboard-reachable; focus is
  handed on explicitly after a state swap the user asked for, so a keyboard user is not
  dropped on `<body>`.
- `A11Y-002` — every icon in the table and the summary is decorative and marked
  `aria-hidden`; the meaning is in the text next to it.
- `A11Y-006` — status is a word in the tag's own `value`, never the severity colour alone.
- `A11Y-005` — `de-easy` / `en-easy` copy authored alongside `de` / `en`.
- `PRIV-002`, `PRIV-004` — the page reads what is already stored and adds nothing; it says
  plainly that the data never leaves the browser and links to Settings for deletion, which
  is where the kit's existing delete-everything action lives (PRIV-005).
- `QUAL-004` — the status rules, the summary arithmetic and the catalogue-coverage check
  are unit-tested; the component test drives loading → ready, loading → error → retry, and
  the empty branch.
- `QUAL-005`, `QUAL-006` — reuse `ArticlesService` / `DemosService` / `UserProgressService`
  and the kit's own `app-article` / `app-page-header` / `app-standard-container` /
  `app-stat-card` shells rather than new chrome.
