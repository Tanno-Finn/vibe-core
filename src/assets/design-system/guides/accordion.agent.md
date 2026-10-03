---
id: accordion
title: Accordion
category: library
tags: [layout, disclosure, a11y]
summary: Stacked disclosure panels that survive 360px — a header with no heading semantics, content that is hidden but never unmounted, and a root keyboard layer that swallows arrow keys.
related: [tabs, card, panelmenu, a11y-guidelines, stepper]
covers: [accordion]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground across single and multiple mode, the rendered anatomy, a long-label panel at narrow width
  usage: Accordion vs tabs vs stepper vs a plain stack, the value contract per mode, Do/Don't pairs
  design: Aura token chain, the eight direct-child rules, the focus ring, the 360px statement, contrast
  development: Inputs and outputs, generated ids, the inert root keyboard layer, the never-unmounted body and how it is hidden
  i18n: Zero library strings, label length in a header that wraps, logical radii under RTL, values stay untranslated
  history: Document changelog
---

## When to use
- **Sections a reader compares, scans, or prints** — independent chapters; `[multiple]="true"` opens all of them.
- Narrow viewports: one column that grows downwards, never sideways.
- Long or unpredictable labels — the header wraps instead of truncating or scrolling.

## When not to use
- **Parallel views of ONE subject**, exactly one at a time → `p-tabs`. A tab set answers *which view*; an accordion *which of these do I open* — "all" or "none" included (the open header toggles to `undefined`, `openng-optimus-ui-accordion.mjs:606-608`).
- Stages of one task in an enforced order → `p-stepper`.
- Under about three short sections, or content the reader needs anyway → stack it unheaded.
- State that must be linkable → mirror `value` into a query param; nothing is persisted.

## Key API
`AccordionModule` from `@openng/optimus-ui/accordion`. Four elements, no `ControlValueAccessor`: `<p-accordion>` → `<p-accordion-panel>` → `<p-accordion-header>` + `<p-accordion-content>` (unhyphenated selectors also bind, `:144`, `:298`, `:408`).
- **`p-accordionTab` no longer exists** (`types/openng-optimus-ui-accordion.d.ts` declares no `AccordionTab`). The name survives in `AccordionTabOpenEvent`/`AccordionTabCloseEvent` (`:77`, `:93` of that file), whose `index` is the panel's `value`, not an ordinal.
- `p-accordion`: `value` (`model()`, `:462`), `[multiple]` (`:469`), `[selectOnFocus]` (`:491`), `expandIcon`/`collapseIcon`, `motionOptions`; `styleClass` (`:472`) and `transitionOptions` (`:495`) deprecated. Outputs `valueChange`, plus `onOpen`/`onClose` (`{ originalEvent, index }`) on **click only** (`:196-211`).
- **`value` changes type with the mode** (`updateValue`, `:592-613`): single mode holds one value or `undefined`, `[multiple]` an **array**; a non-array initial value is discarded on the first toggle (`:595`).
- `p-accordion-panel`: `value` (`model()`, `:126`), `[disabled]`. `p-accordion-header`: projected label plus optional `#toggleicon`.
- **There is no `lazy`.** The body renders eagerly and stays (`p-motion`, `[unmountOnLeave]="false"`, `hideStrategy="visibility"`, `:409-416`), collapsed as `visibility: hidden; max-height: 0` (`openng-optimus-ui-motion.mjs:26-29`).

## Accessibility
- Correct out of the box: header `role="button"`, `aria-expanded`, `aria-controls`, `aria-disabled`, `tabindex` `0`/`-1` (`:298`); content `role="region"` labelled by the header (`:408`); all ids derive from the panel value (`:177`, `:183`, `:393`, `:395`).
- **No heading semantics, and the fix has a price.** Nothing emits `h2`–`h6` or `aria-level`, while APG wants the button *inside* a heading. A heading inside the header does not count (`role="button"` makes descendants presentational). Wrapping the header does, but eight preset rules are direct-child keyed (`> .p-accordionheader`, `@openng/optimus-ui-styles/dist/accordion/index.mjs:32`, `:38`, `:43`, `:58`, `:67`, `:72`, `:76`, `:81`) and stop matching, open and hover states included. Re-declare them, or forgo the outline deliberately.
- Header keys (`:216-238`): `↑`/`↓` (wrapping, skipping disabled panels), `Home`, `End`, `Enter`/`Space`/`NumpadEnter` — the full APG contract.
- The kit's 2px `--primary-color-fg` ring replaces Aura's 1px one, inside the header, keyed on `.p-accordionheader:focus-visible` alone, so it survives a heading wrapper (CONTRAST.MD "focus ring").
- Collapsed bodies leave the accessibility tree and the tab order — and find-in-page with them (no `hidden="until-found"`).

## Pitfalls
- **The root swallows `↑`/`↓` and unshifted `Home`/`End` for every descendant.** Its second keyboard layer (`:526`) looks up `[data-pc-section="accordionheader"]` (`:566-582`), but the components emit `data-pc-name` (`openng-optimus-ui-basecomponent.mjs:355`): every lookup is `null`, yet all four paths call `preventDefault()` (`:549`, `:554`, `:559`, `:587`). A field or scroller in a panel loses its keys — `(keydown)="$event.stopPropagation()"` on the content.
- Every body is built with the page and prerendered — gate an expensive one behind your own `@if`.
- Under `[multiple]`, `valueChange` emits an array: narrow `$event`, and initialize `value` as `[]`.
- Aura paints the header `content.background` in every state: open/closed rides on the chevron and color, so a custom header without the chevron needs a non-color carrier (SC 1.4.1).

## Sources
- W3C APG — Accordion, roles and keys: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- W3C APG — Tabs, the alternative: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WCAG 2.2 SC 1.4.1, the chevron-only state: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- WCAG 2.2 SC 2.1.1, the swallowed keys: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
- Optimus UI — Accordion, the vendor API: https://optimus.openng.org/accordion/

## Semantic mapping
| Intent | Props |
| --- | --- |
| All sections open at once | `[multiple]="true"`, `value` an array |
| One at a time, all closeable | default mode |
| A field or scroller in a panel | `(keydown)="$event.stopPropagation()"` on the content |
| Document outline | a heading around the header **plus** the eight `>`-keyed rules |
| Own chevron | `<ng-template #toggleicon let-active="active">` |

## Rules
- MUST: keep `value` in the mode's shape — array under `[multiple]`, scalar or `undefined` otherwise.
- MUST: keep panel values short, stable, untranslated; they become DOM ids.
- MUST: stop `keydown` in a panel holding a text field, a scroller, or its own arrow keys.
- MUST: decide the heading question, and pay in either the outline or the eight rules.
- SHOULD: drive state from `valueChange`; treat `onOpen`/`onClose` as click telemetry.
- NEVER: expect `[lazy]`, an unmount on collapse, or find-in-page to reach a collapsed body; never treat `index` as an ordinal.

## Default snippet
```html
<!-- sections() is a computed(); ids stay numeric and untranslated. -->
<p-accordion [value]="open()" [multiple]="true" (valueChange)="onOpenChange($event)">
  @for (s of sections(); track s.id) {
    <p-accordion-panel [value]="s.id">
      <p-accordion-header>{{ s.label }}</p-accordion-header>
      <p-accordion-content (keydown)="$event.stopPropagation()">
        <p>{{ s.body }}</p>
      </p-accordion-content>
    </p-accordion-panel>
  }
</p-accordion>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
