---
id: dragdrop
title: Drag and Drop
category: library
tags: [interaction, pointer, sorting, a11y]
summary: Two directives that wrap the native drag events and add no role, no focus, and no key — ship a button path and a spoken result beside every drag.
related: [dataview, button, fileupload, feedback-messages]
covers: [dragdrop]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: A live sorting board with drag, move buttons, focus return, and a status line; the attributes the directives write
  usage: Whether to drag at all, per task; Do/Don't on drag-only versus drag plus buttons; annotated sources
  design: The states you must paint yourself, drop-zone contrast from the gate, narrow viewport and touch, motion
  development: Inputs and outputs of both directives, the scope-as-drag-data probe, the wiring recipe, checklist
  i18n: Why the library contributes no string, the labels and announcement you own, direction
  history: Document changelog
---

## When to use
- Sorting items into **named groups** (a quiz, a card sort) where no library component fits — always together with a button path.
- An optional pointer shortcut on top of an interaction that already works by button and keyboard.

## When not to use
- Reordering one list → `p-orderlist`; moving between two lists → `p-picklist` (DataView guide). Both ship native move buttons.
- One category per item → a radio group or `p-select` per item; no movement needed.
- Files from the desktop → `p-fileupload` (a file drag carries no scope, so `pDroppable` rejects it).
- Free positioning on a canvas — no reasonable keyboard equivalent.

## Key API
Import `Draggable`, `Droppable` (standalone) from `@openng/optimus-ui/dragdrop`; `DragDropModule` only re-exports them (`openng-optimus-ui-dragdrop.mjs:318-322`).
- `pDraggable="<scope>"`, `dragEffect`, `dragHandle` (CSS selector), `pDraggableDisabled`; outputs `onDragStart`, `onDrag`, `onDragEnd` (`DragEvent`) — `:142`.
- `pDroppable="<scope>" | string[]`, `dropEffect`, `pDroppableDisabled`; outputs `onDragEnter`, `onDragLeave`, `onDrop` — `:287`.
- The scope is the **only** payload: `dataTransfer.setData('text', scope)` (`:113`), compared in `allowDrop` (`:269-282`) at drop time only (`:247-253`). Carry item identity in component state (set in `onDragStart`, read in `onDrop`).
- Drop-target hook class `p-draggable-enter` (`:259`); no Optimus stylesheet, Aura token, or `src/styles.scss` rule styles it.

## Accessibility
- The directives add `draggable = true` (`:62`, `:68`) and nothing else: no role, no tabindex, no `aria-*`, no key handler. A drag built on them is mouse-only.
- Listeners are mouse and native drag events only (`:87-94`, `:142`, `:287`) — no touch or pointer events; whether a finger can drag depends on the browser.
- WCAG 2.2 SC 2.5.7 (AA) requires a single-pointer path without dragging; SC 2.1.1 a keyboard path. Move buttons per item satisfy both.
- Announce each move in a `role="status"` region that exists before the first move (SC 4.1.3).
- After a button move, focus the moved item in its new place: the pressed button leaves the DOM with its row. Ring your own rows with the kit ring's values (2px `--primary-color-fg`, "focus ring" 3.88:1+), never `--primary-color`.
- Draw zone boundaries with `--control-border`: 5.23:1 light / 4.91:1 dark on `--surface-card`, werkbund (`docs/generated/CONTRAST.MD`, "control boundary"; SC 1.4.11 needs 3:1).

## Pitfalls
- `dragenter` adds `p-draggable-enter` for **any** drag, whatever its scope (`:254-261`); only an accepted drop removes it (`:248-249`), so a rejected drop leaves the highlight on.
- `dragover` is prevented unconditionally (`:244-246`): the cursor promises a drop that a scope mismatch then ignores.
- `dragHandle` is checked against the last `mousedown` target (`:125-136`); a drag with no recorded mousedown passes from anywhere.
- The scope string lands verbatim in any text field, tab, or application it is dropped on — never put data in it.
- `pDraggableDisabled` leaves `draggable = true` and cancels in `dragstart` (`:56-64`, `:109-119`); `pDroppableDisabled` unbinds `dragover` only, so the highlight still appears (`:189-196`).
- `onDrag` and `dragover` run outside the Angular zone (`:74-76`, `:231-233`) — update signals.

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-dragdrop.mjs` — both directives; every behavior above.
- WCAG 2.2 SC 2.5.7: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html — the single-pointer alternative.
- WCAG 2.2 SC 2.1.1: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html — the keyboard path.
- WCAG 2.2 SC 4.1.3: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html — announcing the result.
- HTML Standard, drag and drop: https://html.spec.whatwg.org/multipage/dnd.html — the event model and drag data store.

## Semantic mapping
| Intent | Build |
| --- | --- |
| Reorder one list | `p-orderlist` (buttons built in) |
| Move between two lists | `p-picklist` |
| Sort into named groups | `pDraggable` + `pDroppable` + one button per destination |
| Item picked up | your class from `onDragStart` / `onDragEnd` |
| Zone under the pointer | style `.p-draggable-enter` |
| Result of a move | `role="status"` sentence |

## Rules
- MUST: ship a single-pointer, keyboard-operable path (buttons or a select) beside every drag.
- MUST: route drop and buttons through one move method.
- MUST: announce every move in a pre-rendered `role="status"` region.
- MUST: return focus to the moved item after a button move.
- SHOULD: prefer `p-orderlist` / `p-picklist` over hand-built reordering.
- SHOULD: style `.p-draggable-enter` with an outline, not color alone, and clear it yourself when scopes can mismatch.
- NEVER: put item data or user content in the scope string.
- NEVER: hide or remove the buttons on devices that can drag.

## Default snippet
```html
<div role="group" [attr.aria-labelledby]="zone.headingId"
     pDroppable="ml-task" (onDrop)="dropInto(zone.id)">
  <h4 [id]="zone.headingId">{{ zone.title }}</h4>
  <ul><li [id]="'item-' + item.id" tabindex="-1" pDraggable="ml-task"
      (onDragStart)="draggingId.set(item.id)" (onDragEnd)="draggingId.set(null)">
    {{ item.label }}
    <button type="button" (click)="move(item.id, other.id)">
      <span class="sr-only">Move {{ item.label }} to </span>{{ other.short }}
    </button>
  </li></ul>
</div>
<p role="status">{{ status() }}</p>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
