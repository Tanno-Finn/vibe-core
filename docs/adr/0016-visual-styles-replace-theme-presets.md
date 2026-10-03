# ADR-0016 — Visual styles replace the theme presets: style × accent × mode

**Status:** accepted · **Date:** 2026-09-05 (measurements 2026-09-05 on the then-current `master`, worktree dirty
with an unrelated select-state change)

## Context

The kit lets a reader pick a **theme preset** (Aura, Material, Lara, Nora — Optimus UI's
four presets), an **accent color** (ten palettes in `THEME_COLORS`) and a **mode** (light,
dark, system). The preset axis is the weak one: it swaps the widget layer's geometry and
tokens wholesale, three of the four presets ship as lazy chunks nobody measured a reader
choosing, and the kit's own surfaces, text colors, fonts, and radii stay exactly the same
under every preset. Two axes answer the same question ("what does the app look like?") and
one of them barely changes anything a reader sees.

The project this kit was extracted from has since replaced presets with **visual
styles**: a style is a data object that owns surfaces, the numeric surface and brand scales,
status tones, fonts, radius, a small `definePreset` delta on Aura, and a scoped stylesheet
block for its signature (paper shadows, sticker outlines, a millimeter grid). Eight styles
exist there. This ADR ports the mechanism and four of the eight styles, and removes the
preset axis.

The brief (2026-09-05): proceed with architectural care so that nothing breaks, and pick the
styles that suit the kit.

### What was measured, not assumed (2026-09-05)

**The kit's theme layer today.**

- `src/app/services/theme.service.ts`: 1,237 lines. Four presets; Material, Lara, and Nora
  are lazy chunks (416 kB kept out of the initial bundle, measured 2026-09-02, when the
  presets became lazy). Storage keys `theme` (preset name), `mode`, `themeColor`.
- The service writes **41** custom properties as inline style on `<html>`. A `var()` grep
  over `src/app` and `src/styles.scss` finds **22 of them with no reader**: the seven
  status tokens (`--color-success-100/600`, `--success-color`, `--color-warning-100/600`,
  `--color-danger-100/600`), all twelve `--rarity-*` tokens, and `--accent-bg`,
  `--accent-surface-hover`, `--gradient-accent-color-fg`. The kit has no achievement page
  and no "featured" surfaces; that code is inherited, not used.
- Tokens the kit *does* read, by call sites: `--surface-border` 734, `--text-color-secondary`
  725, `--text-color` 629, `--surface-card` 441, `--primary-color` 401, `--primary-color-fg`
  357, `--surface-section` 229, `--surface-ground` 150, `--border-radius` 108, `--primary-500`
  90, `--surface-hover` 67, the numeric `--surface-0…900` scale 53/53/47/34/33/17/17/16/15/
  10/3, `--control-border` 11, `--control-placeholder` 5, `--font-heading` 4, `--font-base` 1.
  330 distinct custom properties are consumed in total. The numeric surface scale and the
  amber `--primary-50…900` scale are **static** today (`styles.scss` :root/.dark-theme and
  `design-tokens.scss` `$colors`), i.e. a preset switch never touched them.
- Consumers of the service API outside the service: `mode()`, `setMode()`, `color()`,
  `setColor()`, `visibleColors()`, `isHighContrast()`, `setHighContrast()`,
  `currentColorOption()` (theme picker, settings page, generic card, page header, loading
  overlay, sources page, three dev articles) — and the preset axis only in
  `theme-picker.component.ts` (`theme()`, `themes`, `setTheme()`). `getThemeColor()` has no
  caller. The barrel `services/index.ts` exports `ThemeService` only.
- `theme-tokens-wcag.spec.ts`, cited in code comments and in the porting brief, **does not
  exist** in this repository (`scripts/check-contrast.mjs` says so in its header). The
  contrast gate is that script: it parses the top-level `:root` / `.dark-theme` blocks of
  `styles.scss` and the `if (isDark)` branches of `applyDesignSystemColors`, asserts the two
  agree, and measures 195 pairs (97 light, 98 dark; 1 declared exception) into
  `docs/generated/CONTRAST.MD` + `contrast.json`. Guides cite ratios from there only.
- **Prerender bakes no theme state**: `dist/vibecore/browser/de/accessibility/index.html`
  has `<html lang="de" data-beasties-container>` — no theme class, no inline tokens. The
  static stylesheet is the prerendered look; the service acts in the browser. The anti-FOUC
  script in `index.html` sets `dark-theme`/`light-theme` pre-paint from `localStorage.mode`
  and paints `#0f172a` / `#ffffff` as `<html>` background.
- **No third-party host at runtime**: `googleapis`, `gstatic` and `fonts.g` have zero hits
  in `src/`, `index.html` and `public/`. `FontService` self-hosts eight families through
  `@fontsource/*` packages (latin, weights 400 and 700, copied by `angular.json` into
  `assets/fonts/<family>/`, 565 kB in `dist`), injected as a `<link>` on demand. The kit has
  no Content-Security-Policy header or meta (zero hits), so the inline boot script stays
  legal.
- Initial bundle from the last manifest (`.build-manifest.json` of
  2026-09-04): **1,707,351 bytes** (1.71 MB decimal, 1.63 MiB; the changelog's "1.72 MB"
  was measured 2026-09-02 on an earlier build), 13 files, `styles-*.css` 111,656 bytes. Budget: 2 MB warning, 3 MB
  error (`angular.json`).
- Guides: 33 `*.agent.md`; **16** mention Aura or a preset. Five carry *mechanism* claims
  (`color-system`, `design-tokens`, `typography`, `a11y-guidelines`, `select`); eleven
  quote Aura *geometry or color* values for a component (`card`, `checkbox`, `drawer`,
  `feedback-messages`, `forms`, `menubar`, `multiselect`, `popover`, `progress`,
  `radiobutton`, `autocomplete`).
- The kit's `styles.scss` has no `h1–h6 { font-family }` rule; headings inherit the body
  font. `--font-heading` is declared in `design-tokens.scss` leading with Poppins, for which
  no `@font-face` ships (the typography guide records this).
- Test runner: `@angular/build:unit-test` (Vitest, curated subset, ADR-0008); 15 spec files
  in `angular.json` `test.include`, baseline in `scripts/check-test-baseline.mjs`.

**The style mechanism of the upstream project** — the project this kit was extracted
from, read from its source on 2026-09-05. The figures below are measurements of that
codebase, not of this repo.

- `portal-styles.ts` 2,260 lines, eight `PortalStyle` objects: `brandScale` (10 steps),
  `preset` (always Aura), `presetOverrides` (radius primitives, button radius, dark button
  color scheme), `surfaces` light/dark (7 fields), `surfaceScale` light/dark (11 steps
  each), `extraTokens` (radius family, `--style-*` signature tokens, `--button-border`),
  `fonts` heading/body (Google Fonts family strings), `status`, `rarity`, `accentTones`
  (10 accents × 2 modes), `severityGradients` (six severities, `from/to/text`).
- `theme.service.ts` 872 lines: `buildTokenMaps` derives every token from the style plus
  the accent, applies them inline, and persists **both modes** as `localStorage`
  `boot-tokens` so the `index.html` script can apply them before first paint; the style
  class `style-<name>` goes on `<html>` pre-paint too. Presets are merged with
  `definePreset` (style delta first, accent primary ramp last). The severity-button block is
  a static `<style>` that reads tokens; only token values change on a switch.
- `font.service.ts` loads style fonts **from `fonts.googleapis.com` at runtime**
  (`fontCssUrl`, line ~276). A user's explicit font choice (`preferred-font-v1`) always
  wins over a style's font defaults (`applyStyleFonts`).
- The ten accent palettes are **byte-identical** to the kit's `THEME_COLORS` (diffed, all
  eight hex fields per palette).
- 28 style-scoped selectors in `styles.scss`; the four candidate blocks span ~215–240 lines
  each. Of the 17 signature selectors they target, **all 17 exist in the kit** (both
  descend from the same code: `related-refs` 21 files, `standard-container` 28,
  `checkpoint` 24, `example-box` 6, `cookie-consent` 5, `fab-button` 4, the rest 1–3).

**Contrast of the four candidates against the kit's own criteria** — recomputed with the
gate's formula from the style data (script in the session scratchpad; the Phase 2 gate
re-derives these). Pairs: body and secondary text on ground/card/section/hover (SC 1.4.3,
4.5:1), all ten accent foregrounds (`primaryFg`, `accentFg`) on ground and card (4.5:1;
`contrast` 7:1), status text on ground/card, kit semantic inline colors on ground/card.

| style | light: fails / text2 on ground / min accent | dark: fails / text2 on ground / min accent |
|---|---|---|
| lernwerkstatt | 0 gated · 5.69 · sunset.accentFg 4.84 | 0 · 7.40 · fire.primaryFg 5.35 |
| skizzenbuch | 0 · 5.20 · sunset.accentFg 4.61 | **1**: text2 on hover **4.37** · 5.99 · 5.08 |
| werkbund | 0 · 7.14 · sunset.accentFg 4.51 | 0 · 7.22 · fire.primaryFg 6.07 |
| blaupause | **1**: text2 on hover **4.47** · 4.90 · 4.63 | **1**: fire.primaryFg on card **4.47** · 6.83 |
| (kit today) | 0 · 4.83 · 4.92 | 0 · 12.02 · 5.29 |

The kit's semantic inline colors (`--semantic-*-fg`) hold on every candidate ground and
card (minimum 4.60, werkbund light green). None of the styles carries a `--control-border`
(a kit-only token, 3:1 on card, ground, and section); the first surface-scale step that
clears 3:1 on all three is **step 500 in every style and mode** (e.g. werkbund light
`#6f6c66` 5.23/4.80/4.47; blaupause's `--surface-border` already clears it: 4.09/3.85/3.64).
Secondary text on the dark section surface, the kit's placeholder pair, holds in all four
(skizzenbuch tightest at 4.79).

**Fonts of the candidates and their availability as self-hosted packages** (npm view,
2026-09-05): `@fontsource/{baloo-2, lora, nunito-sans, archivo, archivo-black, rajdhani}`
all at 5.3.0, license field `OFL-1.1`; `atkinson-hyperlegible` and `ibm-plex-sans` are
already installed. Installed latin weight files measure 17–24 kB each (Atkinson 17.2 /
17.5 kB, IBM Plex Sans 22.6 / 22.8 kB, Inter 23.7 / 24.4 kB); the packages ship the OFL
text as `LICENSE`.

## Options considered

1. **Keep presets, add styles as a third axis.** Rejected: two axes for "look" is the
   confusion this ADR removes; every style would need testing under four presets.
2. **Port all eight styles.** Rejected: `galaxie` and `hologramm` are effect styles with
   nebula/grid backdrops (highest contrast and stylesheet cost), `terminal` is a developer
   niche, `educational-amber` is the upstream project's brand. Four was the decision.
3. **Load style fonts from Google Fonts like the workshop.** Rejected: the kit makes no
   third-party request today (measured), and PRIV-004 treats a silent request as data
   leaving the room. Self-hosting through `@fontsource`, the mechanism `FontService` already
   uses, costs a few kilobytes per style and nothing at runtime unless the style is active.
4. **Ship styles without webfonts (system stack).** Considered as the fallback if a font
   fails a measurement. Not needed: every family is OFL and packaged.
5. **Styles as data plus a scoped stylesheet block (the workshop's model).** Chosen — see
   below.

## Decision

### D1 — Style × accent × mode replaces preset × accent × mode

- The `theme` storage key keeps its name and now holds a **style name**. `mode` and
  `themeColor` are unchanged. Reading the key goes through one pure function,
  `resolveStoredStyle(value: string | null): StyleName`: a known style name is returned as
  is; `aura`, `material`, `lara`, `nora`, `null` and any other value map to the default
  style. Nothing throws, nothing is left half-migrated: the service writes the resolved name
  back on its first `applyTheme()` (it already persists on every apply today).
- `Theme`, `ThemeName`, `themes`, `setTheme()`, `theme()`, `getThemeColor()`,
  `PRESET_LOADERS` and the three lazy preset imports are removed. Aura stays the single base
  preset, imported statically in `app.config.ts` (unchanged) and in the service.
- The accent axis (`THEME_COLORS`, `setColor`, high-contrast toggle, `visibleColors`) is
  untouched — the palettes are identical to the workshop's, so every style's accent
  measurements carry over.

### D2 — Data model: `UiStyle` in `src/app/services/ui-styles.ts`

A trimmed port of `PortalStyle`, holding only what the kit reads:

| field | kept | why |
|---|---|---|
| `name`, `labelKey`, `descriptionKey` | yes | i18n keys `settings.theme.styles.<name>.{name,description}` in all four variants (the genericity gate scans values, `check-i18n-keys` checks EN) |
| `brandScale` (`--primary-50…900`, `--primary-hover/-active`) | yes | 90 readers of `--primary-500` alone; today a static amber scale |
| `surfaces` light/dark | yes, **+ `controlBorder`, + `controlPlaceholder` (dark)** | the kit's SC 1.4.11 token and its placeholder pair; values: surface-scale step 500 (measured above), placeholder = secondary text |
| `surfaceScale` light/dark | yes | 300+ readers, must flip per mode |
| `presetOverrides` (`definePreset` delta on Aura) | yes | radius primitives, button radius, dark button color scheme; `definePreset` is exported by `@openng/optimus-ui-themes` (verified in `dist/index.mjs`) |
| `extraTokens` (`--border-radius`, `--border-radius-md/lg/xl`, `--style-*`, `--button-border`, `--style-btn-outlined-*`) | yes | 108 readers of `--border-radius`; the signature blocks read `--style-*` |
| `severityGradients` (`from/to/text`) | yes | the button block becomes token-driven (D5) |
| `fonts` heading/body | yes, **as self-hosted stylesheet ids** (`cssUrl: 'assets/fonts/<family>.css'`), never a Google Fonts family | D4 |
| `status`, `rarity`, `accentTones` | **no** | 22 tokens without a reader (measured); the corresponding service methods (`applyColorSpecificTokens`, `applyRarityColors`) go too |

Workshop-specific prose (usage counts, board references, phase labels) is not carried into
the data file; the four objects keep their measured hex values. Every style also defines
`--style-brand-ink`, the text color the signature blocks use on brand-colored chips; the
contrast gate measures it against brand 500 (and 400 where used).

### D3 — Four styles, one default, two hairline adjustments

Chosen: **`werkbund`** (default), **`lernwerkstatt`**, **`skizzenbuch`**, **`blaupause`**.

- **werkbund** — zero failing pairs in both modes with the most headroom (secondary text
  7.14 / 7.22 on ground); flat severity buttons (no gradients to gate at two stops); two
  font files for headings and body; a neutral gray-ink palette with a Bauhaus red brand.
  This is the **default** because it is the one style where every measured pair passes
  unmodified and the look reads as a component kit rather than as a brand.
  **Amended 2026-09-24:** the default is now
  **lernwerkstatt**. Werkbund proved too severe as the first thing a visitor sees;
  lernwerkstatt is the friendliest of the four and passes the contrast gate like the rest.
  `DEFAULT_STYLE_NAME`, the picker order, the static first-paint layer in `styles.scss` and
  the boot colors in `index.html` moved with it (gate check 1 and 1c enforce that). Werkbund
  stays as a choice; a reader with a stored style keeps it.
- **lernwerkstatt** — zero gated failures; Atkinson Hyperlegible body (already shipped) for
  the plain-language audience; the amber brand scale equals the kit's current static scale,
  so the brand color does not move for returning readers. The two workshop pairs that miss
  4.5:1 (warning text on its own tint 4.34, danger text on its tint 3.86) are the status
  tokens the kit does not read (D2) and are therefore not ported.
- **skizzenbuch** — one adjustment: dark `hover` `#3f3931` → **`#3c362e`** (secondary text
  4.37 → 4.57; body text 9.62). Everything else passes.
- **blaupause** — two adjustments: light `hover` `#e9eef6` → **`#ebf0f7`** (secondary text
  4.47 → 4.55), dark `card` `#123463` → **`#10305c`** (fire `primaryFg` 4.47 → 4.75, all
  accents ≥ 4.75, secondary text 6.29; card-to-ground stays a visible 1.09 step). Its
  `--surface-border` doubles as `controlBorder` (already ≥ 3:1).

`educational-amber` is not ported (none of the candidates failed), nor are `terminal`,
`galaxie`, `hologramm`. The three adjustments are recorded here and in the data file as
deviations from the workshop values; they are a **backport finding** for the workshop, not
something this port changes there. The dark surface-scale step 50 follows the adjusted card
(blaupause `#10305c`).

### D4 — Fonts: self-hosted, OFL, one heading weight, no runtime host

- Six new dependencies, `@fontsource/{baloo-2, lora, nunito-sans, archivo, archivo-black,
  rajdhani}@5.3.0` (all `OFL-1.1`; `atkinson-hyperlegible` and `ibm-plex-sans` are already
  installed and their stylesheets reused). `angular.json` copies **latin** files only:
  body families at 400 and 700 (the kit's existing convention), heading families at a
  single weight — Baloo 2 700, Lora 700, Archivo Black 400 (its only weight), Rajdhani 700.
  One `assets/fonts/<family>.css` per new family, same shape as the eight existing ones.
- Projected assets: 10 new woff2 files × ~17–25 kB ≈ **170–250 kB on disk**, of which the
  active style fetches at most three files (≈ 60–75 kB) — and only after the reader picks it
  or returns with it stored. **Initial bundle delta from fonts: 0** (assets, not JS).
- License texts: `docs/THIRD-PARTY-FONTS.md` lists every shipped family, its upstream, the
  OFL-1.1 reference and the `LICENSE` path inside its package (the eight existing families
  have no such record today — a gap this closes).
- `FontService` gains the workshop's `applyStyleFonts(fonts | null)`: a style sets
  `--font-heading` and `--font-base`/`--font-family` **only while the reader has no explicit
  font choice** (`preferred-font-v1` empty); an explicit choice — the readable-font toggle
  in particular — always wins and applies to headings too. `styles.scss` gains
  `h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading) }`, and the static
  `--font-heading` in `design-tokens.scss` becomes `var(--font-base)` so the default look
  does not change (Poppins never loaded anyway — the typography guide's finding).

Measured after Phase 1: eight woff2 files (body families 400+700, heading families one
weight), 131,708 bytes on disk; the projection of ten files was an arithmetic error.

### D5 — Service, boot, and severity buttons

- `ThemeService` builds one token map per (style, accent, mode) — the workshop's
  `buildTokenMaps` minus the dropped groups — applies it inline on `<html>`, sets
  `style-<name>` on `<html>`, merges `definePreset(Aura, style.presetOverrides)` then the
  accent primary ramp, and persists `theme`, `mode`, `themeColor` plus a `boot-tokens`
  snapshot of **both** modes. Signals and SSR guards (`isPlatformBrowser`, `DOCUMENT`)
  stay as they are today.
- `index.html`: the boot script additionally adds `style-<name>` from `localStorage.theme`
  (guarded by `/^[a-z0-9-]+$/`) and applies the `boot-tokens` snapshot for the resolved mode
  before first paint. The static `<style>` keeps two rules whose colors are the **default
  style's** ground and text per mode. First visit: static stylesheet (= default style, the
  prerendered look). Return visit: snapshot, no flash. Prerender output stays free of theme
  state, exactly as measured today.
- The severity-button `<style>` block becomes the workshop's **static, token-reading**
  block: `--gradient-<severity>-from/-to/-text`, `--button-border`,
  `--style-btn-outlined-border/-bg`, `--primary-color`, `--gradient-accent-color`,
  `--primary-color-text`. Written once; a switch changes token values only.

### D6 — Picker and settings

- The "Style" section of the theme-picker popover (today four initial-letter buttons) shows
  four **swatch tiles** (ground, card, brand-500 of the style, current mode), name and
  description via the i18n keys, `aria-pressed`, click applies immediately. The settings
  page keeps embedding the same picker.
  **Amended 2026-09-24:** the tiles made the popover
  long, so the section now shows one compact **name chip** per style, laid out in a row; the description moved into a tooltip and, via `aria-describedby`, the
  accessible description. `aria-pressed` and click-applies stay.
- **No hover preview** in this version. A style switch swaps fonts, radii, and a `body::before`
  backdrop, which reflows the popover under the pointer; the workshop implements the
  preview, the kit does not until it is measured jump-free. A click is instant and reversible,
  which is the preview.

### D7 — Gates, tests, and guides

- `scripts/check-contrast.mjs` reads the style data file by a **parser contract** (each
  style block delimited by `name: '<slug>'`; hex literals per field, in the fixed order the
  file promises — the same technique `check-design-guides.mjs` uses on the registry) and
  measures every pair group for **every style × mode**, plus two new groups: severity label
  on `from` and on `to` per style, and `controlPlaceholder` on section (dark). Check 1
  becomes: `styles.scss` `:root`/`.dark-theme` surface tokens **equal the default style's**
  surfaces, and the two `index.html` boot colors equal the default style's ground/text.
  `CONTRAST.MD` is regenerated (≈ 4 × the pair count) and stays the only citation source.
- A new spec, `src/app/services/ui-styles.spec.ts`, added to `angular.json` `test.include`
  and to the baseline: every style × mode × pair group ≥ its criterion from the exported
  data (no DOM), `resolveStoredStyle` for `aura`, `material`, `lara`, `nora`, `null`,
  garbage and each style name, and the invariant that every `extraTokens` key the four
  signature blocks read is defined by every style.
- Guides: the five mechanism guides are rewritten where they describe presets
  (`color-system` §3 and §Runtime, `design-tokens` §3, `typography` §2–3 and the Poppins
  finding, `a11y-guidelines` focus-ring provenance, `select` focus-ring rationale). The
  eleven geometry guides keep their Aura provenance (the preset file is still the source)
  and gain one sentence: rendered radii and dark button colors follow the active style;
  numbers are stated for the default style. Gate `check-design-guides.mjs` (byte ceiling,
  cited files) runs on every edit; `docs/de/` mirrors follow the hash rule where a mirrored
  doc is touched (no guide is mirrored today; `README.md` is).
- Portal ADR numbers quoted in kit comments (`ADR-0027`, `ADR-0031`, `ADR-0039`,
  `ADR-0023` — twelve sites in `theme.service.ts`, `styles.scss`, `translation.service.ts`)
  refer to the workshop's ADR series, not this one's. The theme-service sites disappear with
  the rewrite; the stylesheet sites are replaced by a reference to this ADR where the code
  is touched. Recorded as a finding; not a goal of this port.

## Consequences

- One "look" axis instead of two; readers who stored `material`, `lara` or `nora` land on
  the default style with their accent and mode intact.
- The initial bundle loses three lazy preset entries (never initial), gains the style data
  (four objects, projected ≈ 6–8 kB minified), the token-driven button block (smaller than
  today's interpolated template) and four signature blocks in `styles.scss` (≈ 900 lines,
  projected ≈ 25–35 kB uncompressed CSS). Projection: initial stays under **1.75 MB**;
  the 2 MB warning holds. Measured after Phase 2 against 1,707,351 bytes.
- `styles.scss` grows from 2,099 to roughly 3,000 lines. Each signature block is scoped
  under `html.style-<name>`; rules for selectors the kit does not have are not ported
  (every one of the 17 was found in the kit, so the expected drop list is empty).
- The default look changes: werkbund's radius-0 primitives and ink borders replace today's
  Aura geometry with amber. That is the point of the decision and the reason guides gain
  the "follows the active style" sentence.
- Removed: `applyColorSpecificTokens`, `applyRarityColors`, `getThemeColor`, the preset
  loader, 22 dead tokens. New: `ui-styles.ts`, `ui-styles.spec.ts`,
  `docs/THIRD-PARTY-FONTS.md`, six `@fontsource` dependencies, ten font files, four font
  stylesheets, i18n keys in four variants.
- Backport findings for the workshop (not executed here): the three hairline adjustments
  (D3); `--control-border` has no equivalent in `PortalStyle`; the workshop loads style fonts
  from Google Fonts at runtime.
- Verification at the end of the wave: `npm run build:verify`, `node scripts/verify-harness.mjs`,
  `npm run verify:docs`, `npm run test:ci` (baseline raised), `npm run build:prod`
  (manifest `verification: PASS`), bundle and contrast numbers written into the changelog.
- Measured drop list after the port: `.area-card`, `.myth-card`, `.gamification-pill` and the
  workshop's demo-button classes (no element in the kit carries them); the 17-selector count
  included two card variants that exist only in the workshop.
