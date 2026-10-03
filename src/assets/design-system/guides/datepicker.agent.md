---
id: datepicker
title: DatePicker
category: library
tags: [form, date, overlay]
summary: A text field welded to a calendar dialog — which half your users can actually reach, and which strings the kit never translates.
related: [text-inputs, forms, select, i18n-localization]
covers: [datepicker]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Selection modes, month view, the inline form and why it is not a dialog, the button bar, and the time picker
  usage: The control-choice table, naming and clearing Do/Don't pairs, and the shape to copy
  design: Aura token table, the kit and Aura focus rings, the today fill, contrast rows, narrow-screen behavior, reduced motion
  development: Grid keyboard map, inert and dead inputs, the keyboard route into the panel, value shapes, checklist
  i18n: Which string comes from where, the date vocabulary built from the kit's date locales, format and week-start fallbacks
  history: Document changelog
---

## When to use
- A day chosen in relation to other days — weekday alignment, "the Friday after next".
- A start and an end together: `selectionMode="range"` keeps the two ends comparable.
- A month or quarter: `view="month"`. A time of day alone: `[timeOnly]="true"`.

## When not to use
- A date the person knows by heart (a birth date) → plain fields or a masked text input.
- A field filled by right-click paste, autofill, or a script — such a value never reaches the model (see Pitfalls).

## Key API
`DatePickerModule` from `@openng/optimus-ui/datepicker`; selector `p-datepicker`. A `ControlValueAccessor` with `size`, `variant`, `fluid`, `required`, `invalid`, `disabled`, `name`.
- Naming: `inputId` + `<label for>`, or `ariaLabelledBy` / `ariaLabel`; `iconAriaLabel` names the trigger button only.
- Shape: `selectionMode` (`'single'` | `'multiple'` + `maxDateCount` | `'range'`), `view` (`'date'` | `'month'` | `'year'`), `dataType` (`'date'` | `'string'`), `timeOnly`, `inline`.
- Bounds: `minDate`, `maxDate`, `disabledDates`, `disabledDays`, `defaultDate`.
- Chrome: `showIcon` + `iconDisplay` (`'button'` default | `'input'`), `showButtonBar`, `showClear`, `numberOfMonths` + `responsiveOptions`, `touchUI`, `appendTo`.
- Time: `showTime`, `showSeconds`, `hourFormat` (`'24'` default).
- Behavior: `showOnFocus` (default true), `focusTrap` (default true), `dateFormat`, `firstDayOfWeek`.
- Outputs: `onSelect`, `onInput`, `onClear`, `onClose`, `onShow`, `onMonthChange`.

## Accessibility
- **`<label for>` works.** The trigger is a real `<input type="text" role="combobox">` with `[attr.id]="inputId"`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` (`openng-optimus-ui-datepicker.mjs:3287-3325`, Optimus UI 2.0.2).
- **The keyboard route into the calendar is `showOnFocus` or the trigger button — nothing else.** No Alt+ArrowDown; ArrowDown is guarded by `this.contentViewChild` (`:1808`), which exists only once the overlay is open.
- The grid handles arrows, `Enter`/`Space`, `PageUp`/`PageDown`, `Home`/`End`, `Esc` (`onDateCellKeydown`, `:1831-1990`); `Tab` cycles within the panel while `focusTrap` is on (`:562`); off, `Shift+Tab` on the first element leaves the panel open (`:2282-2293`).
- **A day cell announces its bare number.** `[attr.aria-label]="date.day"` (`:3477`); the selection live region repeats it (`:3496-3498`). No `aria-current`, `aria-selected`, or `aria-disabled` in the bundle; the focusable `<span>` in the `role="grid"` table has no role (`:3459`, `:3479`).
- **`showClear` is mouse-only** — an `<svg>` with `(click)`, no tabindex, role, or name (`:3326-3331`). The button bar's Clear and Today are real `p-button`s (`:3719`, `:3732`).
- The field is a `pInputText`: its `CONTRAST.MD` rows and the `--semantic-red-fg` invalid edge apply. The kit's 2px ring covers field, trigger, cells, and panel buttons; in-field icon `--text-color-secondary`, trigger edge `--control-border` (≥ 3.74:1). Ungated: the panel.
- Panel motion times itself from computed CSS durations; the kit's `prefers-reduced-motion` block cuts it.

## Pitfalls
- **`[firstDayOfWeek]="0"` cannot force Sunday.** `this._firstDayOfWeek || this.getTranslation(…)` (`:2827-2828`); `dateFormat` has the same `||` shape (`:2824-2825`).
- **A value that arrives without a keydown never reaches the model.** `isKeydown` is set only in `onInputKeydown` (`:1807`) — paste by mouse, drag-and-drop, and autofill leave text the form value lacks.
- There is no `locale` input (`:947`, `:959-961`); the vocabulary comes from the Optimus config.
- `iconAriaLabel` lands only with `showIcon` + `iconDisplay="button"`; `'input'` renders a click-only `<svg>` (`:3351-3356`).
- Overlay clipped by an `overflow: hidden` ancestor → `appendTo="body"`, then re-check the dialog's focus scope.

## Sources
- W3C APG — Date Picker Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/ — what a grid should announce.
- WAI-ARIA 1.2 — `grid`: https://www.w3.org/TR/wai-aria-1.2/#grid — what cells must carry.
- WCAG 2.2 — Non-text Contrast (1.4.11): https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 the selected chip owes the panel.
- MDN — `Intl.DateTimeFormat`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat — per-language month and weekday names.
- PrimeNG — DatePicker: https://primeng.org/datepicker — the upstream v21 API these props come from.

## Semantic mapping
| Intent | Props |
| --- | --- |
| A single day, both input methods open it | default; keep `[showOnFocus]="true"` |
| An explicit trigger for keyboard users | `[showIcon]="true"` + `iconDisplay="button"` + `iconAriaLabel` |
| Start and end in one control | `selectionMode="range"` |
| Month or quarter | `view="month"` + a `dateFormat` without a day |
| Emptying reachable by keyboard | `[showButtonBar]="true"` |

## Rules
- MUST: a visible label via `inputId` + `<label for>`, and the expected format as text beside the field, not in the placeholder.
- MUST: leave a keyboard route into the panel — `showOnFocus` on, or `showIcon` + `iconDisplay="button"`.
- MUST: on every language change push the date vocabulary through `Optimus.setTranslation` (the kit's `syncAriaStrings` covers `aria` only): month and weekday names from `Intl.DateTimeFormat(dateLocaleFor(lang))` (`src/app/utils/date-locale.ts`), `dateFormat` `'mm/dd/yy'` for en (07/15/2026) and `'dd.mm.yy'` for de (15.07.2026) — `yy` is the four-digit year (`:2882-2883`) — and `firstDayOfWeek` 0 / 1.
- MUST NOT: rely on the `showClear` icon as the only way to empty the field.
- SHOULD: `showButtonBar` on optional dates; `touchUI` on phone-sized viewports (no built-in breakpoint); `appendTo="body"` inside scroll containers.
- NEVER: bind `0` to `firstDayOfWeek` and expect Sunday; assume a mouse-pasted date reached the model.

## Default snippet
```html
<!-- labels() is a computed() map resolved through the kit's TranslationService -->
<label class="field-label" for="invoice-date">{{ labels().invoiceDate }}</label>
<p-datepicker
  inputId="invoice-date"
  [showIcon]="true"
  iconDisplay="button"
  [iconAriaLabel]="labels().openCalendar"
  [showButtonBar]="true"
  [minDate]="today"
  [(ngModel)]="invoiceDate" />
<p class="hint">{{ labels().dateFormatHint }}</p>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
