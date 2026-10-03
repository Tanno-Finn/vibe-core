---
id: selectbutton
title: Select Button
category: library
tags: [form, choice, segmented]
summary: Two to four exclusive options, all visible at once — and the four questions that keep it from being tabs, a switch, a radio group, or a select.
related: [select, toggleswitch, tabs, radiobutton, toolbar]
covers: [selectbutton]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, the canonical three-option case, multiple mode, custom segment content, sizes, fluid, disabled, and invalid
  usage: The four questions, the choice table against tabs/switch/radio/select, four rendered Do/Don't pairs, label wording
  design: Anatomy, the Aura token chain, what each visual style adds, how "pressed" is signaled, label and pill contrast, sizes, fluid, focus
  development: Inputs, the two outputs, forms without a form control, the dead tabindex and disabled state, A11y checklist
  i18n: Why no string comes from the library, label length as a width risk, rebuilding on a language change, RTL
  history: Document changelog
---

## When to use
- **2–4 short, mutually exclusive values** that fit one line at your narrowest width, applied on click.
- Seeing the whole set matters (Day / Week / Month).
- `[multiple]="true"` for a small set of independent filters.

## When not to use
- **Parallel views of one subject** → `p-tabs`.
- **One boolean applied immediately** → `p-toggleswitch`.
- **One boolean that must look like a button** ("Bold", "Mute") → `p-togglebutton`; a one-option group only adds `role="group"` and hides the child's `ariaLabel`/`onIcon`/`offIcon`.
- **A required field in a validated form** → a radio group (no `required`, no native submit value here).
- **5+ options, or labels that do not fit a row** → `p-select`; segments never truncate.
- **Actions** (Export, Delete) → `p-button`.

## Key API
`SelectButtonModule` from `@openng/optimus-ui/selectbutton`; a `ControlValueAccessor` (ngModel + reactive forms).
- `options` + `optionLabel` / `optionValue` / `optionDisabled`. Omit `optionValue` while `optionLabel` is set and the model receives the whole option object (`openng-optimus-ui-selectbutton.mjs:195-197`); add `dataKey` for object equality.
- **`allowEmpty` defaults to `true`** — clicking the pressed segment sets the model to `null` (`:217-222`). `unselectable` is its legacy inverse — a setter that writes `allowEmpty = !value` (`:103-106`) — use one.
- `multiple` (model becomes an array), `size` (`'small' | 'large'`), `fluid`, `disabled`, `invalid`, `autofocus`; `styleClass` is forwarded onto every child segment (`:316`) — prefer `class`.
- Naming: **`ariaLabelledBy` only** — there is no `ariaLabel` input, and the group binds none on its segments: it sets `onLabel`/`offLabel` to the option label (`:319-320`).
- Outputs `onChange` → `{ originalEvent, value }`, `onOptionClick` → `{ originalEvent, option, index }`; neither fires for a click that changes nothing. Slot: `<ng-template #item let-option>` (direct child; `{ descendants: false }`, `:415`).
- `required`/`name` are inherited but reach no attribute; `tabindex` is accepted and never applied.

## Accessibility
- Host is `role="group"` + `aria-labelledby` (`openng-optimus-ui-selectbutton.mjs:312`, host bindings); each option renders a `p-togglebutton` with `role="button"` and **`aria-pressed`** (`openng-optimus-ui-togglebutton.mjs:280`, host bindings) — **not** a radio, not `aria-checked`.
- **Name the group via `[ariaLabelledBy]`** at the visible caption (or `[attr.aria-label]` on the host).
- Keyboard: **`Enter` and `Space` only** (`openng-optimus-ui-togglebutton.mjs:107-118`). No arrow keys, no `Home`/`End` — SelectButton's roving-tabindex helper (`changeTabIndexes`, `:237`) is never called, so **every segment is its own tab stop**.
- Focus ring is per segment: the kit's one ring (`.p-togglebutton:focus-visible`, 2px `--primary-color-fg`, offset 2px; CONTRAST.MD `focus ring`).
- No library strings — neither component reads a translation config.

## Pitfalls
- `allowEmpty` left at its default on a required choice: one click on the pressed segment gives `null`.
- **Pressed = the inner pill**, painted by the kit's `.p-togglebutton` rule in `styles.scss`: `--primary-color-fg` pill, label `--surface-card`, on a `--surface-section` segment. Gated (`docs/generated/CONTRAST.MD`, "togglebutton & selectbutton"): pill vs segment ≥ 3.88:1 (Aura's was 1.10:1), pressed label ≥ 4.75:1, unpressed (`--text-color-secondary`) ≥ 4.64:1. Keep them; forced colors drop the fill.
- Every `html.style-<name>` block in `styles.scss` restyles `.p-togglebutton` (each segment): outline, radius, and press-in (`[data-p-disabled='false']:active`) in three styles, uppercase labels in blaupause.
- Options are tracked **by their label** (`:313`): duplicate labels collide, and a language switch rebuilds every segment and drops focus.
- `size` moves only the font-size; both paddings are identical at every size.
- **Disabled segments stay in the tab order.** The host writes `tabindex !== undefined ? tabindex : (!$disabled() ? 0 : -1)` (`openng-optimus-ui-togglebutton.mjs:280`), but `tabindex` defaults to `0` (`:177`), so the `-1` branch is dead. With **no `aria-disabled`** either (only `data-p-disabled`), focus lands on a segment that is silent and does nothing. The `togglebutton.disabled.*` tokens are inert (`:disabled` never matches the custom element); the fade is the global `.p-disabled`.
- `[invalid]` is a 1px outline only — no `aria-invalid`.

## Sources
- WAI-ARIA 1.2, `aria-pressed`: https://www.w3.org/TR/wai-aria-1.2/#aria-pressed
- APG Button, incl. toggle buttons: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- APG Radio Group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- APG Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WCAG 2.2 SC 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2 SC 1.4.3 Contrast Minimum: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Upstream SelectButton docs (Optimus forks PrimeNG): https://primeng.org/selectbutton

## Semantic mapping
| Intent | Props |
| --- | --- |
| Exactly one, always answered | `[allowEmpty]="false"` |
| A set of independent filters | `[multiple]="true"` |
| Visible caption exists | `[ariaLabelledBy]="'…-label'"` |
| Equal segments, fixed outer width | `[fluid]="true"` |
| Model holds objects | omit `optionValue`, add `dataKey` |
| Validation failed | `[invalid]="true"` + a visible message |

## Rules
- MUST: name the group — `[ariaLabelledBy]` at a visible caption, or `aria-label` on the host.
- MUST: `[allowEmpty]="false"` when the value is required; build `options` in a `computed()`; keep labels unique.
- MUST NOT: add `role="radiogroup"`; promise arrow keys; rely on the pressed pill as the only state signal.
- SHOULD: 2–4 noun-shaped labels budgeted for the longest language; `[fluid]` inside a bounded container; remove an option rather than disable it.
- NEVER: relabel a segment to express its own state.

## Default snippet
```html
<!-- labels()/periodOptions() are computed() off the TranslationService -->
<span class="field-label" id="period-label">{{ labels().period }}</span>
<p-selectbutton
  [ariaLabelledBy]="'period-label'"
  [options]="periodOptions()"
  optionLabel="label"
  optionValue="value"
  [allowEmpty]="false"
  [(ngModel)]="period" />
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
