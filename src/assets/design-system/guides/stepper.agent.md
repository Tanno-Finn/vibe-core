---
id: stepper
title: Stepper and Steps
category: library
tags: [wizard, process, navigation, a11y]
summary: One holds the content and decides the order, the other only draws where you are — and neither ever says "done" or "3 of 5", so every state a step bar seems to show is state you have to state yourself.
related: [tabs, forms, progress, ui-pattern-selection, a11y-guidelines, carousel]
covers: [stepper, steps]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Both components rendered with the markup each emits, plus a linear stepper you can drive
  usage: The split between the two, Do/Don't on destroyed panel state and on locked steps, annotated source
  design: Aura token chain, the color-only active state, focus ring, narrow viewport
  development: Input maps including the inherited four, the dead bindings, the unmount evidence
  i18n: Titles, the number that is not a label, and saying "step 2 of 5" when translate() takes only a key
  history: Document changelog
---

## When to use
- **An ordered task whose stages carry content** — `p-stepper` with `p-step-list`/`p-step` and `p-step-panels`/`p-step-panel`: it owns the value and renders the bodies.
- **A position display for a process owned elsewhere** (routes, a server flow) — `p-steps`, a `MenuItem[]` bar with no content.
- Only when the order is real; parallel views of one subject are tabs — see the `tabs` guide.

## When not to use
- **Independent stages**, or free roaming → tabs or plain headings.
- **A position that must survive a reload** → `p-stepper` never writes the URL; `p-steps` writes it only when an item carries `routerLink` **and** you set `[readonly]="false"` (`openng-optimus-ui-steps.mjs:219-221`); `activeIndex` itself is a plain input you feed from the route.
- **Input that must outlive its stage** and cannot be lifted out → Pitfalls.

## Key API
Two unrelated families. All extend `BaseComponent` and so also accept `dt`, `unstyled`, `pt`, `ptOptions` (`openng-optimus-ui-basecomponent.mjs:428`), absent from their own compiled input lists. Selectors are kebab: `p-step-list`, `p-step-panels`, `p-step-panel`, `p-step-item`.
- **`p-stepper`** (`StepperModule`) — `value` (`model<number | undefined>`, output `valueChange`), `linear`, `motionOptions`, dead `transitionOptions`. `p-step`: `value`, `disabled`; `p-step-panel` and `p-step-item` (vertical): `value`; the other three take no own inputs.
- **`p-steps`** (`StepsModule`) — `model`, `activeIndex` (`numberAttribute`, default `0`), `readonly` (`booleanAttribute`, **default `true`**, `openng-optimus-ui-steps.mjs:96`), `style`, `styleClass`, dead `exact`; output `activeIndexChange`.
- `p-step` prints its `value` as the digit (`openng-optimus-ui-stepper.mjs:455`) and builds its `id`/`aria-controls` from the same value (`:404-407`), so a non-sequential value prints a wrong bar; `p-steps` prints `{{ i + 1 }}` (`openng-optimus-ui-steps.mjs:284`).

## Accessibility
- **The tab roles do not hold together.** `role="tablist"` is on `p-stepper` (`openng-optimus-ui-stepper.mjs:747`), which wraps the bar *and* the panels, while `p-step-list` — the bar itself — has no role (`:268`). The heads are therefore not owned by their tablist.
- **A head is a `<button role="tab">` with only `aria-controls`** (`:448-450`) — no `aria-selected`. `aria-current="step"` sits one level up, on the `p-step` host that also carries `role="presentation"` (`:509-510`) — not where focus lands.
- **`p-step-panel` carries `aria-controls` where `aria-labelledby` belongs** (`:626-627`), so the panel is unnamed.
- **"Done" does not exist** in either bundle or the Aura preset: only active and not-active.
- **`p-stepper` has no key handler**: no arrows, no `Home`/`End`, no focus move on activation. Every enabled head is a native button and its own Tab stop; a head `linear` disables also carries `tabindex="-1"` (`:449`) and drops out — see Pitfalls. **`p-steps` is the opposite** — a roving `tabindex` leaving one Tab stop unless a non-disabled item sets its own, which then wins (`openng-optimus-ui-steps.mjs:232-240`), plus `←` `→` `Home` `End` `Enter` `Space` (`:143-181`).
- **The focus ring is the kit's**: `.p-step-header` and `.p-steps-item-link` are in the one ring rule of `src/styles.scss` — 2px `--primary-color-fg` at 2px offset, `!important`, over Aura's 1px `{primary.color}` (`@openng/optimus-ui-styles/dist/stepper/index.mjs:45-49`, `.../steps/index.mjs:62-66`); gated in CONTRAST.MD `focus ring` (≥ 3.88:1).
- Digit and title owe **SC 1.4.3, 4.5:1**, a state-carrying marker **SC 1.4.11, 3:1**; the accent pair is not in the contrast gate.

## Pitfalls
- **Leaving a step destroys its panel.** The body sits in `<p-motion [visible]="active()">` (`openng-optimus-ui-stepper.mjs:592`); Motion renders `@if (rendered()) { <ng-content /> }` (`openng-optimus-ui-motion.mjs:404-406`), and `unmountOnLeave` defaults to `true` (`:116`), unset by the panel.
- **`linear` locks the steps behind you too.** `isStepDisabled = !active && (linear || disabled)` (`openng-optimus-ui-stepper.mjs:402`) drives the real `disabled` attribute (`:451`), so completed heads leave the tab order.
- **Locked never looks locked.** A step `linear` disables gets `p-disabled` on its `p-step` wrapper (`openng-optimus-ui-stepper.mjs:205`), and the stepper stylesheet paints it nowhere: its only `.p-disabled` occurrence is the negation in `.p-step:not(.p-disabled):focus-visible` (`@openng/optimus-ui-styles/dist/stepper/index.mjs:111`), and the Aura stepper preset has no disabled token. `p-steps` is worse — `.p-steps-item.p-disabled` and its descendants are reset to `opacity: 1; pointer-events: auto; user-select: auto; cursor: auto` (`.../steps/index.mjs:20-26`). The `p-readonly` class `linear` adds matches no rule either; the only readonly selector is `.p-stepper.p-stepper-readonly` (`.../stepper/index.mjs:51`).

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-stepper.mjs` — every role, id, template, and `linear` claim.
- `.../openng-optimus-ui-basecomponent.mjs:428` — the four inputs all of them accept and none declares.
- `.../openng-optimus-ui-steps.mjs` — the second family in full: keyboard map, readonly default.
- `.../openng-optimus-ui-motion.mjs` — where the panel's mount and unmount is decided.
- `@openng/optimus-ui-styles/dist/stepper/index.mjs`, `.../steps/index.mjs` — the rules consuming the tokens, the dead selectors, the overflow.
- `@openng/optimus-ui-themes/dist/aura/stepper/index.mjs` (cited by export: `stepNumber`, `stepTitle`, `separator`) — the values, and the evidence that the active state is a color swap.
- WCAG 2.2 SC 1.4.1 https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html — why a color-only step marker fails.
- WAI-ARIA 1.2 `tablist` https://www.w3.org/TR/wai-aria-1.2/#tablist — the ownership rule the markup breaks.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Ordered stages with bodies | `p-stepper` + `p-step-list`/`p-step` + `p-step-panels`/`p-step-panel` |
| Where am I, process owned by routes | `p-steps [model] [activeIndex]`, `routerLink` items |

## Rules
- MUST: say the state yourself — a status region with "step 2 of 5" and what is done.
- MUST: hold every panel's model in the parent; the body is destroyed on leave.
- MUST: number `p-step` values `1..n` — the value is the digit — and set `[readonly]="false"` on `p-steps` before wiring `activeIndexChange`.
- NEVER: rely on `linear` for back-navigation — ship your own Back control.
- NEVER: mark step state by color alone; add a glyph or word.

## Default snippet
```ts
readonly step = signal(1);
readonly position = computed(() => this.i18n.translate('wizard.position').replace('{n}', String(this.step())));
```
```html
<p class="sr-only" role="status">{{ position() }}</p>
<p-stepper [value]="step()" (valueChange)="step.set($event ?? 1)">
  <p-step-list>
    <p-step [value]="1">{{ accountLabel() }}</p-step>
  </p-step-list>
  <p-step-panels>
    <!-- model in the parent: the body is destroyed on leave -->
    <p-step-panel [value]="1"><ng-template #content>…</ng-template></p-step-panel>
  </p-step-panels>
</p-stepper>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
