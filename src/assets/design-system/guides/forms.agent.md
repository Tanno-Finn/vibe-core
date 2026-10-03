---
id: forms
title: Forms
category: foundations
tags: [forms, validation, errors, submit]
summary: Compose controls into a submit flow — a signal per field with a split ngModel binding, validation as a pure function whose errors gate on touched-or-submit, and an invalid state you compute yourself, because neither layer validates for you.
related: [text-inputs, input-labels, checkbox, select, button, feedback-messages, a11y-guidelines, i18n-localization]
covers: [autofocus]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: An error that waits for blur or submit, the invalid wiring on and off, three label hulls, pAutoFocus on revealed content, the submit machine
  usage: The field pattern part by part, the validation model, the four wrappers that sit around a control, and two Do/Don't pairs rendered both ways
  design: The formField tokens and the kit's re-pointed field edge, gated error-text contrast, what recolors an in-field label, and narrow screens
  development: The base-class contract, what required emits, how an error reaches its field, p-fluid's reach, initial focus with pAutoFocus, a checklist
  i18n: One key per field and rule, the required mark as text, expansion budgets for labels and errors, and why an in-field label has no room
  history: Document changelog, one line per version
---

## When to use
- Composing two or more controls into one submit flow.
- Deciding when and where a validation error renders.
- Wiring a label, a hint, and an error to their control.
- Deciding where focus goes when a form or its outcome appears — `pAutoFocus` included.

## When not to use
- One control's own API and states — that control's guide (`text-inputs`, `checkbox`, `select`, `button`).
- Message anatomy and transient outcome notices — `feedback-messages`.
- The focus-ring standard, accessible names, target sizes — `a11y-guidelines`.
- Focus inside a dialog — `dialog` (its `focusOnShow` owns the first focus).

## Key API
Two layers meet in a form; neither validates for you.

1. **Angular** — template-driven forms: `FormsModule`, one signal per field, bound split as `[ngModel]="v()" (ngModelChange)="v.set($event)"`. Validation is a pure function over the draft in a `computed()`; a `touched` set decides which complaints may render.
2. **Optimus UI** — every editable component inherits `required`, `invalid`, `disabled`, `name` (signal inputs) and the ControlValueAccessor plumbing from one base class (`openng-optimus-ui-baseeditableholder.mjs:11-56`). **`invalid` is a dumb boolean**: you compute it and bind it; it renders `p-invalid` and the invalid border (kit: `--semantic-red-fg`, gated). Optimus also ships its own `.ng-invalid.ng-dirty` border rule (`openng-optimus-ui-inputtext.mjs:16-22`) — see Pitfalls.
3. **`[pAutoFocus]`** (`@openng/optimus-ui/autofocus`, standalone directive `AutoFocus`) — one input, `pAutoFocus`. When truthy it focuses, from a `setTimeout`, the host's first focusable descendant, or the host itself (`openng-optimus-ui-autofocus.mjs:38-50`) — once per directive instance (`focused` flag, `:48`), browser only. Eighteen bundles embed it, most behind an `autofocus` input of their own (`p-select` binds `[pAutoFocus]="autofocus"`, `openng-optimus-ui-select.mjs:1707`); the rules below apply to those too.
4. Reference implementation: the feedback page (`src/app/pages/feedback/feedback.component.ts`).

## Accessibility
- A label per control: `label[for]` onto the rendered input's id (`inputId` on wrappers); a combobox host (select) takes caption plus `ariaLabelledBy`. `p-floatLabel` ships no label.
- `p-checkbox` has no describedBy input — use `[pt]="{ input: { 'aria-describedby': … } }"`.
- A submit attempt marks every field touched at once, so all errors show together.
- Autofocus skips everything above the field — heading, instructions, skip link — and opens a touch keyboard. Use it only on content the user's own action just revealed (SC 2.4.3).

## Pitfalls
- **Leaving the red border to `ng-invalid`.** Optimus's `.ng-invalid.ng-dirty` rule turns a control red on the first keystroke, before your gate, with no `aria-invalid` and no sentence. Bind `[invalid]`.
- **`p-message` as one field's error.** Its host is always a live region: four errors, four alerts. Use a plain node + `aria-describedby`.
- **An asterisk as the required marking.** `[pInputText]`/`[pTextarea]` have no `required` input, and only select, autocomplete, and datepicker derive `aria-required` from it.
- **`maxlength` as the only too-long defense.** It swallows keystrokes and makes the "too long" error unreachable.
- **`pAutoFocus` on a routed page.** The shell moves focus to `<main>` on every `NavigationEnd`; the directive's timer competes with it.
- **A bare `pAutoFocus` attribute.** It binds `''`, which the truthiness check at `:39` rejects — nothing is focused. Write `[pAutoFocus]="true"`.
- **`pAutoFocus` inside `p-dialog`.** The dialog focuses its first focusable after the enter transition (`openng-optimus-ui-dialog.mjs:620-627`, `:949-952`), after the directive. Order the content instead.

## Sources
- WCAG 2.2 SC 3.3.1 Error Identification: https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html — the error named in text, on the item.
- WCAG 2.2 SC 3.3.2 Labels or Instructions: https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html — what a placeholder label fails.
- WCAG 2.2 SC 2.4.3 Focus Order: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html — why focus may not skip the context.
- HTML Living Standard, autofocus: https://html.spec.whatwg.org/multipage/interaction.html#the-autofocus-attribute — the native attribute, honored only on insertion.
- Angular template-driven forms: https://angular.dev/guide/forms/template-driven-forms — the `NgModel` mechanics.

## Semantic mapping
| Intent | Mechanism |
| --- | --- |
| A field's value | one signal, bound split via `[ngModel]` / `(ngModelChange)` |
| May the error show | the touched-or-submitted gate |
| A failure of no single field | inline `p-message severity="error"` |
| Focus into content a click revealed | `[pAutoFocus]="true"` on its container |
| Focus after a branch swap or a submit | an explicit `.focus()` once rendered |

## Rules
- MUST: label every control — `label[for]`/`inputId`, or caption + `ariaLabelledBy` on a combobox host.
- MUST: put `novalidate` on the form — the browser's own bubbles are unstyled and untranslated — and ship field-anchored errors.
- MUST: bind `[invalid]`, `aria-invalid` and `aria-describedby` together, gated on touched-or-submit.
- MUST: move focus to whatever a branch swap put on screen, after it has rendered.
- MUST: announce the outcome once — live region plus moved focus, never a toast on top.
- MUST: bind `[pAutoFocus]="true"`, never the bare attribute.
- SHOULD: keep hard `maxlength` off free-text fields; count and complain instead.
- NEVER: autofocus on page load, in a dialog, or to jump to the first error.
- NEVER: color as the only error carrier.

## Default snippet
```html
<form (ngSubmit)="submit()" novalidate>
  <label for="fx-email">{{ t('form.emailLabel') }}</label>
  <input pInputText id="fx-email" type="email" name="email" autocomplete="email"
    [invalid]="shows('email')" [attr.aria-invalid]="shows('email')"
    [attr.aria-describedby]="shows('email') ? 'fx-email-error' : null"
    [ngModel]="email()" (ngModelChange)="email.set($event)" (blur)="touch('email')" />
  @if (shows('email')) {
    <small class="field-error" id="fx-email-error">
      <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
      {{ t('form.error.email') }}
    </small>
  }
</form>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
