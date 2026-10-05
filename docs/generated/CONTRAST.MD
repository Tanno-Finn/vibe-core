# Contrast compilat

**GENERATED — do not edit.** Produced by `node scripts/check-contrast.mjs --write` from
the real token values in `src/app/services/ui-styles.ts` (the four visual styles), `src/styles.scss`
(the kit-level tokens) and `src/app/services/theme.service.ts` (the brand palettes). `node scripts/check-contrast.mjs`
(part of `npm run build:verify`) recomputes these numbers and fails if this file is stale.

**Widget rows** (groups named after an Optimus UI component, fg/bg named as Aura tokens such
as `checkbox.border.color`) resolve Aura's preset from `node_modules/@openng/optimus-ui-themes/dist/aura` the way the kit
configures it: stock Aura surfaces (slate light, zinc dark), the accent primary ramp, and every
`styles.scss` rule that re-points or repaints a measured widget. A row prefixed with a palette
name (`ocean.primary.color`) depends on the accent. Informational rows (SC `none`) carry no
WCAG minimum and never fail; they are listed so a guide can quote them.

**Cite from here.** A contrast figure written into a guide by hand goes stale in silence at
the next token tweak. A figure quoted from this table goes stale loudly, because the gate
regenerates the table and the drift check fires.

Criteria: **SC 1.4.3** Contrast (Minimum) — text, 4.5:1 normal / 3:1 large ·
**SC 1.4.11** Non-text Contrast — boundaries that identify a control, 3:1.

Measured: **5946 pairs** (2811 light, 3135 dark) · **5778 meet their criterion** · **0 declared exception(s)** · **168 informational**.

## Headroom per style

Lowest measured ratio per style and mode, ignoring the declared exceptions above. The
criterion is stated with each pair: a 3.6:1 control edge (SC 1.4.11, needs 3:1) has more
headroom than a 4.6:1 text pair (SC 1.4.3, needs 4.5:1), so read the number with its SC.

| style | light: lowest pair | dark: lowest pair |
|---|---|---|
| **werkbund** | 3.30:1 (SC 1.4.11, needs 3:1) · `--dev-toggle-border` on `--surface-card` | 3.78:1 (SC 1.4.11, needs 3:1) · `fire.progressbar.value.background` on `progressbar.background` |
| **lernwerkstatt** (default) | 3.30:1 (SC 1.4.11, needs 3:1) · `--dev-toggle-border` on `--surface-card` | 3.78:1 (SC 1.4.11, needs 3:1) · `fire.progressbar.value.background` on `progressbar.background` |
| **skizzenbuch** | 3.30:1 (SC 1.4.11, needs 3:1) · `--dev-toggle-border` on `--surface-card` | 3.63:1 (SC 1.4.11, needs 3:1) · `fire.--primary-color-fg (kit focus ring, inset)` on `fire.datatable.row.selected.background` |
| **blaupause** | 3.30:1 (SC 1.4.11, needs 3:1) · `--dev-toggle-border` on `--surface-card` | 3.25:1 (SC 1.4.11, needs 3:1) · `--control-border` on `--surface-section` |

## style: werkbund

### light mode

#### body text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--text-color` | `#121212` | `--surface-ground` | `#f6f5f1` | **17.17:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#55524c` | `--surface-ground` | `#f6f5f1` | **7.14:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#121212` | `--surface-card` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#55524c` | `--surface-card` | `#ffffff` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#121212` | `--surface-section` | `#efede7` | **16.00:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#55524c` | `--surface-section` | `#efede7` | **6.65:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#121212` | `--surface-hover` | `#eceae3` | **15.56:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#55524c` | `--surface-hover` | `#eceae3` | **6.47:1** | 1.4.3 | 4.5:1 | ok |

#### semantic text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--semantic-blue-fg` | `#1d4ed8` | `--surface-ground` | `#f6f5f1` | **6.14:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-blue-fg` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#c2410c` | `--surface-ground` | `#f6f5f1` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#15803d` | `--surface-ground` | `#f6f5f1` | **4.60:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#b91c1c` | `--surface-ground` | `#f6f5f1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#0e7490` | `--surface-ground` | `#f6f5f1` | **4.91:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#be185d` | `--surface-ground` | `#f6f5f1` | **5.53:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#be185d` | `--surface-card` | `#ffffff` | **6.04:1** | 1.4.3 | 4.5:1 | ok |

#### dev toggle

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--dev-toggle-fg` | `#166534` | `color-mix(--dev-toggle-border 15%, --surface-card)` | `#dcf1e4` | **6.03:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border` | `#16a34a` | `--surface-card` | `#ffffff` | **3.30:1** | 1.4.11 | 3:1 | ok |
| `--dev-toggle-fg-active` | `#991b1b` | `color-mix(--dev-toggle-border-active 15%, --surface-card)` | `#fde3e3` | **6.84:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border-active` | `#ef4444` | `--surface-card` | `#ffffff` | **3.76:1** | 1.4.11 | 3:1 | ok |

#### control boundary

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-border` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#6f6c66` | `--surface-section` | `#efede7` | **4.47:1** | 1.4.11 | 3:1 | ok |

#### floating action button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `.fab-label --text-color` | `#121212` | `.fab-button --surface-card` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-label --text-color` | `#121212` | `.fab-button:hover --surface-hover` | `#eceae3` | **15.56:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-button --fab-edge` | `#121212` | `--surface-ground` | `#f6f5f1` | **17.17:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#121212` | `--surface-card` | `#ffffff` | **18.73:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#121212` | `--surface-section` | `#efede7` | **16.00:1** | 1.4.11 | 3:1 | ok |

#### severity button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-from` | `#c22525` | **5.86:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-to` | `#c22525` | **5.86:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-from` | `#2e7d4f` | **5.05:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-to` | `#2e7d4f` | **5.05:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-from` | `#2251c9` | **6.80:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-to` | `#2251c9` | **6.80:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#121212` | `--gradient-warn-from` | `#f0c02e` | **10.96:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#121212` | `--gradient-warn-to` | `#f0c02e` | **10.96:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-from` | `#55524c` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-to` | `#55524c` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-from` | `#121212` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-to` | `#121212` | **18.73:1** | 1.4.3 | 4.5:1 | ok |

#### outlined severity

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--outlined-danger-fg` | `#c22525` | `--surface-card` | `#ffffff` | **5.86:1** | 1.4.3 | 4.5:1 | ok |
| `success.--outlined-success-fg` | `#2e7d4f` | `--surface-card` | `#ffffff` | **5.05:1** | 1.4.3 | 4.5:1 | ok |
| `info.--outlined-info-fg` | `#2251c9` | `--surface-card` | `#ffffff` | **6.80:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--outlined-warn-fg` | `#8f6e0a` | `--surface-card` | `#ffffff` | **4.77:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--outlined-secondary-fg` | `#55524c` | `--surface-card` | `#ffffff` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `help.--outlined-help-fg` | `#121212` | `--surface-card` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |

#### severity button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-from @brightness(0.92)` | `#b22222` | **5.60:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-to @brightness(0.92)` | `#b22222` | **5.60:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-from @brightness(0.92)` | `#2a7349` | **4.83:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-to @brightness(0.92)` | `#2a7349` | **4.83:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-from @brightness(0.92)` | `#1f4bb9` | **6.37:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-to @brightness(0.92)` | `#1f4bb9` | **6.37:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#141414` | `--gradient-warn-from @brightness(1.1)` | `#ffd333` | **12.82:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#141414` | `--gradient-warn-to @brightness(1.1)` | `#ffd333` | **12.82:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-from @brightness(0.92)` | `#4e4b46` | **7.28:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-to @brightness(0.92)` | `#4e4b46` | **7.28:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(1.1)` | `#ffffff` | `--gradient-help-from @brightness(1.1)` | `#141414` | **18.42:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(1.1)` | `#ffffff` | `--gradient-help-to @brightness(1.1)` | `#141414` | **18.42:1** | 1.4.3 | 4.5:1 | ok |

#### brand chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-brand-ink` | `#ffffff` | `brandScale 500` | `#d92b2b` | **4.85:1** | 1.4.3 | 4.5:1 | ok |

#### brand foreground

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg` | `#c2410c` | `--surface-ground` | `#f6f5f1` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-fg` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#a16207` | `--surface-ground` | `#f6f5f1` | **4.51:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#a16207` | `--surface-card` | `#ffffff` | **4.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#cd1d1d` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#946708` | `--surface-ground` | `#f6f5f1` | **4.58:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#946708` | `--surface-card` | `#ffffff` | **5.00:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#a8124e` | `--surface-ground` | `#f6f5f1` | **6.73:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#b9267b` | `--surface-ground` | `#f6f5f1` | **5.31:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#b9267b` | `--surface-card` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#157836` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#5d7307` | `--surface-ground` | `#f6f5f1` | **4.91:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#5d7307` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#0a756d` | `--surface-ground` | `#f6f5f1` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#1f63ed` | `--surface-ground` | `#f6f5f1` | **4.73:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#1f63ed` | `--surface-card` | `#ffffff` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#077288` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#167e4a` | `--surface-ground` | `#f6f5f1` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#167e4a` | `--surface-card` | `#ffffff` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#3346d3` | `--surface-ground` | `#f6f5f1` | **6.51:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#0369a1` | `--surface-ground` | `#f6f5f1` | **5.44:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#0369a1` | `--surface-card` | `#ffffff` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#b8147f` | `--surface-ground` | `#f6f5f1` | **5.59:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#d0174a` | `--surface-ground` | `#f6f5f1` | **4.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#d0174a` | `--surface-card` | `#ffffff` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#776558` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#a05e1c` | `--surface-ground` | `#f6f5f1` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#a05e1c` | `--surface-card` | `#ffffff` | **5.11:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#0f172a` | `--surface-ground` | `#f6f5f1` | **16.36:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#1e293b` | `--surface-ground` | `#f6f5f1` | **13.41:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#1e293b` | `--surface-card` | `#ffffff` | **14.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--primary-color` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--gradient-accent-color` | `#a16207` | **4.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--primary-color` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--gradient-accent-color` | `#946708` | **5.00:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--primary-color` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--gradient-accent-color` | `#b9267b` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--primary-color` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--gradient-accent-color` | `#5d7307` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--primary-color` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--gradient-accent-color` | `#1f63ed` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--primary-color` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--gradient-accent-color` | `#167e4a` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--primary-color` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--gradient-accent-color` | `#0369a1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--primary-color` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--gradient-accent-color` | `#d0174a` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--primary-color` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--gradient-accent-color` | `#a05e1c` | **5.11:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#ffffff` | `contrast.--primary-color` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#ffffff` | `contrast.--gradient-accent-color` | `#1e293b` | **14.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--primary-color @brightness(0.92)` | `#b23c0b` | **4.97:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--gradient-accent-color @brightness(0.92)` | `#945a06` | **4.73:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--primary-color @brightness(0.92)` | `#bd1b1b` | **5.28:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--gradient-accent-color @brightness(0.92)` | `#885f07` | **4.78:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--primary-color @brightness(0.92)` | `#9b1148` | **6.86:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--gradient-accent-color @brightness(0.92)` | `#aa2371` | **5.53:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--primary-color @brightness(0.92)` | `#136e32` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--gradient-accent-color @brightness(0.92)` | `#566a06` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--primary-color @brightness(0.92)` | `#096c64` | **5.27:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--gradient-accent-color @brightness(0.92)` | `#1d5bda` | **4.95:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--primary-color @brightness(0.92)` | `#06697d` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--gradient-accent-color @brightness(0.92)` | `#147444` | **4.88:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--primary-color @brightness(0.92)` | `#2f40c2` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--gradient-accent-color @brightness(0.92)` | `#036194` | **5.61:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--primary-color @brightness(0.92)` | `#a91275` | **5.81:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--gradient-accent-color @brightness(0.92)` | `#bf1544` | **5.17:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--primary-color @brightness(0.92)` | `#6d5d51` | **5.28:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--gradient-accent-color @brightness(0.92)` | `#93561a` | **4.91:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#ffffff` | `contrast.--primary-color @brightness(1.1)` | `#11192e` | **17.47:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#ffffff` | `contrast.--gradient-accent-color @brightness(1.1)` | `#212d41` | **13.85:1** | 1.4.3 | 4.5:1 | ok |

#### accent surface

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--accent-on-surface` | `#8f0e00` | `sunset.--accent-surface` | `#ffffd8` | **9.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--accent-on-surface` | `#9a0000` | `fire.--accent-surface` | `#ffe9e9` | **7.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--accent-on-surface` | `#75001b` | `coral.--accent-surface` | `#ffdeff` | **9.67:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--accent-on-surface` | `#004503` | `forest.--accent-surface` | `#e1ffff` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--accent-on-surface` | `#00423a` | `ocean.--accent-surface` | `#d6ffff` | **10.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--accent-on-surface` | `#003f55` | `aurora.--accent-surface` | `#d3ffff` | **10.59:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--accent-on-surface` | `#0013a0` | `twilight.--accent-surface` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--accent-on-surface` | `#85004c` | `mystic.--accent-surface` | `#ffe0ff` | **8.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--accent-on-surface` | `#443225` | `stone.--accent-surface` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--accent-on-surface` | `#000000` | `contrast.--accent-surface` | `#dbe3f6` | **16.33:1** | 1.4.3 | 4.5:1 | ok |

#### checkbox & radiobutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `checkbox.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `checkbox.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#c2410c` | `--surface-ground` | `#f6f5f1` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.checkbox.icon.checked.color` | `#ffffff` | `sunset.checkbox.checked.background` | `#c2410c` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#cd1d1d` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.checkbox.icon.checked.color` | `#ffffff` | `fire.checkbox.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#a8124e` | `--surface-ground` | `#f6f5f1` | **6.73:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.checkbox.icon.checked.color` | `#ffffff` | `coral.checkbox.checked.background` | `#a8124e` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#157836` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.checkbox.icon.checked.color` | `#ffffff` | `forest.checkbox.checked.background` | `#157836` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#0a756d` | `--surface-ground` | `#f6f5f1` | **5.09:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.checkbox.icon.checked.color` | `#ffffff` | `ocean.checkbox.checked.background` | `#0a756d` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#077288` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.checkbox.icon.checked.color` | `#ffffff` | `aurora.checkbox.checked.background` | `#077288` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#3346d3` | `--surface-ground` | `#f6f5f1` | **6.51:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.checkbox.icon.checked.color` | `#ffffff` | `twilight.checkbox.checked.background` | `#3346d3` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#b8147f` | `--surface-ground` | `#f6f5f1` | **5.59:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.checkbox.icon.checked.color` | `#ffffff` | `mystic.checkbox.checked.background` | `#b8147f` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#776558` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.checkbox.icon.checked.color` | `#ffffff` | `stone.checkbox.checked.background` | `#776558` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#0f172a` | `--surface-ground` | `#f6f5f1` | **16.36:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.checkbox.icon.checked.color` | `#ffffff` | `contrast.checkbox.checked.background` | `#0f172a` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### toggleswitch

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `toggleswitch.background` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.background` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.handle.background` | `#ffffff` | `toggleswitch.background` | `#6f6c66` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `sunset.toggleswitch.handle.checked.background` | `#ffffff` | `sunset.toggleswitch.checked.background` | `#c2410c` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.toggleswitch.handle.checked.background` | `#ffffff` | `fire.toggleswitch.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.toggleswitch.handle.checked.background` | `#ffffff` | `coral.toggleswitch.checked.background` | `#a8124e` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.toggleswitch.handle.checked.background` | `#ffffff` | `forest.toggleswitch.checked.background` | `#157836` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.toggleswitch.handle.checked.background` | `#ffffff` | `ocean.toggleswitch.checked.background` | `#0a756d` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.toggleswitch.handle.checked.background` | `#ffffff` | `aurora.toggleswitch.checked.background` | `#077288` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.toggleswitch.handle.checked.background` | `#ffffff` | `twilight.toggleswitch.checked.background` | `#3346d3` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.toggleswitch.handle.checked.background` | `#ffffff` | `mystic.toggleswitch.checked.background` | `#b8147f` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.toggleswitch.handle.checked.background` | `#ffffff` | `stone.toggleswitch.checked.background` | `#776558` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.toggleswitch.handle.checked.background` | `#ffffff` | `contrast.toggleswitch.checked.background` | `#0f172a` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### form field edge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#6f6c66` | `select.background` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#121212` | `--surface-ground` | `#f6f5f1` | **17.17:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#121212` | `--surface-card` | `#ffffff` | **18.73:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#121212` | `inputtext.background` | `#ffffff` | **18.73:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#6f6c66` | `textarea.background` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#6f6c66` | `multiselect.background` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#6f6c66` | `listbox.background` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#6f6c66` | `autocomplete.background` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#6f6c66` | `autocomplete.background` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#6f6c66` | `datepicker.dropdown.background` | `#f1f5f9` | **4.78:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#6f6c66` | `inputtext.background` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#6f6c66` | `cascadeselect.background` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.color` | `#55524c` | `inputtext.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `--surface-ground` | `#f6f5f1` | **5.93:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `inputtext.background` | `#ffffff` | **6.47:1** | 1.4.11 | 3:1 | ok |

#### form field text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `inputtext.color` | `#334155` | `inputtext.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `inputtext.placeholder.color` | `#64748b` | `inputtext.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `select.color` | `#121212` | `select.background` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `select.placeholder.color` | `#64748b` | `select.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.color` | `#334155` | `textarea.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.placeholder.color` | `#64748b` | `textarea.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.color` | `#121212` | `cascadeselect.background` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.placeholder.color` | `#64748b` | `cascadeselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.color` | `#334155` | `multiselect.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.placeholder.color` | `#64748b` | `multiselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.color` | `#334155` | `treeselect.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.placeholder.color` | `#64748b` | `treeselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.color` | `#334155` | `autocomplete.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.placeholder.color` | `#64748b` | `autocomplete.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |

#### form field icon

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.dropdown.color` | `#55524c` | `select.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `multiselect.dropdown.color` | `#55524c` | `multiselect.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.dropdown.color` | `#55524c` | `cascadeselect.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `treeselect.dropdown.color` | `#55524c` | `treeselect.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `password.icon.color` | `#55524c` | `inputtext.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.color` | `#475569` | `autocomplete.dropdown.background` | `#f1f5f9` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.color` | `#475569` | `datepicker.dropdown.background` | `#f1f5f9` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `inputgroup.addon.color` | `#55524c` | `inputgroup.addon.background` | `#ffffff` | **7.78:1** | 1.4.3 | 4.5:1 | ok |

#### float label

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `floatlabel.color` | `#55524c` | `inputtext.background` | `#ffffff` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.active.color` | `#55524c` | `floatlabel.on.active.background` | `#ffffff` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.focus.color` | `#121212` | `floatlabel.on.active.background` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.invalid.color` | `#b91c1c` | `floatlabel.on.active.background` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.color` | `#55524c` | `inputtext.background` | `#ffffff` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.focus.color` | `#121212` | `inputtext.background` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.invalid.color` | `#b91c1c` | `inputtext.background` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.on.active.background` | `#ffffff` | `inputtext.background` | `#ffffff` | **1.00:1** | none | — | info |

#### tag

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `tag.secondary.color` | `#475569` | `tag.secondary.background` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `tag.success.color` | `#15803d` | `tag.success.background` | `#dcfce7` | **4.57:1** | 1.4.3 | 4.5:1 | ok |
| `tag.info.color` | `#0369a1` | `tag.info.background` | `#e0f2fe` | **5.17:1** | 1.4.3 | 4.5:1 | ok |
| `tag.warn.color` | `#c2410c` | `tag.warn.background` | `#ffedd5` | **4.52:1** | 1.4.3 | 4.5:1 | ok |
| `tag.danger.color` | `#b91c1c` | `tag.danger.background` | `#fee2e2` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `tag.contrast.color` | `#ffffff` | `tag.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#8f0e00` | `sunset.tag.primary.background` | `#ffffd8` | **9.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#9a0000` | `fire.tag.primary.background` | `#ffe9e9` | **7.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#75001b` | `coral.tag.primary.background` | `#ffdeff` | **9.67:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#004503` | `forest.tag.primary.background` | `#e1ffff` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#00423a` | `ocean.tag.primary.background` | `#d6ffff` | **10.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#003f55` | `aurora.tag.primary.background` | `#d3ffff` | **10.59:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#0013a0` | `twilight.tag.primary.background` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#85004c` | `mystic.tag.primary.background` | `#ffe0ff` | **8.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#443225` | `stone.tag.primary.background` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#000000` | `contrast.tag.primary.background` | `#dbe3f6` | **16.33:1** | 1.4.3 | 4.5:1 | ok |

#### chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `chip.color` | `#1e293b` | `chip.background` | `#f1f5f9` | **13.35:1** | 1.4.3 | 4.5:1 | ok |
| `chip.remove.icon.color` | `#1e293b` | `chip.background` | `#f1f5f9` | **13.35:1** | 1.4.11 | 3:1 | ok |

#### dialog

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `dialog.color` | `#334155` | `dialog.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#55524c` | `dialog.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |

#### skeleton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `skeleton.background` | `#e2e8f0` | `--surface-ground` | `#f6f5f1` | **1.13:1** | none | — | info |
| `skeleton.background` | `#e2e8f0` | `--surface-card` | `#ffffff` | **1.23:1** | none | — | info |

#### progressbar & slider

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `slider.track.background` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#6f6c66` | `--surface-ground` | `#f6f5f1` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#e2e8f0` | `--surface-ground` | `#f6f5f1` | **1.13:1** | none | — | info |
| `slider.track.background` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#6f6c66` | `--surface-card` | `#ffffff` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#e2e8f0` | `--surface-card` | `#ffffff` | **1.23:1** | none | — | info |
| `sunset.progressbar.value.background` | `#c2410c` | `progressbar.background` | `#e2e8f0` | **4.20:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressbar.label.color` | `#ffffff` | `sunset.progressbar.value.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.progressbar.value.background` | `#cd1d1d` | `progressbar.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `fire.progressbar.label.color` | `#ffffff` | `fire.progressbar.value.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.progressbar.value.background` | `#a8124e` | `progressbar.background` | `#e2e8f0` | **5.95:1** | 1.4.11 | 3:1 | ok |
| `coral.progressbar.label.color` | `#ffffff` | `coral.progressbar.value.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.progressbar.value.background` | `#157836` | `progressbar.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `forest.progressbar.label.color` | `#ffffff` | `forest.progressbar.value.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.progressbar.value.background` | `#0a756d` | `progressbar.background` | `#e2e8f0` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressbar.label.color` | `#ffffff` | `ocean.progressbar.value.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.progressbar.value.background` | `#077288` | `progressbar.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressbar.label.color` | `#ffffff` | `aurora.progressbar.value.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.progressbar.value.background` | `#3346d3` | `progressbar.background` | `#e2e8f0` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressbar.label.color` | `#ffffff` | `twilight.progressbar.value.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.progressbar.value.background` | `#b8147f` | `progressbar.background` | `#e2e8f0` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressbar.label.color` | `#ffffff` | `mystic.progressbar.value.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.progressbar.value.background` | `#776558` | `progressbar.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `stone.progressbar.label.color` | `#ffffff` | `stone.progressbar.value.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.progressbar.value.background` | `#0f172a` | `progressbar.background` | `#e2e8f0` | **14.48:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressbar.label.color` | `#ffffff` | `contrast.progressbar.value.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### togglebutton & selectbutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `togglebutton.color` | `#55524c` | `togglebutton.background` | `#efede7` | **6.65:1** | 1.4.3 | 4.5:1 | ok |
| `togglebutton.hover.color` | `#121212` | `togglebutton.hover.background` | `#eceae3` | **15.56:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.togglebutton.content.checked.background` | `#c2410c` | `togglebutton.background` | `#efede7` | **4.42:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `sunset.togglebutton.content.checked.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.togglebutton.content.checked.background` | `#cd1d1d` | `togglebutton.background` | `#efede7` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `fire.togglebutton.content.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.togglebutton.content.checked.background` | `#a8124e` | `togglebutton.background` | `#efede7` | **6.27:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `coral.togglebutton.content.checked.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.togglebutton.content.checked.background` | `#157836` | `togglebutton.background` | `#efede7` | **4.76:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `forest.togglebutton.content.checked.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.togglebutton.content.checked.background` | `#0a756d` | `togglebutton.background` | `#efede7` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `ocean.togglebutton.content.checked.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.togglebutton.content.checked.background` | `#077288` | `togglebutton.background` | `#efede7` | **4.76:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `aurora.togglebutton.content.checked.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.togglebutton.content.checked.background` | `#3346d3` | `togglebutton.background` | `#efede7` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `twilight.togglebutton.content.checked.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.togglebutton.content.checked.background` | `#b8147f` | `togglebutton.background` | `#efede7` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `mystic.togglebutton.content.checked.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.togglebutton.content.checked.background` | `#776558` | `togglebutton.background` | `#efede7` | **4.74:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `stone.togglebutton.content.checked.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.togglebutton.content.checked.background` | `#0f172a` | `togglebutton.background` | `#efede7` | **15.25:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `contrast.togglebutton.content.checked.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### menu focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `menubar.submenu.icon.color` | `#55524c` | `menubar.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `menubar.submenu.icon.color` | `#55524c` | `menubar.item.focus.background` | `#f1f5f9` | **7.11:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#55524c` | `menubar.background` | `#ffffff` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#55524c` | `menubar.item.focus.background` | `#f1f5f9` | **7.11:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.focus.background` | `#f1f5f9` | `menubar.background` | `#ffffff` | **1.10:1** | none | — | info |
| `sunset.--primary-color-fg (focus ring)` | `#c2410c` | `menubar.item.focus.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (focus ring)` | `#c2410c` | `menubar.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#cd1d1d` | `menubar.item.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#cd1d1d` | `menubar.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#a8124e` | `menubar.item.focus.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#a8124e` | `menubar.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#157836` | `menubar.item.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#157836` | `menubar.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#0a756d` | `menubar.item.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#0a756d` | `menubar.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#077288` | `menubar.item.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#077288` | `menubar.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#3346d3` | `menubar.item.focus.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#3346d3` | `menubar.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#b8147f` | `menubar.item.focus.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#b8147f` | `menubar.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#776558` | `menubar.item.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#776558` | `menubar.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#0f172a` | `menubar.item.focus.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#0f172a` | `menubar.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### option list focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.option.focus.background` | `#f1f5f9` | `select.overlay.background` | `#ffffff` | **1.10:1** | none | — | info |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `select.overlay.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `select.option.focus.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `sunset.select.option.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `sunset.select.option.selected.focus.background` | `#ffffd8` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `select.overlay.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `select.option.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `fire.select.option.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `fire.select.option.selected.focus.background` | `#ffe9e9` | **4.77:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `select.overlay.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `select.option.focus.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `coral.select.option.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `coral.select.option.selected.focus.background` | `#ffdeff` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `select.overlay.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `select.option.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `forest.select.option.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `forest.select.option.selected.focus.background` | `#e1ffff` | **5.29:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `select.overlay.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `select.option.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `ocean.select.option.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `ocean.select.option.selected.focus.background` | `#d6ffff` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `select.overlay.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `select.option.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `aurora.select.option.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `aurora.select.option.selected.focus.background` | `#d3ffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `select.overlay.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `select.option.focus.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `twilight.select.option.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `twilight.select.option.selected.focus.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `select.overlay.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `select.option.focus.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `mystic.select.option.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `mystic.select.option.selected.focus.background` | `#ffe0ff` | **5.04:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `select.overlay.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `select.option.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `stone.select.option.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `stone.select.option.selected.focus.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `select.overlay.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `select.option.focus.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `contrast.select.option.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `contrast.select.option.selected.focus.background` | `#dbe3f6` | **13.88:1** | 1.4.11 | 3:1 | ok |

#### panel outline

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-outline` | `#121212` | `--surface-ground` | `#f6f5f1` | **17.17:1** | 1.4.11 | 3:1 | ok |
| `--style-outline` | `#121212` | `--surface-card` | `#ffffff` | **18.73:1** | 1.4.11 | 3:1 | ok |
| `popover.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `drawer.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |

#### content panel

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `text.color` | `#334155` | `content.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |

#### table & paginator

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `datatable.row.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `paginator.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `datatable.row.color` | `#334155` | `datatable.row.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `paginator.nav.button.color` | `#64748b` | `paginator.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.datatable.row.selected.color` | `#8f0e00` | `sunset.datatable.row.selected.background` | `#fffff2` | **9.34:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.color` | `#ffffff` | `sunset.paginator.nav.button.selected.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.background` | `#c2410c` | `paginator.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.datatable.row.selected.background` | `#fffff2` | `datatable.row.background` | `#ffffff` | **1.01:1** | none | — | info |
| `sunset.--primary-color-fg (selected-row bar)` | `#c2410c` | `sunset.datatable.row.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (selected-row bar)` | `#c2410c` | `datatable.row.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.color` | `#9a0000` | `fire.datatable.row.selected.background` | `#ffffff` | **8.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.color` | `#ffffff` | `fire.paginator.nav.button.selected.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.background` | `#cd1d1d` | `paginator.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `fire.--primary-color-fg (selected-row bar)` | `#cd1d1d` | `fire.datatable.row.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (selected-row bar)` | `#cd1d1d` | `datatable.row.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.color` | `#75001b` | `coral.datatable.row.selected.background` | `#fff8ff` | **11.35:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.color` | `#ffffff` | `coral.paginator.nav.button.selected.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.background` | `#a8124e` | `paginator.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.background` | `#fff8ff` | `datatable.row.background` | `#ffffff` | **1.04:1** | none | — | info |
| `coral.--primary-color-fg (selected-row bar)` | `#a8124e` | `coral.datatable.row.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (selected-row bar)` | `#a8124e` | `datatable.row.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.color` | `#004503` | `forest.datatable.row.selected.background` | `#fbffff` | **11.25:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.color` | `#ffffff` | `forest.paginator.nav.button.selected.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.background` | `#157836` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.background` | `#fbffff` | `datatable.row.background` | `#ffffff` | **1.01:1** | none | — | info |
| `forest.--primary-color-fg (selected-row bar)` | `#157836` | `forest.datatable.row.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (selected-row bar)` | `#157836` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.color` | `#00423a` | `ocean.datatable.row.selected.background` | `#f0ffff` | **11.11:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.color` | `#ffffff` | `ocean.paginator.nav.button.selected.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.background` | `#0a756d` | `paginator.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.background` | `#f0ffff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `ocean.--primary-color-fg (selected-row bar)` | `#0a756d` | `ocean.datatable.row.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (selected-row bar)` | `#0a756d` | `datatable.row.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.color` | `#003f55` | `aurora.datatable.row.selected.background` | `#edffff` | **11.05:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.color` | `#ffffff` | `aurora.paginator.nav.button.selected.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.background` | `#077288` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.background` | `#edffff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `aurora.--primary-color-fg (selected-row bar)` | `#077288` | `aurora.datatable.row.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (selected-row bar)` | `#077288` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.color` | `#0013a0` | `twilight.datatable.row.selected.background` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.color` | `#ffffff` | `twilight.paginator.nav.button.selected.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.background` | `#3346d3` | `paginator.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `twilight.--primary-color-fg (selected-row bar)` | `#3346d3` | `twilight.datatable.row.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (selected-row bar)` | `#3346d3` | `datatable.row.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.color` | `#85004c` | `mystic.datatable.row.selected.background` | `#fffaff` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.color` | `#ffffff` | `mystic.paginator.nav.button.selected.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.background` | `#b8147f` | `paginator.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.background` | `#fffaff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `mystic.--primary-color-fg (selected-row bar)` | `#b8147f` | `mystic.datatable.row.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (selected-row bar)` | `#b8147f` | `datatable.row.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.color` | `#443225` | `stone.datatable.row.selected.background` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.color` | `#ffffff` | `stone.paginator.nav.button.selected.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.background` | `#776558` | `paginator.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `stone.--primary-color-fg (selected-row bar)` | `#776558` | `stone.datatable.row.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (selected-row bar)` | `#776558` | `datatable.row.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.color` | `#000000` | `contrast.datatable.row.selected.background` | `#f5fdff` | **20.38:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.color` | `#ffffff` | `contrast.paginator.nav.button.selected.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.background` | `#0f172a` | `paginator.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.background` | `#f5fdff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `contrast.--primary-color-fg (selected-row bar)` | `#0f172a` | `contrast.datatable.row.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (selected-row bar)` | `#0f172a` | `datatable.row.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### badge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `badge.secondary.color` | `#475569` | `badge.secondary.background` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `badge.success.color` | `#ffffff` | `badge.success.background` | `#15803d` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `badge.info.color` | `#ffffff` | `badge.info.background` | `#1d4ed8` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `badge.warn.color` | `#ffffff` | `badge.warn.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `badge.danger.color` | `#ffffff` | `badge.danger.background` | `#b91c1c` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `badge.contrast.color` | `#ffffff` | `badge.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.badge.primary.color` | `#ffffff` | `sunset.badge.primary.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.badge.primary.color` | `#ffffff` | `fire.badge.primary.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.badge.primary.color` | `#ffffff` | `coral.badge.primary.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.badge.primary.color` | `#ffffff` | `forest.badge.primary.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.badge.primary.color` | `#ffffff` | `ocean.badge.primary.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.badge.primary.color` | `#ffffff` | `aurora.badge.primary.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.badge.primary.color` | `#ffffff` | `twilight.badge.primary.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.badge.primary.color` | `#ffffff` | `mystic.badge.primary.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.badge.primary.color` | `#ffffff` | `stone.badge.primary.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.badge.primary.color` | `#ffffff` | `contrast.badge.primary.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### message & toast

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `message.info.color` | `#1d4ed8` | `message.info.background over --surface-ground` | `#eff6fe` | **6.15:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#1d4ed8` | `--surface-ground` | `#f6f5f1` | **6.14:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#1d4ed8` | `toast.info.background over --surface-ground` | `#eff6fe` | **6.15:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#334155` | `toast.info.background over --surface-ground` | `#eff6fe` | **9.51:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.color` | `#1d4ed8` | `message.info.background over --surface-card` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#1d4ed8` | `toast.info.background over --surface-card` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#334155` | `toast.info.background over --surface-card` | `#f0f6ff` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#15803d` | `message.success.background over --surface-ground` | `#f0fdf4` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#15803d` | `--surface-ground` | `#f6f5f1` | **4.60:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#15803d` | `toast.success.background over --surface-ground` | `#f0fdf4` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#334155` | `toast.success.background over --surface-ground` | `#f0fdf4` | **9.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#15803d` | `message.success.background over --surface-card` | `#f1fdf5` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#15803d` | `toast.success.background over --surface-card` | `#f1fdf5` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#334155` | `toast.success.background over --surface-card` | `#f1fdf5` | **9.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#c2410c` | `message.warn.background over --surface-ground` | `#fefce8` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#c2410c` | `--surface-ground` | `#f6f5f1` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#c2410c` | `toast.warn.background over --surface-ground` | `#fefce8` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#334155` | `toast.warn.background over --surface-ground` | `#fefce8` | **10.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#c2410c` | `message.warn.background over --surface-card` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#c2410c` | `toast.warn.background over --surface-card` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#334155` | `toast.warn.background over --surface-card` | `#fefce9` | **10.02:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#b91c1c` | `message.error.background over --surface-ground` | `#fef2f2` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#b91c1c` | `--surface-ground` | `#f6f5f1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#b91c1c` | `toast.error.background over --surface-ground` | `#fef2f2` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#334155` | `toast.error.background over --surface-ground` | `#fef2f2` | **9.47:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#b91c1c` | `message.error.background over --surface-card` | `#fef3f3` | **5.96:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#b91c1c` | `toast.error.background over --surface-card` | `#fef3f3` | **5.96:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#334155` | `toast.error.background over --surface-card` | `#fef3f3` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#475569` | `message.secondary.background over --surface-ground` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#55524c` | `--surface-ground` | `#f6f5f1` | **7.14:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#475569` | `toast.secondary.background over --surface-ground` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#334155` | `toast.secondary.background over --surface-ground` | `#f1f5f9` | **9.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#475569` | `message.secondary.background over --surface-card` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#55524c` | `--surface-card` | `#ffffff` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#475569` | `toast.secondary.background over --surface-card` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#334155` | `toast.secondary.background over --surface-card` | `#f1f5f9` | **9.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#f8fafc` | `message.contrast.background over --surface-ground` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#121212` | `--surface-ground` | `#f6f5f1` | **17.17:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#f8fafc` | `toast.contrast.background over --surface-ground` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#ffffff` | `toast.contrast.background over --surface-ground` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#f8fafc` | `message.contrast.background over --surface-card` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#121212` | `--surface-card` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#f8fafc` | `toast.contrast.background over --surface-card` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#ffffff` | `toast.contrast.background over --surface-card` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### text & link button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.text.secondary.color` | `#55524c` | `--surface-ground` | `#f6f5f1` | **7.14:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#55524c` | `--surface-card` | `#ffffff` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#15803d` | `--surface-ground` | `#f6f5f1` | **4.60:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#1d4ed8` | `--surface-ground` | `#f6f5f1` | **6.14:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#c2410c` | `--surface-ground` | `#f6f5f1` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#0e7490` | `--surface-ground` | `#f6f5f1` | **4.91:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#b91c1c` | `--surface-ground` | `#f6f5f1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#121212` | `--surface-ground` | `#f6f5f1` | **17.17:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#121212` | `--surface-card` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#121212` | `--surface-ground` | `#f6f5f1` | **17.17:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#121212` | `--surface-card` | `#ffffff` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#c2410c` | `--surface-ground` | `#f6f5f1` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#cd1d1d` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#a8124e` | `--surface-ground` | `#f6f5f1` | **6.73:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#157836` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#0a756d` | `--surface-ground` | `#f6f5f1` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#077288` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#3346d3` | `--surface-ground` | `#f6f5f1` | **6.51:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#b8147f` | `--surface-ground` | `#f6f5f1` | **5.59:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#776558` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#0f172a` | `--surface-ground` | `#f6f5f1` | **16.36:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (contrast)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.contrast.color` | `#ffffff` | `button.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |

#### avatar

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `avatar.color` | `#334155` | `avatar.background` | `#e2e8f0` | **8.40:1** | 1.4.3 | 4.5:1 | ok |

#### image preview

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `image.action.color` | `#f8fafc` | `image.toolbar.background over mask.background over --surface-ground` | `#3b3b3a` | **10.72:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-ground` | `#4f4f4e` | **8.20:1** | 1.4.11 | 3:1 | ok |
| `image.action.color` | `#f8fafc` | `image.toolbar.background over mask.background over --surface-card` | `#3d3d3d` | **10.38:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-card` | `#505050` | **8.06:1** | 1.4.11 | 3:1 | ok |

#### focus ring

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-ground` | `#f6f5f1` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-section` | `#efede7` | **4.42:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `dialog.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `chip.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `paginator.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `datatable.row.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `datatable.row.hover.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `sunset.datatable.row.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.20:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-section` | `#efede7` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `dialog.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `chip.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `paginator.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `datatable.row.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `datatable.row.hover.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `fire.datatable.row.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-ground` | `#f6f5f1` | **6.73:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-section` | `#efede7` | **6.27:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `dialog.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `chip.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `paginator.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `datatable.row.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `datatable.row.hover.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `coral.datatable.row.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `autocomplete.chip.focus.background` | `#e2e8f0` | **5.95:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-section` | `#efede7` | **4.76:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `dialog.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `chip.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `datatable.row.hover.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `forest.datatable.row.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-ground` | `#f6f5f1` | **5.09:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-section` | `#efede7` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `dialog.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `chip.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `paginator.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `datatable.row.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `datatable.row.hover.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `ocean.datatable.row.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-section` | `#efede7` | **4.76:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `dialog.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `chip.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `datatable.row.hover.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `aurora.datatable.row.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-ground` | `#f6f5f1` | **6.51:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-section` | `#efede7` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `dialog.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `chip.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `paginator.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `datatable.row.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `datatable.row.hover.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `twilight.datatable.row.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `autocomplete.chip.focus.background` | `#e2e8f0` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-ground` | `#f6f5f1` | **5.59:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-section` | `#efede7` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `dialog.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `chip.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `paginator.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `datatable.row.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `datatable.row.hover.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `mystic.datatable.row.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-section` | `#efede7` | **4.74:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `dialog.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `chip.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `paginator.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `datatable.row.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `datatable.row.hover.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `stone.datatable.row.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-ground` | `#f6f5f1` | **16.36:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-section` | `#efede7` | **15.25:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `dialog.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `chip.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `paginator.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `datatable.row.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `datatable.row.hover.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `contrast.datatable.row.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `autocomplete.chip.focus.background` | `#e2e8f0` | **14.48:1** | 1.4.11 | 3:1 | ok |

#### progress spinner

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-ground` | `#f6f5f1` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-section` | `#efede7` | **4.42:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-section` | `#efede7` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-ground` | `#f6f5f1` | **6.73:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-section` | `#efede7` | **6.27:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-section` | `#efede7` | **4.76:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-ground` | `#f6f5f1` | **5.09:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-section` | `#efede7` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-ground` | `#f6f5f1` | **5.10:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-section` | `#efede7` | **4.76:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-ground` | `#f6f5f1` | **6.51:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-section` | `#efede7` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-ground` | `#f6f5f1` | **5.59:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-section` | `#efede7` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-ground` | `#f6f5f1` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-section` | `#efede7` | **4.74:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-ground` | `#f6f5f1` | **16.36:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-section` | `#efede7` | **15.25:1** | 1.4.11 | 3:1 | ok |

### dark mode

#### body text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--text-color` | `#f2f1ed` | `--surface-ground` | `#141416` | **16.28:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#a5a29b` | `--surface-ground` | `#141416` | **7.22:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#f2f1ed` | `--surface-card` | `#1d1d21` | **14.86:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#a5a29b` | `--surface-card` | `#1d1d21` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#f2f1ed` | `--surface-section` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#a5a29b` | `--surface-section` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#f2f1ed` | `--surface-hover` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#a5a29b` | `--surface-hover` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |

#### semantic text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--semantic-blue-fg` | `#93c5fd` | `--surface-ground` | `#141416` | **10.20:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-blue-fg` | `#93c5fd` | `--surface-card` | `#1d1d21` | **9.32:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#fdba74` | `--surface-ground` | `#141416` | **10.91:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#fdba74` | `--surface-card` | `#1d1d21` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#86efac` | `--surface-ground` | `#141416` | **13.10:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#86efac` | `--surface-card` | `#1d1d21` | **11.97:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#fca5a5` | `--surface-ground` | `#141416` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#fca5a5` | `--surface-card` | `#1d1d21` | **8.85:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#67e8f9` | `--surface-ground` | `#141416` | **12.69:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#67e8f9` | `--surface-card` | `#1d1d21` | **11.59:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#f9a8d4` | `--surface-ground` | `#141416` | **10.15:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#f9a8d4` | `--surface-card` | `#1d1d21` | **9.26:1** | 1.4.3 | 4.5:1 | ok |

#### dev toggle

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--dev-toggle-fg` | `#86efac` | `color-mix(--dev-toggle-border 15%, --surface-card)` | `#243a2f` | **8.69:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border` | `#4ade80` | `--surface-card` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `--dev-toggle-fg-active` | `#fca5a5` | `color-mix(--dev-toggle-border-active 15%, --surface-card)` | `#3e2a2d` | **7.03:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border-active` | `#f87171` | `--surface-card` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |

#### control boundary

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-border` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#8b8a90` | `--surface-section` | `#26262b` | **4.40:1** | 1.4.11 | 3:1 | ok |

#### floating action button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `.fab-label --text-color` | `#f2f1ed` | `.fab-button --surface-card` | `#1d1d21` | **14.86:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-label --text-color` | `#f2f1ed` | `.fab-button:hover --surface-hover` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-button --fab-edge` | `#f2f1ed` | `--surface-ground` | `#141416` | **16.28:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#f2f1ed` | `--surface-card` | `#1d1d21` | **14.86:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#f2f1ed` | `--surface-section` | `#26262b` | **13.32:1** | 1.4.11 | 3:1 | ok |

#### field placeholder

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-placeholder` | `#a5a29b` | `--surface-section` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |

#### severity button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-from` | `#c22525` | **5.86:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-to` | `#c22525` | **5.86:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-from` | `#2e7d4f` | **5.05:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-to` | `#2e7d4f` | **5.05:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-from` | `#2251c9` | **6.80:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-to` | `#2251c9` | **6.80:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#121212` | `--gradient-warn-from` | `#f0c02e` | **10.96:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#121212` | `--gradient-warn-to` | `#f0c02e` | **10.96:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-from` | `#55524c` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-to` | `#55524c` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-from` | `#121212` | **18.73:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-to` | `#121212` | **18.73:1** | 1.4.3 | 4.5:1 | ok |

#### outlined severity

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--outlined-danger-fg` | `#e05e5e` | `--surface-card` | `#1d1d21` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `success.--outlined-success-fg` | `#38975f` | `--surface-card` | `#1d1d21` | **4.61:1** | 1.4.3 | 4.5:1 | ok |
| `info.--outlined-info-fg` | `#5e84e4` | `--surface-card` | `#1d1d21` | **4.72:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--outlined-warn-fg` | `#f0c02e` | `--surface-card` | `#1d1d21` | **9.83:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--outlined-secondary-fg` | `#8a867d` | `--surface-card` | `#1d1d21` | **4.63:1** | 1.4.3 | 4.5:1 | ok |
| `help.--outlined-help-fg` | `#878787` | `--surface-card` | `#1d1d21` | **4.68:1** | 1.4.3 | 4.5:1 | ok |

#### severity button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-from @brightness(0.92)` | `#b22222` | **5.60:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-to @brightness(0.92)` | `#b22222` | **5.60:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-from @brightness(0.92)` | `#2a7349` | **4.83:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-to @brightness(0.92)` | `#2a7349` | **4.83:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-from @brightness(0.92)` | `#1f4bb9` | **6.37:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-to @brightness(0.92)` | `#1f4bb9` | **6.37:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#141414` | `--gradient-warn-from @brightness(1.1)` | `#ffd333` | **12.82:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#141414` | `--gradient-warn-to @brightness(1.1)` | `#ffd333` | **12.82:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-from @brightness(0.92)` | `#4e4b46` | **7.28:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-to @brightness(0.92)` | `#4e4b46` | **7.28:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(1.1)` | `#ffffff` | `--gradient-help-from @brightness(1.1)` | `#141414` | **18.42:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(1.1)` | `#ffffff` | `--gradient-help-to @brightness(1.1)` | `#141414` | **18.42:1** | 1.4.3 | 4.5:1 | ok |

#### brand chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-brand-ink` | `#ffffff` | `brandScale 500` | `#d92b2b` | **4.85:1** | 1.4.3 | 4.5:1 | ok |

#### brand foreground

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg` | `#fb923c` | `--surface-ground` | `#141416` | **8.13:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-fg` | `#fb923c` | `--surface-card` | `#1d1d21` | **7.42:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#facc15` | `--surface-ground` | `#141416` | **12.01:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#facc15` | `--surface-card` | `#1d1d21` | **10.97:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#f87171` | `--surface-ground` | `#141416` | **6.65:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#f87171` | `--surface-card` | `#1d1d21` | **6.07:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#fbbf24` | `--surface-ground` | `#141416` | **11.02:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#fbbf24` | `--surface-card` | `#1d1d21` | **10.06:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#f472b6` | `--surface-ground` | `#141416` | **6.95:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#f472b6` | `--surface-card` | `#1d1d21` | **6.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#e879c0` | `--surface-ground` | `#141416` | **6.95:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#e879c0` | `--surface-card` | `#1d1d21` | **6.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#4ade80` | `--surface-ground` | `#141416` | **10.56:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#4ade80` | `--surface-card` | `#1d1d21` | **9.64:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#bef264` | `--surface-ground` | `#141416` | **14.08:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#bef264` | `--surface-card` | `#1d1d21` | **12.86:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#2dd4bf` | `--surface-ground` | `#141416` | **9.88:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#2dd4bf` | `--surface-card` | `#1d1d21` | **9.03:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#60a5fa` | `--surface-ground` | `#141416` | **7.24:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#60a5fa` | `--surface-card` | `#1d1d21` | **6.61:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#22d3ee` | `--surface-ground` | `#141416` | **10.18:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#22d3ee` | `--surface-card` | `#1d1d21` | **9.30:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#34d399` | `--surface-ground` | `#141416` | **9.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#34d399` | `--surface-card` | `#1d1d21` | **8.74:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#85a7ff` | `--surface-ground` | `#141416` | **7.86:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#85a7ff` | `--surface-card` | `#1d1d21` | **7.18:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#7dd3fc` | `--surface-ground` | `#141416` | **11.04:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#7dd3fc` | `--surface-card` | `#1d1d21` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#f9a8d4` | `--surface-ground` | `#141416` | **10.15:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#f9a8d4` | `--surface-card` | `#1d1d21` | **9.26:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#fda4af` | `--surface-ground` | `#141416` | **9.73:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#fda4af` | `--surface-card` | `#1d1d21` | **8.88:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#d6d3d1` | `--surface-ground` | `#141416` | **12.35:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#d6d3d1` | `--surface-card` | `#1d1d21` | **11.28:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#fbbf24` | `--surface-ground` | `#141416` | **11.02:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#fbbf24` | `--surface-card` | `#1d1d21` | **10.06:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#f8fafc` | `--surface-ground` | `#141416` | **17.58:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#f8fafc` | `--surface-card` | `#1d1d21` | **16.06:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#e2e8f0` | `--surface-ground` | `#141416` | **14.92:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#e2e8f0` | `--surface-card` | `#1d1d21` | **13.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--primary-color` | `#9a3412` | **7.31:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--gradient-accent-color` | `#854d0e` | **6.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--primary-color` | `#a71818` | **7.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--gradient-accent-color` | `#785307` | **6.91:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--primary-color` | `#880f3f` | **9.60:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--gradient-accent-color` | `#971f64` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--primary-color` | `#11612c` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--gradient-accent-color` | `#475a07` | **7.68:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--primary-color` | `#086058` | **7.44:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--gradient-accent-color` | `#1151d0` | **6.75:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--primary-color` | `#065d6e` | **7.50:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--gradient-accent-color` | `#12683d` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--primary-color` | `#2638b0` | **9.23:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--gradient-accent-color` | `#075985` | **7.56:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--primary-color` | `#9a116a` | **7.89:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--gradient-accent-color` | `#af133e` | **7.03:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--primary-color` | `#605247` | **7.51:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--gradient-accent-color` | `#854e17` | **6.78:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#1e293b` | `contrast.--primary-color` | `#f8fafc` | **13.98:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#1e293b` | `contrast.--gradient-accent-color` | `#e2e8f0` | **11.87:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--primary-color @brightness(0.92)` | `#8e3011` | **6.82:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--gradient-accent-color @brightness(0.92)` | `#7a470d` | **6.44:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--primary-color @brightness(0.92)` | `#9a1616` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--gradient-accent-color @brightness(0.92)` | `#6e4c06` | **6.53:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--primary-color @brightness(0.92)` | `#7d0e3a` | **8.83:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--gradient-accent-color @brightness(0.92)` | `#8b1d5c` | **7.25:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--primary-color @brightness(0.92)` | `#105928` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--gradient-accent-color @brightness(0.92)` | `#415306` | **7.15:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--primary-color @brightness(0.92)` | `#075851` | **6.98:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--gradient-accent-color @brightness(0.92)` | `#104bbf` | **6.33:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--primary-color @brightness(0.92)` | `#065665` | **6.97:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--gradient-accent-color @brightness(0.92)` | `#116038` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--primary-color @brightness(0.92)` | `#2334a2` | **8.45:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--gradient-accent-color @brightness(0.92)` | `#06527a` | **7.06:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--primary-color @brightness(0.92)` | `#8e1062` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--gradient-accent-color @brightness(0.92)` | `#a11139` | **6.64:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--primary-color @brightness(0.92)` | `#584b41` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--gradient-accent-color @brightness(0.92)` | `#7a4815` | **6.37:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#212d41` | `contrast.--primary-color @brightness(1.1)` | `#ffffff` | **13.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#212d41` | `contrast.--gradient-accent-color @brightness(1.1)` | `#f9ffff` | **13.70:1** | 1.4.3 | 4.5:1 | ok |

#### accent surface

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--accent-on-surface` | `#ffdaa5` | `sunset.--accent-surface` | `#430000` | **12.78:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--accent-on-surface` | `#ffb6b6` | `fire.--accent-surface` | `#4e0000` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--accent-on-surface` | `#ffabe7` | `coral.--accent-surface` | `#290000` | **11.18:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--accent-on-surface` | `#aeffcf` | `forest.--accent-surface` | `#000000` | **18.00:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--accent-on-surface` | `#a3ffff` | `ocean.--accent-surface` | `#000000` | **18.31:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--accent-on-surface` | `#a0ffff` | `aurora.--accent-surface` | `#000009` | **18.17:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--accent-on-surface` | `#ccdfff` | `twilight.--accent-surface` | `#000054` | **13.80:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--accent-on-surface` | `#ffadff` | `mystic.--accent-surface` | `#390000` | **10.80:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--accent-on-surface` | `#fffef1` | `stone.--accent-surface` | `#000000` | **20.70:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--accent-on-surface` | `#a8b0c3` | `contrast.--accent-surface` | `#000000` | **9.66:1** | 1.4.3 | 4.5:1 | ok |

#### checkbox & radiobutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `checkbox.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `checkbox.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#fb923c` | `--surface-ground` | `#141416` | **8.13:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#fb923c` | `--surface-card` | `#1d1d21` | **7.42:1** | 1.4.11 | 3:1 | ok |
| `sunset.checkbox.icon.checked.color` | `#18181b` | `sunset.checkbox.checked.background` | `#fb923c` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#f87171` | `--surface-ground` | `#141416` | **6.65:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#f87171` | `--surface-card` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `fire.checkbox.icon.checked.color` | `#18181b` | `fire.checkbox.checked.background` | `#f87171` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#f472b6` | `--surface-ground` | `#141416` | **6.95:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#f472b6` | `--surface-card` | `#1d1d21` | **6.34:1** | 1.4.11 | 3:1 | ok |
| `coral.checkbox.icon.checked.color` | `#18181b` | `coral.checkbox.checked.background` | `#f472b6` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#4ade80` | `--surface-ground` | `#141416` | **10.56:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#4ade80` | `--surface-card` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `forest.checkbox.icon.checked.color` | `#18181b` | `forest.checkbox.checked.background` | `#4ade80` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#2dd4bf` | `--surface-ground` | `#141416` | **9.88:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#2dd4bf` | `--surface-card` | `#1d1d21` | **9.03:1** | 1.4.11 | 3:1 | ok |
| `ocean.checkbox.icon.checked.color` | `#18181b` | `ocean.checkbox.checked.background` | `#2dd4bf` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#22d3ee` | `--surface-ground` | `#141416` | **10.18:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#22d3ee` | `--surface-card` | `#1d1d21` | **9.30:1** | 1.4.11 | 3:1 | ok |
| `aurora.checkbox.icon.checked.color` | `#18181b` | `aurora.checkbox.checked.background` | `#22d3ee` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#85a7ff` | `--surface-ground` | `#141416` | **7.86:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#85a7ff` | `--surface-card` | `#1d1d21` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.checkbox.icon.checked.color` | `#18181b` | `twilight.checkbox.checked.background` | `#85a7ff` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#f9a8d4` | `--surface-ground` | `#141416` | **10.15:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#f9a8d4` | `--surface-card` | `#1d1d21` | **9.26:1** | 1.4.11 | 3:1 | ok |
| `mystic.checkbox.icon.checked.color` | `#18181b` | `mystic.checkbox.checked.background` | `#f9a8d4` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#d6d3d1` | `--surface-ground` | `#141416` | **12.35:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#d6d3d1` | `--surface-card` | `#1d1d21` | **11.28:1** | 1.4.11 | 3:1 | ok |
| `stone.checkbox.icon.checked.color` | `#18181b` | `stone.checkbox.checked.background` | `#d6d3d1` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#f8fafc` | `--surface-ground` | `#141416` | **17.58:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#f8fafc` | `--surface-card` | `#1d1d21` | **16.06:1** | 1.4.11 | 3:1 | ok |
| `contrast.checkbox.icon.checked.color` | `#18181b` | `contrast.checkbox.checked.background` | `#f8fafc` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### toggleswitch

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `toggleswitch.background` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.background` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.handle.background` | `#1d1d21` | `toggleswitch.background` | `#8b8a90` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `sunset.toggleswitch.handle.checked.background` | `#18181b` | `sunset.toggleswitch.checked.background` | `#fb923c` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.toggleswitch.handle.checked.background` | `#18181b` | `fire.toggleswitch.checked.background` | `#f87171` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.toggleswitch.handle.checked.background` | `#18181b` | `coral.toggleswitch.checked.background` | `#f472b6` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.toggleswitch.handle.checked.background` | `#18181b` | `forest.toggleswitch.checked.background` | `#4ade80` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.toggleswitch.handle.checked.background` | `#18181b` | `ocean.toggleswitch.checked.background` | `#2dd4bf` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.toggleswitch.handle.checked.background` | `#18181b` | `aurora.toggleswitch.checked.background` | `#22d3ee` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.toggleswitch.handle.checked.background` | `#18181b` | `twilight.toggleswitch.checked.background` | `#85a7ff` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.toggleswitch.handle.checked.background` | `#18181b` | `mystic.toggleswitch.checked.background` | `#f9a8d4` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.toggleswitch.handle.checked.background` | `#18181b` | `stone.toggleswitch.checked.background` | `#d6d3d1` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.toggleswitch.handle.checked.background` | `#18181b` | `contrast.toggleswitch.checked.background` | `#f8fafc` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### form field edge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#8b8a90` | `select.background` | `#26262b` | **4.40:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#f2f1ed` | `--surface-ground` | `#141416` | **16.28:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#f2f1ed` | `--surface-card` | `#1d1d21` | **14.86:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#f2f1ed` | `inputtext.background` | `#26262b` | **13.32:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#8b8a90` | `textarea.background` | `#26262b` | **4.40:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#8b8a90` | `multiselect.background` | `#26262b` | **4.40:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#8b8a90` | `listbox.background` | `#09090b` | **5.81:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#8b8a90` | `autocomplete.background` | `#26262b` | **4.40:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#8b8a90` | `autocomplete.background` | `#26262b` | **4.40:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#8b8a90` | `datepicker.dropdown.background` | `#27272a` | **4.35:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#8b8a90` | `inputtext.background` | `#26262b` | **4.40:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#8b8a90` | `cascadeselect.background` | `#26262b` | **4.40:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.color` | `#a5a29b` | `inputtext.background` | `#26262b` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `--surface-ground` | `#141416` | **9.69:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `--surface-card` | `#1d1d21` | **8.85:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `inputtext.background` | `#26262b` | **7.93:1** | 1.4.11 | 3:1 | ok |

#### form field text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `inputtext.color` | `#f2f1ed` | `inputtext.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `inputtext.placeholder.color` | `#a5a29b` | `inputtext.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `select.color` | `#f2f1ed` | `select.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `select.placeholder.color` | `#a5a29b` | `select.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.color` | `#f2f1ed` | `textarea.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.placeholder.color` | `#a5a29b` | `textarea.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.color` | `#f2f1ed` | `cascadeselect.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.placeholder.color` | `#a5a29b` | `cascadeselect.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.color` | `#f2f1ed` | `multiselect.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.placeholder.color` | `#a5a29b` | `multiselect.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.color` | `#f2f1ed` | `treeselect.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.placeholder.color` | `#a5a29b` | `treeselect.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.color` | `#f2f1ed` | `autocomplete.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.placeholder.color` | `#a5a29b` | `autocomplete.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |

#### form field icon

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.dropdown.color` | `#a5a29b` | `select.background` | `#26262b` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `multiselect.dropdown.color` | `#a5a29b` | `multiselect.background` | `#26262b` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.dropdown.color` | `#a5a29b` | `cascadeselect.background` | `#26262b` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `treeselect.dropdown.color` | `#a5a29b` | `treeselect.background` | `#26262b` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `password.icon.color` | `#a5a29b` | `inputtext.background` | `#26262b` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.color` | `#d4d4d8` | `autocomplete.dropdown.background` | `#27272a` | **10.08:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.color` | `#d4d4d8` | `datepicker.dropdown.background` | `#27272a` | **10.08:1** | 1.4.11 | 3:1 | ok |
| `inputgroup.addon.color` | `#a5a29b` | `inputgroup.addon.background` | `#09090b` | **7.81:1** | 1.4.3 | 4.5:1 | ok |

#### float label

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `floatlabel.color` | `#a5a29b` | `inputtext.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.active.color` | `#a5a29b` | `floatlabel.on.active.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.focus.color` | `#f2f1ed` | `floatlabel.on.active.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.invalid.color` | `#fca5a5` | `floatlabel.on.active.background` | `#26262b` | **7.93:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.color` | `#a5a29b` | `inputtext.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.focus.color` | `#f2f1ed` | `inputtext.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.invalid.color` | `#fca5a5` | `inputtext.background` | `#26262b` | **7.93:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.on.active.background` | `#26262b` | `inputtext.background` | `#26262b` | **1.00:1** | none | — | info |

#### tag

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `tag.secondary.color (styles.scss)` | `#ffffff` | `tag.secondary.background (styles.scss)` | `#475569` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `tag.success.color (styles.scss)` | `#ffffff` | `tag.success.background (styles.scss)` | `#15803d` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `tag.info.color (styles.scss)` | `#ffffff` | `tag.info.background (styles.scss)` | `#0369a1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `tag.warn.color (styles.scss)` | `#ffffff` | `tag.warn.background (styles.scss)` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `tag.danger.color (styles.scss)` | `#ffffff` | `tag.danger.background (styles.scss)` | `#b91c1c` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `tag.contrast.color` | `#09090b` | `tag.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#fff8a2` | `sunset.tag.primary.background over --surface-ground` | `#39281c` | **12.85:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#fff8a2` | `sunset.tag.primary.background over --surface-card` | `#413025` | **11.47:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#ffd7d7` | `fire.tag.primary.background over --surface-ground` | `#382325` | **11.12:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#ffd7d7` | `fire.tag.primary.background over --surface-card` | `#402a2e` | **10.04:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#ffd8ff` | `coral.tag.primary.background over --surface-ground` | `#382330` | **11.38:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#ffd8ff` | `coral.tag.primary.background over --surface-card` | `#3f2b39` | **10.22:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#b0ffe6` | `forest.tag.primary.background over --surface-ground` | `#1d3427` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#b0ffe6` | `forest.tag.primary.background over --surface-card` | `#243c30` | **10.37:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#93ffff` | `ocean.tag.primary.background over --surface-ground` | `#183331` | **11.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#93ffff` | `ocean.tag.primary.background over --surface-card` | `#203a3a` | **10.41:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#88ffff` | `aurora.tag.primary.background over --surface-ground` | `#163339` | **11.36:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#88ffff` | `aurora.tag.primary.background over --surface-card` | `#1e3a42` | **10.23:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#ebffff` | `twilight.tag.primary.background over --surface-ground` | `#262c3b` | **13.47:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#ebffff` | `twilight.tag.primary.background over --surface-card` | `#2e3345` | **12.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#ffffff` | `mystic.tag.primary.background over --surface-ground` | `#392c34` | **13.26:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#ffffff` | `mystic.tag.primary.background over --surface-card` | `#40333e` | **11.92:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#ffffff` | `stone.tag.primary.background over --surface-ground` | `#333334` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#ffffff` | `stone.tag.primary.background over --surface-card` | `#3b3a3d` | **11.30:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#ffffff` | `contrast.tag.primary.background over --surface-ground` | `#38393b` | **11.56:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#ffffff` | `contrast.tag.primary.background over --surface-card` | `#404044` | **10.32:1** | 1.4.3 | 4.5:1 | ok |

#### chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `chip.color` | `#ffffff` | `chip.background` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `chip.remove.icon.color` | `#ffffff` | `chip.background` | `#27272a` | **14.89:1** | 1.4.11 | 3:1 | ok |

#### dialog

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `dialog.color` | `#ffffff` | `dialog.background` | `#18181b` | **17.72:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#a5a29b` | `dialog.background` | `#18181b` | **6.95:1** | 1.4.11 | 3:1 | ok |

#### skeleton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `skeleton.background` | `#222224` | `--surface-ground` | `#141416` | **1.16:1** | none | — | info |
| `skeleton.background` | `#2b2b2e` | `--surface-card` | `#1d1d21` | **1.19:1** | none | — | info |

#### progressbar & slider

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `slider.track.background` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#8b8a90` | `--surface-ground` | `#141416` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#3f3f46` | `--surface-ground` | `#141416` | **1.76:1** | none | — | info |
| `slider.track.background` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#8b8a90` | `--surface-card` | `#1d1d21` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#3f3f46` | `--surface-card` | `#1d1d21` | **1.61:1** | none | — | info |
| `sunset.progressbar.value.background` | `#fb923c` | `progressbar.background` | `#3f3f46` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressbar.label.color` | `#18181b` | `sunset.progressbar.value.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `fire.progressbar.value.background` | `#f87171` | `progressbar.background` | `#3f3f46` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `fire.progressbar.label.color` | `#18181b` | `fire.progressbar.value.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `coral.progressbar.value.background` | `#f472b6` | `progressbar.background` | `#3f3f46` | **3.94:1** | 1.4.11 | 3:1 | ok |
| `coral.progressbar.label.color` | `#18181b` | `coral.progressbar.value.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `forest.progressbar.value.background` | `#4ade80` | `progressbar.background` | `#3f3f46` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `forest.progressbar.label.color` | `#18181b` | `forest.progressbar.value.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.progressbar.value.background` | `#2dd4bf` | `progressbar.background` | `#3f3f46` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressbar.label.color` | `#18181b` | `ocean.progressbar.value.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.progressbar.value.background` | `#22d3ee` | `progressbar.background` | `#3f3f46` | **5.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressbar.label.color` | `#18181b` | `aurora.progressbar.value.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.progressbar.value.background` | `#85a7ff` | `progressbar.background` | `#3f3f46` | **4.46:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressbar.label.color` | `#18181b` | `twilight.progressbar.value.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.progressbar.value.background` | `#f9a8d4` | `progressbar.background` | `#3f3f46` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressbar.label.color` | `#18181b` | `mystic.progressbar.value.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `stone.progressbar.value.background` | `#d6d3d1` | `progressbar.background` | `#3f3f46` | **7.01:1** | 1.4.11 | 3:1 | ok |
| `stone.progressbar.label.color` | `#18181b` | `stone.progressbar.value.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.progressbar.value.background` | `#f8fafc` | `progressbar.background` | `#3f3f46` | **9.98:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressbar.label.color` | `#18181b` | `contrast.progressbar.value.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |

#### togglebutton & selectbutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `togglebutton.color` | `#a5a29b` | `togglebutton.background` | `#26262b` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `togglebutton.hover.color` | `#f2f1ed` | `togglebutton.hover.background` | `#26262b` | **13.32:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.togglebutton.content.checked.background` | `#fb923c` | `togglebutton.background` | `#26262b` | **6.65:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `sunset.togglebutton.content.checked.background` | `#fb923c` | **7.42:1** | 1.4.3 | 4.5:1 | ok |
| `fire.togglebutton.content.checked.background` | `#f87171` | `togglebutton.background` | `#26262b` | **5.44:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `fire.togglebutton.content.checked.background` | `#f87171` | **6.07:1** | 1.4.3 | 4.5:1 | ok |
| `coral.togglebutton.content.checked.background` | `#f472b6` | `togglebutton.background` | `#26262b` | **5.69:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `coral.togglebutton.content.checked.background` | `#f472b6` | **6.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.togglebutton.content.checked.background` | `#4ade80` | `togglebutton.background` | `#26262b` | **8.64:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `forest.togglebutton.content.checked.background` | `#4ade80` | **9.64:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.togglebutton.content.checked.background` | `#2dd4bf` | `togglebutton.background` | `#26262b` | **8.09:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `ocean.togglebutton.content.checked.background` | `#2dd4bf` | **9.03:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.togglebutton.content.checked.background` | `#22d3ee` | `togglebutton.background` | `#26262b` | **8.33:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `aurora.togglebutton.content.checked.background` | `#22d3ee` | **9.30:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.togglebutton.content.checked.background` | `#85a7ff` | `togglebutton.background` | `#26262b` | **6.43:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `twilight.togglebutton.content.checked.background` | `#85a7ff` | **7.18:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.togglebutton.content.checked.background` | `#f9a8d4` | `togglebutton.background` | `#26262b` | **8.30:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `mystic.togglebutton.content.checked.background` | `#f9a8d4` | **9.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.togglebutton.content.checked.background` | `#d6d3d1` | `togglebutton.background` | `#26262b` | **10.11:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `stone.togglebutton.content.checked.background` | `#d6d3d1` | **11.28:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.togglebutton.content.checked.background` | `#f8fafc` | `togglebutton.background` | `#26262b` | **14.39:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#1d1d21` | `contrast.togglebutton.content.checked.background` | `#f8fafc` | **16.06:1** | 1.4.3 | 4.5:1 | ok |

#### menu focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `menubar.submenu.icon.color` | `#a5a29b` | `menubar.background` | `#18181b` | **6.95:1** | 1.4.11 | 3:1 | ok |
| `menubar.submenu.icon.color` | `#a5a29b` | `menubar.item.focus.background` | `#27272a` | **5.85:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#a5a29b` | `menubar.background` | `#18181b` | **6.95:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#a5a29b` | `menubar.item.focus.background` | `#27272a` | **5.85:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.focus.background` | `#27272a` | `menubar.background` | `#18181b` | **1.19:1** | none | — | info |
| `sunset.--primary-color-fg (focus ring)` | `#fb923c` | `menubar.item.focus.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (focus ring)` | `#fb923c` | `menubar.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#f87171` | `menubar.item.focus.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#f87171` | `menubar.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#f472b6` | `menubar.item.focus.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#f472b6` | `menubar.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#4ade80` | `menubar.item.focus.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#4ade80` | `menubar.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#2dd4bf` | `menubar.item.focus.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#2dd4bf` | `menubar.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#22d3ee` | `menubar.item.focus.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#22d3ee` | `menubar.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#85a7ff` | `menubar.item.focus.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#85a7ff` | `menubar.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#f9a8d4` | `menubar.item.focus.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#f9a8d4` | `menubar.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#d6d3d1` | `menubar.item.focus.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#d6d3d1` | `menubar.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#f8fafc` | `menubar.item.focus.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#f8fafc` | `menubar.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### option list focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.option.focus.background` | `#27272a` | `select.overlay.background` | `#18181b` | **1.19:1** | none | — | info |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **7.42:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `select.option.focus.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.select.option.selected.background` | `#41382d` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.select.option.selected.focus.background` | `#41382d` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **6.65:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `multiselect.overlay.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.multiselect.option.selected.background` | `#3d3428` | **5.39:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.multiselect.option.selected.focus.background` | `#4f422f` | **4.31:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `listbox.background` | `#09090b` | **8.79:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.listbox.option.selected.background` | `#30271b` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.listbox.option.selected.focus.background` | `#443623` | **5.16:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `select.option.focus.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.select.option.selected.background` | `#413336` | **4.33:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.select.option.selected.focus.background` | `#413336` | **4.33:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **5.44:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `multiselect.overlay.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.multiselect.option.selected.background` | `#3d2e31` | **4.65:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.multiselect.option.selected.focus.background` | `#4f3a3c` | **3.79:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `listbox.background` | `#09090b` | **7.19:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.listbox.option.selected.background` | `#302223` | **5.51:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.listbox.option.selected.focus.background` | `#442e30` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **6.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `select.option.focus.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.select.option.selected.background` | `#413341` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.select.option.selected.focus.background` | `#413341` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **5.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `multiselect.overlay.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.multiselect.option.selected.background` | `#3d2f3c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.multiselect.option.selected.focus.background` | `#4f3a4c` | **3.88:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `listbox.background` | `#09090b` | **7.51:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.listbox.option.selected.background` | `#30222f` | **5.68:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.listbox.option.selected.focus.background` | `#442e40` | **4.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `select.option.focus.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.select.option.selected.background` | `#2c4138` | **6.28:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.select.option.selected.focus.background` | `#2c4138` | **6.28:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **8.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `multiselect.overlay.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.multiselect.option.selected.background` | `#283d33` | **6.67:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.multiselect.option.selected.focus.background` | `#304f3f` | **5.20:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `listbox.background` | `#09090b` | **11.42:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.listbox.option.selected.background` | `#1c3026` | **8.03:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.listbox.option.selected.focus.background` | `#254433` | **6.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **9.03:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `select.option.focus.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.select.option.selected.background` | `#284142` | **5.86:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.select.option.selected.focus.background` | `#284142` | **5.86:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **8.09:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `multiselect.overlay.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.multiselect.option.selected.background` | `#243d3d` | **6.23:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.multiselect.option.selected.focus.background` | `#294f4f` | **4.85:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `listbox.background` | `#09090b` | **10.69:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.listbox.option.selected.background` | `#173030` | **7.51:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.listbox.option.selected.focus.background` | `#1e4442` | **5.75:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **9.30:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `select.option.focus.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.select.option.selected.background` | `#264145` | **6.04:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.select.option.selected.focus.background` | `#264145` | **6.04:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **8.33:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `multiselect.overlay.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.multiselect.option.selected.background` | `#223d3f` | **6.43:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.multiselect.option.selected.focus.background` | `#274f52` | **4.99:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `listbox.background` | `#09090b` | **11.01:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.listbox.option.selected.background` | `#153032` | **7.74:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.listbox.option.selected.focus.background` | `#1b4446` | **5.92:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `select.option.focus.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.select.option.selected.background` | `#363b45` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.select.option.selected.focus.background` | `#363b45` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **6.43:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `multiselect.overlay.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.multiselect.option.selected.background` | `#32373f` | **5.11:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.multiselect.option.selected.focus.background` | `#3e4752` | **4.03:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `listbox.background` | `#09090b` | **8.50:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.listbox.option.selected.background` | `#252a32` | **6.16:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.listbox.option.selected.focus.background` | `#333b46` | **4.84:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **9.26:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `select.option.focus.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.select.option.selected.background` | `#413b45` | **5.98:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.select.option.selected.focus.background` | `#413b45` | **5.98:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **8.30:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `multiselect.overlay.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.multiselect.option.selected.background` | `#3d373f` | **6.37:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.multiselect.option.selected.focus.background` | `#4f4752` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `listbox.background` | `#09090b` | **10.97:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.listbox.option.selected.background` | `#302b32` | **7.63:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.listbox.option.selected.focus.background` | `#443b46` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **11.28:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `select.option.focus.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.select.option.selected.background` | `#414145` | **6.82:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.select.option.selected.focus.background` | `#414145` | **6.82:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **10.11:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `multiselect.overlay.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.multiselect.option.selected.background` | `#3d3d3f` | **7.28:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.multiselect.option.selected.focus.background` | `#4f4f52` | **5.48:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `listbox.background` | `#09090b` | **13.36:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.listbox.option.selected.background` | `#303032` | **8.84:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.listbox.option.selected.focus.background` | `#444446` | **6.52:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `--surface-card (.dark-theme .p-select-overlay)` | `#1d1d21` | **16.06:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `select.option.focus.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.select.option.selected.background` | `#414145` | **9.71:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.select.option.selected.focus.background` | `#414145` | **9.71:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#26262b` | **14.39:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `multiselect.overlay.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.multiselect.option.selected.background` | `#3d3d3f` | **10.36:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.multiselect.option.selected.focus.background` | `#4f4f52` | **7.80:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `listbox.background` | `#09090b` | **19.02:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.listbox.option.selected.background` | `#303032` | **12.59:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.listbox.option.selected.focus.background` | `#444446` | **9.29:1** | 1.4.11 | 3:1 | ok |

#### panel outline

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-outline` | `#f2f1ed` | `--surface-ground` | `#141416` | **16.28:1** | 1.4.11 | 3:1 | ok |
| `--style-outline` | `#f2f1ed` | `--surface-card` | `#1d1d21` | **14.86:1** | 1.4.11 | 3:1 | ok |
| `popover.background` | `#18181b` | `--surface-card` | `#1d1d21` | **1.05:1** | none | — | info |
| `drawer.background` | `#18181b` | `--surface-card` | `#1d1d21` | **1.05:1** | none | — | info |

#### content panel

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `text.color` | `#ffffff` | `content.background` | `#18181b` | **17.72:1** | 1.4.3 | 4.5:1 | ok |

#### table & paginator

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `datatable.row.background` | `#1d1d21` | `--surface-card` | `#1d1d21` | **1.00:1** | none | — | info |
| `paginator.background` | `#1d1d21` | `--surface-card` | `#1d1d21` | **1.00:1** | none | — | info |
| `datatable.row.color` | `#ffffff` | `datatable.row.background` | `#1d1d21` | **16.80:1** | 1.4.3 | 4.5:1 | ok |
| `paginator.nav.button.color` | `#a1a1aa` | `paginator.background` | `#1d1d21` | **6.56:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.datatable.row.selected.color` | `#e6e5e4` | `sunset.datatable.row.selected.background` | `#41382d` | **9.13:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.color` | `#18181b` | `sunset.paginator.nav.button.selected.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.background` | `#fb923c` | `paginator.background` | `#1d1d21` | **7.42:1** | 1.4.11 | 3:1 | ok |
| `sunset.datatable.row.selected.background` | `#41382d` | `datatable.row.background` | `#1d1d21` | **1.46:1** | none | — | info |
| `sunset.--primary-color-fg (selected-row bar)` | `#fb923c` | `sunset.datatable.row.selected.background` | `#41382d` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (selected-row bar)` | `#fb923c` | `datatable.row.background` | `#1d1d21` | **7.42:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.color` | `#e6e4e5` | `fire.datatable.row.selected.background` | `#413336` | **9.47:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.color` | `#18181b` | `fire.paginator.nav.button.selected.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.background` | `#f87171` | `paginator.background` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.background` | `#413336` | `datatable.row.background` | `#1d1d21` | **1.40:1** | none | — | info |
| `fire.--primary-color-fg (selected-row bar)` | `#f87171` | `fire.datatable.row.selected.background` | `#413336` | **4.33:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (selected-row bar)` | `#f87171` | `datatable.row.background` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.color` | `#e6e4e6` | `coral.datatable.row.selected.background` | `#413341` | **9.36:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.color` | `#18181b` | `coral.paginator.nav.button.selected.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.background` | `#f472b6` | `paginator.background` | `#1d1d21` | **6.34:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.background` | `#413341` | `datatable.row.background` | `#1d1d21` | **1.42:1** | none | — | info |
| `coral.--primary-color-fg (selected-row bar)` | `#f472b6` | `coral.datatable.row.selected.background` | `#413341` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (selected-row bar)` | `#f472b6` | `datatable.row.background` | `#1d1d21` | **6.34:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.color` | `#e4e6e5` | `forest.datatable.row.selected.background` | `#2c4138` | **8.72:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.color` | `#18181b` | `forest.paginator.nav.button.selected.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.background` | `#4ade80` | `paginator.background` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.background` | `#2c4138` | `datatable.row.background` | `#1d1d21` | **1.54:1** | none | — | info |
| `forest.--primary-color-fg (selected-row bar)` | `#4ade80` | `forest.datatable.row.selected.background` | `#2c4138` | **6.28:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (selected-row bar)` | `#4ade80` | `datatable.row.background` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.color` | `#e3e6e6` | `ocean.datatable.row.selected.background` | `#284142` | **8.69:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.color` | `#18181b` | `ocean.paginator.nav.button.selected.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.background` | `#2dd4bf` | `paginator.background` | `#1d1d21` | **9.03:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.background` | `#284142` | `datatable.row.background` | `#1d1d21` | **1.54:1** | none | — | info |
| `ocean.--primary-color-fg (selected-row bar)` | `#2dd4bf` | `ocean.datatable.row.selected.background` | `#284142` | **5.86:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (selected-row bar)` | `#2dd4bf` | `datatable.row.background` | `#1d1d21` | **9.03:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.color` | `#e3e6e7` | `aurora.datatable.row.selected.background` | `#264145` | **8.70:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.color` | `#18181b` | `aurora.paginator.nav.button.selected.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.background` | `#22d3ee` | `paginator.background` | `#1d1d21` | **9.30:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.background` | `#264145` | `datatable.row.background` | `#1d1d21` | **1.54:1** | none | — | info |
| `aurora.--primary-color-fg (selected-row bar)` | `#22d3ee` | `aurora.datatable.row.selected.background` | `#264145` | **6.04:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (selected-row bar)` | `#22d3ee` | `datatable.row.background` | `#1d1d21` | **9.30:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.color` | `#e5e6e7` | `twilight.datatable.row.selected.background` | `#363b45` | **8.99:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.color` | `#18181b` | `twilight.paginator.nav.button.selected.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.background` | `#85a7ff` | `paginator.background` | `#1d1d21` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.background` | `#363b45` | `datatable.row.background` | `#1d1d21` | **1.49:1** | none | — | info |
| `twilight.--primary-color-fg (selected-row bar)` | `#85a7ff` | `twilight.datatable.row.selected.background` | `#363b45` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (selected-row bar)` | `#85a7ff` | `datatable.row.background` | `#1d1d21` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.color` | `#e6e6e7` | `mystic.datatable.row.selected.background` | `#413b45` | **8.70:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.color` | `#18181b` | `mystic.paginator.nav.button.selected.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.background` | `#f9a8d4` | `paginator.background` | `#1d1d21` | **9.26:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.background` | `#413b45` | `datatable.row.background` | `#1d1d21` | **1.55:1** | none | — | info |
| `mystic.--primary-color-fg (selected-row bar)` | `#f9a8d4` | `mystic.datatable.row.selected.background` | `#413b45` | **5.98:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (selected-row bar)` | `#f9a8d4` | `datatable.row.background` | `#1d1d21` | **9.26:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.color` | `#e6e6e7` | `stone.datatable.row.selected.background` | `#414145` | **8.15:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.color` | `#18181b` | `stone.paginator.nav.button.selected.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.background` | `#d6d3d1` | `paginator.background` | `#1d1d21` | **11.28:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.background` | `#414145` | `datatable.row.background` | `#1d1d21` | **1.65:1** | none | — | info |
| `stone.--primary-color-fg (selected-row bar)` | `#d6d3d1` | `stone.datatable.row.selected.background` | `#414145` | **6.82:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (selected-row bar)` | `#d6d3d1` | `datatable.row.background` | `#1d1d21` | **11.28:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.color` | `#e6e6e7` | `contrast.datatable.row.selected.background` | `#414145` | **8.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.color` | `#18181b` | `contrast.paginator.nav.button.selected.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.background` | `#f8fafc` | `paginator.background` | `#1d1d21` | **16.06:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.background` | `#414145` | `datatable.row.background` | `#1d1d21` | **1.65:1** | none | — | info |
| `contrast.--primary-color-fg (selected-row bar)` | `#f8fafc` | `contrast.datatable.row.selected.background` | `#414145` | **9.71:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (selected-row bar)` | `#f8fafc` | `datatable.row.background` | `#1d1d21` | **16.06:1** | 1.4.11 | 3:1 | ok |

#### badge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `badge.secondary.color` | `#d4d4d8` | `badge.secondary.background` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `badge.success.color` | `#052e16` | `badge.success.background` | `#86efac` | **10.62:1** | 1.4.3 | 4.5:1 | ok |
| `badge.info.color` | `#172554` | `badge.info.background` | `#93c5fd` | **8.15:1** | 1.4.3 | 4.5:1 | ok |
| `badge.warn.color` | `#431407` | `badge.warn.background` | `#fdba74` | **9.28:1** | 1.4.3 | 4.5:1 | ok |
| `badge.danger.color` | `#450a0a` | `badge.danger.background` | `#fca5a5` | **8.51:1** | 1.4.3 | 4.5:1 | ok |
| `badge.contrast.color` | `#09090b` | `badge.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.badge.primary.color` | `#18181b` | `sunset.badge.primary.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `fire.badge.primary.color` | `#18181b` | `fire.badge.primary.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `coral.badge.primary.color` | `#18181b` | `coral.badge.primary.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `forest.badge.primary.color` | `#18181b` | `forest.badge.primary.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.badge.primary.color` | `#18181b` | `ocean.badge.primary.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.badge.primary.color` | `#18181b` | `aurora.badge.primary.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.badge.primary.color` | `#18181b` | `twilight.badge.primary.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.badge.primary.color` | `#18181b` | `mystic.badge.primary.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `stone.badge.primary.color` | `#18181b` | `stone.badge.primary.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.badge.primary.color` | `#18181b` | `contrast.badge.primary.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |

#### message & toast

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `message.info.color` | `#93c5fd` | `message.info.background over --surface-ground` | `#1a263a` | **8.42:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#93c5fd` | `--surface-ground` | `#141416` | **10.20:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#93c5fd` | `toast.info.background over --surface-ground` | `#1a263a` | **8.42:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#ffffff` | `toast.info.background over --surface-ground` | `#1a263a` | **15.19:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.color` | `#93c5fd` | `message.info.background over --surface-card` | `#222d43` | **7.64:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#93c5fd` | `--surface-card` | `#1d1d21` | **9.32:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#93c5fd` | `toast.info.background over --surface-card` | `#222d43` | **7.64:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#ffffff` | `toast.info.background over --surface-card` | `#222d43` | **13.78:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#86efac` | `message.success.background over --surface-ground` | `#163022` | **10.11:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#86efac` | `--surface-ground` | `#141416` | **13.10:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#86efac` | `toast.success.background over --surface-ground` | `#163022` | **10.11:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#ffffff` | `toast.success.background over --surface-ground` | `#163022` | **14.19:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#86efac` | `message.success.background over --surface-card` | `#1e382b` | **9.03:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#86efac` | `--surface-card` | `#1d1d21` | **11.97:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#86efac` | `toast.success.background over --surface-card` | `#1e382b` | **9.03:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#ffffff` | `toast.success.background over --surface-card` | `#1e382b` | **12.68:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#fdba74` | `message.warn.background over --surface-ground` | `#362d14` | **8.07:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#fdba74` | `--surface-ground` | `#141416` | **10.91:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#fdba74` | `toast.warn.background over --surface-ground` | `#362d14` | **8.07:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#ffffff` | `toast.warn.background over --surface-ground` | `#362d14` | **13.62:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#fdba74` | `message.warn.background over --surface-card` | `#3e351d` | **7.19:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#fdba74` | `--surface-card` | `#1d1d21` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#fdba74` | `toast.warn.background over --surface-card` | `#3e351d` | **7.19:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#ffffff` | `toast.warn.background over --surface-card` | `#3e351d` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#fca5a5` | `message.error.background over --surface-ground` | `#371c1d` | **8.22:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#fca5a5` | `--surface-ground` | `#141416` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#fca5a5` | `toast.error.background over --surface-ground` | `#371c1d` | **8.22:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#ffffff` | `toast.error.background over --surface-ground` | `#371c1d` | **15.60:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#fca5a5` | `message.error.background over --surface-card` | `#3f2327` | **7.47:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#fca5a5` | `--surface-card` | `#1d1d21` | **8.85:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#fca5a5` | `toast.error.background over --surface-card` | `#3f2327` | **7.47:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#ffffff` | `toast.error.background over --surface-card` | `#3f2327` | **14.18:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#d4d4d8` | `message.secondary.background over --surface-ground` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#a5a29b` | `--surface-ground` | `#141416` | **7.22:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#d4d4d8` | `toast.secondary.background over --surface-ground` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#ffffff` | `toast.secondary.background over --surface-ground` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#d4d4d8` | `message.secondary.background over --surface-card` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#a5a29b` | `--surface-card` | `#1d1d21` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#d4d4d8` | `toast.secondary.background over --surface-card` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#ffffff` | `toast.secondary.background over --surface-card` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#09090b` | `message.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#f2f1ed` | `--surface-ground` | `#141416` | **16.28:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#09090b` | `toast.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#09090b` | `toast.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#09090b` | `message.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#f2f1ed` | `--surface-card` | `#1d1d21` | **14.86:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#09090b` | `toast.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#09090b` | `toast.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |

#### text & link button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.text.secondary.color` | `#a5a29b` | `--surface-ground` | `#141416` | **7.22:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#a5a29b` | `--surface-card` | `#1d1d21` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#86efac` | `--surface-ground` | `#141416` | **13.10:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#86efac` | `--surface-card` | `#1d1d21` | **11.97:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#93c5fd` | `--surface-ground` | `#141416` | **10.20:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#93c5fd` | `--surface-card` | `#1d1d21` | **9.32:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#fdba74` | `--surface-ground` | `#141416` | **10.91:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#fdba74` | `--surface-card` | `#1d1d21` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#67e8f9` | `--surface-ground` | `#141416` | **12.69:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#67e8f9` | `--surface-card` | `#1d1d21` | **11.59:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#fca5a5` | `--surface-ground` | `#141416` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#fca5a5` | `--surface-card` | `#1d1d21` | **8.85:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#f2f1ed` | `--surface-ground` | `#141416` | **16.28:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#f2f1ed` | `--surface-card` | `#1d1d21` | **14.86:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#f2f1ed` | `--surface-ground` | `#141416` | **16.28:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#f2f1ed` | `--surface-card` | `#1d1d21` | **14.86:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#fb923c` | `--surface-ground` | `#141416` | **8.13:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#fb923c` | `--surface-card` | `#1d1d21` | **7.42:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#f87171` | `--surface-ground` | `#141416` | **6.65:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#f87171` | `--surface-card` | `#1d1d21` | **6.07:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#f472b6` | `--surface-ground` | `#141416` | **6.95:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#f472b6` | `--surface-card` | `#1d1d21` | **6.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#4ade80` | `--surface-ground` | `#141416` | **10.56:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#4ade80` | `--surface-card` | `#1d1d21` | **9.64:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#2dd4bf` | `--surface-ground` | `#141416` | **9.88:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#2dd4bf` | `--surface-card` | `#1d1d21` | **9.03:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#22d3ee` | `--surface-ground` | `#141416` | **10.18:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#22d3ee` | `--surface-card` | `#1d1d21` | **9.30:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#85a7ff` | `--surface-ground` | `#141416` | **7.86:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#85a7ff` | `--surface-card` | `#1d1d21` | **7.18:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#f9a8d4` | `--surface-ground` | `#141416` | **10.15:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#f9a8d4` | `--surface-card` | `#1d1d21` | **9.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#d6d3d1` | `--surface-ground` | `#141416` | **12.35:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#d6d3d1` | `--surface-card` | `#1d1d21` | **11.28:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#f8fafc` | `--surface-ground` | `#141416` | **17.58:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#f8fafc` | `--surface-card` | `#1d1d21` | **16.06:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (contrast)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.contrast.color` | `#09090b` | `button.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |

#### avatar

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `avatar.color` | `#ffffff` | `avatar.background` | `#3f3f46` | **10.44:1** | 1.4.3 | 4.5:1 | ok |

#### image preview

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `image.action.color` | `#fafafa` | `image.toolbar.background over mask.background over --surface-ground` | `#030304` | **19.75:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-ground` | `#1c1c1d` | **17.03:1** | 1.4.11 | 3:1 | ok |
| `image.action.color` | `#fafafa` | `image.toolbar.background over mask.background over --surface-card` | `#050505` | **19.53:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-card` | `#1e1e1e` | **16.67:1** | 1.4.11 | 3:1 | ok |

#### focus ring

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-ground` | `#141416` | **8.13:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-card` | `#1d1d21` | **7.42:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-section` | `#26262b` | **6.65:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `dialog.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `chip.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `paginator.background` | `#1d1d21` | **7.42:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `datatable.row.background` | `#1d1d21` | **7.42:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `datatable.row.hover.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `sunset.datatable.row.selected.background` | `#41382d` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `autocomplete.chip.focus.background` | `#3f3f46` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-ground` | `#141416` | **6.65:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-card` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-section` | `#26262b` | **5.44:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `dialog.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `chip.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `paginator.background` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `datatable.row.background` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `datatable.row.hover.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `fire.datatable.row.selected.background` | `#413336` | **4.33:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `autocomplete.chip.focus.background` | `#3f3f46` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-ground` | `#141416` | **6.95:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-card` | `#1d1d21` | **6.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-section` | `#26262b` | **5.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `dialog.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `chip.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `paginator.background` | `#1d1d21` | **6.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `datatable.row.background` | `#1d1d21` | **6.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `datatable.row.hover.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `coral.datatable.row.selected.background` | `#413341` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `autocomplete.chip.focus.background` | `#3f3f46` | **3.94:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-ground` | `#141416` | **10.56:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-card` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-section` | `#26262b` | **8.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `dialog.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `chip.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `paginator.background` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `datatable.row.background` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `datatable.row.hover.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `forest.datatable.row.selected.background` | `#2c4138` | **6.28:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-ground` | `#141416` | **9.88:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-card` | `#1d1d21` | **9.03:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-section` | `#26262b` | **8.09:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `dialog.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `chip.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `paginator.background` | `#1d1d21` | **9.03:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `datatable.row.background` | `#1d1d21` | **9.03:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `datatable.row.hover.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `ocean.datatable.row.selected.background` | `#284142` | **5.86:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-ground` | `#141416` | **10.18:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-card` | `#1d1d21` | **9.30:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-section` | `#26262b` | **8.33:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `dialog.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `chip.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `paginator.background` | `#1d1d21` | **9.30:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `datatable.row.background` | `#1d1d21` | **9.30:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `datatable.row.hover.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `aurora.datatable.row.selected.background` | `#264145` | **6.04:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-ground` | `#141416` | **7.86:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-card` | `#1d1d21` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-section` | `#26262b` | **6.43:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `dialog.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `chip.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `paginator.background` | `#1d1d21` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `datatable.row.background` | `#1d1d21` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `datatable.row.hover.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `twilight.datatable.row.selected.background` | `#363b45` | **4.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `autocomplete.chip.focus.background` | `#3f3f46` | **4.46:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-ground` | `#141416` | **10.15:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-card` | `#1d1d21` | **9.26:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-section` | `#26262b` | **8.30:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `dialog.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `chip.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `paginator.background` | `#1d1d21` | **9.26:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `datatable.row.background` | `#1d1d21` | **9.26:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `datatable.row.hover.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `mystic.datatable.row.selected.background` | `#413b45` | **5.98:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-ground` | `#141416` | **12.35:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-card` | `#1d1d21` | **11.28:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-section` | `#26262b` | **10.11:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `dialog.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `chip.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `paginator.background` | `#1d1d21` | **11.28:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `datatable.row.background` | `#1d1d21` | **11.28:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `datatable.row.hover.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `stone.datatable.row.selected.background` | `#414145` | **6.82:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `autocomplete.chip.focus.background` | `#3f3f46` | **7.01:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-ground` | `#141416` | **17.58:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-card` | `#1d1d21` | **16.06:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-section` | `#26262b` | **14.39:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `dialog.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `chip.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `paginator.background` | `#1d1d21` | **16.06:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `datatable.row.background` | `#1d1d21` | **16.06:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `datatable.row.hover.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `contrast.datatable.row.selected.background` | `#414145` | **9.71:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `autocomplete.chip.focus.background` | `#3f3f46` | **9.98:1** | 1.4.11 | 3:1 | ok |

#### progress spinner

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-ground` | `#141416` | **8.13:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-card` | `#1d1d21` | **7.42:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-section` | `#26262b` | **6.65:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-ground` | `#141416` | **6.65:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-card` | `#1d1d21` | **6.07:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-section` | `#26262b` | **5.44:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-ground` | `#141416` | **6.95:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-card` | `#1d1d21` | **6.34:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-section` | `#26262b` | **5.69:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-ground` | `#141416` | **10.56:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-card` | `#1d1d21` | **9.64:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-section` | `#26262b` | **8.64:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-ground` | `#141416` | **9.88:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-card` | `#1d1d21` | **9.03:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-section` | `#26262b` | **8.09:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-ground` | `#141416` | **10.18:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-card` | `#1d1d21` | **9.30:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-section` | `#26262b` | **8.33:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-ground` | `#141416` | **7.86:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-card` | `#1d1d21` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-section` | `#26262b` | **6.43:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-ground` | `#141416` | **10.15:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-card` | `#1d1d21` | **9.26:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-section` | `#26262b` | **8.30:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-ground` | `#141416` | **12.35:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-card` | `#1d1d21` | **11.28:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-section` | `#26262b` | **10.11:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-ground` | `#141416` | **17.58:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-card` | `#1d1d21` | **16.06:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-section` | `#26262b` | **14.39:1** | 1.4.11 | 3:1 | ok |

## style: lernwerkstatt (default)

### light mode

#### body text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--text-color` | `#2b2622` | `--surface-ground` | `#fffdf6` | **14.71:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#6d645c` | `--surface-ground` | `#fffdf6` | **5.69:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#2b2622` | `--surface-card` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#6d645c` | `--surface-card` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#2b2622` | `--surface-section` | `#fdf8ec` | **14.12:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#6d645c` | `--surface-section` | `#fdf8ec` | **5.46:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#2b2622` | `--surface-hover` | `#f7efdd` | **13.08:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#6d645c` | `--surface-hover` | `#f7efdd` | **5.06:1** | 1.4.3 | 4.5:1 | ok |

#### semantic text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--semantic-blue-fg` | `#1d4ed8` | `--surface-ground` | `#fffdf6` | **6.58:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-blue-fg` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#c2410c` | `--surface-ground` | `#fffdf6` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#15803d` | `--surface-ground` | `#fffdf6` | **4.93:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#b91c1c` | `--surface-ground` | `#fffdf6` | **6.36:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#0e7490` | `--surface-ground` | `#fffdf6` | **5.26:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#be185d` | `--surface-ground` | `#fffdf6` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#be185d` | `--surface-card` | `#ffffff` | **6.04:1** | 1.4.3 | 4.5:1 | ok |

#### dev toggle

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--dev-toggle-fg` | `#166534` | `color-mix(--dev-toggle-border 15%, --surface-card)` | `#dcf1e4` | **6.03:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border` | `#16a34a` | `--surface-card` | `#ffffff` | **3.30:1** | 1.4.11 | 3:1 | ok |
| `--dev-toggle-fg-active` | `#991b1b` | `color-mix(--dev-toggle-border-active 15%, --surface-card)` | `#fde3e3` | **6.84:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border-active` | `#ef4444` | `--surface-card` | `#ffffff` | **3.76:1** | 1.4.11 | 3:1 | ok |

#### control boundary

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-border` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#8a7a68` | `--surface-section` | `#fdf8ec` | **3.91:1** | 1.4.11 | 3:1 | ok |

#### floating action button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `.fab-label --text-color` | `#2b2622` | `.fab-button --surface-card` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-label --text-color` | `#2b2622` | `.fab-button:hover --surface-hover` | `#f7efdd` | **13.08:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-button --fab-edge` | `#2b2622` | `--surface-ground` | `#fffdf6` | **14.71:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#2b2622` | `--surface-card` | `#ffffff` | **14.97:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#2b2622` | `--surface-section` | `#fdf8ec` | **14.12:1** | 1.4.11 | 3:1 | ok |

#### severity button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-from` | `#cf3f52` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-to` | `#cf3f52` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-from` | `#187a50` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-to` | `#187a50` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-from` | `#4762c9` | **5.44:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-to` | `#4762c9` | **5.44:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#2b2622` | `--gradient-warn-from` | `#f59e0b` | **6.97:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#2b2622` | `--gradient-warn-to` | `#f59e0b` | **6.97:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-from` | `#6d645c` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-to` | `#6d645c` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-from` | `#0e7490` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-to` | `#0e7490` | **5.36:1** | 1.4.3 | 4.5:1 | ok |

#### outlined severity

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--outlined-danger-fg` | `#cf3f52` | `--surface-card` | `#ffffff` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `success.--outlined-success-fg` | `#187a50` | `--surface-card` | `#ffffff` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `info.--outlined-info-fg` | `#4762c9` | `--surface-card` | `#ffffff` | **5.44:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--outlined-warn-fg` | `#9e6506` | `--surface-card` | `#ffffff` | **4.86:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--outlined-secondary-fg` | `#6d645c` | `--surface-card` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `help.--outlined-help-fg` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |

#### severity button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-from @brightness(0.92)` | `#be3a4b` | **4.52:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-to @brightness(0.92)` | `#be3a4b` | **4.52:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-from @brightness(0.92)` | `#16704a` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-to @brightness(0.92)` | `#16704a` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-from @brightness(0.92)` | `#415ab9` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-to @brightness(0.92)` | `#415ab9` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#2f2a25` | `--gradient-warn-from @brightness(1.1)` | `#ffae0c` | **7.65:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#2f2a25` | `--gradient-warn-to @brightness(1.1)` | `#ffae0c` | **7.65:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-from @brightness(0.92)` | `#645c55` | **5.50:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-to @brightness(0.92)` | `#645c55` | **5.50:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(0.92)` | `#ebebeb` | `--gradient-help-from @brightness(0.92)` | `#0d6b84` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(0.92)` | `#ebebeb` | `--gradient-help-to @brightness(0.92)` | `#0d6b84` | **5.10:1** | 1.4.3 | 4.5:1 | ok |

#### brand chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-brand-ink` | `#2b2622` | `brandScale 500` | `#f59e0b` | **6.97:1** | 1.4.3 | 4.5:1 | ok |

#### brand foreground

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg` | `#c2410c` | `--surface-ground` | `#fffdf6` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-fg` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#a16207` | `--surface-ground` | `#fffdf6` | **4.84:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#a16207` | `--surface-card` | `#ffffff` | **4.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#cd1d1d` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#946708` | `--surface-ground` | `#fffdf6` | **4.91:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#946708` | `--surface-card` | `#ffffff` | **5.00:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#a8124e` | `--surface-ground` | `#fffdf6` | **7.21:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#b9267b` | `--surface-ground` | `#fffdf6` | **5.69:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#b9267b` | `--surface-card` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#157836` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#5d7307` | `--surface-ground` | `#fffdf6` | **5.26:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#5d7307` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#0a756d` | `--surface-ground` | `#fffdf6` | **5.46:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#1f63ed` | `--surface-ground` | `#fffdf6` | **5.07:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#1f63ed` | `--surface-card` | `#ffffff` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#077288` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#167e4a` | `--surface-ground` | `#fffdf6` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#167e4a` | `--surface-card` | `#ffffff` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#3346d3` | `--surface-ground` | `#fffdf6` | **6.98:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#0369a1` | `--surface-ground` | `#fffdf6` | **5.83:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#0369a1` | `--surface-card` | `#ffffff` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#b8147f` | `--surface-ground` | `#fffdf6` | **5.99:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#d0174a` | `--surface-ground` | `#fffdf6` | **5.29:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#d0174a` | `--surface-card` | `#ffffff` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#776558` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#a05e1c` | `--surface-ground` | `#fffdf6` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#a05e1c` | `--surface-card` | `#ffffff` | **5.11:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#0f172a` | `--surface-ground` | `#fffdf6` | **17.54:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#1e293b` | `--surface-ground` | `#fffdf6` | **14.37:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#1e293b` | `--surface-card` | `#ffffff` | **14.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--primary-color` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--gradient-accent-color` | `#a16207` | **4.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--primary-color` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--gradient-accent-color` | `#946708` | **5.00:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--primary-color` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--gradient-accent-color` | `#b9267b` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--primary-color` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--gradient-accent-color` | `#5d7307` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--primary-color` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--gradient-accent-color` | `#1f63ed` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--primary-color` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--gradient-accent-color` | `#167e4a` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--primary-color` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--gradient-accent-color` | `#0369a1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--primary-color` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--gradient-accent-color` | `#d0174a` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--primary-color` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--gradient-accent-color` | `#a05e1c` | **5.11:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#ffffff` | `contrast.--primary-color` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#ffffff` | `contrast.--gradient-accent-color` | `#1e293b` | **14.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--primary-color @brightness(0.92)` | `#b23c0b` | **4.97:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--gradient-accent-color @brightness(0.92)` | `#945a06` | **4.73:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--primary-color @brightness(0.92)` | `#bd1b1b` | **5.28:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--gradient-accent-color @brightness(0.92)` | `#885f07` | **4.78:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--primary-color @brightness(0.92)` | `#9b1148` | **6.86:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--gradient-accent-color @brightness(0.92)` | `#aa2371` | **5.53:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--primary-color @brightness(0.92)` | `#136e32` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--gradient-accent-color @brightness(0.92)` | `#566a06` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--primary-color @brightness(0.92)` | `#096c64` | **5.27:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--gradient-accent-color @brightness(0.92)` | `#1d5bda` | **4.95:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--primary-color @brightness(0.92)` | `#06697d` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--gradient-accent-color @brightness(0.92)` | `#147444` | **4.88:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--primary-color @brightness(0.92)` | `#2f40c2` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--gradient-accent-color @brightness(0.92)` | `#036194` | **5.61:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--primary-color @brightness(0.92)` | `#a91275` | **5.81:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--gradient-accent-color @brightness(0.92)` | `#bf1544` | **5.17:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--primary-color @brightness(0.92)` | `#6d5d51` | **5.28:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--gradient-accent-color @brightness(0.92)` | `#93561a` | **4.91:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#ffffff` | `contrast.--primary-color @brightness(1.1)` | `#11192e` | **17.47:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#ffffff` | `contrast.--gradient-accent-color @brightness(1.1)` | `#212d41` | **13.85:1** | 1.4.3 | 4.5:1 | ok |

#### accent surface

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--accent-on-surface` | `#8f0e00` | `sunset.--accent-surface` | `#ffffd8` | **9.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--accent-on-surface` | `#9a0000` | `fire.--accent-surface` | `#ffe9e9` | **7.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--accent-on-surface` | `#75001b` | `coral.--accent-surface` | `#ffdeff` | **9.67:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--accent-on-surface` | `#004503` | `forest.--accent-surface` | `#e1ffff` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--accent-on-surface` | `#00423a` | `ocean.--accent-surface` | `#d6ffff` | **10.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--accent-on-surface` | `#003f55` | `aurora.--accent-surface` | `#d3ffff` | **10.59:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--accent-on-surface` | `#0013a0` | `twilight.--accent-surface` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--accent-on-surface` | `#85004c` | `mystic.--accent-surface` | `#ffe0ff` | **8.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--accent-on-surface` | `#443225` | `stone.--accent-surface` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--accent-on-surface` | `#000000` | `contrast.--accent-surface` | `#dbe3f6` | **16.33:1** | 1.4.3 | 4.5:1 | ok |

#### checkbox & radiobutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `checkbox.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `checkbox.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#c2410c` | `--surface-ground` | `#fffdf6` | **5.09:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.checkbox.icon.checked.color` | `#ffffff` | `sunset.checkbox.checked.background` | `#c2410c` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#cd1d1d` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.checkbox.icon.checked.color` | `#ffffff` | `fire.checkbox.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#a8124e` | `--surface-ground` | `#fffdf6` | **7.21:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.checkbox.icon.checked.color` | `#ffffff` | `coral.checkbox.checked.background` | `#a8124e` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#157836` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.checkbox.icon.checked.color` | `#ffffff` | `forest.checkbox.checked.background` | `#157836` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#0a756d` | `--surface-ground` | `#fffdf6` | **5.46:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.checkbox.icon.checked.color` | `#ffffff` | `ocean.checkbox.checked.background` | `#0a756d` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#077288` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.checkbox.icon.checked.color` | `#ffffff` | `aurora.checkbox.checked.background` | `#077288` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#3346d3` | `--surface-ground` | `#fffdf6` | **6.98:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.checkbox.icon.checked.color` | `#ffffff` | `twilight.checkbox.checked.background` | `#3346d3` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#b8147f` | `--surface-ground` | `#fffdf6` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.checkbox.icon.checked.color` | `#ffffff` | `mystic.checkbox.checked.background` | `#b8147f` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#776558` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.checkbox.icon.checked.color` | `#ffffff` | `stone.checkbox.checked.background` | `#776558` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#0f172a` | `--surface-ground` | `#fffdf6` | **17.54:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.checkbox.icon.checked.color` | `#ffffff` | `contrast.checkbox.checked.background` | `#0f172a` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### toggleswitch

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `toggleswitch.background` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.background` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.handle.background` | `#ffffff` | `toggleswitch.background` | `#8a7a68` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `sunset.toggleswitch.handle.checked.background` | `#ffffff` | `sunset.toggleswitch.checked.background` | `#c2410c` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.toggleswitch.handle.checked.background` | `#ffffff` | `fire.toggleswitch.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.toggleswitch.handle.checked.background` | `#ffffff` | `coral.toggleswitch.checked.background` | `#a8124e` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.toggleswitch.handle.checked.background` | `#ffffff` | `forest.toggleswitch.checked.background` | `#157836` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.toggleswitch.handle.checked.background` | `#ffffff` | `ocean.toggleswitch.checked.background` | `#0a756d` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.toggleswitch.handle.checked.background` | `#ffffff` | `aurora.toggleswitch.checked.background` | `#077288` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.toggleswitch.handle.checked.background` | `#ffffff` | `twilight.toggleswitch.checked.background` | `#3346d3` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.toggleswitch.handle.checked.background` | `#ffffff` | `mystic.toggleswitch.checked.background` | `#b8147f` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.toggleswitch.handle.checked.background` | `#ffffff` | `stone.toggleswitch.checked.background` | `#776558` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.toggleswitch.handle.checked.background` | `#ffffff` | `contrast.toggleswitch.checked.background` | `#0f172a` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### form field edge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#8a7a68` | `select.background` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#2b2622` | `--surface-ground` | `#fffdf6` | **14.71:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#2b2622` | `--surface-card` | `#ffffff` | **14.97:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#2b2622` | `inputtext.background` | `#ffffff` | **14.97:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#8a7a68` | `textarea.background` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#8a7a68` | `multiselect.background` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#8a7a68` | `listbox.background` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#8a7a68` | `autocomplete.background` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#8a7a68` | `autocomplete.background` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#8a7a68` | `datepicker.dropdown.background` | `#f1f5f9` | **3.79:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#8a7a68` | `inputtext.background` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#8a7a68` | `cascadeselect.background` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.color` | `#6d645c` | `inputtext.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `--surface-ground` | `#fffdf6` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `inputtext.background` | `#ffffff` | **6.47:1** | 1.4.11 | 3:1 | ok |

#### form field text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `inputtext.color` | `#334155` | `inputtext.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `inputtext.placeholder.color` | `#64748b` | `inputtext.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `select.color` | `#2b2622` | `select.background` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `select.placeholder.color` | `#64748b` | `select.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.color` | `#334155` | `textarea.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.placeholder.color` | `#64748b` | `textarea.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.color` | `#2b2622` | `cascadeselect.background` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.placeholder.color` | `#64748b` | `cascadeselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.color` | `#334155` | `multiselect.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.placeholder.color` | `#64748b` | `multiselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.color` | `#334155` | `treeselect.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.placeholder.color` | `#64748b` | `treeselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.color` | `#334155` | `autocomplete.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.placeholder.color` | `#64748b` | `autocomplete.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |

#### form field icon

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.dropdown.color` | `#6d645c` | `select.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |
| `multiselect.dropdown.color` | `#6d645c` | `multiselect.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.dropdown.color` | `#6d645c` | `cascadeselect.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |
| `treeselect.dropdown.color` | `#6d645c` | `treeselect.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |
| `password.icon.color` | `#6d645c` | `inputtext.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.color` | `#475569` | `autocomplete.dropdown.background` | `#f1f5f9` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.color` | `#475569` | `datepicker.dropdown.background` | `#f1f5f9` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `inputgroup.addon.color` | `#6d645c` | `inputgroup.addon.background` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |

#### float label

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `floatlabel.color` | `#6d645c` | `inputtext.background` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.active.color` | `#6d645c` | `floatlabel.on.active.background` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.focus.color` | `#2b2622` | `floatlabel.on.active.background` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.invalid.color` | `#b91c1c` | `floatlabel.on.active.background` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.color` | `#6d645c` | `inputtext.background` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.focus.color` | `#2b2622` | `inputtext.background` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.invalid.color` | `#b91c1c` | `inputtext.background` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.on.active.background` | `#ffffff` | `inputtext.background` | `#ffffff` | **1.00:1** | none | — | info |

#### tag

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `tag.secondary.color` | `#475569` | `tag.secondary.background` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `tag.success.color` | `#15803d` | `tag.success.background` | `#dcfce7` | **4.57:1** | 1.4.3 | 4.5:1 | ok |
| `tag.info.color` | `#0369a1` | `tag.info.background` | `#e0f2fe` | **5.17:1** | 1.4.3 | 4.5:1 | ok |
| `tag.warn.color` | `#c2410c` | `tag.warn.background` | `#ffedd5` | **4.52:1** | 1.4.3 | 4.5:1 | ok |
| `tag.danger.color` | `#b91c1c` | `tag.danger.background` | `#fee2e2` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `tag.contrast.color` | `#ffffff` | `tag.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#8f0e00` | `sunset.tag.primary.background` | `#ffffd8` | **9.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#9a0000` | `fire.tag.primary.background` | `#ffe9e9` | **7.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#75001b` | `coral.tag.primary.background` | `#ffdeff` | **9.67:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#004503` | `forest.tag.primary.background` | `#e1ffff` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#00423a` | `ocean.tag.primary.background` | `#d6ffff` | **10.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#003f55` | `aurora.tag.primary.background` | `#d3ffff` | **10.59:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#0013a0` | `twilight.tag.primary.background` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#85004c` | `mystic.tag.primary.background` | `#ffe0ff` | **8.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#443225` | `stone.tag.primary.background` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#000000` | `contrast.tag.primary.background` | `#dbe3f6` | **16.33:1** | 1.4.3 | 4.5:1 | ok |

#### chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `chip.color` | `#1e293b` | `chip.background` | `#f1f5f9` | **13.35:1** | 1.4.3 | 4.5:1 | ok |
| `chip.remove.icon.color` | `#1e293b` | `chip.background` | `#f1f5f9` | **13.35:1** | 1.4.11 | 3:1 | ok |

#### dialog

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `dialog.color` | `#334155` | `dialog.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#6d645c` | `dialog.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |

#### skeleton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `skeleton.background` | `#e2e8f0` | `--surface-ground` | `#fffdf6` | **1.21:1** | none | — | info |
| `skeleton.background` | `#e2e8f0` | `--surface-card` | `#ffffff` | **1.23:1** | none | — | info |

#### progressbar & slider

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `slider.track.background` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#8a7a68` | `--surface-ground` | `#fffdf6` | **4.07:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#e2e8f0` | `--surface-ground` | `#fffdf6` | **1.21:1** | none | — | info |
| `slider.track.background` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#8a7a68` | `--surface-card` | `#ffffff` | **4.15:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#e2e8f0` | `--surface-card` | `#ffffff` | **1.23:1** | none | — | info |
| `sunset.progressbar.value.background` | `#c2410c` | `progressbar.background` | `#e2e8f0` | **4.20:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressbar.label.color` | `#ffffff` | `sunset.progressbar.value.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.progressbar.value.background` | `#cd1d1d` | `progressbar.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `fire.progressbar.label.color` | `#ffffff` | `fire.progressbar.value.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.progressbar.value.background` | `#a8124e` | `progressbar.background` | `#e2e8f0` | **5.95:1** | 1.4.11 | 3:1 | ok |
| `coral.progressbar.label.color` | `#ffffff` | `coral.progressbar.value.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.progressbar.value.background` | `#157836` | `progressbar.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `forest.progressbar.label.color` | `#ffffff` | `forest.progressbar.value.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.progressbar.value.background` | `#0a756d` | `progressbar.background` | `#e2e8f0` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressbar.label.color` | `#ffffff` | `ocean.progressbar.value.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.progressbar.value.background` | `#077288` | `progressbar.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressbar.label.color` | `#ffffff` | `aurora.progressbar.value.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.progressbar.value.background` | `#3346d3` | `progressbar.background` | `#e2e8f0` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressbar.label.color` | `#ffffff` | `twilight.progressbar.value.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.progressbar.value.background` | `#b8147f` | `progressbar.background` | `#e2e8f0` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressbar.label.color` | `#ffffff` | `mystic.progressbar.value.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.progressbar.value.background` | `#776558` | `progressbar.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `stone.progressbar.label.color` | `#ffffff` | `stone.progressbar.value.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.progressbar.value.background` | `#0f172a` | `progressbar.background` | `#e2e8f0` | **14.48:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressbar.label.color` | `#ffffff` | `contrast.progressbar.value.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### togglebutton & selectbutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `togglebutton.color` | `#6d645c` | `togglebutton.background` | `#fdf8ec` | **5.46:1** | 1.4.3 | 4.5:1 | ok |
| `togglebutton.hover.color` | `#2b2622` | `togglebutton.hover.background` | `#f7efdd` | **13.08:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.togglebutton.content.checked.background` | `#c2410c` | `togglebutton.background` | `#fdf8ec` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `sunset.togglebutton.content.checked.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.togglebutton.content.checked.background` | `#cd1d1d` | `togglebutton.background` | `#fdf8ec` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `fire.togglebutton.content.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.togglebutton.content.checked.background` | `#a8124e` | `togglebutton.background` | `#fdf8ec` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `coral.togglebutton.content.checked.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.togglebutton.content.checked.background` | `#157836` | `togglebutton.background` | `#fdf8ec` | **5.25:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `forest.togglebutton.content.checked.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.togglebutton.content.checked.background` | `#0a756d` | `togglebutton.background` | `#fdf8ec` | **5.24:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `ocean.togglebutton.content.checked.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.togglebutton.content.checked.background` | `#077288` | `togglebutton.background` | `#fdf8ec` | **5.25:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `aurora.togglebutton.content.checked.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.togglebutton.content.checked.background` | `#3346d3` | `togglebutton.background` | `#fdf8ec` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `twilight.togglebutton.content.checked.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.togglebutton.content.checked.background` | `#b8147f` | `togglebutton.background` | `#fdf8ec` | **5.75:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `mystic.togglebutton.content.checked.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.togglebutton.content.checked.background` | `#776558` | `togglebutton.background` | `#fdf8ec` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `stone.togglebutton.content.checked.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.togglebutton.content.checked.background` | `#0f172a` | `togglebutton.background` | `#fdf8ec` | **16.84:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `contrast.togglebutton.content.checked.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### menu focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `menubar.submenu.icon.color` | `#6d645c` | `menubar.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |
| `menubar.submenu.icon.color` | `#6d645c` | `menubar.item.focus.background` | `#f1f5f9` | **5.28:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#6d645c` | `menubar.background` | `#ffffff` | **5.79:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#6d645c` | `menubar.item.focus.background` | `#f1f5f9` | **5.28:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.focus.background` | `#f1f5f9` | `menubar.background` | `#ffffff` | **1.10:1** | none | — | info |
| `sunset.--primary-color-fg (focus ring)` | `#c2410c` | `menubar.item.focus.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (focus ring)` | `#c2410c` | `menubar.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#cd1d1d` | `menubar.item.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#cd1d1d` | `menubar.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#a8124e` | `menubar.item.focus.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#a8124e` | `menubar.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#157836` | `menubar.item.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#157836` | `menubar.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#0a756d` | `menubar.item.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#0a756d` | `menubar.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#077288` | `menubar.item.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#077288` | `menubar.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#3346d3` | `menubar.item.focus.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#3346d3` | `menubar.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#b8147f` | `menubar.item.focus.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#b8147f` | `menubar.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#776558` | `menubar.item.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#776558` | `menubar.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#0f172a` | `menubar.item.focus.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#0f172a` | `menubar.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### option list focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.option.focus.background` | `#f1f5f9` | `select.overlay.background` | `#ffffff` | **1.10:1** | none | — | info |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `select.overlay.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `select.option.focus.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `sunset.select.option.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `sunset.select.option.selected.focus.background` | `#ffffd8` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `select.overlay.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `select.option.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `fire.select.option.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `fire.select.option.selected.focus.background` | `#ffe9e9` | **4.77:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `select.overlay.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `select.option.focus.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `coral.select.option.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `coral.select.option.selected.focus.background` | `#ffdeff` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `select.overlay.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `select.option.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `forest.select.option.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `forest.select.option.selected.focus.background` | `#e1ffff` | **5.29:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `select.overlay.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `select.option.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `ocean.select.option.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `ocean.select.option.selected.focus.background` | `#d6ffff` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `select.overlay.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `select.option.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `aurora.select.option.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `aurora.select.option.selected.focus.background` | `#d3ffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `select.overlay.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `select.option.focus.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `twilight.select.option.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `twilight.select.option.selected.focus.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `select.overlay.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `select.option.focus.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `mystic.select.option.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `mystic.select.option.selected.focus.background` | `#ffe0ff` | **5.04:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `select.overlay.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `select.option.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `stone.select.option.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `stone.select.option.selected.focus.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `select.overlay.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `select.option.focus.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `contrast.select.option.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `contrast.select.option.selected.focus.background` | `#dbe3f6` | **13.88:1** | 1.4.11 | 3:1 | ok |

#### panel outline

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-outline` | `#2b2622` | `--surface-ground` | `#fffdf6` | **14.71:1** | 1.4.11 | 3:1 | ok |
| `--style-outline` | `#2b2622` | `--surface-card` | `#ffffff` | **14.97:1** | 1.4.11 | 3:1 | ok |
| `popover.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `drawer.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |

#### content panel

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `text.color` | `#334155` | `content.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |

#### table & paginator

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `datatable.row.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `paginator.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `datatable.row.color` | `#334155` | `datatable.row.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `paginator.nav.button.color` | `#64748b` | `paginator.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.datatable.row.selected.color` | `#8f0e00` | `sunset.datatable.row.selected.background` | `#fffff2` | **9.34:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.color` | `#ffffff` | `sunset.paginator.nav.button.selected.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.background` | `#c2410c` | `paginator.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.datatable.row.selected.background` | `#fffff2` | `datatable.row.background` | `#ffffff` | **1.01:1** | none | — | info |
| `sunset.--primary-color-fg (selected-row bar)` | `#c2410c` | `sunset.datatable.row.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (selected-row bar)` | `#c2410c` | `datatable.row.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.color` | `#9a0000` | `fire.datatable.row.selected.background` | `#ffffff` | **8.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.color` | `#ffffff` | `fire.paginator.nav.button.selected.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.background` | `#cd1d1d` | `paginator.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `fire.--primary-color-fg (selected-row bar)` | `#cd1d1d` | `fire.datatable.row.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (selected-row bar)` | `#cd1d1d` | `datatable.row.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.color` | `#75001b` | `coral.datatable.row.selected.background` | `#fff8ff` | **11.35:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.color` | `#ffffff` | `coral.paginator.nav.button.selected.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.background` | `#a8124e` | `paginator.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.background` | `#fff8ff` | `datatable.row.background` | `#ffffff` | **1.04:1** | none | — | info |
| `coral.--primary-color-fg (selected-row bar)` | `#a8124e` | `coral.datatable.row.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (selected-row bar)` | `#a8124e` | `datatable.row.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.color` | `#004503` | `forest.datatable.row.selected.background` | `#fbffff` | **11.25:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.color` | `#ffffff` | `forest.paginator.nav.button.selected.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.background` | `#157836` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.background` | `#fbffff` | `datatable.row.background` | `#ffffff` | **1.01:1** | none | — | info |
| `forest.--primary-color-fg (selected-row bar)` | `#157836` | `forest.datatable.row.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (selected-row bar)` | `#157836` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.color` | `#00423a` | `ocean.datatable.row.selected.background` | `#f0ffff` | **11.11:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.color` | `#ffffff` | `ocean.paginator.nav.button.selected.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.background` | `#0a756d` | `paginator.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.background` | `#f0ffff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `ocean.--primary-color-fg (selected-row bar)` | `#0a756d` | `ocean.datatable.row.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (selected-row bar)` | `#0a756d` | `datatable.row.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.color` | `#003f55` | `aurora.datatable.row.selected.background` | `#edffff` | **11.05:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.color` | `#ffffff` | `aurora.paginator.nav.button.selected.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.background` | `#077288` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.background` | `#edffff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `aurora.--primary-color-fg (selected-row bar)` | `#077288` | `aurora.datatable.row.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (selected-row bar)` | `#077288` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.color` | `#0013a0` | `twilight.datatable.row.selected.background` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.color` | `#ffffff` | `twilight.paginator.nav.button.selected.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.background` | `#3346d3` | `paginator.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `twilight.--primary-color-fg (selected-row bar)` | `#3346d3` | `twilight.datatable.row.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (selected-row bar)` | `#3346d3` | `datatable.row.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.color` | `#85004c` | `mystic.datatable.row.selected.background` | `#fffaff` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.color` | `#ffffff` | `mystic.paginator.nav.button.selected.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.background` | `#b8147f` | `paginator.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.background` | `#fffaff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `mystic.--primary-color-fg (selected-row bar)` | `#b8147f` | `mystic.datatable.row.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (selected-row bar)` | `#b8147f` | `datatable.row.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.color` | `#443225` | `stone.datatable.row.selected.background` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.color` | `#ffffff` | `stone.paginator.nav.button.selected.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.background` | `#776558` | `paginator.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `stone.--primary-color-fg (selected-row bar)` | `#776558` | `stone.datatable.row.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (selected-row bar)` | `#776558` | `datatable.row.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.color` | `#000000` | `contrast.datatable.row.selected.background` | `#f5fdff` | **20.38:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.color` | `#ffffff` | `contrast.paginator.nav.button.selected.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.background` | `#0f172a` | `paginator.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.background` | `#f5fdff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `contrast.--primary-color-fg (selected-row bar)` | `#0f172a` | `contrast.datatable.row.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (selected-row bar)` | `#0f172a` | `datatable.row.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### badge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `badge.secondary.color` | `#475569` | `badge.secondary.background` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `badge.success.color` | `#ffffff` | `badge.success.background` | `#15803d` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `badge.info.color` | `#ffffff` | `badge.info.background` | `#1d4ed8` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `badge.warn.color` | `#ffffff` | `badge.warn.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `badge.danger.color` | `#ffffff` | `badge.danger.background` | `#b91c1c` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `badge.contrast.color` | `#ffffff` | `badge.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.badge.primary.color` | `#ffffff` | `sunset.badge.primary.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.badge.primary.color` | `#ffffff` | `fire.badge.primary.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.badge.primary.color` | `#ffffff` | `coral.badge.primary.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.badge.primary.color` | `#ffffff` | `forest.badge.primary.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.badge.primary.color` | `#ffffff` | `ocean.badge.primary.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.badge.primary.color` | `#ffffff` | `aurora.badge.primary.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.badge.primary.color` | `#ffffff` | `twilight.badge.primary.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.badge.primary.color` | `#ffffff` | `mystic.badge.primary.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.badge.primary.color` | `#ffffff` | `stone.badge.primary.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.badge.primary.color` | `#ffffff` | `contrast.badge.primary.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### message & toast

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `message.info.color` | `#1d4ed8` | `message.info.background over --surface-ground` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#1d4ed8` | `--surface-ground` | `#fffdf6` | **6.58:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#1d4ed8` | `toast.info.background over --surface-ground` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#334155` | `toast.info.background over --surface-ground` | `#f0f6ff` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.color` | `#1d4ed8` | `message.info.background over --surface-card` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#1d4ed8` | `toast.info.background over --surface-card` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#334155` | `toast.info.background over --surface-card` | `#f0f6ff` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#15803d` | `message.success.background over --surface-ground` | `#f1fdf4` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#15803d` | `--surface-ground` | `#fffdf6` | **4.93:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#15803d` | `toast.success.background over --surface-ground` | `#f1fdf4` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#334155` | `toast.success.background over --surface-ground` | `#f1fdf4` | **9.91:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#15803d` | `message.success.background over --surface-card` | `#f1fdf5` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#15803d` | `toast.success.background over --surface-card` | `#f1fdf5` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#334155` | `toast.success.background over --surface-card` | `#f1fdf5` | **9.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#c2410c` | `message.warn.background over --surface-ground` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#c2410c` | `--surface-ground` | `#fffdf6` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#c2410c` | `toast.warn.background over --surface-ground` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#334155` | `toast.warn.background over --surface-ground` | `#fefce9` | **10.02:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#c2410c` | `message.warn.background over --surface-card` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#c2410c` | `toast.warn.background over --surface-card` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#334155` | `toast.warn.background over --surface-card` | `#fefce9` | **10.02:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#b91c1c` | `message.error.background over --surface-ground` | `#fef3f2` | **5.95:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#b91c1c` | `--surface-ground` | `#fffdf6` | **6.36:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#b91c1c` | `toast.error.background over --surface-ground` | `#fef3f2` | **5.95:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#334155` | `toast.error.background over --surface-ground` | `#fef3f2` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#b91c1c` | `message.error.background over --surface-card` | `#fef3f3` | **5.96:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#b91c1c` | `toast.error.background over --surface-card` | `#fef3f3` | **5.96:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#334155` | `toast.error.background over --surface-card` | `#fef3f3` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#475569` | `message.secondary.background over --surface-ground` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#6d645c` | `--surface-ground` | `#fffdf6` | **5.69:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#475569` | `toast.secondary.background over --surface-ground` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#334155` | `toast.secondary.background over --surface-ground` | `#f1f5f9` | **9.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#475569` | `message.secondary.background over --surface-card` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#6d645c` | `--surface-card` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#475569` | `toast.secondary.background over --surface-card` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#334155` | `toast.secondary.background over --surface-card` | `#f1f5f9` | **9.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#f8fafc` | `message.contrast.background over --surface-ground` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#2b2622` | `--surface-ground` | `#fffdf6` | **14.71:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#f8fafc` | `toast.contrast.background over --surface-ground` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#ffffff` | `toast.contrast.background over --surface-ground` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#f8fafc` | `message.contrast.background over --surface-card` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#2b2622` | `--surface-card` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#f8fafc` | `toast.contrast.background over --surface-card` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#ffffff` | `toast.contrast.background over --surface-card` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### text & link button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.text.secondary.color` | `#6d645c` | `--surface-ground` | `#fffdf6` | **5.69:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#6d645c` | `--surface-card` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#15803d` | `--surface-ground` | `#fffdf6` | **4.93:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#1d4ed8` | `--surface-ground` | `#fffdf6` | **6.58:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#c2410c` | `--surface-ground` | `#fffdf6` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#0e7490` | `--surface-ground` | `#fffdf6` | **5.26:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#b91c1c` | `--surface-ground` | `#fffdf6` | **6.36:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#2b2622` | `--surface-ground` | `#fffdf6` | **14.71:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#2b2622` | `--surface-card` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#2b2622` | `--surface-ground` | `#fffdf6` | **14.71:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#2b2622` | `--surface-card` | `#ffffff` | **14.97:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#c2410c` | `--surface-ground` | `#fffdf6` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#cd1d1d` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#a8124e` | `--surface-ground` | `#fffdf6` | **7.21:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#157836` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#0a756d` | `--surface-ground` | `#fffdf6` | **5.46:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#077288` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#3346d3` | `--surface-ground` | `#fffdf6` | **6.98:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#b8147f` | `--surface-ground` | `#fffdf6` | **5.99:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#776558` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#0f172a` | `--surface-ground` | `#fffdf6` | **17.54:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (contrast)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.contrast.color` | `#ffffff` | `button.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |

#### avatar

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `avatar.color` | `#334155` | `avatar.background` | `#e2e8f0` | **8.40:1** | 1.4.3 | 4.5:1 | ok |

#### image preview

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `image.action.color` | `#f8fafc` | `image.toolbar.background over mask.background over --surface-ground` | `#3d3d3b` | **10.40:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-ground` | `#50504f` | **8.07:1** | 1.4.11 | 3:1 | ok |
| `image.action.color` | `#f8fafc` | `image.toolbar.background over mask.background over --surface-card` | `#3d3d3d` | **10.38:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-card` | `#505050` | **8.06:1** | 1.4.11 | 3:1 | ok |

#### focus ring

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-ground` | `#fffdf6` | **5.09:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-section` | `#fdf8ec` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `dialog.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `chip.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `paginator.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `datatable.row.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `datatable.row.hover.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `sunset.datatable.row.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.20:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-section` | `#fdf8ec` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `dialog.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `chip.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `paginator.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `datatable.row.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `datatable.row.hover.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `fire.datatable.row.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-ground` | `#fffdf6` | **7.21:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-section` | `#fdf8ec` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `dialog.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `chip.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `paginator.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `datatable.row.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `datatable.row.hover.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `coral.datatable.row.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `autocomplete.chip.focus.background` | `#e2e8f0` | **5.95:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-section` | `#fdf8ec` | **5.25:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `dialog.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `chip.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `datatable.row.hover.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `forest.datatable.row.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-ground` | `#fffdf6` | **5.46:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-section` | `#fdf8ec` | **5.24:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `dialog.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `chip.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `paginator.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `datatable.row.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `datatable.row.hover.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `ocean.datatable.row.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-section` | `#fdf8ec` | **5.25:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `dialog.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `chip.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `datatable.row.hover.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `aurora.datatable.row.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-ground` | `#fffdf6` | **6.98:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-section` | `#fdf8ec` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `dialog.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `chip.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `paginator.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `datatable.row.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `datatable.row.hover.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `twilight.datatable.row.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `autocomplete.chip.focus.background` | `#e2e8f0` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-ground` | `#fffdf6` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-section` | `#fdf8ec` | **5.75:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `dialog.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `chip.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `paginator.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `datatable.row.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `datatable.row.hover.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `mystic.datatable.row.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-section` | `#fdf8ec` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `dialog.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `chip.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `paginator.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `datatable.row.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `datatable.row.hover.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `stone.datatable.row.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-ground` | `#fffdf6` | **17.54:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-section` | `#fdf8ec` | **16.84:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `dialog.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `chip.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `paginator.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `datatable.row.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `datatable.row.hover.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `contrast.datatable.row.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `autocomplete.chip.focus.background` | `#e2e8f0` | **14.48:1** | 1.4.11 | 3:1 | ok |

#### progress spinner

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-ground` | `#fffdf6` | **5.09:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-section` | `#fdf8ec` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-section` | `#fdf8ec` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-ground` | `#fffdf6` | **7.21:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-section` | `#fdf8ec` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-section` | `#fdf8ec` | **5.25:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-ground` | `#fffdf6` | **5.46:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-section` | `#fdf8ec` | **5.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-ground` | `#fffdf6` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-section` | `#fdf8ec` | **5.25:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-ground` | `#fffdf6` | **6.98:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-section` | `#fdf8ec` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-ground` | `#fffdf6` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-section` | `#fdf8ec` | **5.75:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-ground` | `#fffdf6` | **5.45:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-section` | `#fdf8ec` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-ground` | `#fffdf6` | **17.54:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-section` | `#fdf8ec` | **16.84:1** | 1.4.11 | 3:1 | ok |

### dark mode

#### body text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--text-color` | `#f1efec` | `--surface-ground` | `#201e1b` | **14.49:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#afacaa` | `--surface-ground` | `#201e1b` | **7.37:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#f1efec` | `--surface-card` | `#292725` | **12.97:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#afacaa` | `--surface-card` | `#292725` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#f1efec` | `--surface-section` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#afacaa` | `--surface-section` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#f1efec` | `--surface-hover` | `#373432` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#afacaa` | `--surface-hover` | `#373432` | **5.47:1** | 1.4.3 | 4.5:1 | ok |

#### semantic text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--semantic-blue-fg` | `#93c5fd` | `--surface-ground` | `#201e1b` | **9.22:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-blue-fg` | `#93c5fd` | `--surface-card` | `#292725` | **8.25:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#fdba74` | `--surface-ground` | `#201e1b` | **9.86:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#fdba74` | `--surface-card` | `#292725` | **8.82:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#86efac` | `--surface-ground` | `#201e1b` | **11.84:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#86efac` | `--surface-card` | `#292725` | **10.60:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#fca5a5` | `--surface-ground` | `#201e1b` | **8.76:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#fca5a5` | `--surface-card` | `#292725` | **7.84:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#67e8f9` | `--surface-ground` | `#201e1b` | **11.47:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#67e8f9` | `--surface-card` | `#292725` | **10.27:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#f9a8d4` | `--surface-ground` | `#201e1b` | **9.17:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#f9a8d4` | `--surface-card` | `#292725` | **8.21:1** | 1.4.3 | 4.5:1 | ok |

#### dev toggle

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--dev-toggle-fg` | `#86efac` | `color-mix(--dev-toggle-border 15%, --surface-card)` | `#2e4233` | **7.70:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border` | `#4ade80` | `--surface-card` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `--dev-toggle-fg-active` | `#fca5a5` | `color-mix(--dev-toggle-border-active 15%, --surface-card)` | `#483230` | **6.24:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border-active` | `#f87171` | `--surface-card` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |

#### control boundary

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-border` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#969491` | `--surface-section` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |

#### floating action button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `.fab-label --text-color` | `#f1efec` | `.fab-button --surface-card` | `#292725` | **12.97:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-label --text-color` | `#f1efec` | `.fab-button:hover --surface-hover` | `#373432` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-button --fab-edge` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#969491` | `--surface-section` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |

#### field placeholder

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-placeholder` | `#afacaa` | `--surface-section` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |

#### severity button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-from` | `#cf3f52` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-to` | `#cf3f52` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-from` | `#187a50` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-to` | `#187a50` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-from` | `#4762c9` | **5.44:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-to` | `#4762c9` | **5.44:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#2b2622` | `--gradient-warn-from` | `#f59e0b` | **6.97:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#2b2622` | `--gradient-warn-to` | `#f59e0b` | **6.97:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-from` | `#6d645c` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-to` | `#6d645c` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-from` | `#0e7490` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-to` | `#0e7490` | **5.36:1** | 1.4.3 | 4.5:1 | ok |

#### outlined severity

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--outlined-danger-fg` | `#db707e` | `--surface-card` | `#292725` | **4.70:1** | 1.4.3 | 4.5:1 | ok |
| `success.--outlined-success-fg` | `#20a56c` | `--surface-card` | `#292725` | **4.72:1** | 1.4.3 | 4.5:1 | ok |
| `info.--outlined-info-fg` | `#7a8ed8` | `--surface-card` | `#292725` | **4.74:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--outlined-warn-fg` | `#f59e0b` | `--surface-card` | `#292725` | **6.93:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--outlined-secondary-fg` | `#998f86` | `--surface-card` | `#292725` | **4.70:1** | 1.4.3 | 4.5:1 | ok |
| `help.--outlined-help-fg` | `#139dc3` | `--surface-card` | `#292725` | **4.70:1** | 1.4.3 | 4.5:1 | ok |

#### severity button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-from @brightness(0.92)` | `#be3a4b` | **4.52:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-to @brightness(0.92)` | `#be3a4b` | **4.52:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-from @brightness(0.92)` | `#16704a` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-to @brightness(0.92)` | `#16704a` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-from @brightness(0.92)` | `#415ab9` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-to @brightness(0.92)` | `#415ab9` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#2f2a25` | `--gradient-warn-from @brightness(1.1)` | `#ffae0c` | **7.65:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#2f2a25` | `--gradient-warn-to @brightness(1.1)` | `#ffae0c` | **7.65:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-from @brightness(0.92)` | `#645c55` | **5.50:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-to @brightness(0.92)` | `#645c55` | **5.50:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(0.92)` | `#ebebeb` | `--gradient-help-from @brightness(0.92)` | `#0d6b84` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(0.92)` | `#ebebeb` | `--gradient-help-to @brightness(0.92)` | `#0d6b84` | **5.10:1** | 1.4.3 | 4.5:1 | ok |

#### brand chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-brand-ink` | `#2b2622` | `brandScale 500` | `#f59e0b` | **6.97:1** | 1.4.3 | 4.5:1 | ok |

#### brand foreground

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg` | `#fb923c` | `--surface-ground` | `#201e1b` | **7.35:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-fg` | `#fb923c` | `--surface-card` | `#292725` | **6.57:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#facc15` | `--surface-ground` | `#201e1b` | **10.86:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#facc15` | `--surface-card` | `#292725` | **9.72:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#f87171` | `--surface-ground` | `#201e1b` | **6.01:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#f87171` | `--surface-card` | `#292725` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#fbbf24` | `--surface-ground` | `#201e1b` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#fbbf24` | `--surface-card` | `#292725` | **8.91:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#f472b6` | `--surface-ground` | `#201e1b` | **6.28:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#f472b6` | `--surface-card` | `#292725` | **5.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#e879c0` | `--surface-ground` | `#201e1b` | **6.28:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#e879c0` | `--surface-card` | `#292725` | **5.62:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#4ade80` | `--surface-ground` | `#201e1b` | **9.54:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#4ade80` | `--surface-card` | `#292725` | **8.54:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#bef264` | `--surface-ground` | `#201e1b` | **12.73:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#bef264` | `--surface-card` | `#292725` | **11.39:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#2dd4bf` | `--surface-ground` | `#201e1b` | **8.93:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#2dd4bf` | `--surface-card` | `#292725` | **7.99:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#60a5fa` | `--surface-ground` | `#201e1b` | **6.54:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#60a5fa` | `--surface-card` | `#292725` | **5.85:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#22d3ee` | `--surface-ground` | `#201e1b` | **9.20:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#22d3ee` | `--surface-card` | `#292725` | **8.23:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#34d399` | `--surface-ground` | `#201e1b` | **8.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#34d399` | `--surface-card` | `#292725` | **7.74:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#85a7ff` | `--surface-ground` | `#201e1b` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#85a7ff` | `--surface-card` | `#292725` | **6.36:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#7dd3fc` | `--surface-ground` | `#201e1b` | **9.97:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#7dd3fc` | `--surface-card` | `#292725` | **8.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#f9a8d4` | `--surface-ground` | `#201e1b` | **9.17:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#f9a8d4` | `--surface-card` | `#292725` | **8.21:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#fda4af` | `--surface-ground` | `#201e1b` | **8.79:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#fda4af` | `--surface-card` | `#292725` | **7.87:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#d6d3d1` | `--surface-ground` | `#201e1b` | **11.16:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#d6d3d1` | `--surface-card` | `#292725` | **9.99:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#fbbf24` | `--surface-ground` | `#201e1b` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#fbbf24` | `--surface-card` | `#292725` | **8.91:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#f8fafc` | `--surface-ground` | `#201e1b` | **15.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#f8fafc` | `--surface-card` | `#292725` | **14.22:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#e2e8f0` | `--surface-ground` | `#201e1b` | **13.49:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#e2e8f0` | `--surface-card` | `#292725` | **12.07:1** | 1.4.3 | 4.5:1 | ok |

#### filled button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--primary-color` | `#9a3412` | **7.31:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--gradient-accent-color` | `#854d0e` | **6.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--primary-color` | `#a71818` | **7.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--gradient-accent-color` | `#785307` | **6.91:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--primary-color` | `#880f3f` | **9.60:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--gradient-accent-color` | `#971f64` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--primary-color` | `#11612c` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--gradient-accent-color` | `#475a07` | **7.68:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--primary-color` | `#086058` | **7.44:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--gradient-accent-color` | `#1151d0` | **6.75:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--primary-color` | `#065d6e` | **7.50:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--gradient-accent-color` | `#12683d` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--primary-color` | `#2638b0` | **9.23:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--gradient-accent-color` | `#075985` | **7.56:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--primary-color` | `#9a116a` | **7.89:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--gradient-accent-color` | `#af133e` | **7.03:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--primary-color` | `#605247` | **7.51:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--gradient-accent-color` | `#854e17` | **6.78:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#1e293b` | `contrast.--primary-color` | `#f8fafc` | **13.98:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#1e293b` | `contrast.--gradient-accent-color` | `#e2e8f0` | **11.87:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--primary-color @brightness(0.92)` | `#8e3011` | **6.82:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--gradient-accent-color @brightness(0.92)` | `#7a470d` | **6.44:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--primary-color @brightness(0.92)` | `#9a1616` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--gradient-accent-color @brightness(0.92)` | `#6e4c06` | **6.53:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--primary-color @brightness(0.92)` | `#7d0e3a` | **8.83:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--gradient-accent-color @brightness(0.92)` | `#8b1d5c` | **7.25:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--primary-color @brightness(0.92)` | `#105928` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--gradient-accent-color @brightness(0.92)` | `#415306` | **7.15:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--primary-color @brightness(0.92)` | `#075851` | **6.98:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--gradient-accent-color @brightness(0.92)` | `#104bbf` | **6.33:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--primary-color @brightness(0.92)` | `#065665` | **6.97:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--gradient-accent-color @brightness(0.92)` | `#116038` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--primary-color @brightness(0.92)` | `#2334a2` | **8.45:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--gradient-accent-color @brightness(0.92)` | `#06527a` | **7.06:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--primary-color @brightness(0.92)` | `#8e1062` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--gradient-accent-color @brightness(0.92)` | `#a11139` | **6.64:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--primary-color @brightness(0.92)` | `#584b41` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--gradient-accent-color @brightness(0.92)` | `#7a4815` | **6.37:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#212d41` | `contrast.--primary-color @brightness(1.1)` | `#ffffff` | **13.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#212d41` | `contrast.--gradient-accent-color @brightness(1.1)` | `#f9ffff` | **13.70:1** | 1.4.3 | 4.5:1 | ok |

#### accent surface

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--accent-on-surface` | `#ffdaa5` | `sunset.--accent-surface` | `#430000` | **12.78:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--accent-on-surface` | `#ffb6b6` | `fire.--accent-surface` | `#4e0000` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--accent-on-surface` | `#ffabe7` | `coral.--accent-surface` | `#290000` | **11.18:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--accent-on-surface` | `#aeffcf` | `forest.--accent-surface` | `#000000` | **18.00:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--accent-on-surface` | `#a3ffff` | `ocean.--accent-surface` | `#000000` | **18.31:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--accent-on-surface` | `#a0ffff` | `aurora.--accent-surface` | `#000009` | **18.17:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--accent-on-surface` | `#ccdfff` | `twilight.--accent-surface` | `#000054` | **13.80:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--accent-on-surface` | `#ffadff` | `mystic.--accent-surface` | `#390000` | **10.80:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--accent-on-surface` | `#fffef1` | `stone.--accent-surface` | `#000000` | **20.70:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--accent-on-surface` | `#a8b0c3` | `contrast.--accent-surface` | `#000000` | **9.66:1** | 1.4.3 | 4.5:1 | ok |

#### checkbox & radiobutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `checkbox.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `checkbox.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#fb923c` | `--surface-ground` | `#201e1b` | **7.35:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#fb923c` | `--surface-card` | `#292725` | **6.57:1** | 1.4.11 | 3:1 | ok |
| `sunset.checkbox.icon.checked.color` | `#18181b` | `sunset.checkbox.checked.background` | `#fb923c` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#f87171` | `--surface-ground` | `#201e1b` | **6.01:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#f87171` | `--surface-card` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.checkbox.icon.checked.color` | `#18181b` | `fire.checkbox.checked.background` | `#f87171` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#f472b6` | `--surface-ground` | `#201e1b` | **6.28:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#f472b6` | `--surface-card` | `#292725` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.checkbox.icon.checked.color` | `#18181b` | `coral.checkbox.checked.background` | `#f472b6` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#4ade80` | `--surface-ground` | `#201e1b` | **9.54:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#4ade80` | `--surface-card` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `forest.checkbox.icon.checked.color` | `#18181b` | `forest.checkbox.checked.background` | `#4ade80` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#2dd4bf` | `--surface-ground` | `#201e1b` | **8.93:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#2dd4bf` | `--surface-card` | `#292725` | **7.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.checkbox.icon.checked.color` | `#18181b` | `ocean.checkbox.checked.background` | `#2dd4bf` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#22d3ee` | `--surface-ground` | `#201e1b` | **9.20:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#22d3ee` | `--surface-card` | `#292725` | **8.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.checkbox.icon.checked.color` | `#18181b` | `aurora.checkbox.checked.background` | `#22d3ee` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#85a7ff` | `--surface-ground` | `#201e1b` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#85a7ff` | `--surface-card` | `#292725` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.checkbox.icon.checked.color` | `#18181b` | `twilight.checkbox.checked.background` | `#85a7ff` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#f9a8d4` | `--surface-ground` | `#201e1b` | **9.17:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#f9a8d4` | `--surface-card` | `#292725` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.checkbox.icon.checked.color` | `#18181b` | `mystic.checkbox.checked.background` | `#f9a8d4` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#d6d3d1` | `--surface-ground` | `#201e1b` | **11.16:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#d6d3d1` | `--surface-card` | `#292725` | **9.99:1** | 1.4.11 | 3:1 | ok |
| `stone.checkbox.icon.checked.color` | `#18181b` | `stone.checkbox.checked.background` | `#d6d3d1` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#f8fafc` | `--surface-ground` | `#201e1b` | **15.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#f8fafc` | `--surface-card` | `#292725` | **14.22:1** | 1.4.11 | 3:1 | ok |
| `contrast.checkbox.icon.checked.color` | `#18181b` | `contrast.checkbox.checked.background` | `#f8fafc` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### toggleswitch

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `toggleswitch.background` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.background` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.handle.background` | `#292725` | `toggleswitch.background` | `#969491` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `sunset.toggleswitch.handle.checked.background` | `#18181b` | `sunset.toggleswitch.checked.background` | `#fb923c` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.toggleswitch.handle.checked.background` | `#18181b` | `fire.toggleswitch.checked.background` | `#f87171` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.toggleswitch.handle.checked.background` | `#18181b` | `coral.toggleswitch.checked.background` | `#f472b6` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.toggleswitch.handle.checked.background` | `#18181b` | `forest.toggleswitch.checked.background` | `#4ade80` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.toggleswitch.handle.checked.background` | `#18181b` | `ocean.toggleswitch.checked.background` | `#2dd4bf` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.toggleswitch.handle.checked.background` | `#18181b` | `aurora.toggleswitch.checked.background` | `#22d3ee` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.toggleswitch.handle.checked.background` | `#18181b` | `twilight.toggleswitch.checked.background` | `#85a7ff` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.toggleswitch.handle.checked.background` | `#18181b` | `mystic.toggleswitch.checked.background` | `#f9a8d4` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.toggleswitch.handle.checked.background` | `#18181b` | `stone.toggleswitch.checked.background` | `#d6d3d1` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.toggleswitch.handle.checked.background` | `#18181b` | `contrast.toggleswitch.checked.background` | `#f8fafc` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### form field edge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#969491` | `select.background` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--control-border)` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--control-border)` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--control-border)` | `#969491` | `inputtext.background` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#969491` | `textarea.background` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#969491` | `multiselect.background` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#969491` | `listbox.background` | `#09090b` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#969491` | `autocomplete.background` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#969491` | `autocomplete.background` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#969491` | `datepicker.dropdown.background` | `#27272a` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#969491` | `inputtext.background` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#969491` | `cascadeselect.background` | `#312f2c` | **4.41:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.color` | `#afacaa` | `inputtext.background` | `#312f2c` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `--surface-ground` | `#201e1b` | **8.76:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `--surface-card` | `#292725` | **7.84:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `inputtext.background` | `#312f2c` | **7.03:1** | 1.4.11 | 3:1 | ok |

#### form field text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `inputtext.color` | `#f1efec` | `inputtext.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `inputtext.placeholder.color` | `#afacaa` | `inputtext.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `select.color` | `#f1efec` | `select.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `select.placeholder.color` | `#afacaa` | `select.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.color` | `#f1efec` | `textarea.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.placeholder.color` | `#afacaa` | `textarea.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.color` | `#f1efec` | `cascadeselect.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.placeholder.color` | `#afacaa` | `cascadeselect.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.color` | `#f1efec` | `multiselect.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.placeholder.color` | `#afacaa` | `multiselect.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.color` | `#f1efec` | `treeselect.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.placeholder.color` | `#afacaa` | `treeselect.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.color` | `#f1efec` | `autocomplete.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.placeholder.color` | `#afacaa` | `autocomplete.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |

#### form field icon

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.dropdown.color` | `#afacaa` | `select.background` | `#312f2c` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `multiselect.dropdown.color` | `#afacaa` | `multiselect.background` | `#312f2c` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.dropdown.color` | `#afacaa` | `cascadeselect.background` | `#312f2c` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `treeselect.dropdown.color` | `#afacaa` | `treeselect.background` | `#312f2c` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `password.icon.color` | `#afacaa` | `inputtext.background` | `#312f2c` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.color` | `#d4d4d8` | `autocomplete.dropdown.background` | `#27272a` | **10.08:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.color` | `#d4d4d8` | `datepicker.dropdown.background` | `#27272a` | **10.08:1** | 1.4.11 | 3:1 | ok |
| `inputgroup.addon.color` | `#afacaa` | `inputgroup.addon.background` | `#09090b` | **8.81:1** | 1.4.3 | 4.5:1 | ok |

#### float label

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `floatlabel.color` | `#afacaa` | `inputtext.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.active.color` | `#afacaa` | `floatlabel.on.active.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.focus.color` | `#f1efec` | `floatlabel.on.active.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.invalid.color` | `#fca5a5` | `floatlabel.on.active.background` | `#312f2c` | **7.03:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.color` | `#afacaa` | `inputtext.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.focus.color` | `#f1efec` | `inputtext.background` | `#312f2c` | **11.63:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.invalid.color` | `#fca5a5` | `inputtext.background` | `#312f2c` | **7.03:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.on.active.background` | `#312f2c` | `inputtext.background` | `#312f2c` | **1.00:1** | none | — | info |

#### tag

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `tag.secondary.color (styles.scss)` | `#ffffff` | `tag.secondary.background (styles.scss)` | `#475569` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `tag.success.color (styles.scss)` | `#ffffff` | `tag.success.background (styles.scss)` | `#15803d` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `tag.info.color (styles.scss)` | `#ffffff` | `tag.info.background (styles.scss)` | `#0369a1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `tag.warn.color (styles.scss)` | `#ffffff` | `tag.warn.background (styles.scss)` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `tag.danger.color (styles.scss)` | `#ffffff` | `tag.danger.background (styles.scss)` | `#b91c1c` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `tag.contrast.color` | `#09090b` | `tag.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#fff8a2` | `sunset.tag.primary.background over --surface-ground` | `#433120` | **11.30:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#fff8a2` | `sunset.tag.primary.background over --surface-card` | `#4b3829` | **10.12:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#ffd7d7` | `fire.tag.primary.background over --surface-ground` | `#432b29` | **9.87:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#ffd7d7` | `fire.tag.primary.background over --surface-card` | `#4a3331` | **8.82:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#ffd8ff` | `coral.tag.primary.background over --surface-ground` | `#422b34` | **10.15:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#ffd8ff` | `coral.tag.primary.background over --surface-card` | `#49333c` | **9.07:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#b0ffe6` | `forest.tag.primary.background over --surface-ground` | `#273d2b` | **10.23:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#b0ffe6` | `forest.tag.primary.background over --surface-card` | `#2e4434` | **9.18:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#93ffff` | `ocean.tag.primary.background over --surface-ground` | `#223b35` | **10.31:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#93ffff` | `ocean.tag.primary.background over --surface-card` | `#2a433e` | **9.13:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#88ffff` | `aurora.tag.primary.background over --surface-ground` | `#203b3d` | **10.14:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#88ffff` | `aurora.tag.primary.background over --surface-card` | `#284345` | **8.99:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#ebffff` | `twilight.tag.primary.background over --surface-ground` | `#30343f` | **12.01:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#ebffff` | `twilight.tag.primary.background over --surface-card` | `#383b48` | **10.75:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#ffffff` | `mystic.tag.primary.background over --surface-ground` | `#433439` | **11.74:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#ffffff` | `mystic.tag.primary.background over --surface-card` | `#4a3c41` | **10.43:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#ffffff` | `stone.tag.primary.background over --surface-ground` | `#3d3b38` | **11.16:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#ffffff` | `stone.tag.primary.background over --surface-card` | `#454341` | **9.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#ffffff` | `contrast.tag.primary.background over --surface-ground` | `#43413f` | **10.16:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#ffffff` | `contrast.tag.primary.background over --surface-card` | `#4a4947` | **8.99:1** | 1.4.3 | 4.5:1 | ok |

#### chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `chip.color` | `#ffffff` | `chip.background` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `chip.remove.icon.color` | `#ffffff` | `chip.background` | `#27272a` | **14.89:1** | 1.4.11 | 3:1 | ok |

#### dialog

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `dialog.color` | `#ffffff` | `dialog.background` | `#18181b` | **17.72:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#afacaa` | `dialog.background` | `#18181b` | **7.85:1** | 1.4.11 | 3:1 | ok |

#### skeleton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `skeleton.background` | `#2d2c29` | `--surface-ground` | `#201e1b` | **1.19:1** | none | — | info |
| `skeleton.background` | `#363432` | `--surface-card` | `#292725` | **1.20:1** | none | — | info |

#### progressbar & slider

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `slider.track.background` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#3f3f46` | `--surface-ground` | `#201e1b` | **1.59:1** | none | — | info |
| `slider.track.background` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#3f3f46` | `--surface-card` | `#292725` | **1.42:1** | none | — | info |
| `sunset.progressbar.value.background` | `#fb923c` | `progressbar.background` | `#3f3f46` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressbar.label.color` | `#18181b` | `sunset.progressbar.value.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `fire.progressbar.value.background` | `#f87171` | `progressbar.background` | `#3f3f46` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `fire.progressbar.label.color` | `#18181b` | `fire.progressbar.value.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `coral.progressbar.value.background` | `#f472b6` | `progressbar.background` | `#3f3f46` | **3.94:1** | 1.4.11 | 3:1 | ok |
| `coral.progressbar.label.color` | `#18181b` | `coral.progressbar.value.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `forest.progressbar.value.background` | `#4ade80` | `progressbar.background` | `#3f3f46` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `forest.progressbar.label.color` | `#18181b` | `forest.progressbar.value.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.progressbar.value.background` | `#2dd4bf` | `progressbar.background` | `#3f3f46` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressbar.label.color` | `#18181b` | `ocean.progressbar.value.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.progressbar.value.background` | `#22d3ee` | `progressbar.background` | `#3f3f46` | **5.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressbar.label.color` | `#18181b` | `aurora.progressbar.value.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.progressbar.value.background` | `#85a7ff` | `progressbar.background` | `#3f3f46` | **4.46:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressbar.label.color` | `#18181b` | `twilight.progressbar.value.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.progressbar.value.background` | `#f9a8d4` | `progressbar.background` | `#3f3f46` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressbar.label.color` | `#18181b` | `mystic.progressbar.value.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `stone.progressbar.value.background` | `#d6d3d1` | `progressbar.background` | `#3f3f46` | **7.01:1** | 1.4.11 | 3:1 | ok |
| `stone.progressbar.label.color` | `#18181b` | `stone.progressbar.value.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.progressbar.value.background` | `#f8fafc` | `progressbar.background` | `#3f3f46` | **9.98:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressbar.label.color` | `#18181b` | `contrast.progressbar.value.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |

#### togglebutton & selectbutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `togglebutton.color` | `#afacaa` | `togglebutton.background` | `#312f2c` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `togglebutton.hover.color` | `#f1efec` | `togglebutton.hover.background` | `#373432` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.togglebutton.content.checked.background` | `#fb923c` | `togglebutton.background` | `#312f2c` | **5.90:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `sunset.togglebutton.content.checked.background` | `#fb923c` | **6.57:1** | 1.4.3 | 4.5:1 | ok |
| `fire.togglebutton.content.checked.background` | `#f87171` | `togglebutton.background` | `#312f2c` | **4.82:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `fire.togglebutton.content.checked.background` | `#f87171` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `coral.togglebutton.content.checked.background` | `#f472b6` | `togglebutton.background` | `#312f2c` | **5.04:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `coral.togglebutton.content.checked.background` | `#f472b6` | **5.62:1** | 1.4.3 | 4.5:1 | ok |
| `forest.togglebutton.content.checked.background` | `#4ade80` | `togglebutton.background` | `#312f2c` | **7.66:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `forest.togglebutton.content.checked.background` | `#4ade80` | **8.54:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.togglebutton.content.checked.background` | `#2dd4bf` | `togglebutton.background` | `#312f2c` | **7.17:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `ocean.togglebutton.content.checked.background` | `#2dd4bf` | **7.99:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.togglebutton.content.checked.background` | `#22d3ee` | `togglebutton.background` | `#312f2c` | **7.38:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `aurora.togglebutton.content.checked.background` | `#22d3ee` | **8.23:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.togglebutton.content.checked.background` | `#85a7ff` | `togglebutton.background` | `#312f2c` | **5.70:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `twilight.togglebutton.content.checked.background` | `#85a7ff` | **6.36:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.togglebutton.content.checked.background` | `#f9a8d4` | `togglebutton.background` | `#312f2c` | **7.36:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `mystic.togglebutton.content.checked.background` | `#f9a8d4` | **8.21:1** | 1.4.3 | 4.5:1 | ok |
| `stone.togglebutton.content.checked.background` | `#d6d3d1` | `togglebutton.background` | `#312f2c` | **8.96:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `stone.togglebutton.content.checked.background` | `#d6d3d1` | **9.99:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.togglebutton.content.checked.background` | `#f8fafc` | `togglebutton.background` | `#312f2c` | **12.76:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#292725` | `contrast.togglebutton.content.checked.background` | `#f8fafc` | **14.22:1** | 1.4.3 | 4.5:1 | ok |

#### menu focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `menubar.submenu.icon.color` | `#afacaa` | `menubar.background` | `#18181b` | **7.85:1** | 1.4.11 | 3:1 | ok |
| `menubar.submenu.icon.color` | `#afacaa` | `menubar.item.focus.background` | `#27272a` | **6.60:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#afacaa` | `menubar.background` | `#18181b` | **7.85:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#afacaa` | `menubar.item.focus.background` | `#27272a` | **6.60:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.focus.background` | `#27272a` | `menubar.background` | `#18181b` | **1.19:1** | none | — | info |
| `sunset.--primary-color-fg (focus ring)` | `#fb923c` | `menubar.item.focus.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (focus ring)` | `#fb923c` | `menubar.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#f87171` | `menubar.item.focus.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#f87171` | `menubar.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#f472b6` | `menubar.item.focus.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#f472b6` | `menubar.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#4ade80` | `menubar.item.focus.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#4ade80` | `menubar.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#2dd4bf` | `menubar.item.focus.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#2dd4bf` | `menubar.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#22d3ee` | `menubar.item.focus.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#22d3ee` | `menubar.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#85a7ff` | `menubar.item.focus.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#85a7ff` | `menubar.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#f9a8d4` | `menubar.item.focus.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#f9a8d4` | `menubar.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#d6d3d1` | `menubar.item.focus.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#d6d3d1` | `menubar.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#f8fafc` | `menubar.item.focus.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#f8fafc` | `menubar.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### option list focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.option.focus.background` | `#27272a` | `select.overlay.background` | `#18181b` | **1.19:1** | none | — | info |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **6.57:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `select.option.focus.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.select.option.selected.background` | `#4b4031` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.select.option.selected.focus.background` | `#4b4031` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **5.46:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `multiselect.overlay.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.multiselect.option.selected.background` | `#3d3428` | **5.39:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.multiselect.option.selected.focus.background` | `#4f422f` | **4.31:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `listbox.background` | `#09090b` | **8.79:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.listbox.option.selected.background` | `#30271b` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.listbox.option.selected.focus.background` | `#443623` | **5.16:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `select.option.focus.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.select.option.selected.background` | `#4b3b39` | **3.83:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.select.option.selected.focus.background` | `#4b3b39` | **3.83:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `multiselect.overlay.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.multiselect.option.selected.background` | `#3d2e31` | **4.65:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.multiselect.option.selected.focus.background` | `#4f3a3c` | **3.79:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `listbox.background` | `#09090b` | **7.19:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.listbox.option.selected.background` | `#302223` | **5.51:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.listbox.option.selected.focus.background` | `#442e30` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `select.option.focus.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.select.option.selected.background` | `#4b3b44` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.select.option.selected.focus.background` | `#4b3b44` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **4.66:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `multiselect.overlay.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.multiselect.option.selected.background` | `#3d2f3c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.multiselect.option.selected.focus.background` | `#4f3a4c` | **3.88:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `listbox.background` | `#09090b` | **7.51:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.listbox.option.selected.background` | `#30222f` | **5.68:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.listbox.option.selected.focus.background` | `#442e40` | **4.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `select.option.focus.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.select.option.selected.background` | `#364a3c` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.select.option.selected.focus.background` | `#364a3c` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **7.09:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `multiselect.overlay.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.multiselect.option.selected.background` | `#283d33` | **6.67:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.multiselect.option.selected.focus.background` | `#304f3f` | **5.20:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `listbox.background` | `#09090b` | **11.42:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.listbox.option.selected.background` | `#1c3026` | **8.03:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.listbox.option.selected.focus.background` | `#254433` | **6.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **7.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `select.option.focus.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.select.option.selected.background` | `#324a46` | **5.12:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.select.option.selected.focus.background` | `#324a46` | **5.12:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **6.64:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `multiselect.overlay.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.multiselect.option.selected.background` | `#243d3d` | **6.23:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.multiselect.option.selected.focus.background` | `#294f4f` | **4.85:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `listbox.background` | `#09090b` | **10.69:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.listbox.option.selected.background` | `#173030` | **7.51:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.listbox.option.selected.focus.background` | `#1e4442` | **5.75:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **8.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `select.option.focus.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.select.option.selected.background` | `#304a48` | **5.28:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.select.option.selected.focus.background` | `#304a48` | **5.28:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **6.84:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `multiselect.overlay.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.multiselect.option.selected.background` | `#223d3f` | **6.43:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.multiselect.option.selected.focus.background` | `#274f52` | **4.99:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `listbox.background` | `#09090b` | **11.01:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.listbox.option.selected.background` | `#153032` | **7.74:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.listbox.option.selected.focus.background` | `#1b4446` | **5.92:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `select.option.focus.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.select.option.selected.background` | `#404448` | **4.19:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.select.option.selected.focus.background` | `#404448` | **4.19:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **5.28:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `multiselect.overlay.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.multiselect.option.selected.background` | `#32373f` | **5.11:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.multiselect.option.selected.focus.background` | `#3e4752` | **4.03:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `listbox.background` | `#09090b` | **8.50:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.listbox.option.selected.background` | `#252a32` | **6.16:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.listbox.option.selected.focus.background` | `#333b46` | **4.84:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `select.option.focus.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.select.option.selected.background` | `#4b4448` | **5.22:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.select.option.selected.focus.background` | `#4b4448` | **5.22:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **6.81:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `multiselect.overlay.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.multiselect.option.selected.background` | `#3d373f` | **6.37:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.multiselect.option.selected.focus.background` | `#4f4752` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `listbox.background` | `#09090b` | **10.97:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.listbox.option.selected.background` | `#302b32` | **7.63:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.listbox.option.selected.focus.background` | `#443b46` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **9.99:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `select.option.focus.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.select.option.selected.background` | `#4b4a48` | **5.94:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.select.option.selected.focus.background` | `#4b4a48` | **5.94:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **8.29:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `multiselect.overlay.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.multiselect.option.selected.background` | `#3d3d3f` | **7.28:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.multiselect.option.selected.focus.background` | `#4f4f52` | **5.48:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `listbox.background` | `#09090b` | **13.36:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.listbox.option.selected.background` | `#303032` | **8.84:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.listbox.option.selected.focus.background` | `#444446` | **6.52:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `--surface-card (.dark-theme .p-select-overlay)` | `#292725` | **14.22:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `select.option.focus.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.select.option.selected.background` | `#4b4a48` | **8.46:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.select.option.selected.focus.background` | `#4b4a48` | **8.46:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#373432` | **11.81:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `multiselect.overlay.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.multiselect.option.selected.background` | `#3d3d3f` | **10.36:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.multiselect.option.selected.focus.background` | `#4f4f52` | **7.80:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `listbox.background` | `#09090b` | **19.02:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.listbox.option.selected.background` | `#303032` | **12.59:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.listbox.option.selected.focus.background` | `#444446` | **9.29:1** | 1.4.11 | 3:1 | ok |

#### panel outline

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-outline` | `#969491` | `--surface-ground` | `#201e1b` | **5.50:1** | 1.4.11 | 3:1 | ok |
| `--style-outline` | `#969491` | `--surface-card` | `#292725` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `popover.background` | `#18181b` | `--surface-card` | `#292725` | **1.19:1** | none | — | info |
| `drawer.background` | `#18181b` | `--surface-card` | `#292725` | **1.19:1** | none | — | info |

#### content panel

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `text.color` | `#ffffff` | `content.background` | `#18181b` | **17.72:1** | 1.4.3 | 4.5:1 | ok |

#### table & paginator

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `datatable.row.background` | `#292725` | `--surface-card` | `#292725` | **1.00:1** | none | — | info |
| `paginator.background` | `#292725` | `--surface-card` | `#292725` | **1.00:1** | none | — | info |
| `datatable.row.color` | `#ffffff` | `datatable.row.background` | `#292725` | **14.88:1** | 1.4.3 | 4.5:1 | ok |
| `paginator.nav.button.color` | `#a1a1aa` | `paginator.background` | `#292725` | **5.81:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.datatable.row.selected.color` | `#e8e6e4` | `sunset.datatable.row.selected.background` | `#4b4031` | **8.12:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.color` | `#18181b` | `sunset.paginator.nav.button.selected.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.background` | `#fb923c` | `paginator.background` | `#292725` | **6.57:1** | 1.4.11 | 3:1 | ok |
| `sunset.datatable.row.selected.background` | `#4b4031` | `datatable.row.background` | `#292725` | **1.47:1** | none | — | info |
| `sunset.--primary-color-fg (selected-row bar)` | `#fb923c` | `sunset.datatable.row.selected.background` | `#4b4031` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (selected-row bar)` | `#fb923c` | `datatable.row.background` | `#292725` | **6.57:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.color` | `#e8e6e5` | `fire.datatable.row.selected.background` | `#4b3b39` | **8.51:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.color` | `#18181b` | `fire.paginator.nav.button.selected.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.background` | `#f87171` | `paginator.background` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.background` | `#4b3b39` | `datatable.row.background` | `#292725` | **1.41:1** | none | — | info |
| `fire.--primary-color-fg (selected-row bar)` | `#f87171` | `fire.datatable.row.selected.background` | `#4b3b39` | **3.83:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (selected-row bar)` | `#f87171` | `datatable.row.background` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.color` | `#e8e6e7` | `coral.datatable.row.selected.background` | `#4b3b44` | **8.42:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.color` | `#18181b` | `coral.paginator.nav.button.selected.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.background` | `#f472b6` | `paginator.background` | `#292725` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.background` | `#4b3b44` | `datatable.row.background` | `#292725` | **1.42:1** | none | — | info |
| `coral.--primary-color-fg (selected-row bar)` | `#f472b6` | `coral.datatable.row.selected.background` | `#4b3b44` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (selected-row bar)` | `#f472b6` | `datatable.row.background` | `#292725` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.color` | `#e5e7e6` | `forest.datatable.row.selected.background` | `#364a3c` | **7.68:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.color` | `#18181b` | `forest.paginator.nav.button.selected.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.background` | `#4ade80` | `paginator.background` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.background` | `#364a3c` | `datatable.row.background` | `#292725` | **1.56:1** | none | — | info |
| `forest.--primary-color-fg (selected-row bar)` | `#4ade80` | `forest.datatable.row.selected.background` | `#364a3c` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (selected-row bar)` | `#4ade80` | `datatable.row.background` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.color` | `#e4e7e7` | `ocean.datatable.row.selected.background` | `#324a46` | **7.66:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.color` | `#18181b` | `ocean.paginator.nav.button.selected.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.background` | `#2dd4bf` | `paginator.background` | `#292725` | **7.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.background` | `#324a46` | `datatable.row.background` | `#292725` | **1.56:1** | none | — | info |
| `ocean.--primary-color-fg (selected-row bar)` | `#2dd4bf` | `ocean.datatable.row.selected.background` | `#324a46` | **5.12:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (selected-row bar)` | `#2dd4bf` | `datatable.row.background` | `#292725` | **7.99:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.color` | `#e4e7e7` | `aurora.datatable.row.selected.background` | `#304a48` | **7.68:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.color` | `#18181b` | `aurora.paginator.nav.button.selected.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.background` | `#22d3ee` | `paginator.background` | `#292725` | **8.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.background` | `#304a48` | `datatable.row.background` | `#292725` | **1.56:1** | none | — | info |
| `aurora.--primary-color-fg (selected-row bar)` | `#22d3ee` | `aurora.datatable.row.selected.background` | `#304a48` | **5.28:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (selected-row bar)` | `#22d3ee` | `datatable.row.background` | `#292725` | **8.23:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.color` | `#e6e7e7` | `twilight.datatable.row.selected.background` | `#404448` | **7.93:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.color` | `#18181b` | `twilight.paginator.nav.button.selected.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.background` | `#85a7ff` | `paginator.background` | `#292725` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.background` | `#404448` | `datatable.row.background` | `#292725` | **1.52:1** | none | — | info |
| `twilight.--primary-color-fg (selected-row bar)` | `#85a7ff` | `twilight.datatable.row.selected.background` | `#404448` | **4.19:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (selected-row bar)` | `#85a7ff` | `datatable.row.background` | `#292725` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.color` | `#e8e7e7` | `mystic.datatable.row.selected.background` | `#4b4448` | **7.67:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.color` | `#18181b` | `mystic.paginator.nav.button.selected.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.background` | `#f9a8d4` | `paginator.background` | `#292725` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.background` | `#4b4448` | `datatable.row.background` | `#292725` | **1.57:1** | none | — | info |
| `mystic.--primary-color-fg (selected-row bar)` | `#f9a8d4` | `mystic.datatable.row.selected.background` | `#4b4448` | **5.22:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (selected-row bar)` | `#f9a8d4` | `datatable.row.background` | `#292725` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.color` | `#e8e7e7` | `stone.datatable.row.selected.background` | `#4b4a48` | **7.17:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.color` | `#18181b` | `stone.paginator.nav.button.selected.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.background` | `#d6d3d1` | `paginator.background` | `#292725` | **9.99:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.background` | `#4b4a48` | `datatable.row.background` | `#292725` | **1.68:1** | none | — | info |
| `stone.--primary-color-fg (selected-row bar)` | `#d6d3d1` | `stone.datatable.row.selected.background` | `#4b4a48` | **5.94:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (selected-row bar)` | `#d6d3d1` | `datatable.row.background` | `#292725` | **9.99:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.color` | `#e8e7e7` | `contrast.datatable.row.selected.background` | `#4b4a48` | **7.17:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.color` | `#18181b` | `contrast.paginator.nav.button.selected.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.background` | `#f8fafc` | `paginator.background` | `#292725` | **14.22:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.background` | `#4b4a48` | `datatable.row.background` | `#292725` | **1.68:1** | none | — | info |
| `contrast.--primary-color-fg (selected-row bar)` | `#f8fafc` | `contrast.datatable.row.selected.background` | `#4b4a48` | **8.46:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (selected-row bar)` | `#f8fafc` | `datatable.row.background` | `#292725` | **14.22:1** | 1.4.11 | 3:1 | ok |

#### badge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `badge.secondary.color` | `#d4d4d8` | `badge.secondary.background` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `badge.success.color` | `#052e16` | `badge.success.background` | `#86efac` | **10.62:1** | 1.4.3 | 4.5:1 | ok |
| `badge.info.color` | `#172554` | `badge.info.background` | `#93c5fd` | **8.15:1** | 1.4.3 | 4.5:1 | ok |
| `badge.warn.color` | `#431407` | `badge.warn.background` | `#fdba74` | **9.28:1** | 1.4.3 | 4.5:1 | ok |
| `badge.danger.color` | `#450a0a` | `badge.danger.background` | `#fca5a5` | **8.51:1** | 1.4.3 | 4.5:1 | ok |
| `badge.contrast.color` | `#09090b` | `badge.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.badge.primary.color` | `#18181b` | `sunset.badge.primary.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `fire.badge.primary.color` | `#18181b` | `fire.badge.primary.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `coral.badge.primary.color` | `#18181b` | `coral.badge.primary.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `forest.badge.primary.color` | `#18181b` | `forest.badge.primary.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.badge.primary.color` | `#18181b` | `ocean.badge.primary.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.badge.primary.color` | `#18181b` | `aurora.badge.primary.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.badge.primary.color` | `#18181b` | `twilight.badge.primary.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.badge.primary.color` | `#18181b` | `mystic.badge.primary.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `stone.badge.primary.color` | `#18181b` | `stone.badge.primary.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.badge.primary.color` | `#18181b` | `contrast.badge.primary.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |

#### message & toast

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `message.info.color` | `#93c5fd` | `message.info.background over --surface-ground` | `#242e3e` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#93c5fd` | `--surface-ground` | `#201e1b` | **9.22:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#93c5fd` | `toast.info.background over --surface-ground` | `#242e3e` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#ffffff` | `toast.info.background over --surface-ground` | `#242e3e` | **13.68:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.color` | `#93c5fd` | `message.info.background over --surface-card` | `#2c3646` | **6.76:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#93c5fd` | `--surface-card` | `#292725` | **8.25:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#93c5fd` | `toast.info.background over --surface-card` | `#2c3646` | **6.76:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#ffffff` | `toast.info.background over --surface-card` | `#2c3646` | **12.19:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#86efac` | `message.success.background over --surface-ground` | `#203926` | **8.93:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#86efac` | `--surface-ground` | `#201e1b` | **11.84:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#86efac` | `toast.success.background over --surface-ground` | `#203926` | **8.93:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#ffffff` | `toast.success.background over --surface-ground` | `#203926` | **12.54:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#86efac` | `message.success.background over --surface-card` | `#28402e` | **8.03:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#86efac` | `--surface-card` | `#292725` | **10.60:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#86efac` | `toast.success.background over --surface-card` | `#28402e` | **8.03:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#ffffff` | `toast.success.background over --surface-card` | `#28402e` | **11.27:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#fdba74` | `message.warn.background over --surface-ground` | `#403618` | **7.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#fdba74` | `--surface-ground` | `#201e1b` | **9.86:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#fdba74` | `toast.warn.background over --surface-ground` | `#403618` | **7.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#ffffff` | `toast.warn.background over --surface-ground` | `#403618` | **11.94:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#fdba74` | `message.warn.background over --surface-card` | `#483d20` | **6.34:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#fdba74` | `--surface-card` | `#292725` | **8.82:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#fdba74` | `toast.warn.background over --surface-card` | `#483d20` | **6.34:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#ffffff` | `toast.warn.background over --surface-card` | `#483d20` | **10.69:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#fca5a5` | `message.error.background over --surface-ground` | `#412422` | **7.38:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#fca5a5` | `--surface-ground` | `#201e1b` | **8.76:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#fca5a5` | `toast.error.background over --surface-ground` | `#412422` | **7.38:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#ffffff` | `toast.error.background over --surface-ground` | `#412422` | **14.00:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#fca5a5` | `message.error.background over --surface-card` | `#492c2a` | **6.60:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#fca5a5` | `--surface-card` | `#292725` | **7.84:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#fca5a5` | `toast.error.background over --surface-card` | `#492c2a` | **6.60:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#ffffff` | `toast.error.background over --surface-card` | `#492c2a` | **12.52:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#d4d4d8` | `message.secondary.background over --surface-ground` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#afacaa` | `--surface-ground` | `#201e1b` | **7.37:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#d4d4d8` | `toast.secondary.background over --surface-ground` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#ffffff` | `toast.secondary.background over --surface-ground` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#d4d4d8` | `message.secondary.background over --surface-card` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#afacaa` | `--surface-card` | `#292725` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#d4d4d8` | `toast.secondary.background over --surface-card` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#ffffff` | `toast.secondary.background over --surface-card` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#09090b` | `message.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#f1efec` | `--surface-ground` | `#201e1b` | **14.49:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#09090b` | `toast.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#09090b` | `toast.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#09090b` | `message.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#f1efec` | `--surface-card` | `#292725` | **12.97:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#09090b` | `toast.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#09090b` | `toast.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |

#### text & link button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.text.secondary.color` | `#afacaa` | `--surface-ground` | `#201e1b` | **7.37:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#afacaa` | `--surface-card` | `#292725` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#86efac` | `--surface-ground` | `#201e1b` | **11.84:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#86efac` | `--surface-card` | `#292725` | **10.60:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#93c5fd` | `--surface-ground` | `#201e1b` | **9.22:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#93c5fd` | `--surface-card` | `#292725` | **8.25:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#fdba74` | `--surface-ground` | `#201e1b` | **9.86:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#fdba74` | `--surface-card` | `#292725` | **8.82:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#67e8f9` | `--surface-ground` | `#201e1b` | **11.47:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#67e8f9` | `--surface-card` | `#292725` | **10.27:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#fca5a5` | `--surface-ground` | `#201e1b` | **8.76:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#fca5a5` | `--surface-card` | `#292725` | **7.84:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#f1efec` | `--surface-ground` | `#201e1b` | **14.49:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#f1efec` | `--surface-card` | `#292725` | **12.97:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#f1efec` | `--surface-ground` | `#201e1b` | **14.49:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#f1efec` | `--surface-card` | `#292725` | **12.97:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#fb923c` | `--surface-ground` | `#201e1b` | **7.35:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#fb923c` | `--surface-card` | `#292725` | **6.57:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#f87171` | `--surface-ground` | `#201e1b` | **6.01:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#f87171` | `--surface-card` | `#292725` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#f472b6` | `--surface-ground` | `#201e1b` | **6.28:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#f472b6` | `--surface-card` | `#292725` | **5.62:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#4ade80` | `--surface-ground` | `#201e1b` | **9.54:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#4ade80` | `--surface-card` | `#292725` | **8.54:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#2dd4bf` | `--surface-ground` | `#201e1b` | **8.93:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#2dd4bf` | `--surface-card` | `#292725` | **7.99:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#22d3ee` | `--surface-ground` | `#201e1b` | **9.20:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#22d3ee` | `--surface-card` | `#292725` | **8.23:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#85a7ff` | `--surface-ground` | `#201e1b` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#85a7ff` | `--surface-card` | `#292725` | **6.36:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#f9a8d4` | `--surface-ground` | `#201e1b` | **9.17:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#f9a8d4` | `--surface-card` | `#292725` | **8.21:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#d6d3d1` | `--surface-ground` | `#201e1b` | **11.16:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#d6d3d1` | `--surface-card` | `#292725` | **9.99:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#f8fafc` | `--surface-ground` | `#201e1b` | **15.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#f8fafc` | `--surface-card` | `#292725` | **14.22:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (contrast)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.contrast.color` | `#09090b` | `button.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |

#### avatar

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `avatar.color` | `#ffffff` | `avatar.background` | `#3f3f46` | **10.44:1** | 1.4.3 | 4.5:1 | ok |

#### image preview

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `image.action.color` | `#fafafa` | `image.toolbar.background over mask.background over --surface-ground` | `#050504` | **19.54:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-ground` | `#1e1e1d` | **16.68:1** | 1.4.11 | 3:1 | ok |
| `image.action.color` | `#fafafa` | `image.toolbar.background over mask.background over --surface-card` | `#060606` | **19.41:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-card` | `#1f1f1f` | **16.48:1** | 1.4.11 | 3:1 | ok |

#### focus ring

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-ground` | `#201e1b` | **7.35:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-card` | `#292725` | **6.57:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-section` | `#312f2c` | **5.90:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `dialog.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `chip.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `paginator.background` | `#292725` | **6.57:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `datatable.row.background` | `#292725` | **6.57:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `datatable.row.hover.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `sunset.datatable.row.selected.background` | `#4b4031` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `autocomplete.chip.focus.background` | `#3f3f46` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-ground` | `#201e1b` | **6.01:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-card` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-section` | `#312f2c` | **4.82:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `dialog.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `chip.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `paginator.background` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `datatable.row.background` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `datatable.row.hover.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `fire.datatable.row.selected.background` | `#4b3b39` | **3.83:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `autocomplete.chip.focus.background` | `#3f3f46` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-ground` | `#201e1b` | **6.28:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-card` | `#292725` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-section` | `#312f2c` | **5.04:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `dialog.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `chip.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `paginator.background` | `#292725` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `datatable.row.background` | `#292725` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `datatable.row.hover.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `coral.datatable.row.selected.background` | `#4b3b44` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `autocomplete.chip.focus.background` | `#3f3f46` | **3.94:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-ground` | `#201e1b` | **9.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-card` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-section` | `#312f2c` | **7.66:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `dialog.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `chip.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `paginator.background` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `datatable.row.background` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `datatable.row.hover.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `forest.datatable.row.selected.background` | `#364a3c` | **5.47:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-ground` | `#201e1b` | **8.93:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-card` | `#292725` | **7.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-section` | `#312f2c` | **7.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `dialog.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `chip.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `paginator.background` | `#292725` | **7.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `datatable.row.background` | `#292725` | **7.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `datatable.row.hover.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `ocean.datatable.row.selected.background` | `#324a46` | **5.12:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-ground` | `#201e1b` | **9.20:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-card` | `#292725` | **8.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-section` | `#312f2c` | **7.38:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `dialog.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `chip.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `paginator.background` | `#292725` | **8.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `datatable.row.background` | `#292725` | **8.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `datatable.row.hover.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `aurora.datatable.row.selected.background` | `#304a48` | **5.28:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-ground` | `#201e1b` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-card` | `#292725` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-section` | `#312f2c` | **5.70:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `dialog.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `chip.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `paginator.background` | `#292725` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `datatable.row.background` | `#292725` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `datatable.row.hover.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `twilight.datatable.row.selected.background` | `#404448` | **4.19:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `autocomplete.chip.focus.background` | `#3f3f46` | **4.46:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-ground` | `#201e1b` | **9.17:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-card` | `#292725` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-section` | `#312f2c` | **7.36:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `dialog.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `chip.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `paginator.background` | `#292725` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `datatable.row.background` | `#292725` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `datatable.row.hover.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `mystic.datatable.row.selected.background` | `#4b4448` | **5.22:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-ground` | `#201e1b` | **11.16:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-card` | `#292725` | **9.99:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-section` | `#312f2c` | **8.96:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `dialog.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `chip.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `paginator.background` | `#292725` | **9.99:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `datatable.row.background` | `#292725` | **9.99:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `datatable.row.hover.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `stone.datatable.row.selected.background` | `#4b4a48` | **5.94:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `autocomplete.chip.focus.background` | `#3f3f46` | **7.01:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-ground` | `#201e1b` | **15.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-card` | `#292725` | **14.22:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-section` | `#312f2c` | **12.76:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `dialog.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `chip.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `paginator.background` | `#292725` | **14.22:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `datatable.row.background` | `#292725` | **14.22:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `datatable.row.hover.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `contrast.datatable.row.selected.background` | `#4b4a48` | **8.46:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `autocomplete.chip.focus.background` | `#3f3f46` | **9.98:1** | 1.4.11 | 3:1 | ok |

#### progress spinner

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-ground` | `#201e1b` | **7.35:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-card` | `#292725` | **6.57:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-section` | `#312f2c` | **5.90:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-ground` | `#201e1b` | **6.01:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-card` | `#292725` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-section` | `#312f2c` | **4.82:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-ground` | `#201e1b` | **6.28:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-card` | `#292725` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-section` | `#312f2c` | **5.04:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-ground` | `#201e1b` | **9.54:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-card` | `#292725` | **8.54:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-section` | `#312f2c` | **7.66:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-ground` | `#201e1b` | **8.93:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-card` | `#292725` | **7.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-section` | `#312f2c` | **7.17:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-ground` | `#201e1b` | **9.20:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-card` | `#292725` | **8.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-section` | `#312f2c` | **7.38:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-ground` | `#201e1b` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-card` | `#292725` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-section` | `#312f2c` | **5.70:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-ground` | `#201e1b` | **9.17:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-card` | `#292725` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-section` | `#312f2c` | **7.36:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-ground` | `#201e1b` | **11.16:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-card` | `#292725` | **9.99:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-section` | `#312f2c` | **8.96:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-ground` | `#201e1b` | **15.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-card` | `#292725` | **14.22:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-section` | `#312f2c` | **12.76:1** | 1.4.11 | 3:1 | ok |

## style: skizzenbuch

### light mode

#### body text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--text-color` | `#3a3530` | `--surface-ground` | `#faf7f2` | **11.35:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#6f675e` | `--surface-ground` | `#faf7f2` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#3a3530` | `--surface-card` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#6f675e` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#3a3530` | `--surface-section` | `#f5f0e8` | **10.69:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#6f675e` | `--surface-section` | `#f5f0e8` | **4.90:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#3a3530` | `--surface-hover` | `#efe8dc` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#6f675e` | `--surface-hover` | `#efe8dc` | **4.57:1** | 1.4.3 | 4.5:1 | ok |

#### semantic text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--semantic-blue-fg` | `#1d4ed8` | `--surface-ground` | `#faf7f2` | **6.27:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-blue-fg` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#c2410c` | `--surface-ground` | `#faf7f2` | **4.85:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#15803d` | `--surface-ground` | `#faf7f2` | **4.69:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#b91c1c` | `--surface-ground` | `#faf7f2` | **6.05:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#0e7490` | `--surface-ground` | `#faf7f2` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#be185d` | `--surface-ground` | `#faf7f2` | **5.65:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#be185d` | `--surface-card` | `#ffffff` | **6.04:1** | 1.4.3 | 4.5:1 | ok |

#### dev toggle

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--dev-toggle-fg` | `#166534` | `color-mix(--dev-toggle-border 15%, --surface-card)` | `#dcf1e4` | **6.03:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border` | `#16a34a` | `--surface-card` | `#ffffff` | **3.30:1** | 1.4.11 | 3:1 | ok |
| `--dev-toggle-fg-active` | `#991b1b` | `color-mix(--dev-toggle-border-active 15%, --surface-card)` | `#fde3e3` | **6.84:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border-active` | `#ef4444` | `--surface-card` | `#ffffff` | **3.76:1** | 1.4.11 | 3:1 | ok |

#### control boundary

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-border` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#837a6e` | `--surface-section` | `#f5f0e8` | **3.72:1** | 1.4.11 | 3:1 | ok |

#### floating action button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `.fab-label --text-color` | `#3a3530` | `.fab-button --surface-card` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-label --text-color` | `#3a3530` | `.fab-button:hover --surface-hover` | `#efe8dc` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-button --fab-edge` | `#3a3530` | `--surface-ground` | `#faf7f2` | **11.35:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#3a3530` | `--surface-card` | `#ffffff` | **12.13:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#3a3530` | `--surface-section` | `#f5f0e8` | **10.69:1** | 1.4.11 | 3:1 | ok |

#### severity button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text` | `#963f3a` | `--gradient-danger-from` | `#f6e1df` | **5.46:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text` | `#963f3a` | `--gradient-danger-to` | `#f6e1df` | **5.46:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#3f6b4c` | `--gradient-success-from` | `#e4efe6` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#3f6b4c` | `--gradient-success-to` | `#e4efe6` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#425c86` | `--gradient-info-from` | `#e3eaf5` | **5.59:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#425c86` | `--gradient-info-to` | `#e3eaf5` | **5.59:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#7d5813` | `--gradient-warn-from` | `#f5ead2` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#7d5813` | `--gradient-warn-to` | `#f5ead2` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#3a3530` | `--gradient-secondary-from` | `#efe8dc` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#3a3530` | `--gradient-secondary-to` | `#efe8dc` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#2b6169` | `--gradient-help-from` | `#dcecee` | **5.73:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#2b6169` | `--gradient-help-to` | `#dcecee` | **5.73:1** | 1.4.3 | 4.5:1 | ok |

#### outlined severity

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--outlined-danger-fg` | `#c8483c` | `--surface-card` | `#ffffff` | **4.72:1** | 1.4.3 | 4.5:1 | ok |
| `success.--outlined-success-fg` | `#4b7f54` | `--surface-card` | `#ffffff` | **4.71:1** | 1.4.3 | 4.5:1 | ok |
| `info.--outlined-info-fg` | `#4574bd` | `--surface-card` | `#ffffff` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--outlined-warn-fg` | `#936f21` | `--surface-card` | `#ffffff` | **4.63:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--outlined-secondary-fg` | `#8c7040` | `--surface-card` | `#ffffff` | **4.66:1** | 1.4.3 | 4.5:1 | ok |
| `help.--outlined-help-fg` | `#417e85` | `--surface-card` | `#ffffff` | **4.62:1** | 1.4.3 | 4.5:1 | ok |

#### severity button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text @brightness(1.1)` | `#a54540` | `--gradient-danger-from @brightness(1.1)` | `#fff8f5` | **5.67:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text @brightness(1.1)` | `#a54540` | `--gradient-danger-to @brightness(1.1)` | `#fff8f5` | **5.67:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(1.1)` | `#457654` | `--gradient-success-from @brightness(1.1)` | `#fbfffd` | **5.24:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(1.1)` | `#457654` | `--gradient-success-to @brightness(1.1)` | `#fbfffd` | **5.24:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(1.1)` | `#496593` | `--gradient-info-from @brightness(1.1)` | `#faffff` | **5.84:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(1.1)` | `#496593` | `--gradient-info-to @brightness(1.1)` | `#faffff` | **5.84:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#8a6115` | `--gradient-warn-from @brightness(1.1)` | `#ffffe7` | **5.45:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#8a6115` | `--gradient-warn-to @brightness(1.1)` | `#ffffe7` | **5.45:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(1.1)` | `#403a35` | `--gradient-secondary-from @brightness(1.1)` | `#fffff2` | **11.12:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(1.1)` | `#403a35` | `--gradient-secondary-to @brightness(1.1)` | `#fffff2` | **11.12:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(1.1)` | `#2f6b74` | `--gradient-help-from @brightness(1.1)` | `#f2ffff` | **5.90:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(1.1)` | `#2f6b74` | `--gradient-help-to @brightness(1.1)` | `#f2ffff` | **5.90:1** | 1.4.3 | 4.5:1 | ok |

#### brand chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-brand-ink` | `#3a3530` | `brandScale 400` | `#dcb878` | **6.45:1** | 1.4.3 | 4.5:1 | ok |

#### brand foreground

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg` | `#c2410c` | `--surface-ground` | `#faf7f2` | **4.85:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-fg` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#a16207` | `--surface-ground` | `#faf7f2` | **4.61:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#a16207` | `--surface-card` | `#ffffff` | **4.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#cd1d1d` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#946708` | `--surface-ground` | `#faf7f2` | **4.68:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#946708` | `--surface-card` | `#ffffff` | **5.00:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#a8124e` | `--surface-ground` | `#faf7f2` | **6.87:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#b9267b` | `--surface-ground` | `#faf7f2` | **5.42:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#b9267b` | `--surface-card` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#157836` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#5d7307` | `--surface-ground` | `#faf7f2` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#5d7307` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#0a756d` | `--surface-ground` | `#faf7f2` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#1f63ed` | `--surface-ground` | `#faf7f2` | **4.83:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#1f63ed` | `--surface-card` | `#ffffff` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#077288` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#167e4a` | `--surface-ground` | `#faf7f2` | **4.77:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#167e4a` | `--surface-card` | `#ffffff` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#3346d3` | `--surface-ground` | `#faf7f2` | **6.64:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#0369a1` | `--surface-ground` | `#faf7f2` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#0369a1` | `--surface-card` | `#ffffff` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#b8147f` | `--surface-ground` | `#faf7f2` | **5.70:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#d0174a` | `--surface-ground` | `#faf7f2` | **5.03:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#d0174a` | `--surface-card` | `#ffffff` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#776558` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#a05e1c` | `--surface-ground` | `#faf7f2` | **4.78:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#a05e1c` | `--surface-card` | `#ffffff` | **5.11:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#0f172a` | `--surface-ground` | `#faf7f2` | **16.71:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#1e293b` | `--surface-ground` | `#faf7f2` | **13.69:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#1e293b` | `--surface-card` | `#ffffff` | **14.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--primary-color` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--gradient-accent-color` | `#a16207` | **4.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--primary-color` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--gradient-accent-color` | `#946708` | **5.00:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--primary-color` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--gradient-accent-color` | `#b9267b` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--primary-color` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--gradient-accent-color` | `#5d7307` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--primary-color` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--gradient-accent-color` | `#1f63ed` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--primary-color` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--gradient-accent-color` | `#167e4a` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--primary-color` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--gradient-accent-color` | `#0369a1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--primary-color` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--gradient-accent-color` | `#d0174a` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--primary-color` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--gradient-accent-color` | `#a05e1c` | **5.11:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#ffffff` | `contrast.--primary-color` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#ffffff` | `contrast.--gradient-accent-color` | `#1e293b` | **14.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--primary-color @brightness(0.92)` | `#b23c0b` | **4.97:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--gradient-accent-color @brightness(0.92)` | `#945a06` | **4.73:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--primary-color @brightness(0.92)` | `#bd1b1b` | **5.28:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--gradient-accent-color @brightness(0.92)` | `#885f07` | **4.78:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--primary-color @brightness(0.92)` | `#9b1148` | **6.86:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--gradient-accent-color @brightness(0.92)` | `#aa2371` | **5.53:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--primary-color @brightness(0.92)` | `#136e32` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--gradient-accent-color @brightness(0.92)` | `#566a06` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--primary-color @brightness(0.92)` | `#096c64` | **5.27:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--gradient-accent-color @brightness(0.92)` | `#1d5bda` | **4.95:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--primary-color @brightness(0.92)` | `#06697d` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--gradient-accent-color @brightness(0.92)` | `#147444` | **4.88:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--primary-color @brightness(0.92)` | `#2f40c2` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--gradient-accent-color @brightness(0.92)` | `#036194` | **5.61:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--primary-color @brightness(0.92)` | `#a91275` | **5.81:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--gradient-accent-color @brightness(0.92)` | `#bf1544` | **5.17:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--primary-color @brightness(0.92)` | `#6d5d51` | **5.28:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--gradient-accent-color @brightness(0.92)` | `#93561a` | **4.91:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#ffffff` | `contrast.--primary-color @brightness(1.1)` | `#11192e` | **17.47:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#ffffff` | `contrast.--gradient-accent-color @brightness(1.1)` | `#212d41` | **13.85:1** | 1.4.3 | 4.5:1 | ok |

#### accent surface

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--accent-on-surface` | `#8f0e00` | `sunset.--accent-surface` | `#ffffd8` | **9.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--accent-on-surface` | `#9a0000` | `fire.--accent-surface` | `#ffe9e9` | **7.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--accent-on-surface` | `#75001b` | `coral.--accent-surface` | `#ffdeff` | **9.67:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--accent-on-surface` | `#004503` | `forest.--accent-surface` | `#e1ffff` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--accent-on-surface` | `#00423a` | `ocean.--accent-surface` | `#d6ffff` | **10.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--accent-on-surface` | `#003f55` | `aurora.--accent-surface` | `#d3ffff` | **10.59:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--accent-on-surface` | `#0013a0` | `twilight.--accent-surface` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--accent-on-surface` | `#85004c` | `mystic.--accent-surface` | `#ffe0ff` | **8.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--accent-on-surface` | `#443225` | `stone.--accent-surface` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--accent-on-surface` | `#000000` | `contrast.--accent-surface` | `#dbe3f6` | **16.33:1** | 1.4.3 | 4.5:1 | ok |

#### checkbox & radiobutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `checkbox.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `checkbox.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#c2410c` | `--surface-ground` | `#faf7f2` | **4.85:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.checkbox.icon.checked.color` | `#ffffff` | `sunset.checkbox.checked.background` | `#c2410c` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#cd1d1d` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.checkbox.icon.checked.color` | `#ffffff` | `fire.checkbox.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#a8124e` | `--surface-ground` | `#faf7f2` | **6.87:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.checkbox.icon.checked.color` | `#ffffff` | `coral.checkbox.checked.background` | `#a8124e` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#157836` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.checkbox.icon.checked.color` | `#ffffff` | `forest.checkbox.checked.background` | `#157836` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#0a756d` | `--surface-ground` | `#faf7f2` | **5.20:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.checkbox.icon.checked.color` | `#ffffff` | `ocean.checkbox.checked.background` | `#0a756d` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#077288` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.checkbox.icon.checked.color` | `#ffffff` | `aurora.checkbox.checked.background` | `#077288` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#3346d3` | `--surface-ground` | `#faf7f2` | **6.64:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.checkbox.icon.checked.color` | `#ffffff` | `twilight.checkbox.checked.background` | `#3346d3` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#b8147f` | `--surface-ground` | `#faf7f2` | **5.70:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.checkbox.icon.checked.color` | `#ffffff` | `mystic.checkbox.checked.background` | `#b8147f` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#776558` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.checkbox.icon.checked.color` | `#ffffff` | `stone.checkbox.checked.background` | `#776558` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#0f172a` | `--surface-ground` | `#faf7f2` | **16.71:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.checkbox.icon.checked.color` | `#ffffff` | `contrast.checkbox.checked.background` | `#0f172a` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### toggleswitch

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `toggleswitch.background` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.background` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.handle.background` | `#ffffff` | `toggleswitch.background` | `#837a6e` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `sunset.toggleswitch.handle.checked.background` | `#ffffff` | `sunset.toggleswitch.checked.background` | `#c2410c` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.toggleswitch.handle.checked.background` | `#ffffff` | `fire.toggleswitch.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.toggleswitch.handle.checked.background` | `#ffffff` | `coral.toggleswitch.checked.background` | `#a8124e` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.toggleswitch.handle.checked.background` | `#ffffff` | `forest.toggleswitch.checked.background` | `#157836` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.toggleswitch.handle.checked.background` | `#ffffff` | `ocean.toggleswitch.checked.background` | `#0a756d` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.toggleswitch.handle.checked.background` | `#ffffff` | `aurora.toggleswitch.checked.background` | `#077288` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.toggleswitch.handle.checked.background` | `#ffffff` | `twilight.toggleswitch.checked.background` | `#3346d3` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.toggleswitch.handle.checked.background` | `#ffffff` | `mystic.toggleswitch.checked.background` | `#b8147f` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.toggleswitch.handle.checked.background` | `#ffffff` | `stone.toggleswitch.checked.background` | `#776558` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.toggleswitch.handle.checked.background` | `#ffffff` | `contrast.toggleswitch.checked.background` | `#0f172a` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### form field edge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#837a6e` | `select.background` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline-soft)` | `#898683` | `--surface-ground` | `#faf7f2` | **3.39:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline-soft)` | `#898683` | `--surface-card` | `#ffffff` | **3.62:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline-soft)` | `#898683` | `inputtext.background` | `#ffffff` | **3.62:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#837a6e` | `textarea.background` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#837a6e` | `multiselect.background` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#837a6e` | `listbox.background` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#837a6e` | `autocomplete.background` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#837a6e` | `autocomplete.background` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#837a6e` | `datepicker.dropdown.background` | `#f1f5f9` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#837a6e` | `inputtext.background` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#837a6e` | `cascadeselect.background` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.color` | `#6f675e` | `inputtext.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `--surface-ground` | `#faf7f2` | **6.05:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `inputtext.background` | `#ffffff` | **6.47:1** | 1.4.11 | 3:1 | ok |

#### form field text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `inputtext.color` | `#334155` | `inputtext.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `inputtext.placeholder.color` | `#64748b` | `inputtext.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `select.color` | `#3a3530` | `select.background` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `select.placeholder.color` | `#64748b` | `select.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.color` | `#334155` | `textarea.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.placeholder.color` | `#64748b` | `textarea.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.color` | `#3a3530` | `cascadeselect.background` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.placeholder.color` | `#64748b` | `cascadeselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.color` | `#334155` | `multiselect.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.placeholder.color` | `#64748b` | `multiselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.color` | `#334155` | `treeselect.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.placeholder.color` | `#64748b` | `treeselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.color` | `#334155` | `autocomplete.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.placeholder.color` | `#64748b` | `autocomplete.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |

#### form field icon

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.dropdown.color` | `#6f675e` | `select.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `multiselect.dropdown.color` | `#6f675e` | `multiselect.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.dropdown.color` | `#6f675e` | `cascadeselect.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `treeselect.dropdown.color` | `#6f675e` | `treeselect.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `password.icon.color` | `#6f675e` | `inputtext.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.color` | `#475569` | `autocomplete.dropdown.background` | `#f1f5f9` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.color` | `#475569` | `datepicker.dropdown.background` | `#f1f5f9` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `inputgroup.addon.color` | `#6f675e` | `inputgroup.addon.background` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |

#### float label

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `floatlabel.color` | `#6f675e` | `inputtext.background` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.active.color` | `#6f675e` | `floatlabel.on.active.background` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.focus.color` | `#3a3530` | `floatlabel.on.active.background` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.invalid.color` | `#b91c1c` | `floatlabel.on.active.background` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.color` | `#6f675e` | `inputtext.background` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.focus.color` | `#3a3530` | `inputtext.background` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.invalid.color` | `#b91c1c` | `inputtext.background` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.on.active.background` | `#ffffff` | `inputtext.background` | `#ffffff` | **1.00:1** | none | — | info |

#### tag

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `tag.secondary.color` | `#475569` | `tag.secondary.background` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `tag.success.color` | `#15803d` | `tag.success.background` | `#dcfce7` | **4.57:1** | 1.4.3 | 4.5:1 | ok |
| `tag.info.color` | `#0369a1` | `tag.info.background` | `#e0f2fe` | **5.17:1** | 1.4.3 | 4.5:1 | ok |
| `tag.warn.color` | `#c2410c` | `tag.warn.background` | `#ffedd5` | **4.52:1** | 1.4.3 | 4.5:1 | ok |
| `tag.danger.color` | `#b91c1c` | `tag.danger.background` | `#fee2e2` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `tag.contrast.color` | `#ffffff` | `tag.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#8f0e00` | `sunset.tag.primary.background` | `#ffffd8` | **9.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#9a0000` | `fire.tag.primary.background` | `#ffe9e9` | **7.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#75001b` | `coral.tag.primary.background` | `#ffdeff` | **9.67:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#004503` | `forest.tag.primary.background` | `#e1ffff` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#00423a` | `ocean.tag.primary.background` | `#d6ffff` | **10.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#003f55` | `aurora.tag.primary.background` | `#d3ffff` | **10.59:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#0013a0` | `twilight.tag.primary.background` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#85004c` | `mystic.tag.primary.background` | `#ffe0ff` | **8.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#443225` | `stone.tag.primary.background` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#000000` | `contrast.tag.primary.background` | `#dbe3f6` | **16.33:1** | 1.4.3 | 4.5:1 | ok |

#### chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `chip.color` | `#1e293b` | `chip.background` | `#f1f5f9` | **13.35:1** | 1.4.3 | 4.5:1 | ok |
| `chip.remove.icon.color` | `#1e293b` | `chip.background` | `#f1f5f9` | **13.35:1** | 1.4.11 | 3:1 | ok |

#### dialog

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `dialog.color` | `#334155` | `dialog.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#6f675e` | `dialog.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |

#### skeleton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `skeleton.background` | `#e2e8f0` | `--surface-ground` | `#faf7f2` | **1.15:1** | none | — | info |
| `skeleton.background` | `#e2e8f0` | `--surface-card` | `#ffffff` | **1.23:1** | none | — | info |

#### progressbar & slider

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `slider.track.background` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#837a6e` | `--surface-ground` | `#faf7f2` | **3.95:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#e2e8f0` | `--surface-ground` | `#faf7f2` | **1.15:1** | none | — | info |
| `slider.track.background` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#837a6e` | `--surface-card` | `#ffffff` | **4.22:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#e2e8f0` | `--surface-card` | `#ffffff` | **1.23:1** | none | — | info |
| `sunset.progressbar.value.background` | `#c2410c` | `progressbar.background` | `#e2e8f0` | **4.20:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressbar.label.color` | `#ffffff` | `sunset.progressbar.value.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.progressbar.value.background` | `#cd1d1d` | `progressbar.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `fire.progressbar.label.color` | `#ffffff` | `fire.progressbar.value.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.progressbar.value.background` | `#a8124e` | `progressbar.background` | `#e2e8f0` | **5.95:1** | 1.4.11 | 3:1 | ok |
| `coral.progressbar.label.color` | `#ffffff` | `coral.progressbar.value.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.progressbar.value.background` | `#157836` | `progressbar.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `forest.progressbar.label.color` | `#ffffff` | `forest.progressbar.value.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.progressbar.value.background` | `#0a756d` | `progressbar.background` | `#e2e8f0` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressbar.label.color` | `#ffffff` | `ocean.progressbar.value.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.progressbar.value.background` | `#077288` | `progressbar.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressbar.label.color` | `#ffffff` | `aurora.progressbar.value.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.progressbar.value.background` | `#3346d3` | `progressbar.background` | `#e2e8f0` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressbar.label.color` | `#ffffff` | `twilight.progressbar.value.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.progressbar.value.background` | `#b8147f` | `progressbar.background` | `#e2e8f0` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressbar.label.color` | `#ffffff` | `mystic.progressbar.value.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.progressbar.value.background` | `#776558` | `progressbar.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `stone.progressbar.label.color` | `#ffffff` | `stone.progressbar.value.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.progressbar.value.background` | `#0f172a` | `progressbar.background` | `#e2e8f0` | **14.48:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressbar.label.color` | `#ffffff` | `contrast.progressbar.value.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### togglebutton & selectbutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `togglebutton.color` | `#6f675e` | `togglebutton.background` | `#f5f0e8` | **4.90:1** | 1.4.3 | 4.5:1 | ok |
| `togglebutton.hover.color` | `#3a3530` | `togglebutton.hover.background` | `#efe8dc` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.togglebutton.content.checked.background` | `#c2410c` | `togglebutton.background` | `#f5f0e8` | **4.56:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `sunset.togglebutton.content.checked.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.togglebutton.content.checked.background` | `#cd1d1d` | `togglebutton.background` | `#f5f0e8` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `fire.togglebutton.content.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.togglebutton.content.checked.background` | `#a8124e` | `togglebutton.background` | `#f5f0e8` | **6.47:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `coral.togglebutton.content.checked.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.togglebutton.content.checked.background` | `#157836` | `togglebutton.background` | `#f5f0e8` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `forest.togglebutton.content.checked.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.togglebutton.content.checked.background` | `#0a756d` | `togglebutton.background` | `#f5f0e8` | **4.90:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `ocean.togglebutton.content.checked.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.togglebutton.content.checked.background` | `#077288` | `togglebutton.background` | `#f5f0e8` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `aurora.togglebutton.content.checked.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.togglebutton.content.checked.background` | `#3346d3` | `togglebutton.background` | `#f5f0e8` | **6.26:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `twilight.togglebutton.content.checked.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.togglebutton.content.checked.background` | `#b8147f` | `togglebutton.background` | `#f5f0e8` | **5.37:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `mystic.togglebutton.content.checked.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.togglebutton.content.checked.background` | `#776558` | `togglebutton.background` | `#f5f0e8` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `stone.togglebutton.content.checked.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.togglebutton.content.checked.background` | `#0f172a` | `togglebutton.background` | `#f5f0e8` | **15.74:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `contrast.togglebutton.content.checked.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### menu focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `menubar.submenu.icon.color` | `#6f675e` | `menubar.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `menubar.submenu.icon.color` | `#6f675e` | `menubar.item.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#6f675e` | `menubar.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#6f675e` | `menubar.item.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.focus.background` | `#f1f5f9` | `menubar.background` | `#ffffff` | **1.10:1** | none | — | info |
| `sunset.--primary-color-fg (focus ring)` | `#c2410c` | `menubar.item.focus.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (focus ring)` | `#c2410c` | `menubar.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#cd1d1d` | `menubar.item.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#cd1d1d` | `menubar.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#a8124e` | `menubar.item.focus.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#a8124e` | `menubar.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#157836` | `menubar.item.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#157836` | `menubar.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#0a756d` | `menubar.item.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#0a756d` | `menubar.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#077288` | `menubar.item.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#077288` | `menubar.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#3346d3` | `menubar.item.focus.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#3346d3` | `menubar.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#b8147f` | `menubar.item.focus.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#b8147f` | `menubar.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#776558` | `menubar.item.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#776558` | `menubar.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#0f172a` | `menubar.item.focus.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#0f172a` | `menubar.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### option list focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.option.focus.background` | `#f1f5f9` | `select.overlay.background` | `#ffffff` | **1.10:1** | none | — | info |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `select.overlay.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `select.option.focus.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `sunset.select.option.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `sunset.select.option.selected.focus.background` | `#ffffd8` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `select.overlay.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `select.option.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `fire.select.option.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `fire.select.option.selected.focus.background` | `#ffe9e9` | **4.77:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `select.overlay.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `select.option.focus.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `coral.select.option.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `coral.select.option.selected.focus.background` | `#ffdeff` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `select.overlay.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `select.option.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `forest.select.option.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `forest.select.option.selected.focus.background` | `#e1ffff` | **5.29:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `select.overlay.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `select.option.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `ocean.select.option.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `ocean.select.option.selected.focus.background` | `#d6ffff` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `select.overlay.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `select.option.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `aurora.select.option.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `aurora.select.option.selected.focus.background` | `#d3ffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `select.overlay.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `select.option.focus.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `twilight.select.option.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `twilight.select.option.selected.focus.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `select.overlay.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `select.option.focus.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `mystic.select.option.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `mystic.select.option.selected.focus.background` | `#ffe0ff` | **5.04:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `select.overlay.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `select.option.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `stone.select.option.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `stone.select.option.selected.focus.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `select.overlay.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `select.option.focus.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `contrast.select.option.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `contrast.select.option.selected.focus.background` | `#dbe3f6` | **13.88:1** | 1.4.11 | 3:1 | ok |

#### panel outline

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-outline` | `#3a3530` | `--surface-ground` | `#faf7f2` | **11.35:1** | 1.4.11 | 3:1 | ok |
| `--style-outline` | `#3a3530` | `--surface-card` | `#ffffff` | **12.13:1** | 1.4.11 | 3:1 | ok |
| `popover.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `drawer.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |

#### content panel

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `text.color` | `#334155` | `content.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |

#### table & paginator

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `datatable.row.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `paginator.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `datatable.row.color` | `#334155` | `datatable.row.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `paginator.nav.button.color` | `#64748b` | `paginator.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.datatable.row.selected.color` | `#8f0e00` | `sunset.datatable.row.selected.background` | `#fffff2` | **9.34:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.color` | `#ffffff` | `sunset.paginator.nav.button.selected.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.background` | `#c2410c` | `paginator.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.datatable.row.selected.background` | `#fffff2` | `datatable.row.background` | `#ffffff` | **1.01:1** | none | — | info |
| `sunset.--primary-color-fg (selected-row bar)` | `#c2410c` | `sunset.datatable.row.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (selected-row bar)` | `#c2410c` | `datatable.row.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.color` | `#9a0000` | `fire.datatable.row.selected.background` | `#ffffff` | **8.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.color` | `#ffffff` | `fire.paginator.nav.button.selected.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.background` | `#cd1d1d` | `paginator.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `fire.--primary-color-fg (selected-row bar)` | `#cd1d1d` | `fire.datatable.row.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (selected-row bar)` | `#cd1d1d` | `datatable.row.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.color` | `#75001b` | `coral.datatable.row.selected.background` | `#fff8ff` | **11.35:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.color` | `#ffffff` | `coral.paginator.nav.button.selected.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.background` | `#a8124e` | `paginator.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.background` | `#fff8ff` | `datatable.row.background` | `#ffffff` | **1.04:1** | none | — | info |
| `coral.--primary-color-fg (selected-row bar)` | `#a8124e` | `coral.datatable.row.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (selected-row bar)` | `#a8124e` | `datatable.row.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.color` | `#004503` | `forest.datatable.row.selected.background` | `#fbffff` | **11.25:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.color` | `#ffffff` | `forest.paginator.nav.button.selected.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.background` | `#157836` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.background` | `#fbffff` | `datatable.row.background` | `#ffffff` | **1.01:1** | none | — | info |
| `forest.--primary-color-fg (selected-row bar)` | `#157836` | `forest.datatable.row.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (selected-row bar)` | `#157836` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.color` | `#00423a` | `ocean.datatable.row.selected.background` | `#f0ffff` | **11.11:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.color` | `#ffffff` | `ocean.paginator.nav.button.selected.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.background` | `#0a756d` | `paginator.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.background` | `#f0ffff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `ocean.--primary-color-fg (selected-row bar)` | `#0a756d` | `ocean.datatable.row.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (selected-row bar)` | `#0a756d` | `datatable.row.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.color` | `#003f55` | `aurora.datatable.row.selected.background` | `#edffff` | **11.05:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.color` | `#ffffff` | `aurora.paginator.nav.button.selected.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.background` | `#077288` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.background` | `#edffff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `aurora.--primary-color-fg (selected-row bar)` | `#077288` | `aurora.datatable.row.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (selected-row bar)` | `#077288` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.color` | `#0013a0` | `twilight.datatable.row.selected.background` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.color` | `#ffffff` | `twilight.paginator.nav.button.selected.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.background` | `#3346d3` | `paginator.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `twilight.--primary-color-fg (selected-row bar)` | `#3346d3` | `twilight.datatable.row.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (selected-row bar)` | `#3346d3` | `datatable.row.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.color` | `#85004c` | `mystic.datatable.row.selected.background` | `#fffaff` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.color` | `#ffffff` | `mystic.paginator.nav.button.selected.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.background` | `#b8147f` | `paginator.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.background` | `#fffaff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `mystic.--primary-color-fg (selected-row bar)` | `#b8147f` | `mystic.datatable.row.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (selected-row bar)` | `#b8147f` | `datatable.row.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.color` | `#443225` | `stone.datatable.row.selected.background` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.color` | `#ffffff` | `stone.paginator.nav.button.selected.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.background` | `#776558` | `paginator.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `stone.--primary-color-fg (selected-row bar)` | `#776558` | `stone.datatable.row.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (selected-row bar)` | `#776558` | `datatable.row.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.color` | `#000000` | `contrast.datatable.row.selected.background` | `#f5fdff` | **20.38:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.color` | `#ffffff` | `contrast.paginator.nav.button.selected.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.background` | `#0f172a` | `paginator.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.background` | `#f5fdff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `contrast.--primary-color-fg (selected-row bar)` | `#0f172a` | `contrast.datatable.row.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (selected-row bar)` | `#0f172a` | `datatable.row.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### badge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `badge.secondary.color` | `#475569` | `badge.secondary.background` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `badge.success.color` | `#ffffff` | `badge.success.background` | `#15803d` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `badge.info.color` | `#ffffff` | `badge.info.background` | `#1d4ed8` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `badge.warn.color` | `#ffffff` | `badge.warn.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `badge.danger.color` | `#ffffff` | `badge.danger.background` | `#b91c1c` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `badge.contrast.color` | `#ffffff` | `badge.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.badge.primary.color` | `#ffffff` | `sunset.badge.primary.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.badge.primary.color` | `#ffffff` | `fire.badge.primary.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.badge.primary.color` | `#ffffff` | `coral.badge.primary.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.badge.primary.color` | `#ffffff` | `forest.badge.primary.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.badge.primary.color` | `#ffffff` | `ocean.badge.primary.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.badge.primary.color` | `#ffffff` | `aurora.badge.primary.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.badge.primary.color` | `#ffffff` | `twilight.badge.primary.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.badge.primary.color` | `#ffffff` | `mystic.badge.primary.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.badge.primary.color` | `#ffffff` | `stone.badge.primary.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.badge.primary.color` | `#ffffff` | `contrast.badge.primary.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### message & toast

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `message.info.color` | `#1d4ed8` | `message.info.background over --surface-ground` | `#f0f6fe` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#1d4ed8` | `--surface-ground` | `#faf7f2` | **6.27:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#1d4ed8` | `toast.info.background over --surface-ground` | `#f0f6fe` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#334155` | `toast.info.background over --surface-ground` | `#f0f6fe` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.color` | `#1d4ed8` | `message.info.background over --surface-card` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#1d4ed8` | `toast.info.background over --surface-card` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#334155` | `toast.info.background over --surface-card` | `#f0f6ff` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#15803d` | `message.success.background over --surface-ground` | `#f1fdf4` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#15803d` | `--surface-ground` | `#faf7f2` | **4.69:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#15803d` | `toast.success.background over --surface-ground` | `#f1fdf4` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#334155` | `toast.success.background over --surface-ground` | `#f1fdf4` | **9.91:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#15803d` | `message.success.background over --surface-card` | `#f1fdf5` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#15803d` | `toast.success.background over --surface-card` | `#f1fdf5` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#334155` | `toast.success.background over --surface-card` | `#f1fdf5` | **9.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#c2410c` | `message.warn.background over --surface-ground` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#c2410c` | `--surface-ground` | `#faf7f2` | **4.85:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#c2410c` | `toast.warn.background over --surface-ground` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#334155` | `toast.warn.background over --surface-ground` | `#fefce9` | **10.02:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#c2410c` | `message.warn.background over --surface-card` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#c2410c` | `toast.warn.background over --surface-card` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#334155` | `toast.warn.background over --surface-card` | `#fefce9` | **10.02:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#b91c1c` | `message.error.background over --surface-ground` | `#fef2f2` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#b91c1c` | `--surface-ground` | `#faf7f2` | **6.05:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#b91c1c` | `toast.error.background over --surface-ground` | `#fef2f2` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#334155` | `toast.error.background over --surface-ground` | `#fef2f2` | **9.47:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#b91c1c` | `message.error.background over --surface-card` | `#fef3f3` | **5.96:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#b91c1c` | `toast.error.background over --surface-card` | `#fef3f3` | **5.96:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#334155` | `toast.error.background over --surface-card` | `#fef3f3` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#475569` | `message.secondary.background over --surface-ground` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#6f675e` | `--surface-ground` | `#faf7f2` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#475569` | `toast.secondary.background over --surface-ground` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#334155` | `toast.secondary.background over --surface-ground` | `#f1f5f9` | **9.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#475569` | `message.secondary.background over --surface-card` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#6f675e` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#475569` | `toast.secondary.background over --surface-card` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#334155` | `toast.secondary.background over --surface-card` | `#f1f5f9` | **9.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#f8fafc` | `message.contrast.background over --surface-ground` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#3a3530` | `--surface-ground` | `#faf7f2` | **11.35:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#f8fafc` | `toast.contrast.background over --surface-ground` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#ffffff` | `toast.contrast.background over --surface-ground` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#f8fafc` | `message.contrast.background over --surface-card` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#3a3530` | `--surface-card` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#f8fafc` | `toast.contrast.background over --surface-card` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#ffffff` | `toast.contrast.background over --surface-card` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### text & link button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.text.secondary.color` | `#6f675e` | `--surface-ground` | `#faf7f2` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#6f675e` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#15803d` | `--surface-ground` | `#faf7f2` | **4.69:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#1d4ed8` | `--surface-ground` | `#faf7f2` | **6.27:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#c2410c` | `--surface-ground` | `#faf7f2` | **4.85:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#0e7490` | `--surface-ground` | `#faf7f2` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#b91c1c` | `--surface-ground` | `#faf7f2` | **6.05:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#3a3530` | `--surface-ground` | `#faf7f2` | **11.35:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#3a3530` | `--surface-card` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#3a3530` | `--surface-ground` | `#faf7f2` | **11.35:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#3a3530` | `--surface-card` | `#ffffff` | **12.13:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#c2410c` | `--surface-ground` | `#faf7f2` | **4.85:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#cd1d1d` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#a8124e` | `--surface-ground` | `#faf7f2` | **6.87:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#157836` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#0a756d` | `--surface-ground` | `#faf7f2` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#077288` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#3346d3` | `--surface-ground` | `#faf7f2` | **6.64:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#b8147f` | `--surface-ground` | `#faf7f2` | **5.70:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#776558` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#0f172a` | `--surface-ground` | `#faf7f2` | **16.71:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (contrast)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.contrast.color` | `#ffffff` | `button.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |

#### avatar

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `avatar.color` | `#334155` | `avatar.background` | `#e2e8f0` | **8.40:1** | 1.4.3 | 4.5:1 | ok |

#### image preview

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `image.action.color` | `#f8fafc` | `image.toolbar.background over mask.background over --surface-ground` | `#3c3b3a` | **10.68:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-ground` | `#504f4e` | **8.17:1** | 1.4.11 | 3:1 | ok |
| `image.action.color` | `#f8fafc` | `image.toolbar.background over mask.background over --surface-card` | `#3d3d3d` | **10.38:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-card` | `#505050` | **8.06:1** | 1.4.11 | 3:1 | ok |

#### focus ring

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-ground` | `#faf7f2` | **4.85:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-section` | `#f5f0e8` | **4.56:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `dialog.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `chip.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `paginator.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `datatable.row.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `datatable.row.hover.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `sunset.datatable.row.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.20:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-section` | `#f5f0e8` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `dialog.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `chip.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `paginator.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `datatable.row.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `datatable.row.hover.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `fire.datatable.row.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-ground` | `#faf7f2` | **6.87:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-section` | `#f5f0e8` | **6.47:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `dialog.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `chip.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `paginator.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `datatable.row.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `datatable.row.hover.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `coral.datatable.row.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `autocomplete.chip.focus.background` | `#e2e8f0` | **5.95:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-section` | `#f5f0e8` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `dialog.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `chip.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `datatable.row.hover.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `forest.datatable.row.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-ground` | `#faf7f2` | **5.20:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-section` | `#f5f0e8` | **4.90:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `dialog.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `chip.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `paginator.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `datatable.row.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `datatable.row.hover.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `ocean.datatable.row.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-section` | `#f5f0e8` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `dialog.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `chip.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `datatable.row.hover.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `aurora.datatable.row.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-ground` | `#faf7f2` | **6.64:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-section` | `#f5f0e8` | **6.26:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `dialog.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `chip.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `paginator.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `datatable.row.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `datatable.row.hover.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `twilight.datatable.row.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `autocomplete.chip.focus.background` | `#e2e8f0` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-ground` | `#faf7f2` | **5.70:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-section` | `#f5f0e8` | **5.37:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `dialog.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `chip.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `paginator.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `datatable.row.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `datatable.row.hover.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `mystic.datatable.row.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-section` | `#f5f0e8` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `dialog.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `chip.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `paginator.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `datatable.row.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `datatable.row.hover.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `stone.datatable.row.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-ground` | `#faf7f2` | **16.71:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-section` | `#f5f0e8` | **15.74:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `dialog.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `chip.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `paginator.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `datatable.row.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `datatable.row.hover.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `contrast.datatable.row.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `autocomplete.chip.focus.background` | `#e2e8f0` | **14.48:1** | 1.4.11 | 3:1 | ok |

#### progress spinner

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-ground` | `#faf7f2` | **4.85:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-section` | `#f5f0e8` | **4.56:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-section` | `#f5f0e8` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-ground` | `#faf7f2` | **6.87:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-section` | `#f5f0e8` | **6.47:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-section` | `#f5f0e8` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-ground` | `#faf7f2` | **5.20:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-section` | `#f5f0e8` | **4.90:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-ground` | `#faf7f2` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-section` | `#f5f0e8` | **4.91:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-ground` | `#faf7f2` | **6.64:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-section` | `#f5f0e8` | **6.26:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-ground` | `#faf7f2` | **5.70:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-section` | `#f5f0e8` | **5.37:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-ground` | `#faf7f2` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-section` | `#f5f0e8` | **4.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-ground` | `#faf7f2` | **16.71:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-section` | `#f5f0e8` | **15.74:1** | 1.4.11 | 3:1 | ok |

### dark mode

#### body text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--text-color` | `#ece6dc` | `--surface-ground` | `#26231f` | **12.60:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#a89f92` | `--surface-ground` | `#26231f` | **5.99:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#ece6dc` | `--surface-card` | `#2f2b26` | **11.32:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#a89f92` | `--surface-card` | `#2f2b26` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#ece6dc` | `--surface-section` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#a89f92` | `--surface-section` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#ece6dc` | `--surface-hover` | `#3c362e` | **9.62:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#a89f92` | `--surface-hover` | `#3c362e` | **4.57:1** | 1.4.3 | 4.5:1 | ok |

#### semantic text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--semantic-blue-fg` | `#93c5fd` | `--surface-ground` | `#26231f` | **8.67:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-blue-fg` | `#93c5fd` | `--surface-card` | `#2f2b26` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#fdba74` | `--surface-ground` | `#26231f` | **9.27:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#fdba74` | `--surface-card` | `#2f2b26` | **8.33:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#86efac` | `--surface-ground` | `#26231f` | **11.14:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#86efac` | `--surface-card` | `#2f2b26` | **10.01:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#fca5a5` | `--surface-ground` | `#26231f` | **8.24:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#fca5a5` | `--surface-card` | `#2f2b26` | **7.40:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#67e8f9` | `--surface-ground` | `#26231f` | **10.79:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#67e8f9` | `--surface-card` | `#2f2b26` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#f9a8d4` | `--surface-ground` | `#26231f` | **8.62:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#f9a8d4` | `--surface-card` | `#2f2b26` | **7.75:1** | 1.4.3 | 4.5:1 | ok |

#### dev toggle

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--dev-toggle-fg` | `#86efac` | `color-mix(--dev-toggle-border 15%, --surface-card)` | `#334634` | **7.24:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border` | `#4ade80` | `--surface-card` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `--dev-toggle-fg-active` | `#fca5a5` | `color-mix(--dev-toggle-border-active 15%, --surface-card)` | `#4d3631` | **5.86:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border-active` | `#f87171` | `--surface-card` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |

#### control boundary

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-border` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#968c7d` | `--surface-section` | `#38332c` | **3.78:1** | 1.4.11 | 3:1 | ok |

#### floating action button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `.fab-label --text-color` | `#ece6dc` | `.fab-button --surface-card` | `#2f2b26` | **11.32:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-label --text-color` | `#ece6dc` | `.fab-button:hover --surface-hover` | `#3c362e` | **9.62:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-button --fab-edge` | `#ece6dc` | `--surface-ground` | `#26231f` | **12.60:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#ece6dc` | `--surface-card` | `#2f2b26` | **11.32:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#ece6dc` | `--surface-section` | `#38332c` | **10.08:1** | 1.4.11 | 3:1 | ok |

#### field placeholder

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-placeholder` | `#a89f92` | `--surface-section` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |

#### severity button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text` | `#963f3a` | `--gradient-danger-from` | `#f6e1df` | **5.46:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text` | `#963f3a` | `--gradient-danger-to` | `#f6e1df` | **5.46:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#3f6b4c` | `--gradient-success-from` | `#e4efe6` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#3f6b4c` | `--gradient-success-to` | `#e4efe6` | **5.20:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#425c86` | `--gradient-info-from` | `#e3eaf5` | **5.59:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#425c86` | `--gradient-info-to` | `#e3eaf5` | **5.59:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#7d5813` | `--gradient-warn-from` | `#f5ead2` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#7d5813` | `--gradient-warn-to` | `#f5ead2` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#3a3530` | `--gradient-secondary-from` | `#efe8dc` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#3a3530` | `--gradient-secondary-to` | `#efe8dc` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#2b6169` | `--gradient-help-from` | `#dcecee` | **5.73:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#2b6169` | `--gradient-help-to` | `#dcecee` | **5.73:1** | 1.4.3 | 4.5:1 | ok |

#### outlined severity

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--outlined-danger-fg` | `#f6e1df` | `--surface-card` | `#2f2b26` | **11.21:1** | 1.4.3 | 4.5:1 | ok |
| `success.--outlined-success-fg` | `#e4efe6` | `--surface-card` | `#2f2b26` | **11.90:1** | 1.4.3 | 4.5:1 | ok |
| `info.--outlined-info-fg` | `#e3eaf5` | `--surface-card` | `#2f2b26` | **11.61:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--outlined-warn-fg` | `#f5ead2` | `--surface-card` | `#2f2b26` | **11.77:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--outlined-secondary-fg` | `#efe8dc` | `--surface-card` | `#2f2b26` | **11.54:1** | 1.4.3 | 4.5:1 | ok |
| `help.--outlined-help-fg` | `#dcecee` | `--surface-card` | `#2f2b26` | **11.56:1** | 1.4.3 | 4.5:1 | ok |

#### severity button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text @brightness(1.1)` | `#a54540` | `--gradient-danger-from @brightness(1.1)` | `#fff8f5` | **5.67:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text @brightness(1.1)` | `#a54540` | `--gradient-danger-to @brightness(1.1)` | `#fff8f5` | **5.67:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(1.1)` | `#457654` | `--gradient-success-from @brightness(1.1)` | `#fbfffd` | **5.24:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(1.1)` | `#457654` | `--gradient-success-to @brightness(1.1)` | `#fbfffd` | **5.24:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(1.1)` | `#496593` | `--gradient-info-from @brightness(1.1)` | `#faffff` | **5.84:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(1.1)` | `#496593` | `--gradient-info-to @brightness(1.1)` | `#faffff` | **5.84:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#8a6115` | `--gradient-warn-from @brightness(1.1)` | `#ffffe7` | **5.45:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#8a6115` | `--gradient-warn-to @brightness(1.1)` | `#ffffe7` | **5.45:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(1.1)` | `#403a35` | `--gradient-secondary-from @brightness(1.1)` | `#fffff2` | **11.12:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(1.1)` | `#403a35` | `--gradient-secondary-to @brightness(1.1)` | `#fffff2` | **11.12:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(1.1)` | `#2f6b74` | `--gradient-help-from @brightness(1.1)` | `#f2ffff` | **5.90:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(1.1)` | `#2f6b74` | `--gradient-help-to @brightness(1.1)` | `#f2ffff` | **5.90:1** | 1.4.3 | 4.5:1 | ok |

#### brand chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-brand-ink` | `#3a3530` | `brandScale 400` | `#dcb878` | **6.45:1** | 1.4.3 | 4.5:1 | ok |

#### brand foreground

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg` | `#fb923c` | `--surface-ground` | `#26231f` | **6.91:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-fg` | `#fb923c` | `--surface-card` | `#2f2b26` | **6.21:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#facc15` | `--surface-ground` | `#26231f` | **10.21:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#facc15` | `--surface-card` | `#2f2b26` | **9.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#f87171` | `--surface-ground` | `#26231f` | **5.65:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#f87171` | `--surface-card` | `#2f2b26` | **5.08:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#fbbf24` | `--surface-ground` | `#26231f` | **9.37:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#fbbf24` | `--surface-card` | `#2f2b26` | **8.42:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#f472b6` | `--surface-ground` | `#26231f` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#f472b6` | `--surface-card` | `#2f2b26` | **5.31:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#e879c0` | `--surface-ground` | `#26231f` | **5.90:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#e879c0` | `--surface-card` | `#2f2b26` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#4ade80` | `--surface-ground` | `#26231f` | **8.98:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#4ade80` | `--surface-card` | `#2f2b26` | **8.06:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#bef264` | `--surface-ground` | `#26231f` | **11.97:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#bef264` | `--surface-card` | `#2f2b26` | **10.76:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#2dd4bf` | `--surface-ground` | `#26231f` | **8.40:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#2dd4bf` | `--surface-card` | `#2f2b26` | **7.55:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#60a5fa` | `--surface-ground` | `#26231f` | **6.15:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#60a5fa` | `--surface-card` | `#2f2b26` | **5.53:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#22d3ee` | `--surface-ground` | `#26231f` | **8.66:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#22d3ee` | `--surface-card` | `#2f2b26` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#34d399` | `--surface-ground` | `#26231f` | **8.14:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#34d399` | `--surface-card` | `#2f2b26` | **7.31:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#85a7ff` | `--surface-ground` | `#26231f` | **6.68:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#85a7ff` | `--surface-card` | `#2f2b26` | **6.00:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#7dd3fc` | `--surface-ground` | `#26231f` | **9.38:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#7dd3fc` | `--surface-card` | `#2f2b26` | **8.43:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#f9a8d4` | `--surface-ground` | `#26231f` | **8.62:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#f9a8d4` | `--surface-card` | `#2f2b26` | **7.75:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#fda4af` | `--surface-ground` | `#26231f` | **8.27:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#fda4af` | `--surface-card` | `#2f2b26` | **7.43:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#d6d3d1` | `--surface-ground` | `#26231f` | **10.50:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#d6d3d1` | `--surface-card` | `#2f2b26` | **9.43:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#fbbf24` | `--surface-ground` | `#26231f` | **9.37:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#fbbf24` | `--surface-card` | `#2f2b26` | **8.42:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#f8fafc` | `--surface-ground` | `#26231f` | **14.95:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#f8fafc` | `--surface-card` | `#2f2b26` | **13.43:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#e2e8f0` | `--surface-ground` | `#26231f` | **12.69:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#e2e8f0` | `--surface-card` | `#2f2b26` | **11.40:1** | 1.4.3 | 4.5:1 | ok |

#### filled button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--primary-color` | `#9a3412` | **7.31:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--gradient-accent-color` | `#854d0e` | **6.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--primary-color` | `#a71818` | **7.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--gradient-accent-color` | `#785307` | **6.91:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--primary-color` | `#880f3f` | **9.60:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--gradient-accent-color` | `#971f64` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--primary-color` | `#11612c` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--gradient-accent-color` | `#475a07` | **7.68:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--primary-color` | `#086058` | **7.44:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--gradient-accent-color` | `#1151d0` | **6.75:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--primary-color` | `#065d6e` | **7.50:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--gradient-accent-color` | `#12683d` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--primary-color` | `#2638b0` | **9.23:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--gradient-accent-color` | `#075985` | **7.56:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--primary-color` | `#9a116a` | **7.89:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--gradient-accent-color` | `#af133e` | **7.03:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--primary-color` | `#605247` | **7.51:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--gradient-accent-color` | `#854e17` | **6.78:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#1e293b` | `contrast.--primary-color` | `#f8fafc` | **13.98:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#1e293b` | `contrast.--gradient-accent-color` | `#e2e8f0` | **11.87:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--primary-color @brightness(0.92)` | `#8e3011` | **6.82:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--gradient-accent-color @brightness(0.92)` | `#7a470d` | **6.44:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--primary-color @brightness(0.92)` | `#9a1616` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--gradient-accent-color @brightness(0.92)` | `#6e4c06` | **6.53:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--primary-color @brightness(0.92)` | `#7d0e3a` | **8.83:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--gradient-accent-color @brightness(0.92)` | `#8b1d5c` | **7.25:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--primary-color @brightness(0.92)` | `#105928` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--gradient-accent-color @brightness(0.92)` | `#415306` | **7.15:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--primary-color @brightness(0.92)` | `#075851` | **6.98:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--gradient-accent-color @brightness(0.92)` | `#104bbf` | **6.33:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--primary-color @brightness(0.92)` | `#065665` | **6.97:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--gradient-accent-color @brightness(0.92)` | `#116038` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--primary-color @brightness(0.92)` | `#2334a2` | **8.45:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--gradient-accent-color @brightness(0.92)` | `#06527a` | **7.06:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--primary-color @brightness(0.92)` | `#8e1062` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--gradient-accent-color @brightness(0.92)` | `#a11139` | **6.64:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--primary-color @brightness(0.92)` | `#584b41` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--gradient-accent-color @brightness(0.92)` | `#7a4815` | **6.37:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#212d41` | `contrast.--primary-color @brightness(1.1)` | `#ffffff` | **13.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#212d41` | `contrast.--gradient-accent-color @brightness(1.1)` | `#f9ffff` | **13.70:1** | 1.4.3 | 4.5:1 | ok |

#### accent surface

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--accent-on-surface` | `#ffdaa5` | `sunset.--accent-surface` | `#430000` | **12.78:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--accent-on-surface` | `#ffb6b6` | `fire.--accent-surface` | `#4e0000` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--accent-on-surface` | `#ffabe7` | `coral.--accent-surface` | `#290000` | **11.18:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--accent-on-surface` | `#aeffcf` | `forest.--accent-surface` | `#000000` | **18.00:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--accent-on-surface` | `#a3ffff` | `ocean.--accent-surface` | `#000000` | **18.31:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--accent-on-surface` | `#a0ffff` | `aurora.--accent-surface` | `#000009` | **18.17:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--accent-on-surface` | `#ccdfff` | `twilight.--accent-surface` | `#000054` | **13.80:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--accent-on-surface` | `#ffadff` | `mystic.--accent-surface` | `#390000` | **10.80:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--accent-on-surface` | `#fffef1` | `stone.--accent-surface` | `#000000` | **20.70:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--accent-on-surface` | `#a8b0c3` | `contrast.--accent-surface` | `#000000` | **9.66:1** | 1.4.3 | 4.5:1 | ok |

#### checkbox & radiobutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `checkbox.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `checkbox.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#fb923c` | `--surface-ground` | `#26231f` | **6.91:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#fb923c` | `--surface-card` | `#2f2b26` | **6.21:1** | 1.4.11 | 3:1 | ok |
| `sunset.checkbox.icon.checked.color` | `#18181b` | `sunset.checkbox.checked.background` | `#fb923c` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#f87171` | `--surface-ground` | `#26231f` | **5.65:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#f87171` | `--surface-card` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.checkbox.icon.checked.color` | `#18181b` | `fire.checkbox.checked.background` | `#f87171` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#f472b6` | `--surface-ground` | `#26231f` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#f472b6` | `--surface-card` | `#2f2b26` | **5.31:1** | 1.4.11 | 3:1 | ok |
| `coral.checkbox.icon.checked.color` | `#18181b` | `coral.checkbox.checked.background` | `#f472b6` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#4ade80` | `--surface-ground` | `#26231f` | **8.98:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#4ade80` | `--surface-card` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `forest.checkbox.icon.checked.color` | `#18181b` | `forest.checkbox.checked.background` | `#4ade80` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#2dd4bf` | `--surface-ground` | `#26231f` | **8.40:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#2dd4bf` | `--surface-card` | `#2f2b26` | **7.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.checkbox.icon.checked.color` | `#18181b` | `ocean.checkbox.checked.background` | `#2dd4bf` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#22d3ee` | `--surface-ground` | `#26231f` | **8.66:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#22d3ee` | `--surface-card` | `#2f2b26` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.checkbox.icon.checked.color` | `#18181b` | `aurora.checkbox.checked.background` | `#22d3ee` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#85a7ff` | `--surface-ground` | `#26231f` | **6.68:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#85a7ff` | `--surface-card` | `#2f2b26` | **6.00:1** | 1.4.11 | 3:1 | ok |
| `twilight.checkbox.icon.checked.color` | `#18181b` | `twilight.checkbox.checked.background` | `#85a7ff` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#f9a8d4` | `--surface-ground` | `#26231f` | **8.62:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#f9a8d4` | `--surface-card` | `#2f2b26` | **7.75:1** | 1.4.11 | 3:1 | ok |
| `mystic.checkbox.icon.checked.color` | `#18181b` | `mystic.checkbox.checked.background` | `#f9a8d4` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#d6d3d1` | `--surface-ground` | `#26231f` | **10.50:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#d6d3d1` | `--surface-card` | `#2f2b26` | **9.43:1** | 1.4.11 | 3:1 | ok |
| `stone.checkbox.icon.checked.color` | `#18181b` | `stone.checkbox.checked.background` | `#d6d3d1` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#f8fafc` | `--surface-ground` | `#26231f` | **14.95:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#f8fafc` | `--surface-card` | `#2f2b26` | **13.43:1** | 1.4.11 | 3:1 | ok |
| `contrast.checkbox.icon.checked.color` | `#18181b` | `contrast.checkbox.checked.background` | `#f8fafc` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### toggleswitch

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `toggleswitch.background` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.background` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.handle.background` | `#2f2b26` | `toggleswitch.background` | `#968c7d` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `sunset.toggleswitch.handle.checked.background` | `#18181b` | `sunset.toggleswitch.checked.background` | `#fb923c` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.toggleswitch.handle.checked.background` | `#18181b` | `fire.toggleswitch.checked.background` | `#f87171` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.toggleswitch.handle.checked.background` | `#18181b` | `coral.toggleswitch.checked.background` | `#f472b6` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.toggleswitch.handle.checked.background` | `#18181b` | `forest.toggleswitch.checked.background` | `#4ade80` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.toggleswitch.handle.checked.background` | `#18181b` | `ocean.toggleswitch.checked.background` | `#2dd4bf` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.toggleswitch.handle.checked.background` | `#18181b` | `aurora.toggleswitch.checked.background` | `#22d3ee` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.toggleswitch.handle.checked.background` | `#18181b` | `twilight.toggleswitch.checked.background` | `#85a7ff` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.toggleswitch.handle.checked.background` | `#18181b` | `mystic.toggleswitch.checked.background` | `#f9a8d4` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.toggleswitch.handle.checked.background` | `#18181b` | `stone.toggleswitch.checked.background` | `#d6d3d1` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.toggleswitch.handle.checked.background` | `#18181b` | `contrast.toggleswitch.checked.background` | `#f8fafc` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### form field edge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#968c7d` | `select.background` | `#38332c` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline-soft)` | `#a09b93` | `--surface-ground` | `#26231f` | **5.66:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline-soft)` | `#a09b93` | `--surface-card` | `#2f2b26` | **5.09:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline-soft)` | `#a09b93` | `inputtext.background` | `#38332c` | **4.53:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#968c7d` | `textarea.background` | `#38332c` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#968c7d` | `multiselect.background` | `#38332c` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#968c7d` | `listbox.background` | `#09090b` | **6.01:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#968c7d` | `autocomplete.background` | `#38332c` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#968c7d` | `autocomplete.background` | `#38332c` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#968c7d` | `datepicker.dropdown.background` | `#27272a` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#968c7d` | `inputtext.background` | `#38332c` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#968c7d` | `cascadeselect.background` | `#38332c` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.color` | `#a89f92` | `inputtext.background` | `#38332c` | **4.79:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `--surface-ground` | `#26231f` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `--surface-card` | `#2f2b26` | **7.40:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `inputtext.background` | `#38332c` | **6.59:1** | 1.4.11 | 3:1 | ok |

#### form field text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `inputtext.color` | `#ece6dc` | `inputtext.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `inputtext.placeholder.color` | `#a89f92` | `inputtext.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `select.color` | `#ece6dc` | `select.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `select.placeholder.color` | `#a89f92` | `select.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.color` | `#ece6dc` | `textarea.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.placeholder.color` | `#a89f92` | `textarea.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.color` | `#ece6dc` | `cascadeselect.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.placeholder.color` | `#a89f92` | `cascadeselect.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.color` | `#ece6dc` | `multiselect.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.placeholder.color` | `#a89f92` | `multiselect.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.color` | `#ece6dc` | `treeselect.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.placeholder.color` | `#a89f92` | `treeselect.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.color` | `#ece6dc` | `autocomplete.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.placeholder.color` | `#a89f92` | `autocomplete.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |

#### form field icon

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.dropdown.color` | `#a89f92` | `select.background` | `#38332c` | **4.79:1** | 1.4.11 | 3:1 | ok |
| `multiselect.dropdown.color` | `#a89f92` | `multiselect.background` | `#38332c` | **4.79:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.dropdown.color` | `#a89f92` | `cascadeselect.background` | `#38332c` | **4.79:1** | 1.4.11 | 3:1 | ok |
| `treeselect.dropdown.color` | `#a89f92` | `treeselect.background` | `#38332c` | **4.79:1** | 1.4.11 | 3:1 | ok |
| `password.icon.color` | `#a89f92` | `inputtext.background` | `#38332c` | **4.79:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.color` | `#d4d4d8` | `autocomplete.dropdown.background` | `#27272a` | **10.08:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.color` | `#d4d4d8` | `datepicker.dropdown.background` | `#27272a` | **10.08:1** | 1.4.11 | 3:1 | ok |
| `inputgroup.addon.color` | `#a89f92` | `inputgroup.addon.background` | `#09090b` | **7.62:1** | 1.4.3 | 4.5:1 | ok |

#### float label

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `floatlabel.color` | `#a89f92` | `inputtext.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.active.color` | `#a89f92` | `floatlabel.on.active.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.focus.color` | `#ece6dc` | `floatlabel.on.active.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.invalid.color` | `#fca5a5` | `floatlabel.on.active.background` | `#38332c` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.color` | `#a89f92` | `inputtext.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.focus.color` | `#ece6dc` | `inputtext.background` | `#38332c` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.invalid.color` | `#fca5a5` | `inputtext.background` | `#38332c` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.on.active.background` | `#38332c` | `inputtext.background` | `#38332c` | **1.00:1** | none | — | info |

#### tag

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `tag.secondary.color (styles.scss)` | `#ffffff` | `tag.secondary.background (styles.scss)` | `#475569` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `tag.success.color (styles.scss)` | `#ffffff` | `tag.success.background (styles.scss)` | `#15803d` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `tag.info.color (styles.scss)` | `#ffffff` | `tag.info.background (styles.scss)` | `#0369a1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `tag.warn.color (styles.scss)` | `#ffffff` | `tag.warn.background (styles.scss)` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `tag.danger.color (styles.scss)` | `#ffffff` | `tag.danger.background (styles.scss)` | `#b91c1c` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `tag.contrast.color` | `#09090b` | `tag.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#fff8a2` | `sunset.tag.primary.background over --surface-ground` | `#483524` | **10.61:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#fff8a2` | `sunset.tag.primary.background over --surface-card` | `#503b2a` | **9.60:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#ffd7d7` | `fire.tag.primary.background over --surface-ground` | `#482f2c` | **9.28:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#ffd7d7` | `fire.tag.primary.background over --surface-card` | `#4f3632` | **8.37:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#ffd8ff` | `coral.tag.primary.background over --surface-ground` | `#473037` | **9.46:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#ffd8ff` | `coral.tag.primary.background over --surface-card` | `#4f363d` | **8.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#b0ffe6` | `forest.tag.primary.background over --surface-ground` | `#2c412f` | **9.61:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#b0ffe6` | `forest.tag.primary.background over --surface-card` | `#334834` | **8.64:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#93ffff` | `ocean.tag.primary.background over --surface-ground` | `#273f39` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#93ffff` | `ocean.tag.primary.background over --surface-card` | `#2f463e` | **8.70:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#88ffff` | `aurora.tag.primary.background over --surface-ground` | `#253f40` | **9.55:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#88ffff` | `aurora.tag.primary.background over --surface-card` | `#2d4646` | **8.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#ebffff` | `twilight.tag.primary.background over --surface-ground` | `#353843` | **11.28:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#ebffff` | `twilight.tag.primary.background over --surface-card` | `#3d3f49` | **10.11:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#ffffff` | `mystic.tag.primary.background over --surface-ground` | `#48383c` | **11.02:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#ffffff` | `mystic.tag.primary.background over --surface-card` | `#4f3f42` | **9.90:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#ffffff` | `stone.tag.primary.background over --surface-ground` | `#423f3b` | **10.47:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#ffffff` | `stone.tag.primary.background over --surface-card` | `#4a4641` | **9.36:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#ffffff` | `contrast.tag.primary.background over --surface-ground` | `#484542` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#ffffff` | `contrast.tag.primary.background over --surface-card` | `#4f4c48` | **8.54:1** | 1.4.3 | 4.5:1 | ok |

#### chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `chip.color` | `#ffffff` | `chip.background` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `chip.remove.icon.color` | `#ffffff` | `chip.background` | `#27272a` | **14.89:1** | 1.4.11 | 3:1 | ok |

#### dialog

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `dialog.color` | `#ffffff` | `dialog.background` | `#18181b` | **17.72:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#a89f92` | `dialog.background` | `#18181b` | **6.78:1** | 1.4.11 | 3:1 | ok |

#### skeleton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `skeleton.background` | `#33302c` | `--surface-ground` | `#26231f` | **1.19:1** | none | — | info |
| `skeleton.background` | `#3b3833` | `--surface-card` | `#2f2b26` | **1.20:1** | none | — | info |

#### progressbar & slider

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `slider.track.background` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#968c7d` | `--surface-ground` | `#26231f` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#3f3f46` | `--surface-ground` | `#26231f` | **1.50:1** | none | — | info |
| `slider.track.background` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#968c7d` | `--surface-card` | `#2f2b26` | **4.25:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#3f3f46` | `--surface-card` | `#2f2b26` | **1.35:1** | none | — | info |
| `sunset.progressbar.value.background` | `#fb923c` | `progressbar.background` | `#3f3f46` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressbar.label.color` | `#18181b` | `sunset.progressbar.value.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `fire.progressbar.value.background` | `#f87171` | `progressbar.background` | `#3f3f46` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `fire.progressbar.label.color` | `#18181b` | `fire.progressbar.value.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `coral.progressbar.value.background` | `#f472b6` | `progressbar.background` | `#3f3f46` | **3.94:1** | 1.4.11 | 3:1 | ok |
| `coral.progressbar.label.color` | `#18181b` | `coral.progressbar.value.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `forest.progressbar.value.background` | `#4ade80` | `progressbar.background` | `#3f3f46` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `forest.progressbar.label.color` | `#18181b` | `forest.progressbar.value.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.progressbar.value.background` | `#2dd4bf` | `progressbar.background` | `#3f3f46` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressbar.label.color` | `#18181b` | `ocean.progressbar.value.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.progressbar.value.background` | `#22d3ee` | `progressbar.background` | `#3f3f46` | **5.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressbar.label.color` | `#18181b` | `aurora.progressbar.value.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.progressbar.value.background` | `#85a7ff` | `progressbar.background` | `#3f3f46` | **4.46:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressbar.label.color` | `#18181b` | `twilight.progressbar.value.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.progressbar.value.background` | `#f9a8d4` | `progressbar.background` | `#3f3f46` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressbar.label.color` | `#18181b` | `mystic.progressbar.value.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `stone.progressbar.value.background` | `#d6d3d1` | `progressbar.background` | `#3f3f46` | **7.01:1** | 1.4.11 | 3:1 | ok |
| `stone.progressbar.label.color` | `#18181b` | `stone.progressbar.value.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.progressbar.value.background` | `#f8fafc` | `progressbar.background` | `#3f3f46` | **9.98:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressbar.label.color` | `#18181b` | `contrast.progressbar.value.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |

#### togglebutton & selectbutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `togglebutton.color` | `#a89f92` | `togglebutton.background` | `#38332c` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `togglebutton.hover.color` | `#ece6dc` | `togglebutton.hover.background` | `#3c362e` | **9.62:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.togglebutton.content.checked.background` | `#fb923c` | `togglebutton.background` | `#38332c` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `sunset.togglebutton.content.checked.background` | `#fb923c` | **6.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.togglebutton.content.checked.background` | `#f87171` | `togglebutton.background` | `#38332c` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `fire.togglebutton.content.checked.background` | `#f87171` | **5.08:1** | 1.4.3 | 4.5:1 | ok |
| `coral.togglebutton.content.checked.background` | `#f472b6` | `togglebutton.background` | `#38332c` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `coral.togglebutton.content.checked.background` | `#f472b6` | **5.31:1** | 1.4.3 | 4.5:1 | ok |
| `forest.togglebutton.content.checked.background` | `#4ade80` | `togglebutton.background` | `#38332c` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `forest.togglebutton.content.checked.background` | `#4ade80` | **8.06:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.togglebutton.content.checked.background` | `#2dd4bf` | `togglebutton.background` | `#38332c` | **6.72:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `ocean.togglebutton.content.checked.background` | `#2dd4bf` | **7.55:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.togglebutton.content.checked.background` | `#22d3ee` | `togglebutton.background` | `#38332c` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `aurora.togglebutton.content.checked.background` | `#22d3ee` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.togglebutton.content.checked.background` | `#85a7ff` | `togglebutton.background` | `#38332c` | **5.34:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `twilight.togglebutton.content.checked.background` | `#85a7ff` | **6.00:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.togglebutton.content.checked.background` | `#f9a8d4` | `togglebutton.background` | `#38332c` | **6.90:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `mystic.togglebutton.content.checked.background` | `#f9a8d4` | **7.75:1** | 1.4.3 | 4.5:1 | ok |
| `stone.togglebutton.content.checked.background` | `#d6d3d1` | `togglebutton.background` | `#38332c` | **8.40:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `stone.togglebutton.content.checked.background` | `#d6d3d1` | **9.43:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.togglebutton.content.checked.background` | `#f8fafc` | `togglebutton.background` | `#38332c` | **11.96:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#2f2b26` | `contrast.togglebutton.content.checked.background` | `#f8fafc` | **13.43:1** | 1.4.3 | 4.5:1 | ok |

#### menu focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `menubar.submenu.icon.color` | `#a89f92` | `menubar.background` | `#18181b` | **6.78:1** | 1.4.11 | 3:1 | ok |
| `menubar.submenu.icon.color` | `#a89f92` | `menubar.item.focus.background` | `#27272a` | **5.70:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#a89f92` | `menubar.background` | `#18181b` | **6.78:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#a89f92` | `menubar.item.focus.background` | `#27272a` | **5.70:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.focus.background` | `#27272a` | `menubar.background` | `#18181b` | **1.19:1** | none | — | info |
| `sunset.--primary-color-fg (focus ring)` | `#fb923c` | `menubar.item.focus.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (focus ring)` | `#fb923c` | `menubar.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#f87171` | `menubar.item.focus.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#f87171` | `menubar.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#f472b6` | `menubar.item.focus.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#f472b6` | `menubar.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#4ade80` | `menubar.item.focus.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#4ade80` | `menubar.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#2dd4bf` | `menubar.item.focus.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#2dd4bf` | `menubar.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#22d3ee` | `menubar.item.focus.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#22d3ee` | `menubar.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#85a7ff` | `menubar.item.focus.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#85a7ff` | `menubar.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#f9a8d4` | `menubar.item.focus.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#f9a8d4` | `menubar.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#d6d3d1` | `menubar.item.focus.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#d6d3d1` | `menubar.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#f8fafc` | `menubar.item.focus.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#f8fafc` | `menubar.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### option list focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.option.focus.background` | `#27272a` | `select.overlay.background` | `#18181b` | **1.19:1** | none | — | info |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **6.21:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `select.option.focus.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.select.option.selected.background` | `#504432` | **4.19:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.select.option.selected.focus.background` | `#504432` | **4.19:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **5.27:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `multiselect.overlay.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.multiselect.option.selected.background` | `#3d3428` | **5.39:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.multiselect.option.selected.focus.background` | `#4f422f` | **4.31:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `listbox.background` | `#09090b` | **8.79:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.listbox.option.selected.background` | `#30271b` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.listbox.option.selected.focus.background` | `#443623` | **5.16:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `select.option.focus.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.select.option.selected.background` | `#503e3a` | **3.63:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.select.option.selected.focus.background` | `#503e3a` | **3.63:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `multiselect.overlay.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.multiselect.option.selected.background` | `#3d2e31` | **4.65:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.multiselect.option.selected.focus.background` | `#4f3a3c` | **3.79:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `listbox.background` | `#09090b` | **7.19:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.listbox.option.selected.background` | `#302223` | **5.51:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.listbox.option.selected.focus.background` | `#442e30` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **5.31:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `select.option.focus.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.select.option.selected.background` | `#503f45` | **3.71:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.select.option.selected.focus.background` | `#503f45` | **3.71:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `multiselect.overlay.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.multiselect.option.selected.background` | `#3d2f3c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.multiselect.option.selected.focus.background` | `#4f3a4c` | **3.88:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `listbox.background` | `#09090b` | **7.51:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.listbox.option.selected.background` | `#30222f` | **5.68:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.listbox.option.selected.focus.background` | `#442e40` | **4.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `select.option.focus.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.select.option.selected.background` | `#3b4d3d` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.select.option.selected.focus.background` | `#3b4d3d` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **6.85:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `multiselect.overlay.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.multiselect.option.selected.background` | `#283d33` | **6.67:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.multiselect.option.selected.focus.background` | `#304f3f` | **5.20:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `listbox.background` | `#09090b` | **11.42:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.listbox.option.selected.background` | `#1c3026` | **8.03:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.listbox.option.selected.focus.background` | `#254433` | **6.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **7.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `select.option.focus.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.select.option.selected.background` | `#374d47` | **4.87:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.select.option.selected.focus.background` | `#374d47` | **4.87:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **6.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `multiselect.overlay.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.multiselect.option.selected.background` | `#243d3d` | **6.23:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.multiselect.option.selected.focus.background` | `#294f4f` | **4.85:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `listbox.background` | `#09090b` | **10.69:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.listbox.option.selected.background` | `#173030` | **7.51:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.listbox.option.selected.focus.background` | `#1e4442` | **5.75:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `select.option.focus.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.select.option.selected.background` | `#354d49` | **5.03:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.select.option.selected.focus.background` | `#354d49` | **5.03:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **6.61:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `multiselect.overlay.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.multiselect.option.selected.background` | `#223d3f` | **6.43:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.multiselect.option.selected.focus.background` | `#274f52` | **4.99:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `listbox.background` | `#09090b` | **11.01:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.listbox.option.selected.background` | `#153032` | **7.74:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.listbox.option.selected.focus.background` | `#1b4446` | **5.92:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **6.00:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `select.option.focus.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.select.option.selected.background` | `#454749` | **3.99:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.select.option.selected.focus.background` | `#454749` | **3.99:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **5.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `multiselect.overlay.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.multiselect.option.selected.background` | `#32373f` | **5.11:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.multiselect.option.selected.focus.background` | `#3e4752` | **4.03:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `listbox.background` | `#09090b` | **8.50:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.listbox.option.selected.background` | `#252a32` | **6.16:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.listbox.option.selected.focus.background` | `#333b46` | **4.84:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **7.75:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `select.option.focus.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.select.option.selected.background` | `#504749` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.select.option.selected.focus.background` | `#504749` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `multiselect.overlay.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.multiselect.option.selected.background` | `#3d373f` | **6.37:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.multiselect.option.selected.focus.background` | `#4f4752` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `listbox.background` | `#09090b` | **10.97:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.listbox.option.selected.background` | `#302b32` | **7.63:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.listbox.option.selected.focus.background` | `#443b46` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **9.43:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `select.option.focus.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.select.option.selected.background` | `#504d49` | **5.64:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.select.option.selected.focus.background` | `#504d49` | **5.64:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **8.01:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `multiselect.overlay.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.multiselect.option.selected.background` | `#3d3d3f` | **7.28:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.multiselect.option.selected.focus.background` | `#4f4f52` | **5.48:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `listbox.background` | `#09090b` | **13.36:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.listbox.option.selected.background` | `#303032` | **8.84:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.listbox.option.selected.focus.background` | `#444446` | **6.52:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `--surface-card (.dark-theme .p-select-overlay)` | `#2f2b26` | **13.43:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `select.option.focus.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.select.option.selected.background` | `#504d49` | **8.03:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.select.option.selected.focus.background` | `#504d49` | **8.03:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#3c362e` | **11.41:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `multiselect.overlay.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.multiselect.option.selected.background` | `#3d3d3f` | **10.36:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.multiselect.option.selected.focus.background` | `#4f4f52` | **7.80:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `listbox.background` | `#09090b` | **19.02:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.listbox.option.selected.background` | `#303032` | **12.59:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.listbox.option.selected.focus.background` | `#444446` | **9.29:1** | 1.4.11 | 3:1 | ok |

#### panel outline

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-outline` | `#ece6dc` | `--surface-ground` | `#26231f` | **12.60:1** | 1.4.11 | 3:1 | ok |
| `--style-outline` | `#ece6dc` | `--surface-card` | `#2f2b26` | **11.32:1** | 1.4.11 | 3:1 | ok |
| `popover.background` | `#18181b` | `--surface-card` | `#2f2b26` | **1.26:1** | none | — | info |
| `drawer.background` | `#18181b` | `--surface-card` | `#2f2b26` | **1.26:1** | none | — | info |

#### content panel

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `text.color` | `#ffffff` | `content.background` | `#18181b` | **17.72:1** | 1.4.3 | 4.5:1 | ok |

#### table & paginator

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `datatable.row.background` | `#2f2b26` | `--surface-card` | `#2f2b26` | **1.00:1** | none | — | info |
| `paginator.background` | `#2f2b26` | `--surface-card` | `#2f2b26` | **1.00:1** | none | — | info |
| `datatable.row.color` | `#ffffff` | `datatable.row.background` | `#2f2b26` | **14.05:1** | 1.4.3 | 4.5:1 | ok |
| `paginator.nav.button.color` | `#a1a1aa` | `paginator.background` | `#2f2b26` | **5.48:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.datatable.row.selected.color` | `#e8e7e4` | `sunset.datatable.row.selected.background` | `#504432` | **7.67:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.color` | `#18181b` | `sunset.paginator.nav.button.selected.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.background` | `#fb923c` | `paginator.background` | `#2f2b26` | **6.21:1** | 1.4.11 | 3:1 | ok |
| `sunset.datatable.row.selected.background` | `#504432` | `datatable.row.background` | `#2f2b26` | **1.48:1** | none | — | info |
| `sunset.--primary-color-fg (selected-row bar)` | `#fb923c` | `sunset.datatable.row.selected.background` | `#504432` | **4.19:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (selected-row bar)` | `#fb923c` | `datatable.row.background` | `#2f2b26` | **6.21:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.color` | `#e8e6e5` | `fire.datatable.row.selected.background` | `#503e3a` | **8.07:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.color` | `#18181b` | `fire.paginator.nav.button.selected.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.background` | `#f87171` | `paginator.background` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.background` | `#503e3a` | `datatable.row.background` | `#2f2b26` | **1.40:1** | none | — | info |
| `fire.--primary-color-fg (selected-row bar)` | `#f87171` | `fire.datatable.row.selected.background` | `#503e3a` | **3.63:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (selected-row bar)` | `#f87171` | `datatable.row.background` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.color` | `#e8e6e7` | `coral.datatable.row.selected.background` | `#503f45` | **7.91:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.color` | `#18181b` | `coral.paginator.nav.button.selected.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.background` | `#f472b6` | `paginator.background` | `#2f2b26` | **5.31:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.background` | `#503f45` | `datatable.row.background` | `#2f2b26` | **1.43:1** | none | — | info |
| `coral.--primary-color-fg (selected-row bar)` | `#f472b6` | `coral.datatable.row.selected.background` | `#503f45` | **3.71:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (selected-row bar)` | `#f472b6` | `datatable.row.background` | `#2f2b26` | **5.31:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.color` | `#e6e8e6` | `forest.datatable.row.selected.background` | `#3b4d3d` | **7.37:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.color` | `#18181b` | `forest.paginator.nav.button.selected.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.background` | `#4ade80` | `paginator.background` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.background` | `#3b4d3d` | `datatable.row.background` | `#2f2b26` | **1.55:1** | none | — | info |
| `forest.--primary-color-fg (selected-row bar)` | `#4ade80` | `forest.datatable.row.selected.background` | `#3b4d3d` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (selected-row bar)` | `#4ade80` | `datatable.row.background` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.color` | `#e5e8e7` | `ocean.datatable.row.selected.background` | `#374d47` | **7.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.color` | `#18181b` | `ocean.paginator.nav.button.selected.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.background` | `#2dd4bf` | `paginator.background` | `#2f2b26` | **7.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.background` | `#374d47` | `datatable.row.background` | `#2f2b26` | **1.55:1** | none | — | info |
| `ocean.--primary-color-fg (selected-row bar)` | `#2dd4bf` | `ocean.datatable.row.selected.background` | `#374d47` | **4.87:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (selected-row bar)` | `#2dd4bf` | `datatable.row.background` | `#2f2b26` | **7.55:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.color` | `#e5e8e7` | `aurora.datatable.row.selected.background` | `#354d49` | **7.37:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.color` | `#18181b` | `aurora.paginator.nav.button.selected.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.background` | `#22d3ee` | `paginator.background` | `#2f2b26` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.background` | `#354d49` | `datatable.row.background` | `#2f2b26` | **1.55:1** | none | — | info |
| `aurora.--primary-color-fg (selected-row bar)` | `#22d3ee` | `aurora.datatable.row.selected.background` | `#354d49` | **5.03:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (selected-row bar)` | `#22d3ee` | `datatable.row.background` | `#2f2b26` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.color` | `#e7e7e7` | `twilight.datatable.row.selected.background` | `#454749` | **7.55:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.color` | `#18181b` | `twilight.paginator.nav.button.selected.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.background` | `#85a7ff` | `paginator.background` | `#2f2b26` | **6.00:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.background` | `#454749` | `datatable.row.background` | `#2f2b26` | **1.51:1** | none | — | info |
| `twilight.--primary-color-fg (selected-row bar)` | `#85a7ff` | `twilight.datatable.row.selected.background` | `#454749` | **3.99:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (selected-row bar)` | `#85a7ff` | `datatable.row.background` | `#2f2b26` | **6.00:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.color` | `#e8e7e7` | `mystic.datatable.row.selected.background` | `#504749` | **7.28:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.color` | `#18181b` | `mystic.paginator.nav.button.selected.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.background` | `#f9a8d4` | `paginator.background` | `#2f2b26` | **7.75:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.background` | `#504749` | `datatable.row.background` | `#2f2b26` | **1.56:1** | none | — | info |
| `mystic.--primary-color-fg (selected-row bar)` | `#f9a8d4` | `mystic.datatable.row.selected.background` | `#504749` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (selected-row bar)` | `#f9a8d4` | `datatable.row.background` | `#2f2b26` | **7.75:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.color` | `#e8e8e7` | `stone.datatable.row.selected.background` | `#504d49` | **6.85:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.color` | `#18181b` | `stone.paginator.nav.button.selected.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.background` | `#d6d3d1` | `paginator.background` | `#2f2b26` | **9.43:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.background` | `#504d49` | `datatable.row.background` | `#2f2b26` | **1.67:1** | none | — | info |
| `stone.--primary-color-fg (selected-row bar)` | `#d6d3d1` | `stone.datatable.row.selected.background` | `#504d49` | **5.64:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (selected-row bar)` | `#d6d3d1` | `datatable.row.background` | `#2f2b26` | **9.43:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.color` | `#e8e8e7` | `contrast.datatable.row.selected.background` | `#504d49` | **6.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.color` | `#18181b` | `contrast.paginator.nav.button.selected.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.background` | `#f8fafc` | `paginator.background` | `#2f2b26` | **13.43:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.background` | `#504d49` | `datatable.row.background` | `#2f2b26` | **1.67:1** | none | — | info |
| `contrast.--primary-color-fg (selected-row bar)` | `#f8fafc` | `contrast.datatable.row.selected.background` | `#504d49` | **8.03:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (selected-row bar)` | `#f8fafc` | `datatable.row.background` | `#2f2b26` | **13.43:1** | 1.4.11 | 3:1 | ok |

#### badge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `badge.secondary.color` | `#d4d4d8` | `badge.secondary.background` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `badge.success.color` | `#052e16` | `badge.success.background` | `#86efac` | **10.62:1** | 1.4.3 | 4.5:1 | ok |
| `badge.info.color` | `#172554` | `badge.info.background` | `#93c5fd` | **8.15:1** | 1.4.3 | 4.5:1 | ok |
| `badge.warn.color` | `#431407` | `badge.warn.background` | `#fdba74` | **9.28:1** | 1.4.3 | 4.5:1 | ok |
| `badge.danger.color` | `#450a0a` | `badge.danger.background` | `#fca5a5` | **8.51:1** | 1.4.3 | 4.5:1 | ok |
| `badge.contrast.color` | `#09090b` | `badge.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.badge.primary.color` | `#18181b` | `sunset.badge.primary.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `fire.badge.primary.color` | `#18181b` | `fire.badge.primary.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `coral.badge.primary.color` | `#18181b` | `coral.badge.primary.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `forest.badge.primary.color` | `#18181b` | `forest.badge.primary.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.badge.primary.color` | `#18181b` | `ocean.badge.primary.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.badge.primary.color` | `#18181b` | `aurora.badge.primary.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.badge.primary.color` | `#18181b` | `twilight.badge.primary.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.badge.primary.color` | `#18181b` | `mystic.badge.primary.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `stone.badge.primary.color` | `#18181b` | `stone.badge.primary.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.badge.primary.color` | `#18181b` | `contrast.badge.primary.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |

#### message & toast

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `message.info.color` | `#93c5fd` | `message.info.background over --surface-ground` | `#293241` | **7.16:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#93c5fd` | `--surface-ground` | `#26231f` | **8.67:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#93c5fd` | `toast.info.background over --surface-ground` | `#293241` | **7.16:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#ffffff` | `toast.info.background over --surface-ground` | `#293241` | **12.91:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.color` | `#93c5fd` | `message.info.background over --surface-card` | `#313947` | **6.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#93c5fd` | `--surface-card` | `#2f2b26` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#93c5fd` | `toast.info.background over --surface-card` | `#313947` | **6.45:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#ffffff` | `toast.info.background over --surface-card` | `#313947` | **11.62:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#86efac` | `message.success.background over --surface-ground` | `#253d29` | **8.41:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#86efac` | `--surface-ground` | `#26231f` | **11.14:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#86efac` | `toast.success.background over --surface-ground` | `#253d29` | **8.41:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#ffffff` | `toast.success.background over --surface-ground` | `#253d29` | **11.81:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#86efac` | `message.success.background over --surface-card` | `#2d442f` | **7.56:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#86efac` | `--surface-card` | `#2f2b26` | **10.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#86efac` | `toast.success.background over --surface-card` | `#2d442f` | **7.56:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#ffffff` | `toast.success.background over --surface-card` | `#2d442f` | **10.61:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#fdba74` | `message.warn.background over --surface-ground` | `#453a1b` | **6.64:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#fdba74` | `--surface-ground` | `#26231f` | **9.27:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#fdba74` | `toast.warn.background over --surface-ground` | `#453a1b` | **6.64:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#ffffff` | `toast.warn.background over --surface-ground` | `#453a1b` | **11.21:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#fdba74` | `message.warn.background over --surface-card` | `#4d4121` | **5.95:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#fdba74` | `--surface-card` | `#2f2b26` | **8.33:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#fdba74` | `toast.warn.background over --surface-card` | `#4d4121` | **5.95:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#ffffff` | `toast.warn.background over --surface-card` | `#4d4121` | **10.03:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#fca5a5` | `message.error.background over --surface-ground` | `#462825` | **6.96:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#fca5a5` | `--surface-ground` | `#26231f` | **8.24:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#fca5a5` | `toast.error.background over --surface-ground` | `#462825` | **6.96:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#ffffff` | `toast.error.background over --surface-ground` | `#462825` | **13.20:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#fca5a5` | `message.error.background over --surface-card` | `#4e2f2b` | **6.27:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#fca5a5` | `--surface-card` | `#2f2b26` | **7.40:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#fca5a5` | `toast.error.background over --surface-card` | `#4e2f2b` | **6.27:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#ffffff` | `toast.error.background over --surface-card` | `#4e2f2b` | **11.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#d4d4d8` | `message.secondary.background over --surface-ground` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#a89f92` | `--surface-ground` | `#26231f` | **5.99:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#d4d4d8` | `toast.secondary.background over --surface-ground` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#ffffff` | `toast.secondary.background over --surface-ground` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#d4d4d8` | `message.secondary.background over --surface-card` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#a89f92` | `--surface-card` | `#2f2b26` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#d4d4d8` | `toast.secondary.background over --surface-card` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#ffffff` | `toast.secondary.background over --surface-card` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#09090b` | `message.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#ece6dc` | `--surface-ground` | `#26231f` | **12.60:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#09090b` | `toast.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#09090b` | `toast.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#09090b` | `message.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#ece6dc` | `--surface-card` | `#2f2b26` | **11.32:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#09090b` | `toast.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#09090b` | `toast.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |

#### text & link button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.text.secondary.color` | `#a89f92` | `--surface-ground` | `#26231f` | **5.99:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#a89f92` | `--surface-card` | `#2f2b26` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#86efac` | `--surface-ground` | `#26231f` | **11.14:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#86efac` | `--surface-card` | `#2f2b26` | **10.01:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#93c5fd` | `--surface-ground` | `#26231f` | **8.67:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#93c5fd` | `--surface-card` | `#2f2b26` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#fdba74` | `--surface-ground` | `#26231f` | **9.27:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#fdba74` | `--surface-card` | `#2f2b26` | **8.33:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#67e8f9` | `--surface-ground` | `#26231f` | **10.79:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#67e8f9` | `--surface-card` | `#2f2b26` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#fca5a5` | `--surface-ground` | `#26231f` | **8.24:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#fca5a5` | `--surface-card` | `#2f2b26` | **7.40:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#ece6dc` | `--surface-ground` | `#26231f` | **12.60:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#ece6dc` | `--surface-card` | `#2f2b26` | **11.32:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#ece6dc` | `--surface-ground` | `#26231f` | **12.60:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#ece6dc` | `--surface-card` | `#2f2b26` | **11.32:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#fb923c` | `--surface-ground` | `#26231f` | **6.91:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#fb923c` | `--surface-card` | `#2f2b26` | **6.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#f87171` | `--surface-ground` | `#26231f` | **5.65:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#f87171` | `--surface-card` | `#2f2b26` | **5.08:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#f472b6` | `--surface-ground` | `#26231f` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#f472b6` | `--surface-card` | `#2f2b26` | **5.31:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#4ade80` | `--surface-ground` | `#26231f` | **8.98:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#4ade80` | `--surface-card` | `#2f2b26` | **8.06:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#2dd4bf` | `--surface-ground` | `#26231f` | **8.40:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#2dd4bf` | `--surface-card` | `#2f2b26` | **7.55:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#22d3ee` | `--surface-ground` | `#26231f` | **8.66:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#22d3ee` | `--surface-card` | `#2f2b26` | **7.78:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#85a7ff` | `--surface-ground` | `#26231f` | **6.68:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#85a7ff` | `--surface-card` | `#2f2b26` | **6.00:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#f9a8d4` | `--surface-ground` | `#26231f` | **8.62:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#f9a8d4` | `--surface-card` | `#2f2b26` | **7.75:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#d6d3d1` | `--surface-ground` | `#26231f` | **10.50:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#d6d3d1` | `--surface-card` | `#2f2b26` | **9.43:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#f8fafc` | `--surface-ground` | `#26231f` | **14.95:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#f8fafc` | `--surface-card` | `#2f2b26` | **13.43:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (contrast)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.contrast.color` | `#09090b` | `button.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |

#### avatar

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `avatar.color` | `#ffffff` | `avatar.background` | `#3f3f46` | **10.44:1** | 1.4.3 | 4.5:1 | ok |

#### image preview

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `image.action.color` | `#fafafa` | `image.toolbar.background over mask.background over --surface-ground` | `#060605` | **19.42:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-ground` | `#1f1f1e` | **16.50:1** | 1.4.11 | 3:1 | ok |
| `image.action.color` | `#fafafa` | `image.toolbar.background over mask.background over --surface-card` | `#080706` | **19.28:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-card` | `#21201f` | **16.27:1** | 1.4.11 | 3:1 | ok |

#### focus ring

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-ground` | `#26231f` | **6.91:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-card` | `#2f2b26` | **6.21:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-section` | `#38332c` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `dialog.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `chip.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `paginator.background` | `#2f2b26` | **6.21:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `datatable.row.background` | `#2f2b26` | **6.21:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `datatable.row.hover.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `sunset.datatable.row.selected.background` | `#504432` | **4.19:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `autocomplete.chip.focus.background` | `#3f3f46` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-ground` | `#26231f` | **5.65:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-card` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-section` | `#38332c` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `dialog.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `chip.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `paginator.background` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `datatable.row.background` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `datatable.row.hover.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `fire.datatable.row.selected.background` | `#503e3a` | **3.63:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `autocomplete.chip.focus.background` | `#3f3f46` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-ground` | `#26231f` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-card` | `#2f2b26` | **5.31:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-section` | `#38332c` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `dialog.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `chip.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `paginator.background` | `#2f2b26` | **5.31:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `datatable.row.background` | `#2f2b26` | **5.31:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `datatable.row.hover.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `coral.datatable.row.selected.background` | `#503f45` | **3.71:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `autocomplete.chip.focus.background` | `#3f3f46` | **3.94:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-ground` | `#26231f` | **8.98:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-card` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-section` | `#38332c` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `dialog.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `chip.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `paginator.background` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `datatable.row.background` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `datatable.row.hover.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `forest.datatable.row.selected.background` | `#3b4d3d` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-ground` | `#26231f` | **8.40:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-card` | `#2f2b26` | **7.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-section` | `#38332c` | **6.72:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `dialog.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `chip.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `paginator.background` | `#2f2b26` | **7.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `datatable.row.background` | `#2f2b26` | **7.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `datatable.row.hover.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `ocean.datatable.row.selected.background` | `#374d47` | **4.87:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-ground` | `#26231f` | **8.66:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-card` | `#2f2b26` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-section` | `#38332c` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `dialog.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `chip.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `paginator.background` | `#2f2b26` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `datatable.row.background` | `#2f2b26` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `datatable.row.hover.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `aurora.datatable.row.selected.background` | `#354d49` | **5.03:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-ground` | `#26231f` | **6.68:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-card` | `#2f2b26` | **6.00:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-section` | `#38332c` | **5.34:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `dialog.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `chip.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `paginator.background` | `#2f2b26` | **6.00:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `datatable.row.background` | `#2f2b26` | **6.00:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `datatable.row.hover.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `twilight.datatable.row.selected.background` | `#454749` | **3.99:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `autocomplete.chip.focus.background` | `#3f3f46` | **4.46:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-ground` | `#26231f` | **8.62:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-card` | `#2f2b26` | **7.75:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-section` | `#38332c` | **6.90:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `dialog.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `chip.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `paginator.background` | `#2f2b26` | **7.75:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `datatable.row.background` | `#2f2b26` | **7.75:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `datatable.row.hover.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `mystic.datatable.row.selected.background` | `#504749` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-ground` | `#26231f` | **10.50:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-card` | `#2f2b26` | **9.43:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-section` | `#38332c` | **8.40:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `dialog.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `chip.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `paginator.background` | `#2f2b26` | **9.43:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `datatable.row.background` | `#2f2b26` | **9.43:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `datatable.row.hover.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `stone.datatable.row.selected.background` | `#504d49` | **5.64:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `autocomplete.chip.focus.background` | `#3f3f46` | **7.01:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-ground` | `#26231f` | **14.95:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-card` | `#2f2b26` | **13.43:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-section` | `#38332c` | **11.96:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `dialog.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `chip.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `paginator.background` | `#2f2b26` | **13.43:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `datatable.row.background` | `#2f2b26` | **13.43:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `datatable.row.hover.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `contrast.datatable.row.selected.background` | `#504d49` | **8.03:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `autocomplete.chip.focus.background` | `#3f3f46` | **9.98:1** | 1.4.11 | 3:1 | ok |

#### progress spinner

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-ground` | `#26231f` | **6.91:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-card` | `#2f2b26` | **6.21:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-section` | `#38332c` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-ground` | `#26231f` | **5.65:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-card` | `#2f2b26` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-section` | `#38332c` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-ground` | `#26231f` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-card` | `#2f2b26` | **5.31:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-section` | `#38332c` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-ground` | `#26231f` | **8.98:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-card` | `#2f2b26` | **8.06:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-section` | `#38332c` | **7.18:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-ground` | `#26231f` | **8.40:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-card` | `#2f2b26` | **7.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-section` | `#38332c` | **6.72:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-ground` | `#26231f` | **8.66:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-card` | `#2f2b26` | **7.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-section` | `#38332c` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-ground` | `#26231f` | **6.68:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-card` | `#2f2b26` | **6.00:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-section` | `#38332c` | **5.34:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-ground` | `#26231f` | **8.62:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-card` | `#2f2b26` | **7.75:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-section` | `#38332c` | **6.90:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-ground` | `#26231f` | **10.50:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-card` | `#2f2b26` | **9.43:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-section` | `#38332c` | **8.40:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-ground` | `#26231f` | **14.95:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-card` | `#2f2b26` | **13.43:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-section` | `#38332c` | **11.96:1** | 1.4.11 | 3:1 | ok |

## style: blaupause

### light mode

#### body text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--text-color` | `#17335c` | `--surface-ground` | `#f6f8fb` | **11.86:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#526f8f` | `--surface-ground` | `#f6f8fb` | **4.90:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#17335c` | `--surface-card` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#526f8f` | `--surface-card` | `#ffffff` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#17335c` | `--surface-section` | `#eef2f8` | **11.23:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#526f8f` | `--surface-section` | `#eef2f8` | **4.64:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#17335c` | `--surface-hover` | `#ebf0f7` | **11.02:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#526f8f` | `--surface-hover` | `#ebf0f7` | **4.55:1** | 1.4.3 | 4.5:1 | ok |

#### semantic text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--semantic-blue-fg` | `#1d4ed8` | `--surface-ground` | `#f6f8fb` | **6.30:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-blue-fg` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#c2410c` | `--surface-ground` | `#f6f8fb` | **4.87:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#15803d` | `--surface-ground` | `#f6f8fb` | **4.71:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#b91c1c` | `--surface-ground` | `#f6f8fb` | **6.08:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#0e7490` | `--surface-ground` | `#f6f8fb` | **5.04:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#be185d` | `--surface-ground` | `#f6f8fb` | **5.68:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#be185d` | `--surface-card` | `#ffffff` | **6.04:1** | 1.4.3 | 4.5:1 | ok |

#### dev toggle

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--dev-toggle-fg` | `#166534` | `color-mix(--dev-toggle-border 15%, --surface-card)` | `#dcf1e4` | **6.03:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border` | `#16a34a` | `--surface-card` | `#ffffff` | **3.30:1** | 1.4.11 | 3:1 | ok |
| `--dev-toggle-fg-active` | `#991b1b` | `color-mix(--dev-toggle-border-active 15%, --surface-card)` | `#fde3e3` | **6.84:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border-active` | `#ef4444` | `--surface-card` | `#ffffff` | **3.76:1** | 1.4.11 | 3:1 | ok |

#### control boundary

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-border` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#64809f` | `--surface-section` | `#eef2f8` | **3.64:1** | 1.4.11 | 3:1 | ok |

#### floating action button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `.fab-label --text-color` | `#17335c` | `.fab-button --surface-card` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-label --text-color` | `#17335c` | `.fab-button:hover --surface-hover` | `#ebf0f7` | **11.02:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-button --fab-edge` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#64809f` | `--surface-section` | `#eef2f8` | **3.64:1** | 1.4.11 | 3:1 | ok |

#### severity button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-from` | `#c23540` | **5.42:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-to` | `#c23540` | **5.42:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-from` | `#146c4c` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-to` | `#146c4c` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-from` | `#1273a8` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-to` | `#1273a8` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#0e2a52` | `--gradient-warn-from` | `#ffd23f` | **9.88:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#0e2a52` | `--gradient-warn-to` | `#ffd23f` | **9.88:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-from` | `#47617f` | **6.39:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-to` | `#47617f` | **6.39:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-from` | `#a4470c` | **6.03:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-to` | `#a4470c` | **6.03:1** | 1.4.3 | 4.5:1 | ok |

#### outlined severity

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--outlined-danger-fg` | `#c23540` | `--surface-card` | `#ffffff` | **5.42:1** | 1.4.3 | 4.5:1 | ok |
| `success.--outlined-success-fg` | `#146c4c` | `--surface-card` | `#ffffff` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `info.--outlined-info-fg` | `#1273a8` | `--surface-card` | `#ffffff` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--outlined-warn-fg` | `#916f00` | `--surface-card` | `#ffffff` | **4.69:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--outlined-secondary-fg` | `#47617f` | `--surface-card` | `#ffffff` | **6.39:1** | 1.4.3 | 4.5:1 | ok |
| `help.--outlined-help-fg` | `#a4470c` | `--surface-card` | `#ffffff` | **6.03:1** | 1.4.3 | 4.5:1 | ok |

#### severity button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-from @brightness(0.92)` | `#b2313b` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-to @brightness(0.92)` | `#b2313b` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-from @brightness(0.92)` | `#126346` | **6.08:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-to @brightness(0.92)` | `#126346` | **6.08:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-from @brightness(0.92)` | `#116a9b` | **4.95:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-to @brightness(0.92)` | `#116a9b` | **4.95:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#0f2e5a` | `--gradient-warn-from @brightness(1.1)` | `#ffe745` | **10.76:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#0f2e5a` | `--gradient-warn-to @brightness(1.1)` | `#ffe745` | **10.76:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-from @brightness(0.92)` | `#415975` | **6.05:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-to @brightness(0.92)` | `#415975` | **6.05:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(0.92)` | `#ebebeb` | `--gradient-help-from @brightness(0.92)` | `#97410b` | **5.73:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(0.92)` | `#ebebeb` | `--gradient-help-to @brightness(0.92)` | `#97410b` | **5.73:1** | 1.4.3 | 4.5:1 | ok |

#### brand foreground

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg` | `#c2410c` | `--surface-ground` | `#f6f8fb` | **4.87:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-fg` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#a16207` | `--surface-ground` | `#f6f8fb` | **4.63:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#a16207` | `--surface-card` | `#ffffff` | **4.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#cd1d1d` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#946708` | `--surface-ground` | `#f6f8fb` | **4.70:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#946708` | `--surface-card` | `#ffffff` | **5.00:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#a8124e` | `--surface-ground` | `#f6f8fb` | **6.90:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#b9267b` | `--surface-ground` | `#f6f8fb` | **5.44:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#b9267b` | `--surface-card` | `#ffffff` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#157836` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#5d7307` | `--surface-ground` | `#f6f8fb` | **5.03:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#5d7307` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#0a756d` | `--surface-ground` | `#f6f8fb` | **5.22:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#1f63ed` | `--surface-ground` | `#f6f8fb` | **4.85:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#1f63ed` | `--surface-card` | `#ffffff` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#077288` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#167e4a` | `--surface-ground` | `#f6f8fb` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#167e4a` | `--surface-card` | `#ffffff` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#3346d3` | `--surface-ground` | `#f6f8fb` | **6.67:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#0369a1` | `--surface-ground` | `#f6f8fb` | **5.58:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#0369a1` | `--surface-card` | `#ffffff` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#b8147f` | `--surface-ground` | `#f6f8fb` | **5.73:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#d0174a` | `--surface-ground` | `#f6f8fb` | **5.06:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#d0174a` | `--surface-card` | `#ffffff` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#776558` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#a05e1c` | `--surface-ground` | `#f6f8fb` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#a05e1c` | `--surface-card` | `#ffffff` | **5.11:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#0f172a` | `--surface-ground` | `#f6f8fb` | **16.78:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#1e293b` | `--surface-ground` | `#f6f8fb` | **13.75:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#1e293b` | `--surface-card` | `#ffffff` | **14.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--primary-color` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--gradient-accent-color` | `#a16207` | **4.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--primary-color` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--gradient-accent-color` | `#946708` | **5.00:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--primary-color` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--gradient-accent-color` | `#b9267b` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--primary-color` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--gradient-accent-color` | `#5d7307` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--primary-color` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--gradient-accent-color` | `#1f63ed` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--primary-color` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--gradient-accent-color` | `#167e4a` | **5.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--primary-color` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--gradient-accent-color` | `#0369a1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--primary-color` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--gradient-accent-color` | `#d0174a` | **5.38:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--primary-color` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--gradient-accent-color` | `#a05e1c` | **5.11:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#ffffff` | `contrast.--primary-color` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#ffffff` | `contrast.--gradient-accent-color` | `#1e293b` | **14.63:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--primary-color @brightness(0.92)` | `#b23c0b` | **4.97:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--gradient-accent-color @brightness(0.92)` | `#945a06` | **4.73:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--primary-color @brightness(0.92)` | `#bd1b1b` | **5.28:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--gradient-accent-color @brightness(0.92)` | `#885f07` | **4.78:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--primary-color @brightness(0.92)` | `#9b1148` | **6.86:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--gradient-accent-color @brightness(0.92)` | `#aa2371` | **5.53:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--primary-color @brightness(0.92)` | `#136e32` | **5.33:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--gradient-accent-color @brightness(0.92)` | `#566a06` | **5.09:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--primary-color @brightness(0.92)` | `#096c64` | **5.27:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--gradient-accent-color @brightness(0.92)` | `#1d5bda` | **4.95:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--primary-color @brightness(0.92)` | `#06697d` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--gradient-accent-color @brightness(0.92)` | `#147444` | **4.88:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--primary-color @brightness(0.92)` | `#2f40c2` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--gradient-accent-color @brightness(0.92)` | `#036194` | **5.61:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--primary-color @brightness(0.92)` | `#a91275` | **5.81:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--gradient-accent-color @brightness(0.92)` | `#bf1544` | **5.17:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--primary-color @brightness(0.92)` | `#6d5d51` | **5.28:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--gradient-accent-color @brightness(0.92)` | `#93561a` | **4.91:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#ffffff` | `contrast.--primary-color @brightness(1.1)` | `#11192e` | **17.47:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#ffffff` | `contrast.--gradient-accent-color @brightness(1.1)` | `#212d41` | **13.85:1** | 1.4.3 | 4.5:1 | ok |

#### accent surface

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--accent-on-surface` | `#8f0e00` | `sunset.--accent-surface` | `#ffffd8` | **9.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--accent-on-surface` | `#9a0000` | `fire.--accent-surface` | `#ffe9e9` | **7.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--accent-on-surface` | `#75001b` | `coral.--accent-surface` | `#ffdeff` | **9.67:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--accent-on-surface` | `#004503` | `forest.--accent-surface` | `#e1ffff` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--accent-on-surface` | `#00423a` | `ocean.--accent-surface` | `#d6ffff` | **10.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--accent-on-surface` | `#003f55` | `aurora.--accent-surface` | `#d3ffff` | **10.59:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--accent-on-surface` | `#0013a0` | `twilight.--accent-surface` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--accent-on-surface` | `#85004c` | `mystic.--accent-surface` | `#ffe0ff` | **8.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--accent-on-surface` | `#443225` | `stone.--accent-surface` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--accent-on-surface` | `#000000` | `contrast.--accent-surface` | `#dbe3f6` | **16.33:1** | 1.4.3 | 4.5:1 | ok |

#### checkbox & radiobutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `checkbox.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `checkbox.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#c2410c` | `--surface-ground` | `#f6f8fb` | **4.87:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.checkbox.icon.checked.color` | `#ffffff` | `sunset.checkbox.checked.background` | `#c2410c` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#cd1d1d` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.checkbox.icon.checked.color` | `#ffffff` | `fire.checkbox.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#a8124e` | `--surface-ground` | `#f6f8fb` | **6.90:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.checkbox.icon.checked.color` | `#ffffff` | `coral.checkbox.checked.background` | `#a8124e` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#157836` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.checkbox.icon.checked.color` | `#ffffff` | `forest.checkbox.checked.background` | `#157836` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#0a756d` | `--surface-ground` | `#f6f8fb` | **5.22:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.checkbox.icon.checked.color` | `#ffffff` | `ocean.checkbox.checked.background` | `#0a756d` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#077288` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.checkbox.icon.checked.color` | `#ffffff` | `aurora.checkbox.checked.background` | `#077288` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#3346d3` | `--surface-ground` | `#f6f8fb` | **6.67:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.checkbox.icon.checked.color` | `#ffffff` | `twilight.checkbox.checked.background` | `#3346d3` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#b8147f` | `--surface-ground` | `#f6f8fb` | **5.73:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.checkbox.icon.checked.color` | `#ffffff` | `mystic.checkbox.checked.background` | `#b8147f` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#776558` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.checkbox.icon.checked.color` | `#ffffff` | `stone.checkbox.checked.background` | `#776558` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#0f172a` | `--surface-ground` | `#f6f8fb` | **16.78:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.checkbox.icon.checked.color` | `#ffffff` | `contrast.checkbox.checked.background` | `#0f172a` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### toggleswitch

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `toggleswitch.background` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.background` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.handle.background` | `#ffffff` | `toggleswitch.background` | `#64809f` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `sunset.toggleswitch.handle.checked.background` | `#ffffff` | `sunset.toggleswitch.checked.background` | `#c2410c` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.toggleswitch.handle.checked.background` | `#ffffff` | `fire.toggleswitch.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.toggleswitch.handle.checked.background` | `#ffffff` | `coral.toggleswitch.checked.background` | `#a8124e` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.toggleswitch.handle.checked.background` | `#ffffff` | `forest.toggleswitch.checked.background` | `#157836` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.toggleswitch.handle.checked.background` | `#ffffff` | `ocean.toggleswitch.checked.background` | `#0a756d` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.toggleswitch.handle.checked.background` | `#ffffff` | `aurora.toggleswitch.checked.background` | `#077288` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.toggleswitch.handle.checked.background` | `#ffffff` | `twilight.toggleswitch.checked.background` | `#3346d3` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.toggleswitch.handle.checked.background` | `#ffffff` | `mystic.toggleswitch.checked.background` | `#b8147f` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.toggleswitch.handle.checked.background` | `#ffffff` | `stone.toggleswitch.checked.background` | `#776558` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.toggleswitch.handle.checked.background` | `#ffffff` | `contrast.toggleswitch.checked.background` | `#0f172a` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### form field edge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#64809f` | `select.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#64809f` | `inputtext.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#64809f` | `textarea.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#64809f` | `multiselect.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#64809f` | `listbox.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#64809f` | `autocomplete.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#64809f` | `autocomplete.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#64809f` | `datepicker.dropdown.background` | `#f1f5f9` | **3.74:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#64809f` | `inputtext.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#64809f` | `cascadeselect.background` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.color` | `#526f8f` | `inputtext.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `--surface-ground` | `#f6f8fb` | **6.08:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#b91c1c` | `inputtext.background` | `#ffffff` | **6.47:1** | 1.4.11 | 3:1 | ok |

#### form field text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `inputtext.color` | `#334155` | `inputtext.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `inputtext.placeholder.color` | `#64748b` | `inputtext.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `select.color` | `#17335c` | `select.background` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `select.placeholder.color` | `#64748b` | `select.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.color` | `#334155` | `textarea.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.placeholder.color` | `#64748b` | `textarea.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.color` | `#17335c` | `cascadeselect.background` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.placeholder.color` | `#64748b` | `cascadeselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.color` | `#334155` | `multiselect.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.placeholder.color` | `#64748b` | `multiselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.color` | `#334155` | `treeselect.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.placeholder.color` | `#64748b` | `treeselect.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.color` | `#334155` | `autocomplete.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.placeholder.color` | `#64748b` | `autocomplete.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |

#### form field icon

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.dropdown.color` | `#526f8f` | `select.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `multiselect.dropdown.color` | `#526f8f` | `multiselect.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.dropdown.color` | `#526f8f` | `cascadeselect.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `treeselect.dropdown.color` | `#526f8f` | `treeselect.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `password.icon.color` | `#526f8f` | `inputtext.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.color` | `#475569` | `autocomplete.dropdown.background` | `#f1f5f9` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.color` | `#475569` | `datepicker.dropdown.background` | `#f1f5f9` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `inputgroup.addon.color` | `#526f8f` | `inputgroup.addon.background` | `#ffffff` | **5.21:1** | 1.4.3 | 4.5:1 | ok |

#### float label

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `floatlabel.color` | `#526f8f` | `inputtext.background` | `#ffffff` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.active.color` | `#526f8f` | `floatlabel.on.active.background` | `#ffffff` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.focus.color` | `#17335c` | `floatlabel.on.active.background` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.invalid.color` | `#b91c1c` | `floatlabel.on.active.background` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.color` | `#526f8f` | `inputtext.background` | `#ffffff` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.focus.color` | `#17335c` | `inputtext.background` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.invalid.color` | `#b91c1c` | `inputtext.background` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.on.active.background` | `#ffffff` | `inputtext.background` | `#ffffff` | **1.00:1** | none | — | info |

#### tag

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `tag.secondary.color` | `#475569` | `tag.secondary.background` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `tag.success.color` | `#15803d` | `tag.success.background` | `#dcfce7` | **4.57:1** | 1.4.3 | 4.5:1 | ok |
| `tag.info.color` | `#0369a1` | `tag.info.background` | `#e0f2fe` | **5.17:1** | 1.4.3 | 4.5:1 | ok |
| `tag.warn.color` | `#c2410c` | `tag.warn.background` | `#ffedd5` | **4.52:1** | 1.4.3 | 4.5:1 | ok |
| `tag.danger.color` | `#b91c1c` | `tag.danger.background` | `#fee2e2` | **5.30:1** | 1.4.3 | 4.5:1 | ok |
| `tag.contrast.color` | `#ffffff` | `tag.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#8f0e00` | `sunset.tag.primary.background` | `#ffffd8` | **9.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#9a0000` | `fire.tag.primary.background` | `#ffe9e9` | **7.62:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#75001b` | `coral.tag.primary.background` | `#ffdeff` | **9.67:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#004503` | `forest.tag.primary.background` | `#e1ffff` | **10.77:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#00423a` | `ocean.tag.primary.background` | `#d6ffff` | **10.65:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#003f55` | `aurora.tag.primary.background` | `#d3ffff` | **10.59:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#0013a0` | `twilight.tag.primary.background` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#85004c` | `mystic.tag.primary.background` | `#ffe0ff` | **8.26:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#443225` | `stone.tag.primary.background` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#000000` | `contrast.tag.primary.background` | `#dbe3f6` | **16.33:1** | 1.4.3 | 4.5:1 | ok |

#### chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `chip.color` | `#1e293b` | `chip.background` | `#f1f5f9` | **13.35:1** | 1.4.3 | 4.5:1 | ok |
| `chip.remove.icon.color` | `#1e293b` | `chip.background` | `#f1f5f9` | **13.35:1** | 1.4.11 | 3:1 | ok |

#### dialog

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `dialog.color` | `#334155` | `dialog.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#526f8f` | `dialog.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |

#### skeleton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `skeleton.background` | `#e2e8f0` | `--surface-ground` | `#f6f8fb` | **1.16:1** | none | — | info |
| `skeleton.background` | `#e2e8f0` | `--surface-card` | `#ffffff` | **1.23:1** | none | — | info |

#### progressbar & slider

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `slider.track.background` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#e2e8f0` | `--surface-ground` | `#f6f8fb` | **1.16:1** | none | — | info |
| `slider.track.background` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#e2e8f0` | `--surface-card` | `#ffffff` | **1.23:1** | none | — | info |
| `sunset.progressbar.value.background` | `#c2410c` | `progressbar.background` | `#e2e8f0` | **4.20:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressbar.label.color` | `#ffffff` | `sunset.progressbar.value.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.progressbar.value.background` | `#cd1d1d` | `progressbar.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `fire.progressbar.label.color` | `#ffffff` | `fire.progressbar.value.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.progressbar.value.background` | `#a8124e` | `progressbar.background` | `#e2e8f0` | **5.95:1** | 1.4.11 | 3:1 | ok |
| `coral.progressbar.label.color` | `#ffffff` | `coral.progressbar.value.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.progressbar.value.background` | `#157836` | `progressbar.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `forest.progressbar.label.color` | `#ffffff` | `forest.progressbar.value.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.progressbar.value.background` | `#0a756d` | `progressbar.background` | `#e2e8f0` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressbar.label.color` | `#ffffff` | `ocean.progressbar.value.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.progressbar.value.background` | `#077288` | `progressbar.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressbar.label.color` | `#ffffff` | `aurora.progressbar.value.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.progressbar.value.background` | `#3346d3` | `progressbar.background` | `#e2e8f0` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressbar.label.color` | `#ffffff` | `twilight.progressbar.value.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.progressbar.value.background` | `#b8147f` | `progressbar.background` | `#e2e8f0` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressbar.label.color` | `#ffffff` | `mystic.progressbar.value.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.progressbar.value.background` | `#776558` | `progressbar.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `stone.progressbar.label.color` | `#ffffff` | `stone.progressbar.value.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.progressbar.value.background` | `#0f172a` | `progressbar.background` | `#e2e8f0` | **14.48:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressbar.label.color` | `#ffffff` | `contrast.progressbar.value.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### togglebutton & selectbutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `togglebutton.color` | `#526f8f` | `togglebutton.background` | `#eef2f8` | **4.64:1** | 1.4.3 | 4.5:1 | ok |
| `togglebutton.hover.color` | `#17335c` | `togglebutton.hover.background` | `#ebf0f7` | **11.02:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.togglebutton.content.checked.background` | `#c2410c` | `togglebutton.background` | `#eef2f8` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `sunset.togglebutton.content.checked.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.togglebutton.content.checked.background` | `#cd1d1d` | `togglebutton.background` | `#eef2f8` | **4.93:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `fire.togglebutton.content.checked.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.togglebutton.content.checked.background` | `#a8124e` | `togglebutton.background` | `#eef2f8` | **6.53:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `coral.togglebutton.content.checked.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.togglebutton.content.checked.background` | `#157836` | `togglebutton.background` | `#eef2f8` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `forest.togglebutton.content.checked.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.togglebutton.content.checked.background` | `#0a756d` | `togglebutton.background` | `#eef2f8` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `ocean.togglebutton.content.checked.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.togglebutton.content.checked.background` | `#077288` | `togglebutton.background` | `#eef2f8` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `aurora.togglebutton.content.checked.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.togglebutton.content.checked.background` | `#3346d3` | `togglebutton.background` | `#eef2f8` | **6.32:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `twilight.togglebutton.content.checked.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.togglebutton.content.checked.background` | `#b8147f` | `togglebutton.background` | `#eef2f8` | **5.43:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `mystic.togglebutton.content.checked.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.togglebutton.content.checked.background` | `#776558` | `togglebutton.background` | `#eef2f8` | **4.94:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `stone.togglebutton.content.checked.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.togglebutton.content.checked.background` | `#0f172a` | `togglebutton.background` | `#eef2f8` | **15.89:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#ffffff` | `contrast.togglebutton.content.checked.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### menu focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `menubar.submenu.icon.color` | `#526f8f` | `menubar.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `menubar.submenu.icon.color` | `#526f8f` | `menubar.item.focus.background` | `#f1f5f9` | **4.76:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#526f8f` | `menubar.background` | `#ffffff` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#526f8f` | `menubar.item.focus.background` | `#f1f5f9` | **4.76:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.focus.background` | `#f1f5f9` | `menubar.background` | `#ffffff` | **1.10:1** | none | — | info |
| `sunset.--primary-color-fg (focus ring)` | `#c2410c` | `menubar.item.focus.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (focus ring)` | `#c2410c` | `menubar.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#cd1d1d` | `menubar.item.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#cd1d1d` | `menubar.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#a8124e` | `menubar.item.focus.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#a8124e` | `menubar.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#157836` | `menubar.item.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#157836` | `menubar.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#0a756d` | `menubar.item.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#0a756d` | `menubar.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#077288` | `menubar.item.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#077288` | `menubar.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#3346d3` | `menubar.item.focus.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#3346d3` | `menubar.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#b8147f` | `menubar.item.focus.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#b8147f` | `menubar.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#776558` | `menubar.item.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#776558` | `menubar.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#0f172a` | `menubar.item.focus.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#0f172a` | `menubar.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### option list focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.option.focus.background` | `#f1f5f9` | `select.overlay.background` | `#ffffff` | **1.10:1** | none | — | info |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `select.overlay.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `select.option.focus.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `sunset.select.option.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#c2410c` | `sunset.select.option.selected.focus.background` | `#ffffd8` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `select.overlay.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `select.option.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `fire.select.option.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#cd1d1d` | `fire.select.option.selected.focus.background` | `#ffe9e9` | **4.77:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `select.overlay.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `select.option.focus.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `coral.select.option.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#a8124e` | `coral.select.option.selected.focus.background` | `#ffdeff` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `select.overlay.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `select.option.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `forest.select.option.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#157836` | `forest.select.option.selected.focus.background` | `#e1ffff` | **5.29:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `select.overlay.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `select.option.focus.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `ocean.select.option.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#0a756d` | `ocean.select.option.selected.focus.background` | `#d6ffff` | **5.19:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `select.overlay.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `select.option.focus.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `aurora.select.option.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#077288` | `aurora.select.option.selected.focus.background` | `#d3ffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `select.overlay.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `select.option.focus.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `twilight.select.option.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#3346d3` | `twilight.select.option.selected.focus.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `select.overlay.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `select.option.focus.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `mystic.select.option.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#b8147f` | `mystic.select.option.selected.focus.background` | `#ffe0ff` | **5.04:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `select.overlay.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `select.option.focus.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `stone.select.option.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#776558` | `stone.select.option.selected.focus.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `select.overlay.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `select.option.focus.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `contrast.select.option.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#0f172a` | `contrast.select.option.selected.focus.background` | `#dbe3f6` | **13.88:1** | 1.4.11 | 3:1 | ok |

#### panel outline

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-outline` | `#64809f` | `--surface-ground` | `#f6f8fb` | **3.85:1** | 1.4.11 | 3:1 | ok |
| `--style-outline` | `#64809f` | `--surface-card` | `#ffffff` | **4.09:1** | 1.4.11 | 3:1 | ok |
| `popover.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `drawer.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |

#### content panel

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `text.color` | `#334155` | `content.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |

#### table & paginator

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `datatable.row.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `paginator.background` | `#ffffff` | `--surface-card` | `#ffffff` | **1.00:1** | none | — | info |
| `datatable.row.color` | `#334155` | `datatable.row.background` | `#ffffff` | **10.35:1** | 1.4.3 | 4.5:1 | ok |
| `paginator.nav.button.color` | `#64748b` | `paginator.background` | `#ffffff` | **4.76:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.datatable.row.selected.color` | `#8f0e00` | `sunset.datatable.row.selected.background` | `#fffff2` | **9.34:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.color` | `#ffffff` | `sunset.paginator.nav.button.selected.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.background` | `#c2410c` | `paginator.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.datatable.row.selected.background` | `#fffff2` | `datatable.row.background` | `#ffffff` | **1.01:1** | none | — | info |
| `sunset.--primary-color-fg (selected-row bar)` | `#c2410c` | `sunset.datatable.row.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (selected-row bar)` | `#c2410c` | `datatable.row.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.color` | `#9a0000` | `fire.datatable.row.selected.background` | `#ffffff` | **8.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.color` | `#ffffff` | `fire.paginator.nav.button.selected.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.background` | `#cd1d1d` | `paginator.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `fire.--primary-color-fg (selected-row bar)` | `#cd1d1d` | `fire.datatable.row.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (selected-row bar)` | `#cd1d1d` | `datatable.row.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.color` | `#75001b` | `coral.datatable.row.selected.background` | `#fff8ff` | **11.35:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.color` | `#ffffff` | `coral.paginator.nav.button.selected.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.background` | `#a8124e` | `paginator.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.background` | `#fff8ff` | `datatable.row.background` | `#ffffff` | **1.04:1** | none | — | info |
| `coral.--primary-color-fg (selected-row bar)` | `#a8124e` | `coral.datatable.row.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (selected-row bar)` | `#a8124e` | `datatable.row.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.color` | `#004503` | `forest.datatable.row.selected.background` | `#fbffff` | **11.25:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.color` | `#ffffff` | `forest.paginator.nav.button.selected.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.background` | `#157836` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.background` | `#fbffff` | `datatable.row.background` | `#ffffff` | **1.01:1** | none | — | info |
| `forest.--primary-color-fg (selected-row bar)` | `#157836` | `forest.datatable.row.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (selected-row bar)` | `#157836` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.color` | `#00423a` | `ocean.datatable.row.selected.background` | `#f0ffff` | **11.11:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.color` | `#ffffff` | `ocean.paginator.nav.button.selected.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.background` | `#0a756d` | `paginator.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.background` | `#f0ffff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `ocean.--primary-color-fg (selected-row bar)` | `#0a756d` | `ocean.datatable.row.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (selected-row bar)` | `#0a756d` | `datatable.row.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.color` | `#003f55` | `aurora.datatable.row.selected.background` | `#edffff` | **11.05:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.color` | `#ffffff` | `aurora.paginator.nav.button.selected.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.background` | `#077288` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.background` | `#edffff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `aurora.--primary-color-fg (selected-row bar)` | `#077288` | `aurora.datatable.row.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (selected-row bar)` | `#077288` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.color` | `#0013a0` | `twilight.datatable.row.selected.background` | `#ffffff` | **13.12:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.color` | `#ffffff` | `twilight.paginator.nav.button.selected.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.background` | `#3346d3` | `paginator.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `twilight.--primary-color-fg (selected-row bar)` | `#3346d3` | `twilight.datatable.row.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (selected-row bar)` | `#3346d3` | `datatable.row.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.color` | `#85004c` | `mystic.datatable.row.selected.background` | `#fffaff` | **9.69:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.color` | `#ffffff` | `mystic.paginator.nav.button.selected.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.background` | `#b8147f` | `paginator.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.background` | `#fffaff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `mystic.--primary-color-fg (selected-row bar)` | `#b8147f` | `mystic.datatable.row.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (selected-row bar)` | `#b8147f` | `datatable.row.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.color` | `#443225` | `stone.datatable.row.selected.background` | `#ffffff` | **12.15:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.color` | `#ffffff` | `stone.paginator.nav.button.selected.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.background` | `#776558` | `paginator.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.background` | `#ffffff` | `datatable.row.background` | `#ffffff` | **1.00:1** | none | — | info |
| `stone.--primary-color-fg (selected-row bar)` | `#776558` | `stone.datatable.row.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (selected-row bar)` | `#776558` | `datatable.row.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.color` | `#000000` | `contrast.datatable.row.selected.background` | `#f5fdff` | **20.38:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.color` | `#ffffff` | `contrast.paginator.nav.button.selected.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.background` | `#0f172a` | `paginator.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.background` | `#f5fdff` | `datatable.row.background` | `#ffffff` | **1.03:1** | none | — | info |
| `contrast.--primary-color-fg (selected-row bar)` | `#0f172a` | `contrast.datatable.row.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (selected-row bar)` | `#0f172a` | `datatable.row.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |

#### badge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `badge.secondary.color` | `#475569` | `badge.secondary.background` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `badge.success.color` | `#ffffff` | `badge.success.background` | `#15803d` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `badge.info.color` | `#ffffff` | `badge.info.background` | `#1d4ed8` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `badge.warn.color` | `#ffffff` | `badge.warn.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `badge.danger.color` | `#ffffff` | `badge.danger.background` | `#b91c1c` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `badge.contrast.color` | `#ffffff` | `badge.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.badge.primary.color` | `#ffffff` | `sunset.badge.primary.background` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.badge.primary.color` | `#ffffff` | `fire.badge.primary.background` | `#cd1d1d` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.badge.primary.color` | `#ffffff` | `coral.badge.primary.background` | `#a8124e` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.badge.primary.color` | `#ffffff` | `forest.badge.primary.background` | `#157836` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.badge.primary.color` | `#ffffff` | `ocean.badge.primary.background` | `#0a756d` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.badge.primary.color` | `#ffffff` | `aurora.badge.primary.background` | `#077288` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.badge.primary.color` | `#ffffff` | `twilight.badge.primary.background` | `#3346d3` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.badge.primary.color` | `#ffffff` | `mystic.badge.primary.background` | `#b8147f` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.badge.primary.color` | `#ffffff` | `stone.badge.primary.background` | `#776558` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.badge.primary.color` | `#ffffff` | `contrast.badge.primary.background` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### message & toast

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `message.info.color` | `#1d4ed8` | `message.info.background over --surface-ground` | `#eff6ff` | **6.16:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#1d4ed8` | `--surface-ground` | `#f6f8fb` | **6.30:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#1d4ed8` | `toast.info.background over --surface-ground` | `#eff6ff` | **6.16:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#334155` | `toast.info.background over --surface-ground` | `#eff6ff` | **9.51:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.color` | `#1d4ed8` | `message.info.background over --surface-card` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#1d4ed8` | `toast.info.background over --surface-card` | `#f0f6ff` | **6.17:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#334155` | `toast.info.background over --surface-card` | `#f0f6ff` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#15803d` | `message.success.background over --surface-ground` | `#f0fdf4` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#15803d` | `--surface-ground` | `#f6f8fb` | **4.71:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#15803d` | `toast.success.background over --surface-ground` | `#f0fdf4` | **4.79:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#334155` | `toast.success.background over --surface-ground` | `#f0fdf4` | **9.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#15803d` | `message.success.background over --surface-card` | `#f1fdf5` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#15803d` | `toast.success.background over --surface-card` | `#f1fdf5` | **4.80:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#334155` | `toast.success.background over --surface-card` | `#f1fdf5` | **9.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#c2410c` | `message.warn.background over --surface-ground` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#c2410c` | `--surface-ground` | `#f6f8fb` | **4.87:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#c2410c` | `toast.warn.background over --surface-ground` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#334155` | `toast.warn.background over --surface-ground` | `#fefce9` | **10.02:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#c2410c` | `message.warn.background over --surface-card` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#c2410c` | `toast.warn.background over --surface-card` | `#fefce9` | **5.01:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#334155` | `toast.warn.background over --surface-card` | `#fefce9` | **10.02:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#b91c1c` | `message.error.background over --surface-ground` | `#fef2f2` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#b91c1c` | `--surface-ground` | `#f6f8fb` | **6.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#b91c1c` | `toast.error.background over --surface-ground` | `#fef2f2` | **5.91:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#334155` | `toast.error.background over --surface-ground` | `#fef2f2` | **9.47:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#b91c1c` | `message.error.background over --surface-card` | `#fef3f3` | **5.96:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#b91c1c` | `toast.error.background over --surface-card` | `#fef3f3` | **5.96:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#334155` | `toast.error.background over --surface-card` | `#fef3f3` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#475569` | `message.secondary.background over --surface-ground` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#526f8f` | `--surface-ground` | `#f6f8fb` | **4.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#475569` | `toast.secondary.background over --surface-ground` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#334155` | `toast.secondary.background over --surface-ground` | `#f1f5f9` | **9.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#475569` | `message.secondary.background over --surface-card` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#526f8f` | `--surface-card` | `#ffffff` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#475569` | `toast.secondary.background over --surface-card` | `#f1f5f9` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#334155` | `toast.secondary.background over --surface-card` | `#f1f5f9` | **9.45:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#f8fafc` | `message.contrast.background over --surface-ground` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#17335c` | `--surface-ground` | `#f6f8fb` | **11.86:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#f8fafc` | `toast.contrast.background over --surface-ground` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#ffffff` | `toast.contrast.background over --surface-ground` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#f8fafc` | `message.contrast.background over --surface-card` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#17335c` | `--surface-card` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#f8fafc` | `toast.contrast.background over --surface-card` | `#0f172a` | **17.06:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#ffffff` | `toast.contrast.background over --surface-card` | `#0f172a` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### text & link button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.text.secondary.color` | `#526f8f` | `--surface-ground` | `#f6f8fb` | **4.90:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#526f8f` | `--surface-card` | `#ffffff` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#15803d` | `--surface-ground` | `#f6f8fb` | **4.71:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#15803d` | `--surface-card` | `#ffffff` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#1d4ed8` | `--surface-ground` | `#f6f8fb` | **6.30:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#1d4ed8` | `--surface-card` | `#ffffff` | **6.70:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#c2410c` | `--surface-ground` | `#f6f8fb` | **4.87:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#0e7490` | `--surface-ground` | `#f6f8fb` | **5.04:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#0e7490` | `--surface-card` | `#ffffff` | **5.36:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#b91c1c` | `--surface-ground` | `#f6f8fb` | **6.08:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#b91c1c` | `--surface-card` | `#ffffff` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#17335c` | `--surface-ground` | `#f6f8fb` | **11.86:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#17335c` | `--surface-card` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#17335c` | `--surface-ground` | `#f6f8fb` | **11.86:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#17335c` | `--surface-card` | `#ffffff` | **12.62:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#c2410c` | `--surface-ground` | `#f6f8fb` | **4.87:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#cd1d1d` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#a8124e` | `--surface-ground` | `#f6f8fb` | **6.90:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#157836` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#0a756d` | `--surface-ground` | `#f6f8fb` | **5.22:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#077288` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#3346d3` | `--surface-ground` | `#f6f8fb` | **6.67:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#b8147f` | `--surface-ground` | `#f6f8fb` | **5.73:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#776558` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#0f172a` | `--surface-ground` | `#f6f8fb` | **16.78:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (contrast)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.contrast.color` | `#ffffff` | `button.contrast.background` | `#020617` | **20.17:1** | 1.4.3 | 4.5:1 | ok |

#### avatar

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `avatar.color` | `#334155` | `avatar.background` | `#e2e8f0` | **8.40:1** | 1.4.3 | 4.5:1 | ok |

#### image preview

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `image.action.color` | `#f8fafc` | `image.toolbar.background over mask.background over --surface-ground` | `#3b3c3c` | **10.58:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-ground` | `#4f5050` | **8.09:1** | 1.4.11 | 3:1 | ok |
| `image.action.color` | `#f8fafc` | `image.toolbar.background over mask.background over --surface-card` | `#3d3d3d` | **10.38:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-card` | `#505050` | **8.06:1** | 1.4.11 | 3:1 | ok |

#### focus ring

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-ground` | `#f6f8fb` | **4.87:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `--surface-section` | `#eef2f8` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `dialog.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `chip.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#c2410c` | `paginator.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `datatable.row.background` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `datatable.row.hover.background` | `#f1f5f9` | **4.73:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `sunset.datatable.row.selected.background` | `#fffff2` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#c2410c` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.20:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `--surface-section` | `#eef2f8` | **4.93:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `dialog.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `chip.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#cd1d1d` | `paginator.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `datatable.row.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `datatable.row.hover.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `fire.datatable.row.selected.background` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#cd1d1d` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-ground` | `#f6f8fb` | **6.90:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `--surface-section` | `#eef2f8` | **6.53:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `dialog.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `chip.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#a8124e` | `paginator.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `datatable.row.background` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `datatable.row.hover.background` | `#f1f5f9` | **6.70:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `coral.datatable.row.selected.background` | `#fff8ff` | **7.03:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#a8124e` | `autocomplete.chip.focus.background` | `#e2e8f0` | **5.95:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `--surface-section` | `#eef2f8` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `dialog.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `chip.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#157836` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `datatable.row.hover.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `forest.datatable.row.selected.background` | `#fbffff` | **5.53:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#157836` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-ground` | `#f6f8fb` | **5.22:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `--surface-section` | `#eef2f8` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `dialog.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `chip.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#0a756d` | `paginator.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `datatable.row.background` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `datatable.row.hover.background` | `#f1f5f9` | **5.07:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `ocean.datatable.row.selected.background` | `#f0ffff` | **5.41:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#0a756d` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `--surface-section` | `#eef2f8` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `dialog.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `chip.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#077288` | `paginator.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `datatable.row.background` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `datatable.row.hover.background` | `#f1f5f9` | **5.08:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `aurora.datatable.row.selected.background` | `#edffff` | **5.40:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#077288` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-ground` | `#f6f8fb` | **6.67:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `--surface-section` | `#eef2f8` | **6.32:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `dialog.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `chip.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#3346d3` | `paginator.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `datatable.row.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `datatable.row.hover.background` | `#f1f5f9` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `twilight.datatable.row.selected.background` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#3346d3` | `autocomplete.chip.focus.background` | `#e2e8f0` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-ground` | `#f6f8fb` | **5.73:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `--surface-section` | `#eef2f8` | **5.43:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `dialog.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `chip.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#b8147f` | `paginator.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `datatable.row.background` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `datatable.row.hover.background` | `#f1f5f9` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `mystic.datatable.row.selected.background` | `#fffaff` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#b8147f` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `--surface-section` | `#eef2f8` | **4.94:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `dialog.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `chip.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#776558` | `paginator.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `datatable.row.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `datatable.row.hover.background` | `#f1f5f9` | **5.06:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `stone.datatable.row.selected.background` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#776558` | `autocomplete.chip.focus.background` | `#e2e8f0` | **4.50:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-ground` | `#f6f8fb` | **16.78:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `--surface-section` | `#eef2f8` | **15.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `dialog.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `chip.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#0f172a` | `paginator.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `datatable.row.background` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `datatable.row.hover.background` | `#f1f5f9` | **16.30:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `contrast.datatable.row.selected.background` | `#f5fdff` | **17.32:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#0f172a` | `autocomplete.chip.focus.background` | `#e2e8f0` | **14.48:1** | 1.4.11 | 3:1 | ok |

#### progress spinner

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-ground` | `#f6f8fb` | **4.87:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-card` | `#ffffff` | **5.18:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#c2410c` | `--surface-section` | `#eef2f8` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-card` | `#ffffff` | **5.54:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#cd1d1d` | `--surface-section` | `#eef2f8` | **4.93:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-ground` | `#f6f8fb` | **6.90:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-card` | `#ffffff` | **7.34:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#a8124e` | `--surface-section` | `#eef2f8` | **6.53:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#157836` | `--surface-section` | `#eef2f8` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-ground` | `#f6f8fb` | **5.22:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-card` | `#ffffff` | **5.56:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#0a756d` | `--surface-section` | `#eef2f8` | **4.95:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-ground` | `#f6f8fb` | **5.23:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-card` | `#ffffff` | **5.57:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#077288` | `--surface-section` | `#eef2f8` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-ground` | `#f6f8fb` | **6.67:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-card` | `#ffffff` | **7.10:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#3346d3` | `--surface-section` | `#eef2f8` | **6.32:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-ground` | `#f6f8fb` | **5.73:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-card` | `#ffffff` | **6.10:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#b8147f` | `--surface-section` | `#eef2f8` | **5.43:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-ground` | `#f6f8fb` | **5.21:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-card` | `#ffffff` | **5.55:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#776558` | `--surface-section` | `#eef2f8` | **4.94:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-ground` | `#f6f8fb` | **16.78:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-card` | `#ffffff` | **17.85:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#0f172a` | `--surface-section` | `#eef2f8` | **15.89:1** | 1.4.11 | 3:1 | ok |

### dark mode

#### body text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--text-color` | `#e8f0fb` | `--surface-ground` | `#0e2a52` | **12.43:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#9fb5d6` | `--surface-ground` | `#0e2a52` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#e8f0fb` | `--surface-card` | `#10305c` | **11.43:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#9fb5d6` | `--surface-card` | `#10305c` | **6.29:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#e8f0fb` | `--surface-section` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#9fb5d6` | `--surface-section` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color` | `#e8f0fb` | `--surface-hover` | `#1a4179` | **8.81:1** | 1.4.3 | 4.5:1 | ok |
| `--text-color-secondary` | `#9fb5d6` | `--surface-hover` | `#1a4179` | **4.84:1** | 1.4.3 | 4.5:1 | ok |

#### semantic text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--semantic-blue-fg` | `#93c5fd` | `--surface-ground` | `#0e2a52` | **7.91:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-blue-fg` | `#93c5fd` | `--surface-card` | `#10305c` | **7.28:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#fdba74` | `--surface-ground` | `#0e2a52` | **8.46:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-orange-fg` | `#fdba74` | `--surface-card` | `#10305c` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#86efac` | `--surface-ground` | `#0e2a52` | **10.16:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-green-fg` | `#86efac` | `--surface-card` | `#10305c` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#fca5a5` | `--surface-ground` | `#0e2a52` | **7.52:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-red-fg` | `#fca5a5` | `--surface-card` | `#10305c` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#67e8f9` | `--surface-ground` | `#0e2a52` | **9.84:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-cyan-fg` | `#67e8f9` | `--surface-card` | `#10305c` | **9.06:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#f9a8d4` | `--surface-ground` | `#0e2a52` | **7.87:1** | 1.4.3 | 4.5:1 | ok |
| `--semantic-pink-fg` | `#f9a8d4` | `--surface-card` | `#10305c` | **7.24:1** | 1.4.3 | 4.5:1 | ok |

#### dev toggle

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--dev-toggle-fg` | `#86efac` | `color-mix(--dev-toggle-border 15%, --surface-card)` | `#194a61` | **6.82:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border` | `#4ade80` | `--surface-card` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `--dev-toggle-fg-active` | `#fca5a5` | `color-mix(--dev-toggle-border-active 15%, --surface-card)` | `#333a5f` | **5.79:1** | 1.4.3 | 4.5:1 | ok |
| `--dev-toggle-border-active` | `#f87171` | `--surface-card` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |

#### control boundary

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-border` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `--control-border` | `#6e8fc0` | `--surface-section` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |

#### floating action button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `.fab-label --text-color` | `#e8f0fb` | `.fab-button --surface-card` | `#10305c` | **11.43:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-label --text-color` | `#e8f0fb` | `.fab-button:hover --surface-hover` | `#1a4179` | **8.81:1** | 1.4.3 | 4.5:1 | ok |
| `.fab-button --fab-edge` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `.fab-button --fab-edge` | `#6e8fc0` | `--surface-section` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |

#### field placeholder

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--control-placeholder` | `#9fb5d6` | `--surface-section` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |

#### severity button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-from` | `#c23540` | **5.42:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text` | `#ffffff` | `--gradient-danger-to` | `#c23540` | **5.42:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-from` | `#146c4c` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text` | `#ffffff` | `--gradient-success-to` | `#146c4c` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-from` | `#1273a8` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text` | `#ffffff` | `--gradient-info-to` | `#1273a8` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#0e2a52` | `--gradient-warn-from` | `#ffd23f` | **9.88:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text` | `#0e2a52` | `--gradient-warn-to` | `#ffd23f` | **9.88:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-from` | `#47617f` | **6.39:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text` | `#ffffff` | `--gradient-secondary-to` | `#47617f` | **6.39:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-from` | `#a4470c` | **6.03:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text` | `#ffffff` | `--gradient-help-to` | `#a4470c` | **6.03:1** | 1.4.3 | 4.5:1 | ok |

#### outlined severity

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--outlined-danger-fg` | `#dc8188` | `--surface-card` | `#10305c` | **4.71:1** | 1.4.3 | 4.5:1 | ok |
| `success.--outlined-success-fg` | `#21b17c` | `--surface-card` | `#10305c` | **4.78:1** | 1.4.3 | 4.5:1 | ok |
| `info.--outlined-info-fg` | `#24a2e8` | `--surface-card` | `#10305c` | **4.63:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--outlined-warn-fg` | `#ffd23f` | `--surface-card` | `#10305c` | **9.09:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--outlined-secondary-fg` | `#829cb9` | `--surface-card` | `#10305c` | **4.63:1** | 1.4.3 | 4.5:1 | ok |
| `help.--outlined-help-fg` | `#f0782c` | `--surface-card` | `#10305c` | **4.64:1** | 1.4.3 | 4.5:1 | ok |

#### severity button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-from @brightness(0.92)` | `#b2313b` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `danger.--gradient-danger-text @brightness(0.92)` | `#ebebeb` | `--gradient-danger-to @brightness(0.92)` | `#b2313b` | **5.19:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-from @brightness(0.92)` | `#126346` | **6.08:1** | 1.4.3 | 4.5:1 | ok |
| `success.--gradient-success-text @brightness(0.92)` | `#ebebeb` | `--gradient-success-to @brightness(0.92)` | `#126346` | **6.08:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-from @brightness(0.92)` | `#116a9b` | **4.95:1** | 1.4.3 | 4.5:1 | ok |
| `info.--gradient-info-text @brightness(0.92)` | `#ebebeb` | `--gradient-info-to @brightness(0.92)` | `#116a9b` | **4.95:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#0f2e5a` | `--gradient-warn-from @brightness(1.1)` | `#ffe745` | **10.76:1** | 1.4.3 | 4.5:1 | ok |
| `warn.--gradient-warn-text @brightness(1.1)` | `#0f2e5a` | `--gradient-warn-to @brightness(1.1)` | `#ffe745` | **10.76:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-from @brightness(0.92)` | `#415975` | **6.05:1** | 1.4.3 | 4.5:1 | ok |
| `secondary.--gradient-secondary-text @brightness(0.92)` | `#ebebeb` | `--gradient-secondary-to @brightness(0.92)` | `#415975` | **6.05:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(0.92)` | `#ebebeb` | `--gradient-help-from @brightness(0.92)` | `#97410b` | **5.73:1** | 1.4.3 | 4.5:1 | ok |
| `help.--gradient-help-text @brightness(0.92)` | `#ebebeb` | `--gradient-help-to @brightness(0.92)` | `#97410b` | **5.73:1** | 1.4.3 | 4.5:1 | ok |

#### brand foreground

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg` | `#fb923c` | `--surface-ground` | `#0e2a52` | **6.30:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-fg` | `#fb923c` | `--surface-card` | `#10305c` | **5.80:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#facc15` | `--surface-ground` | `#0e2a52` | **9.32:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--gradient-accent-color-fg` | `#facc15` | `--surface-card` | `#10305c` | **8.57:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#f87171` | `--surface-ground` | `#0e2a52` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-fg` | `#f87171` | `--surface-card` | `#10305c` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#fbbf24` | `--surface-ground` | `#0e2a52` | **8.55:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--gradient-accent-color-fg` | `#fbbf24` | `--surface-card` | `#10305c` | **7.87:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#f472b6` | `--surface-ground` | `#0e2a52` | **5.39:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-fg` | `#f472b6` | `--surface-card` | `#10305c` | **4.96:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#e879c0` | `--surface-ground` | `#0e2a52` | **5.39:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--gradient-accent-color-fg` | `#e879c0` | `--surface-card` | `#10305c` | **4.96:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#4ade80` | `--surface-ground` | `#0e2a52` | **8.19:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-fg` | `#4ade80` | `--surface-card` | `#10305c` | **7.54:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#bef264` | `--surface-ground` | `#0e2a52` | **10.92:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--gradient-accent-color-fg` | `#bef264` | `--surface-card` | `#10305c` | **10.05:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#2dd4bf` | `--surface-ground` | `#0e2a52` | **7.67:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-fg` | `#2dd4bf` | `--surface-card` | `#10305c` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#60a5fa` | `--surface-ground` | `#0e2a52` | **5.61:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--gradient-accent-color-fg` | `#60a5fa` | `--surface-card` | `#10305c` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#22d3ee` | `--surface-ground` | `#0e2a52` | **7.90:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-fg` | `#22d3ee` | `--surface-card` | `#10305c` | **7.27:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#34d399` | `--surface-ground` | `#0e2a52` | **7.42:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--gradient-accent-color-fg` | `#34d399` | `--surface-card` | `#10305c` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#85a7ff` | `--surface-ground` | `#0e2a52` | **6.09:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-fg` | `#85a7ff` | `--surface-card` | `#10305c` | **5.61:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#7dd3fc` | `--surface-ground` | `#0e2a52` | **8.56:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--gradient-accent-color-fg` | `#7dd3fc` | `--surface-card` | `#10305c` | **7.88:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#f9a8d4` | `--surface-ground` | `#0e2a52` | **7.87:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-fg` | `#f9a8d4` | `--surface-card` | `#10305c` | **7.24:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#fda4af` | `--surface-ground` | `#0e2a52` | **7.55:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--gradient-accent-color-fg` | `#fda4af` | `--surface-card` | `#10305c` | **6.94:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#d6d3d1` | `--surface-ground` | `#0e2a52` | **9.58:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-fg` | `#d6d3d1` | `--surface-card` | `#10305c` | **8.81:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#fbbf24` | `--surface-ground` | `#0e2a52` | **8.55:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--gradient-accent-color-fg` | `#fbbf24` | `--surface-card` | `#10305c` | **7.87:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#f8fafc` | `--surface-ground` | `#0e2a52` | **13.64:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-fg` | `#f8fafc` | `--surface-card` | `#10305c` | **12.55:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#e2e8f0` | `--surface-ground` | `#0e2a52` | **11.57:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--gradient-accent-color-fg` | `#e2e8f0` | `--surface-card` | `#10305c` | **10.65:1** | 1.4.3 | 4.5:1 | ok |

#### filled button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--primary-color` | `#9a3412` | **7.31:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text` | `#ffffff` | `sunset.--gradient-accent-color` | `#854d0e` | **6.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--primary-color` | `#a71818` | **7.54:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text` | `#ffffff` | `fire.--gradient-accent-color` | `#785307` | **6.91:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--primary-color` | `#880f3f` | **9.60:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text` | `#ffffff` | `coral.--gradient-accent-color` | `#971f64` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--primary-color` | `#11612c` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text` | `#ffffff` | `forest.--gradient-accent-color` | `#475a07` | **7.68:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--primary-color` | `#086058` | **7.44:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text` | `#ffffff` | `ocean.--gradient-accent-color` | `#1151d0` | **6.75:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--primary-color` | `#065d6e` | **7.50:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text` | `#ffffff` | `aurora.--gradient-accent-color` | `#12683d` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--primary-color` | `#2638b0` | **9.23:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text` | `#ffffff` | `twilight.--gradient-accent-color` | `#075985` | **7.56:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--primary-color` | `#9a116a` | **7.89:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text` | `#ffffff` | `mystic.--gradient-accent-color` | `#af133e` | **7.03:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--primary-color` | `#605247` | **7.51:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text` | `#ffffff` | `stone.--gradient-accent-color` | `#854e17` | **6.78:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#1e293b` | `contrast.--primary-color` | `#f8fafc` | **13.98:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text` | `#1e293b` | `contrast.--gradient-accent-color` | `#e2e8f0` | **11.87:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (hover)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--primary-color @brightness(0.92)` | `#8e3011` | **6.82:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.--primary-color-text @brightness(0.92)` | `#ebebeb` | `sunset.--gradient-accent-color @brightness(0.92)` | `#7a470d` | **6.44:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--primary-color @brightness(0.92)` | `#9a1616` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--primary-color-text @brightness(0.92)` | `#ebebeb` | `fire.--gradient-accent-color @brightness(0.92)` | `#6e4c06` | **6.53:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--primary-color @brightness(0.92)` | `#7d0e3a` | **8.83:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--primary-color-text @brightness(0.92)` | `#ebebeb` | `coral.--gradient-accent-color @brightness(0.92)` | `#8b1d5c` | **7.25:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--primary-color @brightness(0.92)` | `#105928` | **7.10:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--primary-color-text @brightness(0.92)` | `#ebebeb` | `forest.--gradient-accent-color @brightness(0.92)` | `#415306` | **7.15:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--primary-color @brightness(0.92)` | `#075851` | **6.98:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--primary-color-text @brightness(0.92)` | `#ebebeb` | `ocean.--gradient-accent-color @brightness(0.92)` | `#104bbf` | **6.33:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--primary-color @brightness(0.92)` | `#065665` | **6.97:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--primary-color-text @brightness(0.92)` | `#ebebeb` | `aurora.--gradient-accent-color @brightness(0.92)` | `#116038` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--primary-color @brightness(0.92)` | `#2334a2` | **8.45:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--primary-color-text @brightness(0.92)` | `#ebebeb` | `twilight.--gradient-accent-color @brightness(0.92)` | `#06527a` | **7.06:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--primary-color @brightness(0.92)` | `#8e1062` | **7.34:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--primary-color-text @brightness(0.92)` | `#ebebeb` | `mystic.--gradient-accent-color @brightness(0.92)` | `#a11139` | **6.64:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--primary-color @brightness(0.92)` | `#584b41` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--primary-color-text @brightness(0.92)` | `#ebebeb` | `stone.--gradient-accent-color @brightness(0.92)` | `#7a4815` | **6.37:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#212d41` | `contrast.--primary-color @brightness(1.1)` | `#ffffff` | **13.85:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--primary-color-text @brightness(1.1)` | `#212d41` | `contrast.--gradient-accent-color @brightness(1.1)` | `#f9ffff` | **13.70:1** | 1.4.3 | 4.5:1 | ok |

#### accent surface

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--accent-on-surface` | `#ffdaa5` | `sunset.--accent-surface` | `#430000` | **12.78:1** | 1.4.3 | 4.5:1 | ok |
| `fire.--accent-on-surface` | `#ffb6b6` | `fire.--accent-surface` | `#4e0000` | **9.53:1** | 1.4.3 | 4.5:1 | ok |
| `coral.--accent-on-surface` | `#ffabe7` | `coral.--accent-surface` | `#290000` | **11.18:1** | 1.4.3 | 4.5:1 | ok |
| `forest.--accent-on-surface` | `#aeffcf` | `forest.--accent-surface` | `#000000` | **18.00:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.--accent-on-surface` | `#a3ffff` | `ocean.--accent-surface` | `#000000` | **18.31:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.--accent-on-surface` | `#a0ffff` | `aurora.--accent-surface` | `#000009` | **18.17:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.--accent-on-surface` | `#ccdfff` | `twilight.--accent-surface` | `#000054` | **13.80:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.--accent-on-surface` | `#ffadff` | `mystic.--accent-surface` | `#390000` | **10.80:1** | 1.4.3 | 4.5:1 | ok |
| `stone.--accent-on-surface` | `#fffef1` | `stone.--accent-surface` | `#000000` | **20.70:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.--accent-on-surface` | `#a8b0c3` | `contrast.--accent-surface` | `#000000` | **9.66:1** | 1.4.3 | 4.5:1 | ok |

#### checkbox & radiobutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `checkbox.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `checkbox.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#fb923c` | `--surface-ground` | `#0e2a52` | **6.30:1** | 1.4.11 | 3:1 | ok |
| `sunset.primary.color` | `#fb923c` | `--surface-card` | `#10305c` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `sunset.checkbox.icon.checked.color` | `#18181b` | `sunset.checkbox.checked.background` | `#fb923c` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#f87171` | `--surface-ground` | `#0e2a52` | **5.16:1** | 1.4.11 | 3:1 | ok |
| `fire.primary.color` | `#f87171` | `--surface-card` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `fire.checkbox.icon.checked.color` | `#18181b` | `fire.checkbox.checked.background` | `#f87171` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#f472b6` | `--surface-ground` | `#0e2a52` | **5.39:1** | 1.4.11 | 3:1 | ok |
| `coral.primary.color` | `#f472b6` | `--surface-card` | `#10305c` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `coral.checkbox.icon.checked.color` | `#18181b` | `coral.checkbox.checked.background` | `#f472b6` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#4ade80` | `--surface-ground` | `#0e2a52` | **8.19:1** | 1.4.11 | 3:1 | ok |
| `forest.primary.color` | `#4ade80` | `--surface-card` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `forest.checkbox.icon.checked.color` | `#18181b` | `forest.checkbox.checked.background` | `#4ade80` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#2dd4bf` | `--surface-ground` | `#0e2a52` | **7.67:1** | 1.4.11 | 3:1 | ok |
| `ocean.primary.color` | `#2dd4bf` | `--surface-card` | `#10305c` | **7.05:1** | 1.4.11 | 3:1 | ok |
| `ocean.checkbox.icon.checked.color` | `#18181b` | `ocean.checkbox.checked.background` | `#2dd4bf` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#22d3ee` | `--surface-ground` | `#0e2a52` | **7.90:1** | 1.4.11 | 3:1 | ok |
| `aurora.primary.color` | `#22d3ee` | `--surface-card` | `#10305c` | **7.27:1** | 1.4.11 | 3:1 | ok |
| `aurora.checkbox.icon.checked.color` | `#18181b` | `aurora.checkbox.checked.background` | `#22d3ee` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#85a7ff` | `--surface-ground` | `#0e2a52` | **6.09:1** | 1.4.11 | 3:1 | ok |
| `twilight.primary.color` | `#85a7ff` | `--surface-card` | `#10305c` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `twilight.checkbox.icon.checked.color` | `#18181b` | `twilight.checkbox.checked.background` | `#85a7ff` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#f9a8d4` | `--surface-ground` | `#0e2a52` | **7.87:1** | 1.4.11 | 3:1 | ok |
| `mystic.primary.color` | `#f9a8d4` | `--surface-card` | `#10305c` | **7.24:1** | 1.4.11 | 3:1 | ok |
| `mystic.checkbox.icon.checked.color` | `#18181b` | `mystic.checkbox.checked.background` | `#f9a8d4` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#d6d3d1` | `--surface-ground` | `#0e2a52` | **9.58:1** | 1.4.11 | 3:1 | ok |
| `stone.primary.color` | `#d6d3d1` | `--surface-card` | `#10305c` | **8.81:1** | 1.4.11 | 3:1 | ok |
| `stone.checkbox.icon.checked.color` | `#18181b` | `stone.checkbox.checked.background` | `#d6d3d1` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#f8fafc` | `--surface-ground` | `#0e2a52` | **13.64:1** | 1.4.11 | 3:1 | ok |
| `contrast.primary.color` | `#f8fafc` | `--surface-card` | `#10305c` | **12.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.checkbox.icon.checked.color` | `#18181b` | `contrast.checkbox.checked.background` | `#f8fafc` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### toggleswitch

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `toggleswitch.background` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.background` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `toggleswitch.handle.background` | `#10305c` | `toggleswitch.background` | `#6e8fc0` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `sunset.toggleswitch.handle.checked.background` | `#18181b` | `sunset.toggleswitch.checked.background` | `#fb923c` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.toggleswitch.handle.checked.background` | `#18181b` | `fire.toggleswitch.checked.background` | `#f87171` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.toggleswitch.handle.checked.background` | `#18181b` | `coral.toggleswitch.checked.background` | `#f472b6` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.toggleswitch.handle.checked.background` | `#18181b` | `forest.toggleswitch.checked.background` | `#4ade80` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.toggleswitch.handle.checked.background` | `#18181b` | `ocean.toggleswitch.checked.background` | `#2dd4bf` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.toggleswitch.handle.checked.background` | `#18181b` | `aurora.toggleswitch.checked.background` | `#22d3ee` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.toggleswitch.handle.checked.background` | `#18181b` | `twilight.toggleswitch.checked.background` | `#85a7ff` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.toggleswitch.handle.checked.background` | `#18181b` | `mystic.toggleswitch.checked.background` | `#f9a8d4` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.toggleswitch.handle.checked.background` | `#18181b` | `stone.toggleswitch.checked.background` | `#d6d3d1` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.toggleswitch.handle.checked.background` | `#18181b` | `contrast.toggleswitch.checked.background` | `#f8fafc` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### form field edge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `select.border.color` | `#6e8fc0` | `select.background` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `input.p-inputtext border-color: var(--style-outline)` | `#6e8fc0` | `inputtext.background` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `textarea.border.color` | `#6e8fc0` | `textarea.background` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `multiselect.border.color` | `#6e8fc0` | `multiselect.background` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `listbox.border.color` | `#6e8fc0` | `listbox.background` | `#09090b` | **6.02:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.border.color` | `#6e8fc0` | `autocomplete.background` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.border.color` | `#6e8fc0` | `autocomplete.background` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.border.color` | `#6e8fc0` | `datepicker.dropdown.background` | `#27272a` | **4.51:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.border.color` | `#6e8fc0` | `inputtext.background` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.border.color` | `#6e8fc0` | `cascadeselect.background` | `#173d74` | **3.25:1** | 1.4.11 | 3:1 | ok |
| `inputnumber.button.color` | `#9fb5d6` | `inputtext.background` | `#173d74` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `--surface-ground` | `#0e2a52` | **7.52:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `--surface-card` | `#10305c` | **6.92:1** | 1.4.11 | 3:1 | ok |
| `inputtext.invalid.border.color` | `#fca5a5` | `inputtext.background` | `#173d74` | **5.66:1** | 1.4.11 | 3:1 | ok |

#### form field text

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `inputtext.color` | `#e8f0fb` | `inputtext.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `inputtext.placeholder.color` | `#9fb5d6` | `inputtext.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `select.color` | `#e8f0fb` | `select.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `select.placeholder.color` | `#9fb5d6` | `select.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.color` | `#e8f0fb` | `textarea.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `textarea.placeholder.color` | `#9fb5d6` | `textarea.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.color` | `#e8f0fb` | `cascadeselect.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `cascadeselect.placeholder.color` | `#9fb5d6` | `cascadeselect.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.color` | `#e8f0fb` | `multiselect.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `multiselect.placeholder.color` | `#9fb5d6` | `multiselect.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.color` | `#e8f0fb` | `treeselect.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `treeselect.placeholder.color` | `#9fb5d6` | `treeselect.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.color` | `#e8f0fb` | `autocomplete.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `autocomplete.placeholder.color` | `#9fb5d6` | `autocomplete.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |

#### form field icon

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.dropdown.color` | `#9fb5d6` | `select.background` | `#173d74` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `multiselect.dropdown.color` | `#9fb5d6` | `multiselect.background` | `#173d74` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `cascadeselect.dropdown.color` | `#9fb5d6` | `cascadeselect.background` | `#173d74` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `treeselect.dropdown.color` | `#9fb5d6` | `treeselect.background` | `#173d74` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `password.icon.color` | `#9fb5d6` | `inputtext.background` | `#173d74` | **5.14:1** | 1.4.11 | 3:1 | ok |
| `autocomplete.dropdown.color` | `#d4d4d8` | `autocomplete.dropdown.background` | `#27272a` | **10.08:1** | 1.4.11 | 3:1 | ok |
| `datepicker.dropdown.color` | `#d4d4d8` | `datepicker.dropdown.background` | `#27272a` | **10.08:1** | 1.4.11 | 3:1 | ok |
| `inputgroup.addon.color` | `#9fb5d6` | `inputgroup.addon.background` | `#09090b` | **9.53:1** | 1.4.3 | 4.5:1 | ok |

#### float label

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `floatlabel.color` | `#9fb5d6` | `inputtext.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.active.color` | `#9fb5d6` | `floatlabel.on.active.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.focus.color` | `#e8f0fb` | `floatlabel.on.active.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.invalid.color` | `#fca5a5` | `floatlabel.on.active.background` | `#173d74` | **5.66:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.color` | `#9fb5d6` | `inputtext.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.focus.color` | `#e8f0fb` | `inputtext.background` | `#173d74` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `iftalabel.invalid.color` | `#fca5a5` | `inputtext.background` | `#173d74` | **5.66:1** | 1.4.3 | 4.5:1 | ok |
| `floatlabel.on.active.background` | `#173d74` | `inputtext.background` | `#173d74` | **1.00:1** | none | — | info |

#### tag

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `tag.secondary.color (styles.scss)` | `#ffffff` | `tag.secondary.background (styles.scss)` | `#475569` | **7.58:1** | 1.4.3 | 4.5:1 | ok |
| `tag.success.color (styles.scss)` | `#ffffff` | `tag.success.background (styles.scss)` | `#15803d` | **5.02:1** | 1.4.3 | 4.5:1 | ok |
| `tag.info.color (styles.scss)` | `#ffffff` | `tag.info.background (styles.scss)` | `#0369a1` | **5.93:1** | 1.4.3 | 4.5:1 | ok |
| `tag.warn.color (styles.scss)` | `#ffffff` | `tag.warn.background (styles.scss)` | `#c2410c` | **5.18:1** | 1.4.3 | 4.5:1 | ok |
| `tag.danger.color (styles.scss)` | `#ffffff` | `tag.danger.background (styles.scss)` | `#b91c1c` | **6.47:1** | 1.4.3 | 4.5:1 | ok |
| `tag.contrast.color` | `#09090b` | `tag.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#fff8a2` | `sunset.tag.primary.background over --surface-ground` | `#343b4e` | **10.20:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.tag.primary.color` | `#fff8a2` | `sunset.tag.primary.background over --surface-card` | `#364057` | **9.47:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#ffd7d7` | `fire.tag.primary.background over --surface-ground` | `#333557` | **8.92:1** | 1.4.3 | 4.5:1 | ok |
| `fire.tag.primary.color` | `#ffd7d7` | `fire.tag.primary.background over --surface-card` | `#353a5f` | **8.30:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#ffd8ff` | `coral.tag.primary.background over --surface-ground` | `#333662` | **8.95:1** | 1.4.3 | 4.5:1 | ok |
| `coral.tag.primary.color` | `#ffd8ff` | `coral.tag.primary.background over --surface-card` | `#343b6a` | **8.34:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#b0ffe6` | `forest.tag.primary.background over --surface-ground` | `#184759` | **8.78:1** | 1.4.3 | 4.5:1 | ok |
| `forest.tag.primary.color` | `#b0ffe6` | `forest.tag.primary.background over --surface-card` | `#194c62` | **8.12:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#93ffff` | `ocean.tag.primary.background over --surface-ground` | `#134563` | **8.74:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.tag.primary.color` | `#93ffff` | `ocean.tag.primary.background over --surface-card` | `#154a6c` | **8.07:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#88ffff` | `aurora.tag.primary.background over --surface-ground` | `#11456b` | **8.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.tag.primary.color` | `#88ffff` | `aurora.tag.primary.background over --surface-card` | `#134a73` | **7.89:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#ebffff` | `twilight.tag.primary.background over --surface-ground` | `#213e6e` | **10.25:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.tag.primary.color` | `#ebffff` | `twilight.tag.primary.background over --surface-card` | `#234376` | **9.49:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#ffffff` | `mystic.tag.primary.background over --surface-ground` | `#343e67` | **10.34:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.tag.primary.color` | `#ffffff` | `mystic.tag.primary.background over --surface-card` | `#35436f` | **9.62:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#ffffff` | `stone.tag.primary.background over --surface-ground` | `#2e4566` | **9.73:1** | 1.4.3 | 4.5:1 | ok |
| `stone.tag.primary.color` | `#ffffff` | `stone.tag.primary.background over --surface-card` | `#304a6f` | **8.99:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#ffffff` | `contrast.tag.primary.background over --surface-ground` | `#334b6d` | **8.87:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.tag.primary.color` | `#ffffff` | `contrast.tag.primary.background over --surface-card` | `#355076` | **8.20:1** | 1.4.3 | 4.5:1 | ok |

#### chip

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `chip.color` | `#ffffff` | `chip.background` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `chip.remove.icon.color` | `#ffffff` | `chip.background` | `#27272a` | **14.89:1** | 1.4.11 | 3:1 | ok |

#### dialog

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `dialog.color` | `#ffffff` | `dialog.background` | `#18181b` | **17.72:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#9fb5d6` | `dialog.background` | `#18181b` | **8.48:1** | 1.4.11 | 3:1 | ok |

#### skeleton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `skeleton.background` | `#1c375c` | `--surface-ground` | `#0e2a52` | **1.19:1** | none | — | info |
| `skeleton.background` | `#1e3c66` | `--surface-card` | `#10305c` | **1.18:1** | none | — | info |

#### progressbar & slider

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `slider.track.background` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#3f3f46` | `--surface-ground` | `#0e2a52` | **1.37:1** | none | — | info |
| `slider.track.background` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `slider.handle.background` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `progressbar.background` | `#3f3f46` | `--surface-card` | `#10305c` | **1.26:1** | none | — | info |
| `sunset.progressbar.value.background` | `#fb923c` | `progressbar.background` | `#3f3f46` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressbar.label.color` | `#18181b` | `sunset.progressbar.value.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `fire.progressbar.value.background` | `#f87171` | `progressbar.background` | `#3f3f46` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `fire.progressbar.label.color` | `#18181b` | `fire.progressbar.value.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `coral.progressbar.value.background` | `#f472b6` | `progressbar.background` | `#3f3f46` | **3.94:1** | 1.4.11 | 3:1 | ok |
| `coral.progressbar.label.color` | `#18181b` | `coral.progressbar.value.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `forest.progressbar.value.background` | `#4ade80` | `progressbar.background` | `#3f3f46` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `forest.progressbar.label.color` | `#18181b` | `forest.progressbar.value.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.progressbar.value.background` | `#2dd4bf` | `progressbar.background` | `#3f3f46` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressbar.label.color` | `#18181b` | `ocean.progressbar.value.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.progressbar.value.background` | `#22d3ee` | `progressbar.background` | `#3f3f46` | **5.78:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressbar.label.color` | `#18181b` | `aurora.progressbar.value.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.progressbar.value.background` | `#85a7ff` | `progressbar.background` | `#3f3f46` | **4.46:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressbar.label.color` | `#18181b` | `twilight.progressbar.value.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.progressbar.value.background` | `#f9a8d4` | `progressbar.background` | `#3f3f46` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressbar.label.color` | `#18181b` | `mystic.progressbar.value.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `stone.progressbar.value.background` | `#d6d3d1` | `progressbar.background` | `#3f3f46` | **7.01:1** | 1.4.11 | 3:1 | ok |
| `stone.progressbar.label.color` | `#18181b` | `stone.progressbar.value.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.progressbar.value.background` | `#f8fafc` | `progressbar.background` | `#3f3f46` | **9.98:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressbar.label.color` | `#18181b` | `contrast.progressbar.value.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |

#### togglebutton & selectbutton

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `togglebutton.color` | `#9fb5d6` | `togglebutton.background` | `#173d74` | **5.14:1** | 1.4.3 | 4.5:1 | ok |
| `togglebutton.hover.color` | `#e8f0fb` | `togglebutton.hover.background` | `#1a4179` | **8.81:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.togglebutton.content.checked.background` | `#fb923c` | `togglebutton.background` | `#173d74` | **4.74:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `sunset.togglebutton.content.checked.background` | `#fb923c` | **5.80:1** | 1.4.3 | 4.5:1 | ok |
| `fire.togglebutton.content.checked.background` | `#f87171` | `togglebutton.background` | `#173d74` | **3.88:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `fire.togglebutton.content.checked.background` | `#f87171` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `coral.togglebutton.content.checked.background` | `#f472b6` | `togglebutton.background` | `#173d74` | **4.05:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `coral.togglebutton.content.checked.background` | `#f472b6` | **4.96:1** | 1.4.3 | 4.5:1 | ok |
| `forest.togglebutton.content.checked.background` | `#4ade80` | `togglebutton.background` | `#173d74` | **6.16:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `forest.togglebutton.content.checked.background` | `#4ade80` | **7.54:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.togglebutton.content.checked.background` | `#2dd4bf` | `togglebutton.background` | `#173d74` | **5.77:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `ocean.togglebutton.content.checked.background` | `#2dd4bf` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.togglebutton.content.checked.background` | `#22d3ee` | `togglebutton.background` | `#173d74` | **5.94:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `aurora.togglebutton.content.checked.background` | `#22d3ee` | **7.27:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.togglebutton.content.checked.background` | `#85a7ff` | `togglebutton.background` | `#173d74` | **4.58:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `twilight.togglebutton.content.checked.background` | `#85a7ff` | **5.61:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.togglebutton.content.checked.background` | `#f9a8d4` | `togglebutton.background` | `#173d74` | **5.92:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `mystic.togglebutton.content.checked.background` | `#f9a8d4` | **7.24:1** | 1.4.3 | 4.5:1 | ok |
| `stone.togglebutton.content.checked.background` | `#d6d3d1` | `togglebutton.background` | `#173d74` | **7.21:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `stone.togglebutton.content.checked.background` | `#d6d3d1` | **8.81:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.togglebutton.content.checked.background` | `#f8fafc` | `togglebutton.background` | `#173d74` | **10.26:1** | 1.4.11 | 3:1 | ok |
| `togglebutton.checked.color` | `#10305c` | `contrast.togglebutton.content.checked.background` | `#f8fafc` | **12.55:1** | 1.4.3 | 4.5:1 | ok |

#### menu focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `menubar.submenu.icon.color` | `#9fb5d6` | `menubar.background` | `#18181b` | **8.48:1** | 1.4.11 | 3:1 | ok |
| `menubar.submenu.icon.color` | `#9fb5d6` | `menubar.item.focus.background` | `#27272a` | **7.13:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#9fb5d6` | `menubar.background` | `#18181b` | **8.48:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.icon.color` | `#9fb5d6` | `menubar.item.focus.background` | `#27272a` | **7.13:1** | 1.4.11 | 3:1 | ok |
| `menubar.item.focus.background` | `#27272a` | `menubar.background` | `#18181b` | **1.19:1** | none | — | info |
| `sunset.--primary-color-fg (focus ring)` | `#fb923c` | `menubar.item.focus.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (focus ring)` | `#fb923c` | `menubar.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#f87171` | `menubar.item.focus.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (focus ring)` | `#f87171` | `menubar.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#f472b6` | `menubar.item.focus.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (focus ring)` | `#f472b6` | `menubar.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#4ade80` | `menubar.item.focus.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (focus ring)` | `#4ade80` | `menubar.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#2dd4bf` | `menubar.item.focus.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (focus ring)` | `#2dd4bf` | `menubar.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#22d3ee` | `menubar.item.focus.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (focus ring)` | `#22d3ee` | `menubar.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#85a7ff` | `menubar.item.focus.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (focus ring)` | `#85a7ff` | `menubar.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#f9a8d4` | `menubar.item.focus.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (focus ring)` | `#f9a8d4` | `menubar.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#d6d3d1` | `menubar.item.focus.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (focus ring)` | `#d6d3d1` | `menubar.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#f8fafc` | `menubar.item.focus.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (focus ring)` | `#f8fafc` | `menubar.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |

#### option list focus

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `select.option.focus.background` | `#27272a` | `select.overlay.background` | `#18181b` | **1.19:1** | none | — | info |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `select.option.focus.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.select.option.selected.background` | `#36485f` | **4.13:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.select.option.selected.focus.background` | `#36485f` | **4.13:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **4.47:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `multiselect.overlay.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.multiselect.option.selected.background` | `#3d3428` | **5.39:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.multiselect.option.selected.focus.background` | `#4f422f` | **4.31:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `listbox.background` | `#09090b` | **8.79:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.listbox.option.selected.background` | `#30271b` | **6.48:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, option)` | `#fb923c` | `sunset.listbox.option.selected.focus.background` | `#443623` | **5.16:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `select.option.focus.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.select.option.selected.background` | `#364368` | **3.52:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.select.option.selected.focus.background` | `#364368` | **3.52:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **3.66:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `multiselect.overlay.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.multiselect.option.selected.background` | `#3d2e31` | **4.65:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.multiselect.option.selected.focus.background` | `#4f3a3c` | **3.79:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `listbox.background` | `#09090b` | **7.19:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.listbox.option.selected.background` | `#302223` | **5.51:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, option)` | `#f87171` | `fire.listbox.option.selected.focus.background` | `#442e30` | **4.52:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `select.option.focus.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.select.option.selected.background` | `#364373` | **3.59:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.select.option.selected.focus.background` | `#364373` | **3.59:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **3.82:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `multiselect.overlay.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.multiselect.option.selected.background` | `#3d2f3c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.multiselect.option.selected.focus.background` | `#4f3a4c` | **3.88:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `listbox.background` | `#09090b` | **7.51:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.listbox.option.selected.background` | `#30222f` | **5.68:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, option)` | `#f472b6` | `coral.listbox.option.selected.focus.background` | `#442e40` | **4.64:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `select.option.focus.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.select.option.selected.background` | `#21516a` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.select.option.selected.focus.background` | `#21516a` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `multiselect.overlay.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.multiselect.option.selected.background` | `#283d33` | **6.67:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.multiselect.option.selected.focus.background` | `#304f3f` | **5.20:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `listbox.background` | `#09090b` | **11.42:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.listbox.option.selected.background` | `#1c3026` | **8.03:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, option)` | `#4ade80` | `forest.listbox.option.selected.focus.background` | `#254433` | **6.17:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **7.05:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `select.option.focus.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.select.option.selected.background` | `#1d5174` | **4.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.select.option.selected.focus.background` | `#1d5174` | **4.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **5.43:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `multiselect.overlay.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.multiselect.option.selected.background` | `#243d3d` | **6.23:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.multiselect.option.selected.focus.background` | `#294f4f` | **4.85:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `listbox.background` | `#09090b` | **10.69:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.listbox.option.selected.background` | `#173030` | **7.51:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, option)` | `#2dd4bf` | `ocean.listbox.option.selected.focus.background` | `#1e4442` | **5.75:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **7.27:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `select.option.focus.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.select.option.selected.background` | `#1b5176` | **4.68:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.select.option.selected.focus.background` | `#1b5176` | **4.68:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **5.60:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `multiselect.overlay.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.multiselect.option.selected.background` | `#223d3f` | **6.43:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.multiselect.option.selected.focus.background` | `#274f52` | **4.99:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `listbox.background` | `#09090b` | **11.01:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.listbox.option.selected.background` | `#153032` | **7.74:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, option)` | `#22d3ee` | `aurora.listbox.option.selected.focus.background` | `#1b4446` | **5.92:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `select.option.focus.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.select.option.selected.background` | `#2b4b76` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.select.option.selected.focus.background` | `#2b4b76` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `multiselect.overlay.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.multiselect.option.selected.background` | `#32373f` | **5.11:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.multiselect.option.selected.focus.background` | `#3e4752` | **4.03:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `listbox.background` | `#09090b` | **8.50:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.listbox.option.selected.background` | `#252a32` | **6.16:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, option)` | `#85a7ff` | `twilight.listbox.option.selected.focus.background` | `#333b46` | **4.84:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **7.24:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `select.option.focus.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.select.option.selected.background` | `#364b76` | **4.78:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.select.option.selected.focus.background` | `#364b76` | **4.78:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **5.58:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `multiselect.overlay.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.multiselect.option.selected.background` | `#3d373f` | **6.37:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.multiselect.option.selected.focus.background` | `#4f4752` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `listbox.background` | `#09090b` | **10.97:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.listbox.option.selected.background` | `#302b32` | **7.63:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, option)` | `#f9a8d4` | `mystic.listbox.option.selected.focus.background` | `#443b46` | **5.91:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **8.81:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `select.option.focus.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.select.option.selected.background` | `#365176` | **5.43:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.select.option.selected.focus.background` | `#365176` | **5.43:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **6.79:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `multiselect.overlay.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.multiselect.option.selected.background` | `#3d3d3f` | **7.28:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.multiselect.option.selected.focus.background` | `#4f4f52` | **5.48:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `listbox.background` | `#09090b` | **13.36:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.listbox.option.selected.background` | `#303032` | **8.84:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, option)` | `#d6d3d1` | `stone.listbox.option.selected.focus.background` | `#444446` | **6.52:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `--surface-card (.dark-theme .p-select-overlay)` | `#10305c` | **12.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `select.option.focus.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.select.option.selected.background` | `#365176` | **7.73:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.select.option.selected.focus.background` | `#365176` | **7.73:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `--surface-hover (.dark-theme .p-select-option:hover)` | `#1a4179` | **9.67:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `multiselect.overlay.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.multiselect.option.selected.background` | `#3d3d3f` | **10.36:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.multiselect.option.selected.focus.background` | `#4f4f52` | **7.80:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `listbox.background` | `#09090b` | **19.02:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.listbox.option.selected.background` | `#303032` | **12.59:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, option)` | `#f8fafc` | `contrast.listbox.option.selected.focus.background` | `#444446` | **9.29:1** | 1.4.11 | 3:1 | ok |

#### panel outline

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `--style-outline` | `#6e8fc0` | `--surface-ground` | `#0e2a52` | **4.32:1** | 1.4.11 | 3:1 | ok |
| `--style-outline` | `#6e8fc0` | `--surface-card` | `#10305c` | **3.97:1** | 1.4.11 | 3:1 | ok |
| `popover.background` | `#18181b` | `--surface-card` | `#10305c` | **1.35:1** | none | — | info |
| `drawer.background` | `#18181b` | `--surface-card` | `#10305c` | **1.35:1** | none | — | info |

#### content panel

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `text.color` | `#ffffff` | `content.background` | `#18181b` | **17.72:1** | 1.4.3 | 4.5:1 | ok |

#### table & paginator

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `datatable.row.background` | `#10305c` | `--surface-card` | `#10305c` | **1.00:1** | none | — | info |
| `paginator.background` | `#10305c` | `--surface-card` | `#10305c` | **1.00:1** | none | — | info |
| `datatable.row.color` | `#ffffff` | `datatable.row.background` | `#10305c` | **13.13:1** | 1.4.3 | 4.5:1 | ok |
| `paginator.nav.button.color` | `#a1a1aa` | `paginator.background` | `#10305c` | **5.12:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.datatable.row.selected.color` | `#e5e7ea` | `sunset.datatable.row.selected.background` | `#36485f` | **7.54:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.color` | `#18181b` | `sunset.paginator.nav.button.selected.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.paginator.nav.button.selected.background` | `#fb923c` | `paginator.background` | `#10305c` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `sunset.datatable.row.selected.background` | `#36485f` | `datatable.row.background` | `#10305c` | **1.41:1** | none | — | info |
| `sunset.--primary-color-fg (selected-row bar)` | `#fb923c` | `sunset.datatable.row.selected.background` | `#36485f` | **4.13:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (selected-row bar)` | `#fb923c` | `datatable.row.background` | `#10305c` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.color` | `#e5e7eb` | `fire.datatable.row.selected.background` | `#364368` | **7.85:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.color` | `#18181b` | `fire.paginator.nav.button.selected.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `fire.paginator.nav.button.selected.background` | `#f87171` | `paginator.background` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `fire.datatable.row.selected.background` | `#364368` | `datatable.row.background` | `#10305c` | **1.35:1** | none | — | info |
| `fire.--primary-color-fg (selected-row bar)` | `#f87171` | `fire.datatable.row.selected.background` | `#364368` | **3.52:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (selected-row bar)` | `#f87171` | `datatable.row.background` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.color` | `#e5e7ed` | `coral.datatable.row.selected.background` | `#364373` | **7.69:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.color` | `#18181b` | `coral.paginator.nav.button.selected.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `coral.paginator.nav.button.selected.background` | `#f472b6` | `paginator.background` | `#10305c` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `coral.datatable.row.selected.background` | `#364373` | `datatable.row.background` | `#10305c` | **1.38:1** | none | — | info |
| `coral.--primary-color-fg (selected-row bar)` | `#f472b6` | `coral.datatable.row.selected.background` | `#364373` | **3.59:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (selected-row bar)` | `#f472b6` | `datatable.row.background` | `#10305c` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.color` | `#e2e8ec` | `forest.datatable.row.selected.background` | `#21516a` | **6.93:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.color` | `#18181b` | `forest.paginator.nav.button.selected.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `forest.paginator.nav.button.selected.background` | `#4ade80` | `paginator.background` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `forest.datatable.row.selected.background` | `#21516a` | `datatable.row.background` | `#10305c` | **1.53:1** | none | — | info |
| `forest.--primary-color-fg (selected-row bar)` | `#4ade80` | `forest.datatable.row.selected.background` | `#21516a` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (selected-row bar)` | `#4ade80` | `datatable.row.background` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.color` | `#e2e8ed` | `ocean.datatable.row.selected.background` | `#1d5174` | **6.85:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.color` | `#18181b` | `ocean.paginator.nav.button.selected.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.paginator.nav.button.selected.background` | `#2dd4bf` | `paginator.background` | `#10305c` | **7.05:1** | 1.4.11 | 3:1 | ok |
| `ocean.datatable.row.selected.background` | `#1d5174` | `datatable.row.background` | `#10305c` | **1.55:1** | none | — | info |
| `ocean.--primary-color-fg (selected-row bar)` | `#2dd4bf` | `ocean.datatable.row.selected.background` | `#1d5174` | **4.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (selected-row bar)` | `#2dd4bf` | `datatable.row.background` | `#10305c` | **7.05:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.color` | `#e1e8ed` | `aurora.datatable.row.selected.background` | `#1b5176` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.color` | `#18181b` | `aurora.paginator.nav.button.selected.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.paginator.nav.button.selected.background` | `#22d3ee` | `paginator.background` | `#10305c` | **7.27:1** | 1.4.11 | 3:1 | ok |
| `aurora.datatable.row.selected.background` | `#1b5176` | `datatable.row.background` | `#10305c` | **1.55:1** | none | — | info |
| `aurora.--primary-color-fg (selected-row bar)` | `#22d3ee` | `aurora.datatable.row.selected.background` | `#1b5176` | **4.68:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (selected-row bar)` | `#22d3ee` | `datatable.row.background` | `#10305c` | **7.27:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.color` | `#e3e8ed` | `twilight.datatable.row.selected.background` | `#2b4b76` | **7.18:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.color` | `#18181b` | `twilight.paginator.nav.button.selected.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.paginator.nav.button.selected.background` | `#85a7ff` | `paginator.background` | `#10305c` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `twilight.datatable.row.selected.background` | `#2b4b76` | `datatable.row.background` | `#10305c` | **1.48:1** | none | — | info |
| `twilight.--primary-color-fg (selected-row bar)` | `#85a7ff` | `twilight.datatable.row.selected.background` | `#2b4b76` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (selected-row bar)` | `#85a7ff` | `datatable.row.background` | `#10305c` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.color` | `#e5e8ed` | `mystic.datatable.row.selected.background` | `#364b76` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.color` | `#18181b` | `mystic.paginator.nav.button.selected.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.paginator.nav.button.selected.background` | `#f9a8d4` | `paginator.background` | `#10305c` | **7.24:1** | 1.4.11 | 3:1 | ok |
| `mystic.datatable.row.selected.background` | `#364b76` | `datatable.row.background` | `#10305c` | **1.52:1** | none | — | info |
| `mystic.--primary-color-fg (selected-row bar)` | `#f9a8d4` | `mystic.datatable.row.selected.background` | `#364b76` | **4.78:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (selected-row bar)` | `#f9a8d4` | `datatable.row.background` | `#10305c` | **7.24:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.color` | `#e5e8ed` | `stone.datatable.row.selected.background` | `#365176` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.color` | `#18181b` | `stone.paginator.nav.button.selected.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `stone.paginator.nav.button.selected.background` | `#d6d3d1` | `paginator.background` | `#10305c` | **8.81:1** | 1.4.11 | 3:1 | ok |
| `stone.datatable.row.selected.background` | `#365176` | `datatable.row.background` | `#10305c` | **1.62:1** | none | — | info |
| `stone.--primary-color-fg (selected-row bar)` | `#d6d3d1` | `stone.datatable.row.selected.background` | `#365176` | **5.43:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (selected-row bar)` | `#d6d3d1` | `datatable.row.background` | `#10305c` | **8.81:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.color` | `#e5e8ed` | `contrast.datatable.row.selected.background` | `#365176` | **6.59:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.color` | `#18181b` | `contrast.paginator.nav.button.selected.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.paginator.nav.button.selected.background` | `#f8fafc` | `paginator.background` | `#10305c` | **12.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.datatable.row.selected.background` | `#365176` | `datatable.row.background` | `#10305c` | **1.62:1** | none | — | info |
| `contrast.--primary-color-fg (selected-row bar)` | `#f8fafc` | `contrast.datatable.row.selected.background` | `#365176` | **7.73:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (selected-row bar)` | `#f8fafc` | `datatable.row.background` | `#10305c` | **12.55:1** | 1.4.11 | 3:1 | ok |

#### badge

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `badge.secondary.color` | `#d4d4d8` | `badge.secondary.background` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `badge.success.color` | `#052e16` | `badge.success.background` | `#86efac` | **10.62:1** | 1.4.3 | 4.5:1 | ok |
| `badge.info.color` | `#172554` | `badge.info.background` | `#93c5fd` | **8.15:1** | 1.4.3 | 4.5:1 | ok |
| `badge.warn.color` | `#431407` | `badge.warn.background` | `#fdba74` | **9.28:1** | 1.4.3 | 4.5:1 | ok |
| `badge.danger.color` | `#450a0a` | `badge.danger.background` | `#fca5a5` | **8.51:1** | 1.4.3 | 4.5:1 | ok |
| `badge.contrast.color` | `#09090b` | `badge.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.badge.primary.color` | `#18181b` | `sunset.badge.primary.background` | `#fb923c` | **7.83:1** | 1.4.3 | 4.5:1 | ok |
| `fire.badge.primary.color` | `#18181b` | `fire.badge.primary.background` | `#f87171` | **6.40:1** | 1.4.3 | 4.5:1 | ok |
| `coral.badge.primary.color` | `#18181b` | `coral.badge.primary.background` | `#f472b6` | **6.69:1** | 1.4.3 | 4.5:1 | ok |
| `forest.badge.primary.color` | `#18181b` | `forest.badge.primary.background` | `#4ade80` | **10.17:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.badge.primary.color` | `#18181b` | `ocean.badge.primary.background` | `#2dd4bf` | **9.52:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.badge.primary.color` | `#18181b` | `aurora.badge.primary.background` | `#22d3ee` | **9.80:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.badge.primary.color` | `#18181b` | `twilight.badge.primary.background` | `#85a7ff` | **7.57:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.badge.primary.color` | `#18181b` | `mystic.badge.primary.background` | `#f9a8d4` | **9.77:1** | 1.4.3 | 4.5:1 | ok |
| `stone.badge.primary.color` | `#18181b` | `stone.badge.primary.background` | `#d6d3d1` | **11.89:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.badge.primary.color` | `#18181b` | `contrast.badge.primary.background` | `#f8fafc` | **16.93:1** | 1.4.3 | 4.5:1 | ok |

#### message & toast

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `message.info.color` | `#93c5fd` | `message.info.background over --surface-ground` | `#15386c` | **6.42:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#93c5fd` | `--surface-ground` | `#0e2a52` | **7.91:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#93c5fd` | `toast.info.background over --surface-ground` | `#15386c` | **6.42:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#ffffff` | `toast.info.background over --surface-ground` | `#15386c` | **11.58:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.color` | `#93c5fd` | `message.info.background over --surface-card` | `#173d75` | **5.94:1** | 1.4.3 | 4.5:1 | ok |
| `message.info.simple.color` | `#93c5fd` | `--surface-card` | `#10305c` | **7.28:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.color` | `#93c5fd` | `toast.info.background over --surface-card` | `#173d75` | **5.94:1** | 1.4.3 | 4.5:1 | ok |
| `toast.info.detail.color` | `#ffffff` | `toast.info.background over --surface-card` | `#173d75` | **10.71:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#86efac` | `message.success.background over --surface-ground` | `#114354` | **7.65:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#86efac` | `--surface-ground` | `#0e2a52` | **10.16:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#86efac` | `toast.success.background over --surface-ground` | `#114354` | **7.65:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#ffffff` | `toast.success.background over --surface-ground` | `#114354` | **10.74:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.color` | `#86efac` | `message.success.background over --surface-card` | `#13485c` | **7.09:1** | 1.4.3 | 4.5:1 | ok |
| `message.success.simple.color` | `#86efac` | `--surface-card` | `#10305c` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.color` | `#86efac` | `toast.success.background over --surface-card` | `#13485c` | **7.09:1** | 1.4.3 | 4.5:1 | ok |
| `toast.success.detail.color` | `#ffffff` | `toast.success.background over --surface-card` | `#13485c` | **9.96:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#fdba74` | `message.warn.background over --surface-ground` | `#314046` | **6.38:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#fdba74` | `--surface-ground` | `#0e2a52` | **8.46:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#fdba74` | `toast.warn.background over --surface-ground` | `#314046` | **6.38:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#ffffff` | `toast.warn.background over --surface-ground` | `#314046` | **10.76:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.color` | `#fdba74` | `message.warn.background over --surface-card` | `#33454f` | **5.92:1** | 1.4.3 | 4.5:1 | ok |
| `message.warn.simple.color` | `#fdba74` | `--surface-card` | `#10305c` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.color` | `#fdba74` | `toast.warn.background over --surface-card` | `#33454f` | **5.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.warn.detail.color` | `#ffffff` | `toast.warn.background over --surface-card` | `#33454f` | **9.98:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#fca5a5` | `message.error.background over --surface-ground` | `#322e50` | **6.74:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#fca5a5` | `--surface-ground` | `#0e2a52` | **7.52:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#fca5a5` | `toast.error.background over --surface-ground` | `#322e50` | **6.74:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#ffffff` | `toast.error.background over --surface-ground` | `#322e50` | **12.79:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.color` | `#fca5a5` | `message.error.background over --surface-card` | `#343358` | **6.28:1** | 1.4.3 | 4.5:1 | ok |
| `message.error.simple.color` | `#fca5a5` | `--surface-card` | `#10305c` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.color` | `#fca5a5` | `toast.error.background over --surface-card` | `#343358` | **6.28:1** | 1.4.3 | 4.5:1 | ok |
| `toast.error.detail.color` | `#ffffff` | `toast.error.background over --surface-card` | `#343358` | **11.93:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#d4d4d8` | `message.secondary.background over --surface-ground` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#9fb5d6` | `--surface-ground` | `#0e2a52` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#d4d4d8` | `toast.secondary.background over --surface-ground` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#ffffff` | `toast.secondary.background over --surface-ground` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.color` | `#d4d4d8` | `message.secondary.background over --surface-card` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `message.secondary.simple.color` | `#9fb5d6` | `--surface-card` | `#10305c` | **6.29:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.color` | `#d4d4d8` | `toast.secondary.background over --surface-card` | `#27272a` | **10.08:1** | 1.4.3 | 4.5:1 | ok |
| `toast.secondary.detail.color` | `#ffffff` | `toast.secondary.background over --surface-card` | `#27272a` | **14.89:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#09090b` | `message.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#e8f0fb` | `--surface-ground` | `#0e2a52` | **12.43:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#09090b` | `toast.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#09090b` | `toast.contrast.background over --surface-ground` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.color` | `#09090b` | `message.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `message.contrast.simple.color` | `#e8f0fb` | `--surface-card` | `#10305c` | **11.43:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.color` | `#09090b` | `toast.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |
| `toast.contrast.detail.color` | `#09090b` | `toast.contrast.background over --surface-card` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |

#### text & link button

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.text.secondary.color` | `#9fb5d6` | `--surface-ground` | `#0e2a52` | **6.83:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.secondary.color` | `#9fb5d6` | `--surface-card` | `#10305c` | **6.29:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#86efac` | `--surface-ground` | `#0e2a52` | **10.16:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.success.color` | `#86efac` | `--surface-card` | `#10305c` | **9.35:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#93c5fd` | `--surface-ground` | `#0e2a52` | **7.91:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.info.color` | `#93c5fd` | `--surface-card` | `#10305c` | **7.28:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#fdba74` | `--surface-ground` | `#0e2a52` | **8.46:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.warn.color` | `#fdba74` | `--surface-card` | `#10305c` | **7.79:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#67e8f9` | `--surface-ground` | `#0e2a52` | **9.84:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.help.color` | `#67e8f9` | `--surface-card` | `#10305c` | **9.06:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#fca5a5` | `--surface-ground` | `#0e2a52` | **7.52:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.danger.color` | `#fca5a5` | `--surface-card` | `#10305c` | **6.92:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#e8f0fb` | `--surface-ground` | `#0e2a52` | **12.43:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.contrast.color` | `#e8f0fb` | `--surface-card` | `#10305c` | **11.43:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#e8f0fb` | `--surface-ground` | `#0e2a52` | **12.43:1** | 1.4.3 | 4.5:1 | ok |
| `button.text.plain.color` | `#e8f0fb` | `--surface-card` | `#10305c` | **11.43:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#fb923c` | `--surface-ground` | `#0e2a52` | **6.30:1** | 1.4.3 | 4.5:1 | ok |
| `sunset.button.text.primary.color` | `#fb923c` | `--surface-card` | `#10305c` | **5.80:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#f87171` | `--surface-ground` | `#0e2a52` | **5.16:1** | 1.4.3 | 4.5:1 | ok |
| `fire.button.text.primary.color` | `#f87171` | `--surface-card` | `#10305c` | **4.75:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#f472b6` | `--surface-ground` | `#0e2a52` | **5.39:1** | 1.4.3 | 4.5:1 | ok |
| `coral.button.text.primary.color` | `#f472b6` | `--surface-card` | `#10305c` | **4.96:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#4ade80` | `--surface-ground` | `#0e2a52` | **8.19:1** | 1.4.3 | 4.5:1 | ok |
| `forest.button.text.primary.color` | `#4ade80` | `--surface-card` | `#10305c` | **7.54:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#2dd4bf` | `--surface-ground` | `#0e2a52` | **7.67:1** | 1.4.3 | 4.5:1 | ok |
| `ocean.button.text.primary.color` | `#2dd4bf` | `--surface-card` | `#10305c` | **7.05:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#22d3ee` | `--surface-ground` | `#0e2a52` | **7.90:1** | 1.4.3 | 4.5:1 | ok |
| `aurora.button.text.primary.color` | `#22d3ee` | `--surface-card` | `#10305c` | **7.27:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#85a7ff` | `--surface-ground` | `#0e2a52` | **6.09:1** | 1.4.3 | 4.5:1 | ok |
| `twilight.button.text.primary.color` | `#85a7ff` | `--surface-card` | `#10305c` | **5.61:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#f9a8d4` | `--surface-ground` | `#0e2a52` | **7.87:1** | 1.4.3 | 4.5:1 | ok |
| `mystic.button.text.primary.color` | `#f9a8d4` | `--surface-card` | `#10305c` | **7.24:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#d6d3d1` | `--surface-ground` | `#0e2a52` | **9.58:1** | 1.4.3 | 4.5:1 | ok |
| `stone.button.text.primary.color` | `#d6d3d1` | `--surface-card` | `#10305c` | **8.81:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#f8fafc` | `--surface-ground` | `#0e2a52` | **13.64:1** | 1.4.3 | 4.5:1 | ok |
| `contrast.button.text.primary.color` | `#f8fafc` | `--surface-card` | `#10305c` | **12.55:1** | 1.4.3 | 4.5:1 | ok |

#### filled button (contrast)

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `button.contrast.color` | `#09090b` | `button.contrast.background` | `#ffffff` | **19.90:1** | 1.4.3 | 4.5:1 | ok |

#### avatar

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `avatar.color` | `#ffffff` | `avatar.background` | `#3f3f46` | **10.44:1** | 1.4.3 | 4.5:1 | ok |

#### image preview

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `image.action.color` | `#fafafa` | `image.toolbar.background over mask.background over --surface-ground` | `#02070d` | **19.37:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-ground` | `#1b2025` | **16.41:1** | 1.4.11 | 3:1 | ok |
| `image.action.color` | `#fafafa` | `image.toolbar.background over mask.background over --surface-card` | `#02080f` | **19.27:1** | 1.4.11 | 3:1 | ok |
| `image.action.hover.color` | `#ffffff` | `image.action.hover.background over the toolbar over --surface-card` | `#1b2127` | **16.24:1** | 1.4.11 | 3:1 | ok |

#### focus ring

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-ground` | `#0e2a52` | **6.30:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-card` | `#10305c` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `--surface-section` | `#173d74` | **4.74:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `dialog.background` | `#18181b` | **7.83:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `chip.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring)` | `#fb923c` | `paginator.background` | `#10305c` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `datatable.row.background` | `#10305c` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `datatable.row.hover.background` | `#27272a` | **6.58:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `sunset.datatable.row.selected.background` | `#36485f` | **4.13:1** | 1.4.11 | 3:1 | ok |
| `sunset.--primary-color-fg (kit focus ring, inset)` | `#fb923c` | `autocomplete.chip.focus.background` | `#3f3f46` | **4.61:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-ground` | `#0e2a52` | **5.16:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-card` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `--surface-section` | `#173d74` | **3.88:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `dialog.background` | `#18181b` | **6.40:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `chip.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring)` | `#f87171` | `paginator.background` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `datatable.row.background` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `datatable.row.hover.background` | `#27272a` | **5.38:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `fire.datatable.row.selected.background` | `#364368` | **3.52:1** | 1.4.11 | 3:1 | ok |
| `fire.--primary-color-fg (kit focus ring, inset)` | `#f87171` | `autocomplete.chip.focus.background` | `#3f3f46` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-ground` | `#0e2a52` | **5.39:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-card` | `#10305c` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `--surface-section` | `#173d74` | **4.05:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `dialog.background` | `#18181b` | **6.69:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `chip.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring)` | `#f472b6` | `paginator.background` | `#10305c` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `datatable.row.background` | `#10305c` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `datatable.row.hover.background` | `#27272a` | **5.62:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `coral.datatable.row.selected.background` | `#364373` | **3.59:1** | 1.4.11 | 3:1 | ok |
| `coral.--primary-color-fg (kit focus ring, inset)` | `#f472b6` | `autocomplete.chip.focus.background` | `#3f3f46` | **3.94:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-ground` | `#0e2a52` | **8.19:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-card` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `--surface-section` | `#173d74` | **6.16:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `dialog.background` | `#18181b` | **10.17:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `chip.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring)` | `#4ade80` | `paginator.background` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `datatable.row.background` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `datatable.row.hover.background` | `#27272a` | **8.55:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `forest.datatable.row.selected.background` | `#21516a` | **4.92:1** | 1.4.11 | 3:1 | ok |
| `forest.--primary-color-fg (kit focus ring, inset)` | `#4ade80` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.99:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-ground` | `#0e2a52` | **7.67:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-card` | `#10305c` | **7.05:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `--surface-section` | `#173d74` | **5.77:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `dialog.background` | `#18181b` | **9.52:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `chip.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring)` | `#2dd4bf` | `paginator.background` | `#10305c` | **7.05:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `datatable.row.background` | `#10305c` | **7.05:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `datatable.row.hover.background` | `#27272a` | **8.00:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `ocean.datatable.row.selected.background` | `#1d5174` | **4.55:1** | 1.4.11 | 3:1 | ok |
| `ocean.--primary-color-fg (kit focus ring, inset)` | `#2dd4bf` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-ground` | `#0e2a52` | **7.90:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-card` | `#10305c` | **7.27:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `--surface-section` | `#173d74` | **5.94:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `dialog.background` | `#18181b` | **9.80:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `chip.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring)` | `#22d3ee` | `paginator.background` | `#10305c` | **7.27:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `datatable.row.background` | `#10305c` | **7.27:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `datatable.row.hover.background` | `#27272a` | **8.24:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `aurora.datatable.row.selected.background` | `#1b5176` | **4.68:1** | 1.4.11 | 3:1 | ok |
| `aurora.--primary-color-fg (kit focus ring, inset)` | `#22d3ee` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-ground` | `#0e2a52` | **6.09:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-card` | `#10305c` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `--surface-section` | `#173d74` | **4.58:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `dialog.background` | `#18181b` | **7.57:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `chip.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring)` | `#85a7ff` | `paginator.background` | `#10305c` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `datatable.row.background` | `#10305c` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `datatable.row.hover.background` | `#27272a` | **6.36:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `twilight.datatable.row.selected.background` | `#2b4b76` | **3.78:1** | 1.4.11 | 3:1 | ok |
| `twilight.--primary-color-fg (kit focus ring, inset)` | `#85a7ff` | `autocomplete.chip.focus.background` | `#3f3f46` | **4.46:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-ground` | `#0e2a52` | **7.87:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-card` | `#10305c` | **7.24:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `--surface-section` | `#173d74` | **5.92:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `dialog.background` | `#18181b` | **9.77:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `chip.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring)` | `#f9a8d4` | `paginator.background` | `#10305c` | **7.24:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `datatable.row.background` | `#10305c` | **7.24:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `datatable.row.hover.background` | `#27272a` | **8.21:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `mystic.datatable.row.selected.background` | `#364b76` | **4.78:1** | 1.4.11 | 3:1 | ok |
| `mystic.--primary-color-fg (kit focus ring, inset)` | `#f9a8d4` | `autocomplete.chip.focus.background` | `#3f3f46` | **5.76:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-ground` | `#0e2a52` | **9.58:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-card` | `#10305c` | **8.81:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `--surface-section` | `#173d74` | **7.21:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `dialog.background` | `#18181b` | **11.89:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `chip.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring)` | `#d6d3d1` | `paginator.background` | `#10305c` | **8.81:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `datatable.row.background` | `#10305c` | **8.81:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `datatable.row.hover.background` | `#27272a` | **10.00:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `stone.datatable.row.selected.background` | `#365176` | **5.43:1** | 1.4.11 | 3:1 | ok |
| `stone.--primary-color-fg (kit focus ring, inset)` | `#d6d3d1` | `autocomplete.chip.focus.background` | `#3f3f46` | **7.01:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-ground` | `#0e2a52` | **13.64:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-card` | `#10305c` | **12.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `--surface-section` | `#173d74` | **10.26:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `dialog.background` | `#18181b` | **16.93:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `chip.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring)` | `#f8fafc` | `paginator.background` | `#10305c` | **12.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `datatable.row.background` | `#10305c` | **12.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `datatable.row.hover.background` | `#27272a` | **14.24:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `contrast.datatable.row.selected.background` | `#365176` | **7.73:1** | 1.4.11 | 3:1 | ok |
| `contrast.--primary-color-fg (kit focus ring, inset)` | `#f8fafc` | `autocomplete.chip.focus.background` | `#3f3f46` | **9.98:1** | 1.4.11 | 3:1 | ok |

#### progress spinner

| foreground | value | background | value | ratio | SC | needs | verdict |
|---|---|---|---|---|---|---|---|
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-ground` | `#0e2a52` | **6.30:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-card` | `#10305c` | **5.80:1** | 1.4.11 | 3:1 | ok |
| `sunset.progressspinner.color.one…four` | `#fb923c` | `--surface-section` | `#173d74` | **4.74:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-ground` | `#0e2a52` | **5.16:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-card` | `#10305c` | **4.75:1** | 1.4.11 | 3:1 | ok |
| `fire.progressspinner.color.one…four` | `#f87171` | `--surface-section` | `#173d74` | **3.88:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-ground` | `#0e2a52` | **5.39:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-card` | `#10305c` | **4.96:1** | 1.4.11 | 3:1 | ok |
| `coral.progressspinner.color.one…four` | `#f472b6` | `--surface-section` | `#173d74` | **4.05:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-ground` | `#0e2a52` | **8.19:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-card` | `#10305c` | **7.54:1** | 1.4.11 | 3:1 | ok |
| `forest.progressspinner.color.one…four` | `#4ade80` | `--surface-section` | `#173d74` | **6.16:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-ground` | `#0e2a52` | **7.67:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-card` | `#10305c` | **7.05:1** | 1.4.11 | 3:1 | ok |
| `ocean.progressspinner.color.one…four` | `#2dd4bf` | `--surface-section` | `#173d74` | **5.77:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-ground` | `#0e2a52` | **7.90:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-card` | `#10305c` | **7.27:1** | 1.4.11 | 3:1 | ok |
| `aurora.progressspinner.color.one…four` | `#22d3ee` | `--surface-section` | `#173d74` | **5.94:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-ground` | `#0e2a52` | **6.09:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-card` | `#10305c` | **5.61:1** | 1.4.11 | 3:1 | ok |
| `twilight.progressspinner.color.one…four` | `#85a7ff` | `--surface-section` | `#173d74` | **4.58:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-ground` | `#0e2a52` | **7.87:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-card` | `#10305c` | **7.24:1** | 1.4.11 | 3:1 | ok |
| `mystic.progressspinner.color.one…four` | `#f9a8d4` | `--surface-section` | `#173d74` | **5.92:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-ground` | `#0e2a52` | **9.58:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-card` | `#10305c` | **8.81:1** | 1.4.11 | 3:1 | ok |
| `stone.progressspinner.color.one…four` | `#d6d3d1` | `--surface-section` | `#173d74` | **7.21:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-ground` | `#0e2a52` | **13.64:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-card` | `#10305c` | **12.55:1** | 1.4.11 | 3:1 | ok |
| `contrast.progressspinner.color.one…four` | `#f8fafc` | `--surface-section` | `#173d74` | **10.26:1** | 1.4.11 | 3:1 | ok |
