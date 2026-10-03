---
id: color-system
title: Color System
category: foundations
tags: [color, contrast, accessibility, theming]
summary: Kit role tokens per visual style and mode, ten accent palettes, and the Aura widget tokens re-pointed at them — one gate measures every pair in every style, mode, and accent, so which color may sit on which ground is a quoted number.
related: [design-tokens, typography, a11y-guidelines, i18n-localization, ui-pattern-selection]
covers: []
measured-against: '@openng/optimus-ui-themes@2.0.2'
tabs:
  examples: The four grounds with their text partners per style, the six semantic inks, the style-brand-versus-accent swatch, a color-alone demo
  usage: Which token for which job with its tightest measured row, Do/Don't pairs for pairing, roles, and signaling, and annotated sources
  design: Token layers from Aura to the kit, the kit tokens widgets are re-pointed at, the ten accent palettes, what the gate measures, narrow screens
  development: Where a new color goes, getting its pair measured, citing a ratio, the exception mechanism, and an acceptance checklist
  i18n: Why color values are never translated, and why hue-named tokens leave the meaning to the call site
  history: Document changelog, one line per version
---

## When to use
- Choosing a color for text, an icon, a fill, a control edge, or a focus indicator.
- Deciding whether a foreground and a ground may be paired, and citing the number.
- Adding or re-shading a color, or recoloring an Optimus widget, with the gate kept honest.

## When not to use
- *Where* a value is written and which layer wins — the cascade; use `design-tokens`.
- One widget's full `--p-*` surface — that component's guide.
- Color as a data encoding: the measured pairs govern UI chrome, not chart scales.

## Key API
The look is **visual style × accent × mode**, and each color token moves on one of those axes:

1. **Kit role tokens — per style and mode.** `--surface-ground` / `-card` / `-section` / `-hover`, `--surface-border` (decoration), `--control-border` (control edges), `--text-color`, `--text-color-secondary`: the `surfaces` of each style in `src/app/services/ui-styles.ts`, written inline on `<html>` by `theme.service.ts`. The `styles.scss` `:root` / `.dark-theme` values are only the default style's (lernwerkstatt) first-paint copy.
2. **Accent roles — per accent and mode.** `THEME_COLORS` (ten palettes): `--primary-bg` / `--accent-bg` (fills, alias `--primary-color`), `--primary-fg` / `--accent-fg` (links, icons, the focus ring; alias `--primary-color-fg`), `--primary-color-text`, `--accent-surface` / `--accent-on-surface`.
3. **Kit inks — per mode.** `--semantic-<blue|orange|green|red|purple|pink>-fg` in `styles.scss`: inline highlights and all severity text.
4. **Aura `--p-*`** — primitive → semantic → component tokens. The accent ramp replaces `semantic.primary` (`widgetPrimarySemantic`: light from `primaryColor`, dark from `primaryFgDark`, dark `primary.color` = step 500), so a dark widget accent equals `--primary-color-fg`. `styles.scss` re-points component tokens at kit tokens: field, checkbox, switch, slider edges → `--control-border`; one 2px focus ring, selected-row bar, pressed toggle → `--primary-color-fg`; invalid edges, severity text, badges, messages → `--semantic-*-fg`.
5. **Static palette** — `--<hue>-<step>` / `--color-<hue>-<step>` from `design-tokens.scss`: one value, no mode, no measured pair. `--primary-<step>` is overwritten with the style's brand scale.

## Accessibility
- `check-contrast.mjs` measures kit and widget pairs for every style × mode (× accent where it matters) into `docs/generated/CONTRAST.MD`, zero declared exceptions. Quote from there; never eyedrop.
- Text is SC 1.4.3 (4.5:1); a control edge, the focus ring, and the selected-row bar are SC 1.4.11 (3:1). No token-level text role is large text.
- Tightest rows over all styles, light / dark: secondary text 4.55 / 4.57:1, semantic inks 4.60 / 6.92:1, accent foreground 4.51 / 4.75:1, `--control-border` 3.64 / 3.25:1, focus ring 4.42 / 3.48:1.
- SC 1.4.1: hue is never the only carrier of a state — under `forced-colors` the OS replaces these values.

## Pitfalls
- **`--primary-<step>` is the STYLE's brand, not the accent** — it stands still when the reader changes accent. The accent is `--primary-fg` / `--primary-bg`.
- **A value set in `styles.scss` `:root` for a style token is overwritten** at runtime; change the style in `ui-styles.ts`.
- **The palette knows no mode.** `--blue-500` paints the same on a light and a dark ground.
- **The filled-button label is picked at a looser bar than it is judged**: average of both stops at 3:1 at runtime, each stop at 4.5:1 in the gate.
- **A pair the compilat does not list is not a pass.** The inks and accent foregrounds are measured on ground and card only.
- **`--surface-border` identifies no control** — it is decoration and not held to 1.4.11.

## Sources
- WCAG 2.2 SC 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — the 4.5:1 bar for text.
- WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 bar for edges and focus.
- WCAG 2.2 SC 1.4.1: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html — why hue alone may not carry a state.
- CSS Color Adjustment L1: https://www.w3.org/TR/css-color-adjust-1/ — forced-colors, and what it does to authored color.
- PrimeNG Styled Mode (the model Optimus UI inherited): https://primeng.org/theming — how a preset ramp becomes `--p-primary-*`.

## Semantic mapping
Pair a foreground with a ground only inside a measured group.

| Job | Token | CONTRAST.MD group | SC |
| --- | --- | --- | --- |
| Body / supporting text | `--text-color` / `--text-color-secondary` on the four surfaces | body text | 1.4.3 |
| Inline highlight, severity text | `--semantic-<hue>-fg` on ground, card | semantic text, message & toast | 1.4.3 |
| Link, icon, outlined edge | `--primary-color-fg`, `--gradient-accent-color-fg` on ground, card | brand foreground | 1.4.3 |
| Filled-button label | `--primary-color-text` on both stops | filled button | 1.4.3 |
| Tinted panel | `--accent-on-surface` on `--accent-surface` | accent surface | 1.4.3 |
| Control edge | `--control-border` on ground, card, section | control boundary, form field edge | 1.4.11 |
| Keyboard focus | 2px `--primary-color-fg` ring | focus ring | 1.4.11 |

## Rules
- MUST: pick a color by its role token; never a palette step for text or a control edge.
- MUST: quote every ratio from `docs/generated/CONTRAST.MD`, naming the pair, the style, and the criterion.
- MUST: draw every control edge with `--control-border` and focus with the kit ring; recolor a widget by re-pointing its component token at a kit token.
- MUST: run `node scripts/check-contrast.mjs --write` in the same commit as any color change, and add a pair for a new role.
- MUST: give every state a second carrier besides hue (SC 1.4.1, level A).
- NEVER: read `--primary-<step>` for the accent, or hand-measure a ratio.

## Default snippet
```css
/* werkbund: --text-color on --surface-card 18.73:1 light / 14.86:1 dark;
   --semantic-blue-fg on it 6.70:1 / 9.32:1 (SC 1.4.3 needs 4.5:1).
   docs/generated/CONTRAST.MD, groups "body text", "semantic text". */
.card {
  background: var(--surface-card);
  color: var(--text-color);
  border: 1px solid var(--surface-border); /* decoration */
}
.card input { border: 1px solid var(--control-border); }
.card .term {
  color: var(--semantic-blue-fg);
  text-decoration: underline; /* second carrier beside the hue */
}
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
