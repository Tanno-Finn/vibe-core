---
id: text-inputs
title: Text Inputs
category: library
tags: [form, text, input]
summary: Free text the system cannot enumerate — one line, many lines, or welded to an addon, and the boundaries between the three.
related: [select, autocomplete, inputnumber, button, constrained-inputs, input-labels]
covers: [inputtext, textarea, inputgroup, inputgroupaddon, iconfield, inputicon, fluid]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, the size scale, a growing textarea, input groups, a full-width field, and live icon, mask, password, OTP, and key-filter fields
  usage: The control-choice table, one line vs many, Do/Don't pairs, when an input group is wrong, and where each neighbor control stops
  design: Anatomy, the shared Aura token family, the per-theme state matrix, placeholder contrast, group and icon-field geometry, narrow screens
  development: Inputs and outputs, forms without a ControlValueAccessor, CSS properties, pitfalls, the icon-field and fluid API surface, keyboard, A11y
  i18n: Every string is yours except the password strength labels, length and layout, input method and locale, RTL
  history: Document changelog, one line per version
---

## When to use
- Free text the system cannot enumerate: a name, a title, a search term, a comment.
- One line when the value cannot contain a line break; many lines when it can — an address, a description, feedback.
- `p-inputgroup` only to weld a unit or action onto a field's edge: layout, not semantics.
- `p-iconfield` + `p-inputicon` to sit a **decorative** glyph inside one field's own box — a magnifier, a currency mark.
- `p-fluid` to make every field a template declares span its container, instead of repeating `[fluid]` on each.

## When not to use
- A closed list → `p-select`; a long or remote one → `p-autocomplete`. A measured number → `p-inputnumber` (locale separators, min/max); an approximate one → `p-slider`. A yes/no → `p-checkbox` or `p-toggleswitch`. A date → `p-datepicker`; headings or links → `p-editor`.
- A secret, a fixed format, a one-time code, or a keystroke filter — `p-password`, `p-inputmask`, `p-inputotp`, `[pKeyFilter]`: see the constrained-inputs guide, which carries their contract.
- `p-inputgroup` for a form's submit button, for two independent controls side by side, or around a `pTextarea` (the group's flex rule names `.p-inputtext`, so a textarea will not grow).
- `p-iconfield` for anything the user clicks (see Pitfalls), around a `pTextarea`, or as a second trailing icon on `p-password`. `p-fluid` where only one field must stretch — `[fluid]` on that field is cheaper and local.

## Key API
`InputTextModule` (`@openng/optimus-ui/inputtext`), `TextareaModule` (`.../textarea`), `InputGroupModule` + `InputGroupAddonModule`, `IconFieldModule` (`.../iconfield`) + `InputIconModule` (`.../inputicon`), `FluidModule` (`.../fluid`) (Optimus UI 2.0.2).
- Both are **directives on native elements**, not `ControlValueAccessor`s: `ngModel`/`formControlName`, `<label for>`, native `disabled`/`readonly`/`required` and autofill behave as on a bare `<input>`; anything they do not name is a native attribute (`type`, `placeholder`, `rows`, `maxlength`, `autocomplete`, `inputmode`).
- Shared inputs: `pSize` (`'small' | 'large'`), `variant`, `[fluid]`, `[invalid]`. Textarea adds `autoResize` and `(onResize)`; InputText emits nothing — use native `(input)`/`(blur)`.
- PrimeNG 22 dropped the camelCase aliases; Optimus (v21 code) accepts them again — `p-inputgroup, p-inputGroup, p-input-group` (`openng-optimus-ui-inputgroup.mjs:106`) and `p-inputgroup-addon, p-inputGroupAddon` (`openng-optimus-ui-inputgroupaddon.mjs:55`). All-lowercase `<p-inputgroupaddon>` is no selector: NG8001.
- **`p-iconfield` and `p-inputicon` are content wrappers**: no value, no `ControlValueAccessor`, no outputs, template a bare `<ng-content>`. IconField takes `iconPosition` (`'left' | 'right'`, default `'left'` — inert, see Pitfalls), `styleClass` (deprecated since v20, use `class`) and `hostName`; InputIcon declares only `styleClass` and `hostName` (`openng-optimus-ui-iconfield.mjs:71`, `openng-optimus-ui-inputicon.mjs:43`). Both extend `BaseComponent` (`usesInheritance: true`), so `dt`, `unstyled`, `pt` and `ptOptions` bind on either tag as well (`openng-optimus-ui-basecomponent.mjs:428`). Neither is a `fluid` participant.
- Selector asymmetry: `p-iconfield, p-iconField, p-icon-field` all resolve, the icon element **only** `p-inputicon, p-inputIcon`. `<p-input-icon>` matches nothing and fails the template compile (NG8001) — the same trap as all-lowercase `<p-inputgroupaddon>`.
- **`p-fluid` declares no inputs of its own** (`openng-optimus-ui-fluid.mjs:52`; it inherits `dt`, `unstyled`, `pt`, `ptOptions` from `BaseComponent` like every component here) and its `p-fluid` class is read by no stylesheet in the library. It works through DI: a field injects it `{ optional: true, host: true, skipSelf: true }` and resolves `hasFluid` as `fluid() ?? !!pcFluid` (`openng-optimus-ui-baseinput.mjs:7`, `:79`), so an explicit `[fluid]` on the field always wins — including `[fluid]="false"` to opt one field back out — and nesting `p-fluid` inside `p-fluid` changes nothing.
- Constrained neighbors — `p-inputmask`, `p-password`, `p-inputOtp`, `[pKeyFilter]` — live in the constrained-inputs guide; `p-floatlabel`/`p-iftalabel` in the input-labels guide.

## Accessibility
- **Label with `<label for>`** — the element is native, so it binds. `aria-label` only where the context is unmistakable; it *replaces* any `<label>` in the accessible name.
- **An addon is never a name.** The rendered `.p-inputgroupaddon` cell is roleless, so a unit or prefix in it is invisible to assistive technology. Put that meaning in the label; verify in the accessibility tree that the name is the label alone.
- **Validity must be text**: `[invalid]` plus `aria-invalid`, a visible message, `aria-describedby`; the red edge alone is color, not a message.
- Fields collecting the user's own data carry an `autocomplete` token (WCAG 2.2 SC 1.3.5).
- **Focus is kit-provided.** Aura zeroes `form.field.focusRing` (`@openng/optimus-ui-themes/dist/aura/base/index.mjs`), so its own signal is a `{primary.color}` border tint; the kit's `styles.scss` rule `.p-inputtext:focus-visible, .p-textarea:focus-visible` draws 2px solid `var(--primary-color-fg)` at 2px offset, `!important`, both modes. The ring fades in over the field's transition — read it after the transition, not in the same tick as `focus()`.
- **The invalid edge is kit-provided.** Every visual style sets `border-color` on `input.p-inputtext` (`html.style-*` blocks), which outranks `.p-inputtext.p-invalid`; the kit rule `input.p-inputtext.p-invalid` (`!important`) paints `--semantic-red-fg` anyway, so `[invalid]` alone shows red in every style, focused too. Both invalid tokens point at the same red. Disabled tints render in both modes.
- **Outside the kit's rule, restore the ring via tokens from an ancestor scope**: `--p-inputtext-focus-ring-width|-style|-color|-offset` (plus the `--p-textarea-*` twins) on a class around the form. The same tokens on `:root` do not work — Optimus re-declares them on `:root, :host` from a runtime `<style>` element that outranks earlier `:root` rules.
- Edges and text are gated per style and mode (`docs/generated/CONTRAST.MD`, "form field edge" / "form field text"): the input's style-outline edge 3.25–18.73:1, the textarea's `--control-border` edge (kit rule `.p-textarea`) 3.25–5.23:1 on its fill, the invalid edge 5.66–9.69:1, placeholders 4.76:1 or more. In dark both controls fill `--surface-section` with `--control-placeholder` (4.79–5.93:1). The placeholder still may not carry meaning — it vanishes on input.
- `readonly` is styled by neither layer in either theme: it looks editable.
- **`p-iconfield`, `p-inputicon` and `p-fluid` carry no accessibility surface of their own** — no role, no `aria-*`, no focus handling, no name contribution; each renders its projected content and nothing else (`openng-optimus-ui-iconfield.mjs:71`, `openng-optimus-ui-inputicon.mjs:43`, `openng-optimus-ui-fluid.mjs:52`). The field inside keeps the `<label for>` contract unchanged, and the wrappers neither add to nor mask its accessible name.
- **`p-inputicon` sets no `aria-hidden`.** Mark the glyph you project `aria-hidden="true"` yourself; give it a name only where it carries meaning the label does not, and then put that meaning in the label instead.
- **Do not put a control inside `p-inputicon`.** A leading icon precedes the input in document order, so an interactive element there takes focus *before* the field it decorates; the icon box is also `position: absolute` over the field, so it steals that part of the field's click area. An action belongs in an input-group addon or beside the field, where it is a real `<button>` with a name and a place in the tab order.
- `p-fluid` changes width only. That is still an accessibility input: a field stretched to a wide container has a longer, harder-to-scan line, and one that stays intrinsically narrow on a small screen has a smaller pointer target.

## Pitfalls
- `size="small"` sets the *native* character-width attribute; the input is `pSize`.
- `autoResize` clamps with `parseFloat(style.height)` against `parseFloat(style.maxHeight)` (`openng-optimus-ui-textarea.mjs`, `resize()`), so the `max-height` must be inline **and in px**: a class-based value is invisible and the box grows unbounded, while `max-height: 10rem` reads as bare `10` and pins the field at its maximum while still empty. It also re-measures in the after-checked hook, forcing a layout every change-detection pass.
- `p-inputgroup` is `width: 100%` and eats a flex row; constrain the parent.
- `placeholder` as the label — it vanishes on the first keystroke and carries the lowest text contrast in the theme.
- **`iconPosition` is inert.** It writes `p-iconfield-left` / `p-iconfield-right` on the host (`openng-optimus-ui-iconfield.mjs:9`–`17`) and no rule in the shipped stylesheet reads either class. The side comes from **document order** — `.p-inputicon:first-child` gets the leading inset, `:last-child` the trailing one (`@openng/optimus-ui-styles/dist/iconfield/index.mjs:16`–`22`). Move the element, not the input.
- **`p-iconfield` does not fit a `pTextarea`.** The rules that open room for the icon name `.p-inputtext` and `.p-inputwrapper` only (same file, `:24`–`31`), so a textarea gets no padding; and `.p-inputicon` is pinned at `top: 50%` (`:7`–`14`), which on a multi-line box is the middle of the text, not the first line.
- **A trailing icon collides with `p-password`.** The password's reveal glyph sits at `inset-inline-end: form.field.padding.x` (`@openng/optimus-ui-styles/dist/password/index.mjs:64`–`72`) — the same inset `.p-inputicon:last-child` uses, but resolved against a different box: the toggle against `.p-password` (`position: relative`, `inline-flex`, `:2`–`5`), the icon against `.p-iconfield` (`@openng/optimus-ui-styles/dist/iconfield/index.mjs:2`–`5`). The two glyphs stack whenever the password fills the icon field — always under `fluid` (`.p-password-fluid { display: flex }`, `:36`–`38`) — and sit apart otherwise, which reads as two controls. A *leading* icon is fine: the password root carries `p-inputwrapper`, which the icon field's start-padding rule matches.
- **`p-fluid` does not cross a component boundary.** The lookup is declared `host: true`, so it stops at the host element of the component whose template holds the field: `<p-fluid><my-field/></p-fluid>` leaves the inputs inside `my-field` unchanged. Put `p-fluid` in the template that declares the fields, or set `[fluid]` per field.
- **`p-fluid` misses whole components.** Only those that read `hasFluid` react — among them `pInputText`, `pTextarea`, select, multiselect, autocomplete, datepicker, inputnumber, cascadeselect, treeselect, inputmask, password, and button. `p-iconfield` is not one of them, and neither is `p-inputgroup`: it declares `styleClass` as its only input (`openng-optimus-ui-inputgroup.mjs:100`) while its class map still tests `instance.fluid` (`:49`), so `p-inputgroup-fluid` is never applied — harmless only because the group is already `width: 100%`.

## Sources
- WCAG 2.2 SC 3.3.2, persistent labels: https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
- WCAG 2.2 SC 1.3.5, the `autocomplete` tokens: https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html
- WCAG 2.2 SC 2.4.7, a suppressed focus state is a failure: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- WCAG 2.2 SC 1.4.3 and 1.4.11, the 4.5:1 and 3:1 floors: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- MDN `<textarea>` — `rows` and the `resize` `autoResize` disables: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
- GOV.UK Design System, Text input — sizing a field; hint vs placeholder: https://design-system.service.gov.uk/components/text-input/
- Optimus UI InputText: https://optimus.openng.org/inputtext/
- Optimus UI IconField — the vendor page for the wrapper, and the reason its `iconPosition` claim has to be checked against the stylesheet: https://optimus.openng.org/iconfield/
- Optimus UI Fluid — the vendor page for the width wrapper, whose scope the DI declaration narrows: https://optimus.openng.org/fluid/
- Bundles read for the three wrappers: `openng-optimus-ui-iconfield.mjs`, `openng-optimus-ui-inputicon.mjs`, `openng-optimus-ui-fluid.mjs` and `openng-optimus-ui-baseinput.mjs`; geometry from `@openng/optimus-ui-styles/dist/iconfield/index.mjs`. The icon color is the library token `iconfield.icon.color` → `form.field.icon.color`, not a kit token, so `docs/generated/CONTRAST.MD` carries no ratio for it — measure it in the browser before relying on the glyph to carry meaning.

## Semantic mapping

| Intent | Markup |
| --- | --- |
| Short free-text answer | `<input pInputText type="text">` + `<label for>` |
| Value may contain line breaks | `<textarea pTextarea rows="4">` |
| Box that follows its content | `pTextarea autoResize style="max-height: 160px"` |
| Field is in error | `[invalid]` + `aria-invalid` + `aria-describedby` |
| Decorative icon inside one field | `<p-iconfield>` with `<p-inputicon>` **before** the input for a leading glyph, after it for a trailing one |
| Glyph must not be announced | `<p-inputicon><i class="pi pi-search" aria-hidden="true"></i></p-inputicon>` |
| One field spans its container | `[fluid]="true"` on that field |
| Every field in this template spans | `<p-fluid>` around them, in the same template |

## Rules
- MUST: give every field a persistent label (`<label for>`) and express invalidity as visible text linked by `aria-describedby`, never color alone.
- MUST: bind label, placeholder, hint, error, and addon text to translation keys in a `computed()` map; Optimus ships no string here.
- MUST: mark every glyph projected into `p-inputicon` `aria-hidden="true"`, and place the `p-inputicon` element on the side it should render — leading icon before the input, trailing icon after it.
- MUST NOT: let an addon carry meaning absent from the label; write `size` where `pSize` is meant; put an address in a single-line input.
- MUST NOT: put an interactive control inside `p-inputicon`; rely on `iconPosition`; wrap a `pTextarea` in `p-iconfield`; add a trailing icon to a `p-password` that already reveals; expect `p-fluid` to reach fields declared in a child component's template.
- SHOULD: set `autocomplete` on personal-data fields, `type`/`inputmode` for the keyboard, an inline px `max-height` on every `autoResize` textarea, and a focus indicator verified in both themes.
- SHOULD: prefer `[fluid]` on the one field that must stretch, and reserve `p-fluid` for a template whose fields should all stretch.

## Default snippet
```html
<label for="contact-email">{{ labels().email }}</label>
<input pInputText
  id="contact-email"
  type="email"
  autocomplete="email"
  formControlName="email"
  [invalid]="emailFailed()"
  [attr.aria-invalid]="emailFailed()"
  [attr.aria-describedby]="'contact-email-msg'" />
<small id="contact-email-msg">{{ labels().emailHint }}</small>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
