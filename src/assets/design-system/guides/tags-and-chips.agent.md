---
id: tags-and-chips
title: Tags and Chips
category: library
tags: [status, label, collection]
summary: A tag is something the system says about an item; a chip is an item — the line the two components are constantly swapped across.
related: [button, selectbutton, badge, avatar]
covers: [tag, chip]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, every severity, what a chip carries, both jobs on one page
  usage: The one-sentence line, the choice table, filter chips as toggles, Do/Don't
  design: Anatomy, geometry tokens, severity as color, measured contrast, kit patches
  development: Inputs, uncontrolled removal, custom properties, the a11y tree, keyboard
  i18n: Your strings, the library's own "Remove", length behavior, RTL
  history: Document changelog
---

## When to use
- **`p-tag`** — a status, state, or category the SYSTEM asserts about an item (`Draft`, `Beta`, `Beginner`). Read-only, compact, color-coded by `severity`.
- **`p-chip`** — a compact stand-in for an OBJECT, usually one the USER put there: a person, a file, an active filter. Only it can carry an image (`[image]` + `alt`) or be taken back (`[removable]`).

## When not to use
- Clickable "filter chips" are neither — they are toggles → `p-selectbutton` (a set) or `p-togglebutton` (one). Both ship focus, key handling, and `aria-pressed`; neither tag nor chip does.
- An action → `p-button`. A count or dot on another control → `p-badge`.
- A red/urgent chip → you wanted a tag; the chip has no severity scale, on purpose.

## Key API
`TagModule` from `@openng/optimus-ui/tag`, `ChipModule` from `@openng/optimus-ui/chip`. Neither is a form control.
- **Tag (5 inputs, 0 outputs):** `value`, `severity` (`'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'`; omit for the brand palette), `icon`, `[rounded]`, `styleClass` — the last back as a `@deprecated` input that still lands on the host (`[class]="cn(cx('root'), styleClass)"`, `openng-optimus-ui-tag.mjs:126`); prefer `class`. One content slot, `<ng-template #icon>` (`{ descendants: false }`, :182). `severity` is typed `BadgeSeverity` (no `TagSeverity` in Optimus), same six values. Note `'warn'`, **not** `'warning'` — unmatched values fall back to the brand palette silently.
- **Chip:** `label`, `icon`, `image` + `alt` (image wins over icon), `[removable]`, `removeIcon`, `[disabled]`, `chipProps` (its fields override the standalone inputs), `<ng-template #removeicon>`; outputs `(onRemove)`, `(onImageError)`.
- Sizing is CSS only — `--p-tag-*` / `--p-chip-*`. Neither takes a `size` input. Aura 2.x tokens: tag 14px/700 at 4/8px padding, icon 12px; chip 8/12px padding, 2rem image, remove icon 16px, and no `chip.label` token — the label inherits (16px here). Each visual style adds its own outline border and radius to `.p-tag` (`html.style-<name> .p-tag` in `styles.scss`).

## Accessibility
- **`severity` is color and nothing else.** It appends a class (`p-tag-success`) plus a `data-p` attribute. Measured: a bare `StaticText` node — no wrapper, no role, no name. Put the state in `value` (WCAG 1.4.1).
- **The chip host is `role="generic"` with `aria-label` = `label`** (measured), so the label is announced twice. Do not use `label` for extra context.
- **The remove control is a real button** — `role="button"`, `tabindex="0"`, `aria-label` from `config.getTranslation(ARIA).removeLabel`, default the English literal `'Remove'`. A global, not a call-site input: set `translation.aria.removeLabel` and re-push via `setTranslation` on every language switch (spread the current `aria` block — it merges one level deep).
- **Keyboard, measured:** `Enter` removes · `Backspace` removes · **`Space` does nothing** (it scrolls) · `Delete` does nothing. `onKeydown` tests only `Enter` and `Backspace`, so a declared `role="button"` fails the APG contract.
- **Focus is lost on removal** — measured `document.activeElement === <body>` afterwards. Move it yourself.
- **The remove control is 16×16px** (`chip.removeIcon.size` `1rem`, aura/chip/index.mjs) — under WCAG 2.5.8's 24×24. Focus ring: the kit's 2px `--primary-color-fg` at 2px offset, on the chip (CONTRAST.MD "focus ring", 4.73:1+).
- Contrast: the four state severities clear 4.5:1 in both themes in every style (light: fixed Aura palette steps, 4.52–5.30 — `warn` 4.52 / `success` 4.57 have no headroom; dark: the kit's `!important` 700-shade overrides, 5.02–6.47). All gated (CONTRAST.MD "tag", "chip"): `secondary` 6.92/7.58, `contrast` 20.17/19.90, chip 13.35/14.89 (Aura's own scale, which the styles don't replace); severity-less 7.62–16.33 light, 7.89–13.49 dark (ten accents, the 16% dark tint composited over ground and card).

## Pitfalls
- A `p-tag` with `(click)`/`role`/`tabindex`. Even hand-written `keydown.enter`/`keydown.space` leaks twice: no `preventDefault` on Space means it toggles *and* scrolls, and the selected state lands in the label text, not `aria-pressed`.
- `severity="warning"` — a PrimeNG 17-era value Optimus does not match. The type system misses it when it arrives from a method typed on the old union; grep after an upgrade.
- A removable "tag": nothing in a `p-tag` is focusable, so the ✕ is decoration. Use `p-chip [removable]`.
- Color as the whole message: three same-length labels in three severities read identically in grayscale and to a screen reader.
- Chips used for statuses, then repainted per call site with `[style]` objects computed in TypeScript — theme and dark-mode switch both bypassed.
- Assuming `onRemove` can veto: `close()` hides the chip *first*, then emits, and `visible` is not an `@Input` — drive the collection from your own model.
- `[disabled]` is cosmetic plus `tabindex="-1"`: no `aria-disabled`, and the click path still removes the chip.
- Probing `--p-chip-*` on a page with no chip: Optimus injects a component's tokens on first render, so they read back empty.

## Sources
- WCAG 2.2 — Use of Color (1.4.1): https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- WCAG 2.2 — Target Size Minimum (2.5.8): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- W3C APG — Button pattern (Enter *and* Space): https://www.w3.org/WAI/ARIA/apg/patterns/button/
- WAI-ARIA 1.2 — the `generic` role does not support `aria-label`: https://www.w3.org/TR/wai-aria-1.2/#generic
- Optimus UI — Tag: https://optimus.openng.org/tag · Chip: https://optimus.openng.org/chip

## Semantic mapping
| Intent | Reach for |
| --- | --- |
| System-asserted state on a card | `<p-tag [value]="…" severity="…" [rounded]="true" />` |
| The same state, grayscale-proof | the state word in `value` + a matching `icon` |
| A person or file the user picked | `<p-chip [label]="…" [image]="…" alt="…" />` |
| A filter the user can revoke | `<p-chip [label]="…" [removable]="true" (onRemove)="drop(f.id)" />` |
| Denser or squarer pills | `--p-tag-padding` / `--p-chip-border-radius`, scoped to a class |

## Rules
- MUST: put every tag's meaning in its `value`; `severity` may only repeat what the text already says.
- MUST NOT: give a `p-tag` a `(click)`, `role` or `tabindex`; MUST NOT use a `p-chip` for a status.
- MUST: own the collection behind removable chips — `@for` over a signal, `(onRemove)` updates the model — and move focus explicitly afterwards; the browser drops it to `<body>`.
- MUST: set `alt` on every `[image]`, and bind `value` / `label` / `alt` to translation keys built in a `computed()`.
- SHOULD: two or three tags per card; a visible caption plus a "clear all" on any chip group; let rows wrap rather than clip — neither component truncates.
- NEVER: repaint a tag or chip with a per-call-site `[style]` object; never re-order a chip collection under the user's cursor.

## Default snippet
```html
<p-tag [value]="statusLabels()[item.status]" [severity]="statusSeverity[item.status]" [rounded]="true" />

<span id="active-filters-label">{{ labels().activeFilters }}</span>
<div class="filter-chips" role="group" aria-labelledby="active-filters-label">
  @for (f of filters(); track f.id) {
    <p-chip [label]="f.label" [removable]="true" (onRemove)="dropFilter(f.id)" />
  }
</div>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
