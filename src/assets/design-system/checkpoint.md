---
name: Checkpoint
selector: app-checkpoint
tags: [checklist, progress, gamification, didactic]
status: documented
---

# Checkpoint (`app-checkpoint`)

## Purpose

A self-contained "did you get this?" learning checkpoint: a list of goal statements plus a single confirm/undo button. Completion state persists via `UserProgressService` — saved in the browser only once the visitor has agreed to progress storage, kept for the session before that (with a one-time migration from a legacy localStorage key) — and gives toast feedback on completion that says whether the progress was saved, plus a brief flash animation. It dispatches no DOM event: the host page hears about a completion through the `completed` / `uncompleted` outputs, and the `/progress` page reads it from `UserProgressService`.

## When to use

- End-of-section self-checks in a lesson or guide ("Can you explain X? Can you do Y?") where the reader marks the whole set as understood.
- Any place a persisted, ungraded completion marker (not a scored quiz) is needed, including one the `/progress` page counts as a step of a topic.

## When not to use

- Graded, right/wrong assessments with scoring and explanations — use `app-quiz-container`.
- A simple, non-persisted "key takeaways" list — use `app-takeaways-list`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `checkpointId` | `string` | `''` | Unique id within `storageKey`; persistence is a no-op if empty |
| `storageKey` | `string` | `''` | Storage bucket key (e.g. per-guide); persistence is a no-op if empty |
| `items` | `CheckpointItem[]` | `[]` | Goal list; each item is `{ text? }` or `{ textKey? }` |
| `titleKey` | `string` | `'checkpoint.title'` | i18n key for the header title |
| `headingLevel` | `2\|3\|4\|5\|6` | `3` | Heading tag for the title |
| `markCompleteKey` | `string` | `'checkpoint.markComplete'` | i18n key for the button label when incomplete |
| `completedLabelKey` | `string` | `'checkpoint.completedLabel'` | i18n key for the button label when complete |
| `toastTitleKey` | `string` | `'checkpoint.completed'` | i18n key for the success-toast title |
| `toastMessageKey` | `string` | `'checkpoint.progressSaved'` | i18n key for the success-toast message when the progress was saved |
| `toastNotSavedKey` | `string` | `'checkpoint.progressNotSaved'` | i18n key for the success-toast message when it was not (no progress consent) |
| `icon` | `string` | `'pi-list-check'` | PrimeIcon suffix for the header icon (not-completed state) |

**Outputs:** `completed: EventEmitter<string>` (emits `checkpointId`), `uncompleted: EventEmitter<string>`.

No content projection — goal text comes only from `items`.

## Example

```html
<app-checkpoint
  checkpointId="foundations"
  storageKey="neural-nets-guide-checkpoints"
  titleKey="guide.checkpoint.title"
  [items]="[
    { text: 'I can explain what a perceptron computes' },
    { text: 'I can describe why activation functions are non-linear' }
  ]"
  (completed)="onCheckpointCompleted($event)">
</app-checkpoint>
```

## Accessibility

- The action button has `aria-pressed` reflecting completion state and an `aria-label` that switches between the mark-complete/completed translations.
- Incomplete vs completed states are differentiated by both border **style** (dashed vs solid) and icon (circle vs check), not color alone.
- `prefers-reduced-motion` disables the completion flash and other transitions.
- The completion flash and toast are non-blocking, non-modal feedback — no focus is stolen from the toggle button.
