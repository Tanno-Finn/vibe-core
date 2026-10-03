---
id: design-tokens
title: Design Tokens
category: foundations
tags: [tokens, theming, css-variables]
summary: Every color, space, and radius is a CSS custom property written by four layers that all target the same names — read them with var(), override at the layer that owns the value, and know which layer wins.
related: [color-system, typography, a11y-guidelines, i18n-localization, button, article-layout, demo-layout, hub-layout]
covers: []
measured-against: '@openng/optimus-ui-themes@2.0.2'
tabs:
  examples: A live inspector resolving the core tokens in the current theme, and a scoped override applied to a real surface
  usage: Which layer to read, the var() fallback contract, the naming spaces, and Do/Don't pairs for consuming and overriding
  design: The four layers in cascade order, the three --p-* tiers and where the kit re-points them, the dark-theme mechanic, narrow-screen behavior
  development: Override recipes per layer, the inline-style precedence of the runtime layer, and an acceptance checklist
  i18n: The font token's multi-script stack, why token values are never translated, and how writing direction is handled
  history: Document changelog, one line per version
---

## When to use
- Any color, spacing, radius, shadow, z-index, or container width in a component stylesheet.
- A color that must follow mode, visual style, and accent without a second rule.
- A value several components need, or one a downstream project should re-skin.

## When not to use
- Geometry used in exactly one component — a local literal is honest and cheaper.
- A value that must NOT follow the theme (a logo's own color, a print mark).
- Component state you can express as a class — a token is a value, not a switch.
- Which color may sit on which ground → `color-system`; one Optimus component's `--p-*` → its guide.

## Key API
Four layers write custom properties to the same names. Weakest to strongest:

1. **`design-tokens.scss`** — Sass maps compiled into `:root`: the scales (`--space-*`, `--font-size-*`, `--radius-*`, `--shadow-*`, `--z-*`, `--container-*`), the raw palette, a small `.dark-theme` role block.
2. **`styles.scss`** — `:root` / `.dark-theme` blocks with the kit role tokens (surfaces, text, `--control-border`, `--semantic-<hue>-fg`) at the DEFAULT style's values; it `@use`s layer 1 and wins at equal specificity. It also re-points Optimus component tokens at kit tokens on the component's own selector (`.p-checkbox`, `.p-slider`).
3. **`--p-*`** — Optimus UI's Aura preset, injected at runtime after the kit stylesheet, in three tiers: primitive (`--p-green-500`), semantic (`--p-primary-color`), component (`--p-checkbox-border-color`). Light values on `:root,:host`, dark ones in a second block under `.dark-theme` (Aura 2.x, no `light-dark()`). `theme.service.ts` builds it as `definePreset(Aura, style.presetOverrides)` plus the accent ramp (`widgetPrimarySemantic`: light from `primaryColor`, dark from `primaryFgDark`).
4. **`theme.service.ts`** — **inline style on `<html>`** on every style, accent, or mode change: the style's surfaces, text, `--control-border`, `--surface-<step>` / `--primary-<step>` scales, severity gradients, `--style-*` tokens; the accent's `--primary-bg` / `--primary-fg` roles and aliases; and the `html.style-<name>` class the signature blocks key on.

`--primary-bg` is the fill behind light text, `--primary-fg` text, icons, and the focus ring; `--primary-color` / `--primary-color-fg` alias them.

## Accessibility
- `check-contrast.mjs` measures kit and Optimus widget pairs for every style × mode (× accent where it matters) into `docs/generated/CONTRAST.MD`; zero declared exceptions.
- `--text-color` on `--surface-card` is 18.73:1 light / 14.86:1 dark in werkbund (SC 1.4.3 needs 4.5:1).
- **`--surface-border` is decoration; a control edge draws `--control-border`** (lowest row 3.25:1, SC 1.4.11 needs 3:1). A control marked only by the decorative token is a defect no gate sees.

## Pitfalls
- **An empty token is not an undefined token.** `var(--x, red)` does **not** fall back when `--x` is defined but empty — the declaration is invalid at computed-value time (the kit's dark severity tokens once were).
- **Layer 1's value may never reach the screen.** `--text-color` is `#1e293b` in `design-tokens.scss`, `#121212` in `styles.scss`, and the active style's value at runtime.
- **The runtime layer cannot be out-specified** — it is inline style on `<html>`; override on a lower element or change `theme.service.ts`.
- **A `--p-*` override on `:root` is dead** — the preset's `:root` block comes later and wins.
- **Derived colors are flat sRGB arithmetic** (`lightenHex` / `darkenHex`, clamped): dark `--accent-surface` is `#000000` for four of the ten accents.
- **No focus token**: fields use the one kit ring in `styles.scss`. **Print is light paper** in every mode (`ThemeService` on `beforeprint`; `@media print` is the fallback).

## Sources
- CSS Custom Properties L1: https://www.w3.org/TR/css-variables-1/ — the guaranteed-invalid value: why an empty token skips the `var()` fallback.
- CSS Cascade L5: https://www.w3.org/TR/css-cascade-5/ — order of appearance and inline-style precedence.
- WCAG 2.2 SC 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — the 4.5:1 bar for text pairs.
- WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 bar for control edges.
- PrimeNG Styled Mode: https://primeng.org/theming — the engine Optimus UI forks; how preset tiers become `--p-*` names.

## Semantic mapping
Reach for the token that names the ROLE, not the color.

| Intent | Token |
| --- | --- |
| Page background / card fill | `--surface-ground` / `--surface-card` |
| Recessed strip / hovered row | `--surface-section` / `--surface-hover` |
| Hairline or divider | `--surface-border` |
| Edge of a field, checkbox, or switch | `--control-border` |
| Body / secondary text | `--text-color` / `--text-color-secondary` |
| Brand fill behind light text | `--primary-bg` |
| Brand text, icons, focus ring | `--primary-fg` |
| Inline highlight, severity ink | `--semantic-<hue>-fg` |
| Tinted brand surface + its text | `--accent-surface` / `--accent-on-surface` |
| Stacking order | `--z-dropdown`, `--z-modal`, `--z-tooltip`, `--z-toast` |

## Rules
- MUST: read every themed color, space, radius, and shadow through `var(--token)`, never a literal.
- MUST: quote ratios from `docs/generated/CONTRAST.MD`; re-run `check-contrast.mjs --write` in any commit that moves a color token.
- MUST: pick the token by role — swapping `--primary-fg` and `--primary-bg` inverts the contrast they were tuned for.
- MUST: declare a `--p-*` override on the component's own selector, re-pointed at a kit token (pattern: `.p-slider` in `styles.scss`).
- MUST: put a style-dependent value in the style (`src/app/services/ui-styles.ts`), not in a `:root` rule the runtime overwrites.
- SHOULD: scope an override to the smallest element that needs it; add a new token in both `:root` and `.dark-theme`.
- NEVER: fight the runtime layer with a higher-specificity selector, or assume `design-tokens.scss` holds the value that paints.

## Default snippet
```css
/* Role tokens only — follows mode, style, and accent. */
.panel {
  background: var(--surface-card);
  color: var(--text-color);
  border: 1px solid var(--surface-border); /* decoration */
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
.panel input {
  border: 1px solid var(--control-border); /* a control edge */
}
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
