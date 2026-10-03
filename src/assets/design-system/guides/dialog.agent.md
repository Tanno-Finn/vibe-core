---
id: dialog
title: Dialog
category: library
tags: [overlay, modal, a11y]
summary: Interrupt the user with a modal window — rarely the right answer, and the focus and naming mechanics that decide whether it is usable at all.
related: [drawer, popover, confirmdialog, button, image]
covers: [dialog, dynamicdialog, focustrap]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground plus four rendered dialogs with their markup
  usage: Whether to interrupt at all, the container table, house style, Do/Don't
  design: Anatomy, measured tokens, the focus ring, position, width caps, motion
  development: Inputs, outputs, templates, SSR, and the four focus questions
  i18n: The four strings, the library's own, header length, RTL
  history: Document changelog
---

## When to use
- A self-contained sub-task just asked for: rename, upload, a form too big for a popover.
- A media or detail viewer where the page behind does not matter.
- Never as a default container — first try "put it on the page".

## When not to use
- Passive content (definition, footnote) → expand in place, or `p-popover`.
- A long side surface with the page still in view → `p-drawer`.
- "Are you sure?" → `p-confirmdialog` (`role="alertdialog"`, focuses accept).
- Linkable or reloadable → a route; a dialog has no URL. Tabs or steps inside mean it is a page.

## Key API
`DialogModule` from `@openng/optimus-ui/dialog`; projected content, no service.
- Bind `[(visible)]` + `[header]`; set **`[modal]="true"`** (default `false`) and **`[draggable]="false" [resizable]="false"`** (default `true`, mouse-only).
- Dismissal: `closable` (t), `closeOnEscape` (t), `dismissableMask` (f); the latter two need `closable`.
- Naming/chrome: `showHeader` (t), `closeAriaLabel`, and template refs — `<ng-template #header>`, `#footer`, `#content`, `#closeicon`, `#headless` (no context, so no name). `pTemplate` also binds (:570-600).
- Rarely: `focusOnShow`/`focusTrap` (t), `blockScroll` (f), `position`, `role`, `appendTo` (**`'self'`**), `maximizable`, `closeButtonProps`/`maximizeButtonProps`; motion via `motionOptions`/`maskMotionOptions` (`transitionOptions` only delays focus); sizing via `style`/`contentStyle(Class)`/`styleClass`.
- Outputs: `visibleChange`, `onShow`, `onHide` (**restore focus here**), `onMaximize`.
- **`DialogService`** (`@openng/optimus-ui/dynamicdialog`) opens a *component* in a `p-dialog` it renders itself (`openng-optimus-ui-dynamicdialog.mjs:791-871`). `@Injectable()` without `providedIn` — list it in `providers`. `open(Component, config)` returns a `DynamicDialogRef`, or **`null`** while that component is already open unless `duplicate: true` (:1025, :1084-1096). The child reads `inject(DynamicDialogConfig).data`, or gets `inputValues` via `setInput` (:533-537); it ends with `ref.close(result)`, the caller subscribes to `ref.onClose` (:293, :351). Config mirrors the inputs; `templates` take component types.
- **`pFocusTrap`** (`FocusTrapModule`, `@openng/optimus-ui/focustrap`): a standalone directive for an element you own; one input, `pFocusTrapDisabled`. Two hidden sentinels (`openng-optimus-ui-focustrap.mjs:47-66`) wrap Tab to the first/last focusable (`:67-76`).

## Accessibility
APG's modal contract has four clauses; Optimus UI 2.0.2 meets two and a half (accessibility tree, `document.activeElement`).
- **Named, conditionally.** `computedAriaLabelledBy() = ariaLabelledBy() ?? headerId()` (openng-optimus-ui-dialog.mjs:380, :515), `headerId` being the id unless `header() === null` (:513): an unbound `header` keeps the name, **explicit `null` drops it**. The title span sits inside `*ngIf="showHeader"` (:1065-1066); a `#header` template gets the id via context (:1067).
- **Focus in — not the close button.** `focus()` (:633-644) takes the first focusable of the CONTENT, then footer, then header, after the enter motion (`onAfterEnter`, :949-951; `_focus`, :620-632).
- **Focus stays in** (`pFocusTrap`): Tab cycles. **Focus does NOT come back** — after Escape `activeElement` is `document.body`. Kit pattern: `FocusReturn`, `src/app/utils/focus-return.ts`.
- **Background not inert.** Nothing outside a modal gains `inert` or `aria-hidden`; `<body>` gains `p-overflow-hidden`, and the mask `div` blocks the pointer — nothing blocks AT.
- `aria-modal="true"` is a literal (:1056, :1175): under `[modal]="false"` it still reads `"true"` though the mask is transparent and scroll is free.
- Close button: a 40×40 `pButton` with the kit's 2px ring (gated ≥ 5.18:1 on the panel). `closeAriaLabel` has no default and no fallback (:304, :1099), so an unset one names the button **""**.
- **Dynamic dialogs inherit all of the above** — same `role="dialog"`, name from `header`, focus in, trap, no return. Differences: the close label falls back to the translation `aria.close` (dynamicdialog :815, :443-445); focus return goes in the `onClose` subscription.
- **`pFocusTrap` keeps Tab in — only that.** It moves no focus in, returns none, handles no Escape, and a Tab from outside is let *into* the region. For a kit-owned overlay use the CDK: `cdkTrapFocus` + `[cdkTrapFocusAutoCapture]="true"` (`A11yModule`, `@angular/cdk/a11y`) focuses the first tabbable (or `cdkFocusInitial`) and restores the opener on destroy — the kit pattern (`cookie-consent.component.ts`).

## Pitfalls
- `dismissableMask` needs `closable` and `modal`: `enableModality()` (:650-661) wires the mask only `if (this.closable && this.dismissableMask)` (:651) and runs only `if (this.modal)` (:945-947).
- `[blockScroll]` alone blocks nothing: `blockBodyScroll()` runs from `enableModality()` only `if (this.modal)` (:658-660), and `maximize()` (:677-688) skips it `if (!this.modal && !this.blockScroll)` (:679).
- `appendTo` (:387) defaults to `'self'` (`openng-optimus-ui-config.mjs:88`); `appendContainer()` (:927-929) moves the wrapper to `<body>` only otherwise, so a `display: none`/`transform`/`filter`/`contain` ancestor hides or reframes the `position: fixed` mask — use `appendTo="body"`.
- No default width — it shrink-wraps; a fixed pixel width with no `maxWidth` overflows at 360 px. Border, radius, and shadow come from the visual style (`html.style-<name> .p-dialog` in `styles.scss`).
- Stacked dialogs: Escape closes only the topmost (z-index check :906-919).
- **Dynamic dialog without `closable: true` has no way out:** the inner dialog binds `[closable]="ddconfig.closable"` (dynamicdialog :801), and an unset value hides the close button (dialog :1097) and disarms Escape (`closeOnEscape && closable`, :854) and the mask (:651). Only `ref.close()` remains. `DynamicDialogConfig`'s declared defaults (`modal`/`showHeader`/`closeOnEscape` false, :130-195) are not what renders: the template's `!== false` makes them true (:794-815) — and `draggable`/`resizable` too, so pass `false`.
- `pFocusTrap` sentinels are created in the browser only (`isPlatformBrowser`, :21-25); toggle with `pFocusTrapDisabled`, never by removing the attribute.

## Sources
- W3C APG — Modal Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA 1.2 — `aria-modal`: https://www.w3.org/TR/wai-aria-1.2/#aria-modal — outside content must be inert.
- WCAG 2.2 — 2.4.3 Focus Order: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html — what the missing focus return fails.
- WCAG 2.2 — 2.1.2 No Keyboard Trap: https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html — why `closeOnEscape` off plus `focusTrap` on traps.
- MDN — `<dialog>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog — the platform baseline.
- PrimeNG — Dialog: https://primeng.org/dialog — upstream v21 API docs.
- Optimus UI — Dynamic Dialog: https://optimus.openng.org/dynamicdialog — vendor API for `DialogService`.
- Angular CDK — `cdkTrapFocus`: https://material.angular.dev/cdk/a11y/overview#focustrap — the trap with focus capture and restore, the kit's idiom.

## Semantic mapping

| Intent | Props |
| --- | --- |
| Blocking sub-task | `[modal]="true"` + `[header]` + `closeAriaLabel` |
| Custom chrome, named | `<ng-template #header>` + `[id]` from its context — or `[showHeader]="false"` + `[header]="''"` + your heading with `[attr.id]="dlg.computedAriaLabelledBy()"` |
| A component as the dialog body | `DialogService.open(C, { header, closable: true, closeAriaLabel, modal: true, draggable: false, resizable: false })` |
| Trap Tab in your own overlay | `cdkTrapFocus` + `[cdkTrapFocusAutoCapture]="true"`; `pFocusTrap` only inside a library panel |

## Rules
- MUST: name it — `[header]`, or the dialog's `computedAriaLabelledBy()` id on the heading you render.
- MUST: `[modal]="true"` when the task blocks; restore focus to the opener in `(onHide)`; `[draggable]="false" [resizable]="false"`; set and translate `closeAriaLabel`; bind `header` through a `computed()`.
- SHOULD: `[style]="{ width: '90vw', maxWidth: '…' }"`; a non-destructive first focusable in the content.
- SHOULD: with `maximizable`, push the library's ARIA strings via `Optimus.setTranslation` on each language change (spread the current `aria` block).
- MUST: with `DialogService`, pass `closable: true` and a `header`, null-check `open()`, restore focus in `onClose`.
- NEVER: a modal for passive content; `[modal]="false"` for something that blocks.
- NEVER: `pFocusTrap` as a kit overlay's whole focus story.

## Default snippet
```html
<p-button id="rename-trigger" [label]="labels().rename" (onClick)="visible.set(true)" />
<p-dialog [(visible)]="visible" [header]="labels().renameHeader" [modal]="true"
  [draggable]="false" [resizable]="false" [dismissableMask]="true"
  [closeAriaLabel]="labels().close"
  [style]="{ width: '90vw', maxWidth: '28rem' }"
  (onHide)="restoreFocus('rename-trigger')">
  <label for="rename-input">{{ labels().nameLabel }}</label>
  <input pInputText id="rename-input" [(ngModel)]="name" />
  <ng-template #footer>
    <p-button [label]="labels().cancel" severity="secondary" [text]="true" (onClick)="visible.set(false)" />
    <p-button [label]="labels().save" (onClick)="save()" />
  </ng-template>
</p-dialog>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
