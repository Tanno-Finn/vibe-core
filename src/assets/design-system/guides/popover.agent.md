---
id: popover
title: Popover
category: library
tags: [overlay, anchored, a11y]
summary: A panel anchored to the thing the user just clicked, with the page still live behind it — and a dialog role that promises modality it does not deliver.
related: [dialog, drawer, tooltip, menu]
covers: [popover]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, a live focus read-out, flip and edge placement, four dismissal paths, tooltip vs popover
  usage: Delineation table across eight surfaces, the trigger contract and where its attributes land, Do/Don'ts
  design: Anatomy, Aura token chain and contrast per theme, placement branches, motion, sizing, narrow screens
  development: Inputs incl. three dead ones, methods, the four focus questions, dismissal, teardown timing, SSR
  i18n: The four strings you ship, the width trap, RTL
  history: Document changelog
---

## When to use
- Interactive or substantial content belonging to **one trigger**, with the page usable behind it: a settings panel, a filter, a detail card.
- Passive detail the user asked for and can walk away from, where expanding in place would break the layout.

## When not to use
- Short, non-interactive hint → `pTooltip` (`role="tooltip"`, `openng-optimus-ui-tooltip.mjs:479`; nothing inside is reachable).
- Commands only → `p-menu [popup]`. "Delete this?" → `p-confirmpopup` (`role="alertdialog"`, `openng-optimus-ui-confirmpopup.mjs:502`, a real trap).
- Blocks, or must not be abandoned half-done → `p-dialog [modal]="true"`. Long side → `p-drawer`.
- Must be indexed or linkable: nothing renders until the first open.

## Key API
`PopoverModule` from `@openng/optimus-ui/popover` (Optimus UI 2.0.2). No trigger, no `visible` input — hold a template ref, call methods.
- `toggle(event, target?)` / `show(event, target?)` / `hide()`; state is the **plain boolean** `overlayVisible` (`openng-optimus-ui-popover.mjs:140`). `(onShow)` / `(onHide)` — **restore focus in the latter**.
- `appendTo` — `'body'` (`input('body')`, `:80`; the JSDoc at `:77` still says `'self'` — the code wins). Keep body: placement writes document-absolute coordinates.
- `dismissable` (**true**), `focusOnShow` (**true**, see Accessibility), `ariaLabel` / `ariaLabelledBy`, `styleClass`, `style`, `motionOptions`.
- `<ng-template #content>` gets `{ closeCallback }` (`:431`), the only close affordance; `pTemplate="content"` also binds (`:163-171`).
- **Declared and read by nothing:** `ariaCloseLabel` (`:91` — no close button ships); `showTransitionOptions` / `hideTransitionOptions` (`:107`, `:113`, deprecated) — motion is tuned only through `motionOptions`.
- No `position`, no `closeOnEscape`, no width or height token.

## Accessibility
- **You own the trigger:** `aria-expanded`, `aria-haspopup="dialog"` (`"true"` = *menu*), and a name on the panel — else an unnamed dialog.
- **On a `p-button` those attributes need `[pt]`.** The clickable `<button>` sits *inside* the `<p-button>` host and binds the `root` section (`openng-optimus-ui-button.mjs:845`), so `[pt]="{ root: { … } }"` reaches it — from a `computed()`.
- **`role="dialog"` + `[attr.aria-modal]="overlayVisible"`** (`openng-optimus-ui-popover.mjs:418-419`): an open panel claims modality and keeps none of APG's four clauses — no mask, no `inert`, no trap, no focus record.
- **`focusOnShow` focuses the first `[autofocus]` element** (`:322-329`) — and **every `p-button` writes one**: `AutoFocus` sets it unless its input is exactly `false` (`openng-optimus-ui-autofocus.mjs:23-28`; `Button` binds `autofocus || buttonProps?.autofocus`, `openng-optimus-ui-button.mjs:844`) — so the panel focuses its first *button*. Put `pAutoFocus` on the intended control, `[autofocus]="false"` on the rest.
- **Focus never returns** (after Escape it is on `body`) — restore it in `(onHide)`. **Nor does it stay in:** the panel is `<body>`'s last child.
- **Escape always closes:** a `document:keydown.escape` host listener (`:342-344`), no switch, firing with focus anywhere.

## Pitfalls
- **Nothing re-aligns:** one `absolutePosition` call at open (`:269`). A scrolling ancestor of the trigger hides it (`:364-375`); so does a resize, off touch (`:345-349`).
- **No `position` input:** below and start-aligned, flipped above when it does not fit, right-aligned on a right-edge collision. Not mirrored in RTL. Never shrunk: on a phone a wide panel runs off-screen.
- **Teardown rides the motion system:** the node leaves the DOM only after `pMotionOnAfterLeave` (`:426`, `render` false at `:304-321`) *and* the next change detection (`OnPush`, plain booleans). In a fixture, assert on `overlayVisible`, never on the node's absence.
- **No width, max-height, or scroll container** — put them on your own wrapper (`max-width: min(24rem, calc(100vw - 2rem))`). Padding is `--p-popover-content-padding`; scope overrides.
- Fill and text are Aura stock; the border is `--style-outline` (`panel outline`, ≥ 3.97:1 on a card); radius per visual style.

## Sources
- W3C APG — Modal Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — the four clauses the role promises.
- W3C APG — Disclosure: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ — the trigger half nobody ships.
- WAI-ARIA 1.2 — `aria-modal`: https://www.w3.org/TR/wai-aria-1.2/#aria-modal — outside content must be inert; also defines `aria-haspopup`.
- WCAG 2.2 — 2.4.3 Focus Order: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html — the risk a `<body>`-appended overlay runs.
- PrimeNG — Popover: https://primeng.org/popover — the v21 API Optimus forks; re-checked against the shipped 2.0.2 source.

## Semantic mapping
| Intent | Reach for |
| --- | --- |
| Anchored panel, page stays live | `p-popover` + `[ariaLabel]` + a `[pt]`-wired trigger |
| Focus into the panel | `pAutoFocus` on it, `[autofocus]="false"` on the buttons |
| Outside click must not close | `[dismissable]="false"` (Escape still does) |

## Rules
- MUST: name the panel with the same words as its visible heading.
- MUST: give the trigger `aria-expanded` + `aria-haspopup="dialog"` — via `[pt]` on a `p-button` — and check them in the accessibility tree.
- MUST: restore focus in `(onHide)`, pick the `autofocus` target when the panel holds a `p-button`, and cap the panel's width.
- SHOULD: check placement near the bottom and right edge.
- NEVER: put a destructive, unsaveable, or must-not-be-abandoned task in one; nor open it on hover.
- NEVER: rely on `ariaCloseLabel`, on `appendTo="self"`, or on a closed panel's content being absent from the DOM.

## Default snippet
```html
<p-button #trigger [label]="labels().columns" [pt]="triggerPt()"
  (onClick)="panel.toggle($event)" />

<p-popover #panel [ariaLabel]="labels().columns"
  [pt]="{ root: { id: 'columns-panel' } }"
  (onShow)="open.set(true)" (onHide)="onHide()">
  <div class="popover-panel">   <!-- width and padding live here -->
    <input pInputText [pAutoFocus]="true" [(ngModel)]="filter" />
    <p-button [label]="labels().reset" [autofocus]="false" />
  </div>
</p-popover>
```
`triggerPt`: a `computed()` of `{ root: { 'aria-expanded': String(open()), 'aria-haspopup': 'dialog', 'aria-controls': 'columns-panel' } }`.

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
