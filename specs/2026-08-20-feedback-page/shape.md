# Feedback page (`/feedback`) — shape

**Status:** implemented · **Date:** 2026-08-20

Shipped: `src/app/pages/feedback/feedback.component.ts` (+ spec), routed at `/feedback`
and listed in `TIER_1_ROUTES`.

## What

A routed portal page where a visitor writes a short message to the people who run the
site: an optional name, an optional e-mail, a category, the message itself, and a consent
tick. It is the long-form sibling of the existing feedback FAB dialog
(`src/app/components/shared/feedback-dialog.component.ts`) — the dialog interrupts a page,
this one *is* a page, reachable from navigation and by URL.

## Why a second surface at all

The dialog is bound to `FeedbackService`, which posts to
`environment.feedback.endpoint`. The default kit ships that endpoint empty, so the dialog
is not even registered as a FAB — a visitor of a fresh kit has no way to say anything. The
page fills that hole without a backend, and doubles as the kit's worked example of a
form with per-field validation and a full submit state machine (the dialog validates too,
but only enough to decide whether its one button is enabled).

## In scope

- Route `/feedback`, page id `fdbk`, nav group `portal` (next to Impressum / Accessibility).
- Fields and their rules:
  | Field | Required | Rule |
  |---|---|---|
  | Name | no | free text, trimmed, ≤ 80 chars |
  | E-mail | no | if non-empty it must match `…@….…` |
  | Category | yes (defaulted) | one of `praise` · `bug` · `feature` · `general` |
  | Message | yes | ≥ 20 and ≤ 2000 chars after trimming, told rather than cut off |
  | Consent | yes | must be ticked, never pre-ticked (checkbox guide) |
- Submission through a new `FeedbackInboxService`: artificial latency, then a write to
  `localStorage`. Idle → sending → sent (or → error) with the same shape a network call
  would have, so swapping in a real endpoint later touches one service and no template.
- The stored messages are listed on the page, with a "delete everything" action.
- All copy in the existing `feedback.*` i18n namespace, under `page.*`, in all four
  language variants (`de`, `en`, `de-easy`, `en-easy`).

## Explicitly out of scope

- Any network call, endpoint, or backend contract. `docs/how-to/add-a-backend.md` already
  owns that story; this page names the seam and stops.
- Touching `FeedbackService` or the FAB dialog. Two surfaces, two validation rules
  (the dialog lets `praise` through with no message at all); merging them would change
  the dialog's behaviour for no gain here.
- Rating, screenshot, honeypot, metadata collection — the dialog's extras. The page asks
  for the least it needs (PRIV-002).
- A sitemap entry. A form has nothing to rank; the page is prerendered (see below) but not
  advertised to crawlers.

## Decisions worth recording

1. **`localStorage`, not an in-memory stub.** A stub loses everything on reload and would
   make "sent" a lie. Local persistence lets the sent state survive a refresh, which is
   what makes the page behave like a real submission end to end.
2. **Nothing leaves the browser, and the page says so.** The privacy note is not
   boilerplate — it is the accurate description of what happens, and it is what makes
   storing an e-mail address defensible at all (PRIV-002, PRIV-004). PRIV-005 is met by
   the delete-all button; the store also keeps at most 50 entries.
3. **The error state is real, not random.** No dice roll on submit. The service fails when
   the write genuinely fails — `localStorage` disabled, private mode, quota — and the page
   renders that failure inline. A simulated random failure would train the user to retry
   through a lie.
4. **Prerendered (T1), not in the sitemap.** `scripts/generate-prerender-routes.js` says
   why every statically visible page belongs in `TIER_1_ROUTES`: prerendering is how
   `build:prod` proves the page survives Node SSR. That check is worth more here than
   anywhere, because the page touches `localStorage`.
5. **Signals + `[ngModel]`/`(ngModelChange)`, not reactive forms.** `ReactiveFormsModule`
   appears nowhere in `src/app/` outside the dev workshop; the design-system snippets
   use `formControlName`, but QUAL-005 (match the surrounding code) wins over a snippet.

## Standards this answers to

By reference, not copied — `base/standards/`:

- `A11Y-001`, `A11Y-004`, `A11Y-006` — label every control, `:focus-visible` on every
  interactive element, errors carried as text (not colour) and wired with
  `aria-describedby`, submit state announced in a live region.
- `A11Y-005` — `de-easy` / `en-easy` copy authored alongside `de` / `en`.
- `PRIV-002`, `PRIV-004`, `PRIV-005` — see decision 2.
- `PRIV-001` — the shipped i18n placeholders use no real person's data.
- `QUAL-004` — the validation rules and the store are unit-tested; the component test
  drives the form through invalid → valid → sent.
- `QUAL-005`, `QUAL-006` — reuse the existing `feedback.*` namespace and the kit's own
  `app-page-header` / `app-standard-container` / `app-article` shells rather than new
  chrome.
