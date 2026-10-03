---
id: confirmdialog
title: Confirm Dialog and Confirm Popup
category: library
tags: [overlay, confirmation, destructive, a11y]
summary: One service drives two surfaces — a modal alertdialog and an anchored one — and they disagree about focus, about what a dismissal reports, and about whether the message is escaped.
related: [dialog, popover, button, feedback-messages]
covers: [confirmdialog, confirmpopup]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Both surfaces rendered from one service, the emitted markup, and what each close path reports
  usage: Dialog versus popover versus undo, button order and labeling, Do/Don't on labels and on the missing header
  design: Aura token chain, what the visual style changes, which contrast criterion applies and why no ratio is quoted, narrow viewport
  development: Input maps for both components, the inputs the dialog never reads, key routing, concurrency, and the reject argument
  i18n: Where the Yes/No labels come from, why a kit language switch does not move them, the reactive-label pattern
  history: Document changelog
---

## When to use
- **The action is irreversible and the reader is one click from it** — delete, send, overwrite, publish. `p-confirmDialog` when the decision deserves the whole screen, `p-confirmpopup` for a small yes/no on one control.

## When not to use
- **The operation can be undone.** Do it and offer undo. `p-confirmpopup` adds a second reason — click outside (`openng-optimus-ui-confirmpopup.mjs:410-415`), resize (`:425-429`) and scroll of the target (`:443-447`) call `hide()` alone, so a refusal need never be heard. `p-confirmDialog` reports every exit.
- **Nothing is at stake** → a toast or an inline message. **The reader must supply something** (a reason, a typed name) → `p-dialog`; these two render one message and two buttons.

## Key API
Both subscribe to one `ConfirmationService`: `confirm()` pushes onto a plain `Subject` (`openng-optimus-ui-api.mjs:22`, `:31-34`), `close()` pushes `null` (`:39-42`).
- **Routing is by `key`** — an instance reacts when `confirmation.key === this.key` (`openng-optimus-ui-confirmdialog.mjs:343`, `openng-optimus-ui-confirmpopup.mjs:232`), both defaulting to `undefined`, so an unkeyed `confirm()` opens **every** unkeyed instance. `close()` is not routed at all: the `null` branch calls `hide()` before any key test (`openng-optimus-ui-confirmdialog.mjs:339-342`, `openng-optimus-ui-confirmpopup.mjs:222-225`).
- The `Confirmation` carries the content, the labels, the button-props objects, and the callbacks, plus the popup's `target`, without which it never positions (`openng-optimus-ui-confirmpopup.mjs:323-328`). `option()` prefers it over the component input (`openng-optimus-ui-confirmdialog.mjs:397-405`).

## Accessibility
- Both roots carry `role="alertdialog"` (`openng-optimus-ui-confirmdialog.mjs:523`, `openng-optimus-ui-confirmpopup.mjs:502`); the dialog is modal and gets `aria-modal` from `p-dialog`, the popup is neither, yet it traps keyboard focus (`openng-optimus-ui-confirmpopup.mjs:498`). No `aria-describedby` anywhere: the message span has no id (`openng-optimus-ui-confirmdialog.mjs:570`, `openng-optimus-ui-confirmpopup.mjs:515`).
- **The dialog is named by its header, or by nothing.** `p-dialog` derives `aria-labelledby` from its header id (`openng-optimus-ui-dialog.mjs:513-516`); without a `header` the title span still renders and owns that id (`:1066`).
- **The close icon has no accessible name.** `p-dialog` names it from `closeAriaLabel` alone (`openng-optimus-ui-dialog.mjs:1099`), which the confirm dialog binds through neither directly nor via `closeButtonProps`; its own is dead (`openng-optimus-ui-confirmdialog.mjs:131`). Passing `closable: false` removes it, but also removes Escape (`openng-optimus-ui-dialog.mjs:854`), leaving accept and reject as the only exits.
- **Initial focus differs.** The popup honors `defaultFocus` (`openng-optimus-ui-confirmpopup.mjs:304-309`); the dialog ignores it. `p-dialog` focuses the first focusable element, content before footer (`openng-optimus-ui-dialog.mjs:633-641`), and here that is icon plus message, so focus lands on the first footer button, Reject (`openng-optimus-ui-confirmdialog.mjs:580`; accept at `:597`).
- **Focus return is the popup's job alone, and only half of it.** It refocuses the trigger on accept and reject (`openng-optimus-ui-confirmpopup.mjs:373`, `:380`), not on a silent dismissal (outside click, resize, target scroll). Neither records the previously focused element, so restore it yourself.
- Message text owes **SC 1.4.3, 4.5:1**, a meaningful icon **SC 1.4.11, 3:1**. Dialog: gated via the panel (CONTRAST.MD `dialog`, 10.35 / 17.72:1); popup: no row, see Design.

## Pitfalls
- **`defaultFocus` on `p-confirmDialog` does nothing.** It is read only inside `getElementToFocus()` (`openng-optimus-ui-confirmdialog.mjs:411-427`), which nothing calls, and it looks for `.p-confirm-dialog-accept`, a class the buttons do not carry (`:17-23`). In the popup it works, but `"none"` focuses Reject: it tests truthiness, then treats anything but `'accept'` as reject (`openng-optimus-ui-confirmpopup.mjs:304-309`).
- **Nine more inputs are declared and never read.** Dialog: `focusTrap` (`:228`), `rtl` (`:191`), `transitionOptions` (`:223`) and the three `*AriaLabel` inputs (`:131`, `:136`, `:156`) — button names come from `acceptButtonProps.ariaLabel` (`:586`, `:603`). Popup: `baseZIndex` (`openng-optimus-ui-confirmpopup.mjs:131`; `setZIndex()` uses `config.zIndex.overlay`, `:329-333`) and the deprecated `showTransitionOptions`/`hideTransitionOptions` (`:115`, `:121`).
- **A cancel arrives as a reject.** Escape, the close icon, and a dismissable mask go through `close()`, which emits `ConfirmEventType.CANCEL` on the **reject** callback (`openng-optimus-ui-confirmdialog.mjs:448-453`); the Reject button emits `REJECT` (`:492-497`). `REJECT` is `1`, `CANCEL` `2` (`openng-optimus-ui-api.mjs:12-14`). The popup's reject emits no argument (`openng-optimus-ui-confirmpopup.mjs:375-378`).
- **The dialog message is assigned to `innerHTML`** (`openng-optimus-ui-confirmdialog.mjs:570`); the popup interpolates it as text (`openng-optimus-ui-confirmpopup.mjs:515`).
- **The dialog's frame is the visual style's.** Every `html.style-<name>` block in `src/styles.scss` sets `.p-dialog` border, radius, and shadow, so restyling via `confirmdialog`/`dialog` tokens does not move them. The popup has no style rule; its radius is `border.radius.md` from the style.

## Sources
- `@openng/optimus-ui/fesm2022/`: `openng-optimus-ui-confirmdialog.mjs` and `openng-optimus-ui-confirmpopup.mjs` (the two components), `openng-optimus-ui-api.mjs:12-14`, `:21-52` (`ConfirmEventType`, the service), `openng-optimus-ui-dialog.mjs:513-516`, `:633-641`, `:949-952`, `:1099` (the dialog it wraps), `openng-optimus-ui-config.mjs:130-131`, `:235-240` (`Yes`/`No`, z-index bases).
- WCAG 2.2 SC 1.4.3 https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html and SC 1.4.11 https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — 4.5:1 for text, 3:1 for a meaningful icon.
- NN/g on confirmation dialogs https://www.nngroup.com/articles/confirmation-dialog/ — ask sparingly, offer undo.
- WAI-ARIA 1.2 `alertdialog` https://www.w3.org/TR/wai-aria-1.2/#alertdialog and W3C APG https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/ — the role must be named; focus on open and on close belongs to the pattern.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Irreversible, whole-screen decision | `confirm({ header, message, accept })` + `p-confirmDialog` |
| Yes/no anchored to a control | `confirm({ target, message, accept })` + `p-confirmpopup` |

## Rules
- MUST: pass `header` to `p-confirmDialog`, or the alertdialog has no name; label the accept button with the verb of the action, not `Yes`.
- MUST: treat `reject` as "did not accept", read its argument before assuming a No, and refocus the trigger yourself after a confirm dialog closes.
- MUST: keep the dialog's `message` free of user-influenced text; key every instance once a second can exist.
- NEVER: rely on the dead inputs listed under Pitfalls; never put a decision in the popup when losing the answer would matter.

## Default snippet
```ts
// <p-confirmDialog key="destructive" [header]="confirmTitle()" /> sits near the root.
this.confirmationService.confirm({
  key: 'destructive',
  message: this.question(),      // assigned to innerHTML: never user-influenced text
  acceptLabel: this.deleteVerb(), // a computed over translate(), never "Yes"
  rejectLabel: this.keepVerb(),   // unset falls back to the English "No"
  acceptButtonProps: { severity: 'danger' },
  accept: () => this.deleteLesson(), // then focus the surviving list: the trigger is gone
  reject: () => this.trigger()?.focus(), // Escape and the close icon land here
});
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
