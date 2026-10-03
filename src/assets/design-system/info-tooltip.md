---
name: Info Tooltip
selector: app-info-tooltip
tags: [tooltip, help, a11y, overlay]
status: documented
---

# Info Tooltip (`app-info-tooltip`)

## Purpose

The canonical accessible "i" info-popover for demos and didactic controls: a small round button that reveals a short (1-2 sentence) explanatory bubble on click or focus (never hover-only), dismissible with ESC or an outside click, non-modal, and automatically flipping/clamping its position so it never clips the viewport. Built specifically to satisfy WCAG 1.4.13 (content on hover or focus).

## When to use

- Short contextual help (1-2 sentences) next to a form control, demo parameter, or label — e.g. "eps (Radius)" with a tooltip explaining what eps means in DBSCAN.
- Anywhere a hover-only native `title` attribute would fail accessibility requirements.

## When not to use

- Longer explanations — put them in the surrounding body text or use `app-definition`/`app-info-box` instead; the bubble is intentionally short, per the component's own usage guidelines.
- Rich HTML content (links, formatting) in the bubble — `text` is plain interpolated text, there is no `[innerHTML]` support.
- Always-visible help text — just render the text directly instead of hiding it behind a trigger.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `text` | `string` (required) | `''` | The explanatory bubble text — must already be translated |
| `forLabel` | `string` | `''` | The control's plain label, folded into the trigger's accessible name |
| `placement` | `'above'\|'below'` | `'below'` | Preferred placement; auto-flips to the opposite edge if it would clip |
| `moreInfoLabel` | `string` | `'More information'` | Prefix for the trigger's `aria-label` — pass an already-translated string |

No `@Output()`s. No content projection — the bubble text comes only from `text`.

## Example

```html
<label>
  eps (radius)
  <app-info-tooltip
    text="Maximum distance between two points for them to be considered neighbors."
    forLabel="eps (radius)">
  </app-info-tooltip>
</label>
```

## Accessibility

- The trigger is a real `<button>` in the natural tab order with `aria-label="<moreInfoLabel>: <forLabel>"`.
- Opens on **click or focus** (not hover-only) and the bubble itself is hoverable with a short close-delay, satisfying SC 1.4.13.
- **ESC** dismisses without moving focus; clicking **outside** the component also closes a pinned bubble.
- The bubble has `role="tooltip"` and a stable id; the trigger references it via `aria-describedby` while open.
- Visible `:focus-visible` ring; `prefers-reduced-motion` and `forced-colors` are both handled explicitly in the styles.
- All copy is passed in pre-translated — the component hardcodes no strings, so the caller is responsible for localization of `text`, `forLabel`, and `moreInfoLabel`.
