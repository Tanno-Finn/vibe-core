# Third-party fonts

Every typeface this kit ships is **self-hosted**: no `.woff2` is tracked in the repo —
they are copied out of an `@fontsource/*` package at build time (`angular.json` →
`assets`) into
`dist/…/assets/fonts/<family>/`, and a hand-written `src/assets/fonts/<family>.css` declares
the `@font-face` rules. **No font is ever fetched from a third-party host** — `googleapis`,
`gstatic` and `fonts.g*` have zero occurrences in `src/`, `public/` and `index.html`, and a
silent request to a font CDN would be reader data leaving the room (PRIV-004).

Fonts load **on demand**: `FontService` injects the stylesheet `<link>` only when a reader
picks that font, or when the active visual style names it (ADR-0016 D4). Nothing in this
table is part of the initial bundle.

## License

All 14 families are licensed under the **SIL Open Font License 1.1** (`OFL-1.1`). The
OFL requires that the license travels with the files, so the build collects every
package's `LICENSE` into `assets/fonts/LICENSES.txt` and ships it beside the fonts
(`scripts/build-font-licenses.mjs`, run from `prebuild`). The OFL itself is at
<https://openfontlicense.org>. The OFL requires that the fonts are not sold
on their own, that any modified version is renamed, and that the license travels with the
files — all three hold for a build that copies the packaged files unmodified.

## Shipped families

`role` says why the family is in the kit: a **reader font option** in the font picker, or a
**style font** that a visual style sets as its default (ADR-0016).

| family | package (version) | role | latin weights shipped | stylesheet |
|---|---|---|---|---|
| Source Sans 3 | `@fontsource/source-sans-3` (5.3.0) | reader font option | 400, 700 | `src/assets/fonts/source-sans-3.css` |
| Inter | `@fontsource/inter` (5.3.0) | reader font option | 400, 700 | `src/assets/fonts/inter.css` |
| IBM Plex Sans | `@fontsource/ibm-plex-sans` (5.3.0) | reader font option · body font of *Blaupause* | 400, 700 | `src/assets/fonts/ibm-plex-sans.css` |
| Bricolage Grotesque | `@fontsource/bricolage-grotesque` (5.3.0) | reader font option | 400, 700 | `src/assets/fonts/bricolage-grotesque.css` |
| Atkinson Hyperlegible | `@fontsource/atkinson-hyperlegible` (5.3.0) | reader font option · body font of *Lernwerkstatt* | 400, 700 | `src/assets/fonts/atkinson-hyperlegible.css` |
| Andika | `@fontsource/andika` (5.3.0) | reader font option | 400, 700 | `src/assets/fonts/andika.css` |
| Lexend | `@fontsource/lexend` (5.3.0) | reader font option | 400, 700 | `src/assets/fonts/lexend.css` |
| OpenDyslexic | `@fontsource/opendyslexic` (5.3.0) | reader font option (readable-font toggle) | 400, 700 | `src/assets/fonts/opendyslexic.css` |
| Baloo 2 | `@fontsource/baloo-2` (5.3.0) | heading font of *Lernwerkstatt* | 700 | `src/assets/fonts/baloo-2.css` |
| Lora | `@fontsource/lora` (5.3.0) | heading font of *Skizzenbuch* | 700 | `src/assets/fonts/lora.css` |
| Nunito Sans | `@fontsource/nunito-sans` (5.3.0) | body font of *Skizzenbuch* | 400, 700 | `src/assets/fonts/nunito-sans.css` |
| Archivo | `@fontsource/archivo` (5.3.0) | body font of *Werkbund* | 400, 700 | `src/assets/fonts/archivo.css` |
| Archivo Black | `@fontsource/archivo-black` (5.3.0) | heading font of *Werkbund* | 400 (its only weight) | `src/assets/fonts/archivo-black.css` |
| Rajdhani | `@fontsource/rajdhani` (5.3.0) | heading font of *Blaupause* | 700 | `src/assets/fonts/rajdhani.css` |

Heading families ship a **single weight**, because a heading font is only used for `h1–h6`.
Body families ship 400 and 700, the kit's existing convention.

## Weight of the style fonts on disk

The eight files added for the four visual styles (measured 2026-09-05, `node_modules`):

| file | bytes |
|---|---|
| `baloo-2-latin-700-normal.woff2` | 19,436 |
| `lora-latin-700-normal.woff2` | 21,044 |
| `nunito-sans-latin-400-normal.woff2` | 13,892 |
| `nunito-sans-latin-700-normal.woff2` | 13,836 |
| `archivo-latin-400-normal.woff2` | 14,700 |
| `archivo-latin-700-normal.woff2` | 14,508 |
| `archivo-black-latin-400-normal.woff2` | 18,604 |
| `rajdhani-latin-700-normal.woff2` | 15,688 |

**131,708 bytes total on disk**, of which an active style fetches at most three files
(≈ 33–49 kB), and only after a reader picks that style or returns with it stored.
Initial-bundle delta: **0** — these are assets, not JavaScript.

## Adding a family

1. `npm install --save @fontsource/<family>@<version>` and check its `license` field.
2. Add an `assets` entry in `angular.json` with a glob that names the **latin** weights only.
3. Write `src/assets/fonts/<family>.css` following the existing files.
4. Reference it from `FONT_OPTIONS` (a reader font) or from a style's `fonts` (a style font)
   as `assets/fonts/<family>.css`.
5. Add a row to the table above — this file is the license record, and a family that ships
   without a row is a compliance gap, not a detail. `scripts/build-font-licenses.mjs`
   enforces exactly that: it fails the build if `angular.json`, `package.json` and this
   table disagree, if a package is not a runtime dependency (a devDependency breaks
   `npm ci --omit=dev`), or if it declares a license other than OFL-1.1. Update the
   family count in the license section too — the script checks that number.
