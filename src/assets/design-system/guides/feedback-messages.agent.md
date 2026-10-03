---
id: feedback-messages
title: Feedback Messages
category: library
tags: [feedback, status, a11y]
summary: Tell the user what just happened — an inline message that stays with the thing it is about, or a toast that leaves on its own before anyone has read it.
related: [dialog, progress, text-inputs, skeleton]
covers: [message, toast]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Variant matrix, removal probes, a toast playground, focus and announce instruments
  usage: Surface table vs dialog, confirmdialog, field validation, a live region; Do/Don't
  design: Anatomy, token chain, contrast per severity and theme, geometry, motion, z-index
  development: Inputs and defaults, service contract, pt and aria routes, focus, SSR, checklist
  i18n: The one string the library owns, who owns the rest, wrapping, measured RTL
  history: Document changelog
---

## When to use
- **`p-message`** — a condition that stays true, beside what it constrains: read-only mode.
- **`p-toast`** — a confirmation nobody must act on or needs twice ("Saved"): gone in three seconds.

## When not to use
- The user must **act** → inline message with the action in it, or `p-confirmdialog`.
- The error belongs to a **field** → hint + `aria-describedby` + `aria-invalid` (see `text-inputs`).
- Re-readable → the layout. Work in flight → `progress`/`skeleton`. A **status you own and update** → your own live region, in the tree before its text changes.
- App already ships a **toast surface** (`app-toast-container` at the root, own service) → feed that one; a second `<p-toast>` is a second overlay root in the same tier.

## Key API
`MessageModule` (`@openng/optimus-ui/message`), `ToastModule` (`@openng/optimus-ui/toast`), `MessageService` (`@openng/optimus-ui/api`); `:NNN` refs are lines in the Optimus UI 2.0.2 bundles (`openng-optimus-ui-<name>.mjs`). Service has **no `providedIn`** (`api :329-364`): provide it once, where the outlet lives; a second provider is a second bus nobody listens to.
- **`p-message`**: `severity` (`'info'`), `variant` (`'outlined'`|`'simple'`), `size` (`'small'`|`'large'`), `closable` (**`false`**), `life` (unset), `icon`, `closeIcon`, `motionOptions`; `(onClose)`; templates `#container` (gets `closeCallback`), `#icon`, `#closeicon`. **No visibility input**: `@if` is the only handle. `variant: 'text'` is typed but dead: stamps `p-message-text`, fill unchanged. **Back from v21:** `text`, `escape`, `style`, `styleClass` compile and render again (`:89-158`); `showTransitionOptions`/`hideTransitionOptions` compile but are inert.
- **`p-toast`**: `position` (`'top-right'`, `:529`), `life` (**`3000`**, `:435`), `key`, `autoZIndex` (`true`), `baseZIndex` (`0`), `preventOpenDuplicates`/`preventDuplicates` (`false`), `breakpoints`, `motionOptions`; `(onClose)`; templates `#message`, `#headless`; no `appendTo`. **No Sonner stacking**: no `mode`/`stackGap`/`stackVisibleLimit`, no swipe — a plain `@for` list (`:683`). Four transform/transition inputs exist (`:468-486`) but are inert.
- **One message**: `severity, summary, detail, key, life, sticky, closable`, plus icon/style/payload fields. `life` is `message.life || outlet.life || 3000` (`toast :175`) — **`life: 0` means 3000**, use `sticky`; only an explicit `closable: false` drops the button.
- **Service**: `add`, `addAll`, `clear(key?)` — a bus, not a store: no handle, no update, no replay; an outlet mounted after `add()` shows nothing. Keys route by exact equality (`:598`).

## Accessibility
- **Inline message**: static `role="alert" aria-live="polite"` host attributes (`message :247`). Server-rendered, so it announces **nothing** at load.
- **Toast**: the root has no role and no name; `role="alert" aria-live="assertive" aria-atomic="true"` sit on the per-message div (`toast :227-229`); the alert node and its text enter the tree together. Mirror into an existing region when it must be heard.
- **Override** via `pt.root`/`pt.message`: `Bind.setAttrs` runs from `onAfterViewChecked` (`message :81`, `toast :413`), after the template's attributes, so `[pt]="{ root: { role: 'status' } }"` shows as `status`, OnPush included.
- **Focus**: no steal despite the bare `autofocus` on the toast close button (`toast :275`; inserted after load, so browsers ignore it). Only the close button is a tab stop (no `tabindex` on the message div). **Escape does nothing** (the only key handler is `keydown.enter` on it, `:273`). No `handleFocusOnRemove`: on close, focus falls to `<body>`.
- Close-button names come **only** from `config.translation.aria.close` (message `:178-180`, toast `:274`), default `"Close"` (`config :184`).
- **Contrast, gated** (CONTRAST.MD `message & toast`): the kit re-points info/success/warn/error text, icon and outline of both components to `--semantic-<blue|green|orange|red>-fg` (warn is orange), secondary outlined/simple to `--text-color-secondary`; every severity × variant over ground and card ≥ **4.60:1**. The close button's focus ring is the kit's 2px `currentColor` ring, so it inherits that ratio. Tint is translucent (95% light, **16% dark**): over any other surface, re-check.

## Pitfalls
- **`closable` and `life` hide; they do not remove.** `close()` only flips an internal `visible` signal (`:234-237`) that stamps `.p-message-leave-active`, whose keyframes end at `opacity: 0`, collapsed grid rows, `forwards`. It stays an `alert`, its close button still a **tab stop** — remove it with your `@if`.
- **`animation: none` strands an inline message** at full opacity and height (`p-animate-message-leave` animates `grid-template-rows`). Shorten durations instead (the kit: 0.01ms). A toast cannot be stranded: its motion layer skips under `prefers-reduced-motion` and resolves immediately.
- **The toast is not portalled.** `autoZIndex` raises it to the shared modal tier (`toast :625-626`), but an ancestor stacking context still scopes it — a `position: fixed; z-index: 1` element on `<body>` paints over it.
- **Fixed 25rem width** (`toast.width`) at every viewport, 20px from the edge: below ~27.5rem it runs off-screen. Set `[breakpoints]="{ '30rem': { width: 'calc(100vw - 2.5rem)' } }"`.
- **Radii follow the visual style** (`content.border.radius` → `border.radius.md` from `ui-styles.ts` `presetOverrides`): 0 in `werkbund`, 12px in the default `lernwerkstatt`.
- `position` is physical: `top-right` stays top right in RTL; the inside of both mirrors. `preventDuplicates` compares against every message the outlet ever showed (`:597-613`) and **nothing resets that archive**.
- Only `mouseenter`/`mouseleave` pause a toast — no pointer-down, no swipe — and leaving **restarts the full life** (`:185-190`). Keyboard users have no pause: nothing listens to focus.

## Sources
- WAI-ARIA 1.2 `alert`: https://www.w3.org/TR/wai-aria-1.2/#alert — the shipped role; an alert must not take focus.
- WCAG 2.2 SC 4.1.3: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html — delivered without moving focus.
- WCAG 2.2 SC 2.2.1: https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html — the 3000 ms default as a time limit.
- MDN `autofocus`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus — why the close button's `autofocus` does not fire.

## Semantic mapping
| Intent | Props |
| --- | --- |
| Standing condition | `<p-message severity="warn">` in its own `@if` |
| Transient confirmation | `add({ severity: 'success', summary })` |
| Failure the user must see | `add({ severity: 'error', sticky: true })` |

## Rules
- MUST: provide `MessageService` exactly once, for the outlet that must receive it.
- MUST: make anything the user has to act on inline or `sticky`; remove a dismissable inline message from the DOM in `(onClose)`.
- MUST: translate `aria.close` via `Optimus.setTranslation` (`config :246`) (spread the current `aria` first); keep the kit's severity inks (no hard-coded colors).
- SHOULD: `summary` in three words, `detail` in one sentence (announced as one unit); restore focus in `(onClose)` for a dismissable toast; flip `position` when the direction flips.
- NEVER: `animation: none` on `p-message`; never a timed toast for an error, a question, or anything worth re-reading.

## Default snippet
```html
<p-toast position="top-right" />

@if (readOnly()) {
  <p-message severity="warn" [closable]="true" (onClose)="readOnly.set(false)">
    {{ labels().readOnlyNotice }}
  </p-message>
}
```
```ts
this.messages.add({ severity: 'success', summary: this.labels().saved });
this.messages.add({ severity: 'error', summary: this.labels().failed, sticky: true });
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
