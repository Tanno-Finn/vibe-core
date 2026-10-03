---
id: tabs
title: Tabs
category: library
tags: [navigation, layout, a11y]
summary: Parallel views of one subject — and the four questions that decide between tabs, an accordion, a stepper, and separate routes.
related: [accordion, stepper, select, button]
covers: [tabs]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground plus five rendered tab sets with their markup
  usage: The choice table, the four questions, Do/Don't pairs
  design: Anatomy, Aura tokens vs the kit's rendering, rendered values by token, the underline, overflow, sizing
  development: Inputs, generated ids, lazy panels, URL sync, SSR, keyboard key by key
  i18n: Label length, the library's own strings, direction, hidden panels
  history: Document changelog
---

## When to use
- **Parallel views of ONE subject** where one view at a time is enough.
- Two to about four short labels that still fit at 360px in the longest language you ship.
- Switching is cheap and harmless.

## When not to use
- Sections a reader wants to **compare, search, or print** → stack them, or `p-accordion [multiple]`.
- Stages of one task with an enforced order → `p-stepper`.
- Views that must be **linkable or reloadable** → routes, or mirror the value into a query param (Default snippet).
- More than ~4 tabs at 360px: the strip scrolls and off-screen choices stop existing.

## Key API
`TabsModule` from `@openng/optimus-ui/tabs` (Optimus UI 2.0.2) — the v18+ successor to `TabView`. Five elements, no `ControlValueAccessor`: `<p-tabs>` → `<p-tablist>` → `<p-tab>`, `<p-tabpanels>` → `<p-tabpanel>`.
- `p-tabs`: `value` (`model<string | number | undefined>()` — not `any`, so narrow `$event` in a handler under `strictTemplates`), `[lazy]`, `[selectOnFocus]`, `[scrollable]`, `[showNavigators]` (default `true`), `tabindex`, `pt`/`dt`/`unstyled`; no `scrollStrategy`. Only output `valueChange`; nothing cancellable.
- `p-tab`: `value`, `[disabled]`. `p-tabpanel`: `value`, `[lazy]`, content child `#content`. Ids are generated (`<tabsId>_tab_<value>`), so **the value ends up in the DOM id**.
- `[lazy]`: a panel mounts on first activation and is then **never destroyed** (`shouldRender` latches on `hasBeenRendered`, openng-optimus-ui-tabs.mjs:796-807). A cost knob, not a visibility mechanism: an inactive panel already carries `hidden`.
- `[scrollable]` only adds the class `p-tabs-scrollable` — **zero rules** in `@openng/optimus-ui-styles/dist/tabs/index.mjs`; `TabList.scrollable` (:293) is never read. The strip always scrolls (`.p-tablist-viewport` is `overflow-x: auto`, scrollbar hidden).

## Accessibility
- **`role="tablist"` is NOT on `<p-tablist>`** — it sits on the inner `div.p-tablist-tab-list` (openng-optimus-ui-tabs.mjs:411), so an `aria-label` on the host names nothing. **Use `[pt]="{ tabList: { 'aria-label': '…' } }"` on the `p-tablist`** (`content` is the outer viewport div, not the tablist). `pt` does not cascade from `p-tabs`: each component resolves only its own `pt` input.
- Free: tab/tabpanel roles, `aria-selected`, `aria-disabled`, `aria-controls` ↔ `aria-labelledby`, roving `tabindex`.
- **Activation is manual by default** (`selectOnFocus: false`, :122): ArrowRight moves focus, `aria-selected` stays put until Enter. `[selectOnFocus]="true"` makes it automatic; only when switching is cheap.
- Keys: `←`/`→` (wrapping), `Home`/`End`, `Enter`/`Space`; `PageUp`/`PageDown` only scroll a tab into view. No `↑`/`↓`, no `aria-orientation`, no vertical mode.
- **Every keydown is stopped** (`event.stopPropagation()`, :601) — document-level listeners never see it.
- **Panels never get `tabindex="0"`.** APG requires it when the panel holds no focusable element. Use a static `tabindex="0"` (Default snippet); `[pt]="{ root: { tabindex: 0 } }"` has **no effect** here.
- The scroll chevrons take `translation.aria.previous`/`.next` — English `'Previous'`/`'Next'` by default (openng-optimus-ui-config.mjs:185-186). Feed them from your i18n layer via `setTranslation` on every language switch, spreading the current `aria` block (it merges one level deep, so omitted keys are lost).

## Pitfalls
- Assuming `[scrollable]` does something, or that `[showNavigators]="false"` disables scrolling — it only removes the visible affordance.
- Heavy panels without `[lazy]`: every body is built with the page and prerendered.
- Object or unstable values — they become DOM ids and break the pairing.
- Labels from a plain field instead of `computed()` freeze on a language switch; `.p-tab` is `nowrap`/`flex-shrink: 0`, so long translations overflow.
- A `.p-tabs .p-tab:hover` rule: (0,3,0) loses to Aura's `.p-tab:not(.p-tab-active):not(.p-disabled):hover` (0,4,0), whose `border-color` shorthand also overwrites your longhand. Restyle via tokens (the kit ships no tab hover rule).
- Expecting Aura's look: `styles.scss` gives the active tab a 2px `border-bottom` in `--primary-color-fg` and hides Aura's sliding `.p-tablist-active-bar` (`@openng/optimus-ui-themes/dist/aura/tabs/index.mjs`) — one marker, no animation. Focus: the kit's 2px ring, inset ("focus ring").

## Sources
- W3C APG — Tabs (the roles/keyboard contract): https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- W3C APG — Tabs, Manual Activation (the library's default; panel `tabindex="0"`): https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/
- W3C APG — Accordion (the alternative): https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- WCAG 2.2 — Focus Visible 2.4.7 (load-bearing with roving tabindex): https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- Optimus UI — Tabs (vendor API): https://optimus.openng.org/tabs/

## Semantic mapping
Intent → props.

| Intent | Props |
| --- | --- |
| Expensive panels | `[lazy]="true"` on `p-tabs` (or on one `p-tabpanel`) |
| Switching is instant and harmless | `[selectOnFocus]="true"` |
| Panel with no focusable content | `<p-tabpanel tabindex="0">` (static attribute — `pt.root` does not apply) |
| Choice must survive a reload or a shared link | mirror `value` into a query param (`replaceUrl: true`) |

## Rules
- MUST: tabs only for parallel views of one subject — anything ordered, comparable, or linkable is a different control.
- MUST: name the tablist via `[pt]` **on `p-tablist`** when a page carries more than one tab set.
- MUST: give a panel without focusable content `tabindex="0"`; build labels in a `computed()` and keep `value` untranslated.
- SHOULD: `[lazy]` for expensive panels; an explicit decision on `[selectOnFocus]`.
- NEVER: rely on `[scrollable]` or on keydown events bubbling out of a tab.

## Default snippet
```html
<!-- tabs() is a computed() off the TranslationService; view() mirrors ?view= -->
<p-tabs [value]="view()" (valueChange)="onView($event)">
  <p-tablist [pt]="{ tabList: { 'aria-label': labels().views } }">
    @for (t of tabs(); track t.value) {
      <p-tab [value]="t.value">{{ t.label }}</p-tab>
    }
  </p-tablist>
  <p-tabpanels>
    @for (t of tabs(); track t.value) {
      <p-tabpanel [value]="t.value" tabindex="0">…</p-tabpanel>
    }
  </p-tabpanels>
</p-tabs>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
