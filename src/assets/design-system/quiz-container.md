---
name: Quiz Container
selector: app-quiz-container
tags: [quiz, interactive, assessment, didactic]
status: documented
---

# Quiz Container (`app-quiz-container`)

## Purpose

A full single/multiple-choice quiz engine wrapped in `app-standard-container`: per-question progress bar, optional per-question hints, answer-safe Fisher-Yates shuffling of questions and/or options (deferred until after hydration to avoid SSR mismatches), scoring with a results-review screen (per-option correct/incorrect/missed indicators), optional persistence + dynamic container styling (`warning` until done, `success` once completed) keyed by `quizId`, a printable worksheet with an upside-down (anti-spoiler) answer key, and screen-reader live-region announcements for navigation and completion.

## When to use

- A graded knowledge check at the end of a lesson or guide, with explanations and a final score.
- Any quiz that should remember completion across visits (set `quizId`) or feed results into gamification/achievements via the emitted events.

## When not to use

- An ungraded, ticklist-style self-check ("I understand X") — use `app-checkpoint`.
- A single standalone question with no navigation, scoring, or results screen — a plain radio/checkbox group is simpler.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `questions` | `QuizQuestion[]` | `[]` | `{ id, question, type: 'single'\|'multiple', options: QuizOption[], explanation?, points?, hint? }` |
| `showScore` | `boolean` | `true` | Shows the running score during the quiz |
| `shuffleQuestions` | `boolean` | `false` | Shuffles question order (post-hydration) |
| `shuffleOptions` | `boolean` | `true` | Shuffles option order per question; answer-safe (correctness travels with option id) |
| `quizId` | `string` | `''` | Enables persisted completion (saved in the browser only with progress consent, kept for the session before that) + dynamic warning/success container styling |
| `type` | `ContainerType` | `'primary'` | Container accent when `quizId` is not set |
| `title` / `titleKey` | `string?` | `''` | Container header title |
| `subtitle` | `string?` | — | Optional subtitle line rendered under the container title, above the progress bar |
| `icon` | `string` | `'pi pi-question-circle'` | Container header icon (overridden to a check icon once completed) |

**Outputs:** `quizCompleted: EventEmitter<QuizResult[]>` (full results on finish), `questionAnswered: EventEmitter<QuizResult>` (per question, on each "Next" click).

`QuizOption`: `{ id?, text, isCorrect }`. IDs are auto-generated if omitted.

No content projection — questions are fully data-driven via `questions`.

## Example

```html
<app-quiz-container
  quizId="neural-nets-basics"
  title="Quick check: Neural Network Basics"
  [questions]="[
    {
      id: 'q1',
      question: 'What does an activation function introduce into a neural network?',
      type: 'single',
      options: [
        { id: 'a', text: 'Non-linearity', isCorrect: true },
        { id: 'b', text: 'More parameters', isCorrect: false }
      ],
      explanation: 'Without non-linear activations, stacked layers collapse into one linear function.'
    }
  ]"
  (quizCompleted)="onQuizDone($event)">
</app-quiz-container>
```

## Accessibility

- Each question's options are grouped in a `<fieldset>` with a visually-hidden `<legend>` and `aria-labelledby` pointing at the question heading.
- Options use a composite-widget pattern: the native radio/checkbox has `tabindex="-1"` while the surrounding `.option-item` div carries `tabindex="0"` and Enter/Space handlers, so the whole row is one focus stop.
- Two `aria-live` regions (`polite` for question navigation, `assertive` for quiz completion) announce state changes to screen readers.
- Results review marks correct/incorrect/missed-correct with both color and icon/border style, not color alone.
- Print stylesheet renders a worksheet with checkboxes and a 180°-rotated answer key so it can't be read at a glance (anti-spoiler).
