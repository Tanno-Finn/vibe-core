#!/usr/bin/env node
/**
 * check-contrast — the colour-contrast gate (SPEC D4).
 *
 * Fails (exit 1) when a colour pair the kit actually renders falls below the WCAG 2.1
 * success criterion that governs it, or when the committed compilat no longer matches
 * what the tokens say. It is the first gate that catches a VISUAL regression
 * mechanically: every other gate here checks structure, this one checks pixels-by-maths.
 *
 * WHY A GATE AND NOT A SPEC FILE
 * The kit's THEME_COLORS block (theme.service.ts) once claimed "verified ≥4.5:1 vs
 * --surface-ground in theme-tokens-wcag.spec.ts" — a file that never existed in this
 * repo. That claim was therefore unverified; it was replaced with a pointer
 * here and deleted the runtime's unused WCAG helpers. This gate re-derives the numbers from the
 * real token values on every build, so the claim is true by construction, and writes them
 * to a compilat (docs/generated/) that guide authors CITE instead of hand-measuring.
 * A hand-measured number in prose goes stale at the next token tweak in silence; a cited
 * one goes stale loudly, because the compilat is regenerated and the drift check fires.
 *
 * WHAT IT READS (measured, not assumed — see `readTokens` for the parsing)
 *   1. src/app/services/ui-styles.ts — the four visual styles (ADR-0016), text-parsed by
 *      the parser contract that file documents: surfaces and text colours per mode, the
 *      control edge, the dark placeholder and the severity button colours. These are what
 *      the runtime writes as inline custom properties on <html>, so they are the shipped
 *      values, and every pair below is measured for EVERY style × mode.
 *   2. src/styles.scss  — the top-level `:root` and `html.dark-theme` blocks: the kit-level
 *      tokens that do not belong to a style (the semantic inline colours, the dev toggle)
 *      plus the static surface fallbacks. These are the LAST declarations in the cascade
 *      (design-tokens.scss is pulled in by `@use` at the top, so its `:root` output comes
 *      first and loses), which makes them the effective pre-JS values.
 *   3. src/index.html — the two anti-FOUC rules that paint the very first frame.
 *      Check 1 asserts that both static layers (2 and 3) equal the DEFAULT style from (1):
 *      if they diverge, a first visit and every prerendered page show colours that nothing
 *      measured.
 *   4. src/app/services/theme.service.ts — the exported THEME_COLORS array: the 10 brand
 *      palettes, each with a background role (filled-button gradient) and a foreground
 *      role (links, titles, icons, outlined borders).
 *   5. node_modules/@openng/optimus-ui-themes/dist/aura — Aura's base and component
 *      token modules, for the WIDGET pairs (checkbox, toggleswitch, tag, chip, dialog,
 *      skeleton, select/inputtext/textarea/multiselect/autocomplete/inputnumber/
 *      cascadeselect and their invalid edge, the icons inside a field, the float
 *      label, slider, progressbar, progress spinner, togglebutton and its pressed
 *      pill, the menu family's focus ring and chevron, the one kit focus ring (on
 *      the option lists' active option too), panel
 *      outlines, table (incl. the selected-row bar) and paginator, text/link
 *      buttons and the filled contrast button, badge, message and toast, avatar,
 *      the image preview toolbar). Aura is
 *      resolved as the kit configures it — stock surfaces, the accent ramp, and every
 *      styles.scss rule that re-points or repaints a measured widget — see the "widget
 *      layer" section. These are the pairs the design-system guides cite instead of
 *      hedging ("Aura stock palette, not gated").
 *
 * DERIVED COLOURS are recomputed with the runtime's own arithmetic, ported 1:1 from
 * theme.service.ts (`lightenColor`, `darkenColor`, `getOptimalTextColor`) and from CSS
 * `color-mix(in srgb, …)`. A derived colour that the gate computed differently from the
 * app would make the gate lie, so these ports are deliberately literal, warts included.
 *
 * WHICH SUCCESS CRITERION APPLIES is decided per pair from its ROLE IN THIS KIT, not
 * copied from another project's token set. Text on a surface is SC 1.4.3 (4.5:1 normal
 * text; 3:1 only for large text — no pair here qualifies, the kit has no ≥18.66px/bold-14px
 * token-level text role). A boundary that identifies a control is SC 1.4.11 (3:1). Each
 * PAIRS entry states its role and its criterion in a comment, so a reviewer can disagree
 * with the classification without reading any component code.
 *
 * DELIBERATELY OUT OF SCOPE (so the omissions are reviewable, not accidental):
 *   - `--text-color-muted` / `--text-color-disabled`: 1 and 0 usages respectively, and
 *     they are only defined in the SASS-map layer (design-tokens.scss `$light-theme`),
 *     which this gate does not parse. Disabled text is exempt from 1.4.3 anyway.
 *   - Focus indicators: drawn with `--primary-color-fg`, which IS gated (the dead
 *     `--focus-ring-color` token was deleted 2026-09-24).
 *   - Alpha-composited tints (`.dark-theme --green-100: rgba(…, .18)` and friends): the
 *     backdrop they composite over varies per component, so a token-level ratio would be
 *     fiction. Those belong in a per-component audit, not in a token gate. (The widget
 *     rows differ: a translucent widget fill — a dark tag, the dark skeleton — is
 *     composited over each page surface it can sit on, --surface-ground and
 *     --surface-card, and listed once per surface.)
 *   - Most hover, focus-border and disabled states of the widgets, and demo-scoped
 *     overrides inside the dev articles: the rows measure the resting states the kit
 *     ships globally, plus the states that carry meaning on their own — the invalid
 *     edge, the one kit focus ring (menu items and other inset parts included) and
 *     the ink ring of the notices and the image toolbar, the current page, the
 *     selected table row, the pressed toggle/select button, the floated label, and
 *     the hovered toggle button and image toolbar action. A styles.scss rule that
 *     repaints a measured widget with a plain property other than the tag
 *     repaints, the signature input edge and the rules read by selector (the
 *     menu ring, the invalid edge) is not modelled —
 *     add it to readWidgetOverrides when one appears.
 *   - SC 1.4.11 for skeletons and the progress track: decoration / not the value carrier,
 *     so no minimum applies. They are listed as INFORMATIONAL rows (SC `none`).
 *
 * Node core only, like every other gate here (no npm package is imported as code). The
 * widget pairs read Aura's installed token modules as data, so they need `npm ci` first
 * — which every CI job that runs this gate does; without it the gate fails loudly.
 *
 * Usage:
 *   node scripts/check-contrast.mjs           verify tokens + verify the compilat is fresh
 *   node scripts/check-contrast.mjs --write   regenerate the compilat in docs/generated/
 *   VERBOSE=1 …                               also list the green checks
 *   SELFTEST=1 …                              additionally run the maths against known
 *                                             WCAG reference values and the parsers
 *                                             against synthetic input
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DECLINED_COMPONENTS, libraryEntrypoints } from './design-guides.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STYLES = 'src/styles.scss';
const THEME_SERVICE = 'src/app/services/theme.service.ts';
const UI_STYLES = 'src/app/services/ui-styles.ts';
const INDEX_HTML = 'src/index.html';
const COMPILAT_MD = 'docs/generated/CONTRAST.MD';
const COMPILAT_JSON = 'docs/generated/contrast.json';

const WRITE = process.argv.includes('--write');
const errors = [];
const ok = [];

const abs = (p) => path.join(ROOT, p);
const read = (p) => fs.readFileSync(abs(p), 'utf8');

// ---------------------------------------------------------------------------
// WCAG 2.1 maths — ported from scripts/theming-verify/wcag-replica.mjs (the
// runtime carries no contrast maths: every foreground is curated).
// ---------------------------------------------------------------------------

/** sRGB channel (0-255) → linear-light value. WCAG 2.1 relative-luminance step 1. */
const linearize = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

/** #rgb / #rrggbb → [r, g, b] in 0-255. Throws on anything else — a silently
 *  mis-parsed colour would produce a plausible-looking wrong ratio. */
function rgb(hex) {
  const h = String(hex).replace('#', '');
  const e = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  if (!/^[0-9a-fA-F]{6}$/.test(e)) throw new Error(`not a hex color: ${hex}`);
  return [parseInt(e.slice(0, 2), 16), parseInt(e.slice(2, 4), 16), parseInt(e.slice(4, 6), 16)];
}

/** WCAG 2.1 relative luminance of an sRGB hex colour. */
function luminance(hex) {
  const [r, g, b] = rgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG contrast ratio between two hex colours. Range [1, 21]. */
function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');

/** CSS `color-mix(in srgb, <a> <p>%, <b>)` for two opaque colours: a plain per-channel
 *  lerp in the sRGB space (no premultiplication needed without alpha). */
function mix(a, b, percentOfA) {
  const A = rgb(a);
  const B = rgb(b);
  const t = percentOfA / 100;
  return '#' + A.map((v, i) => toHex(Math.round(v * t + B[i] * (1 - t)))).join('');
}

/** Port of theme.service.ts `lightenColor` — a flat additive shift per channel, clamped.
 *  Not a perceptual lighten; reproduced exactly because the app ships exactly this. */
function lightenColor(hex, percent) {
  const amt = Math.round(2.55 * percent * 100);
  return (
    '#' +
    rgb(hex)
      .map((v) => toHex(v + amt))
      .join('')
  );
}

/** Port of theme.service.ts `darkenColor` — the additive shift, downwards. */
function darkenColor(hex, percent) {
  const amt = Math.round(2.55 * percent * 100);
  return (
    '#' +
    rgb(hex)
      .map((v) => toHex(v - amt))
      .join('')
  );
}

/** Port of theme.service.ts `getOptimalTextColor`: picks the filled-button label colour
 *  from the AVERAGE luminance of the two gradient stops, at a 3:1 bar. The gate does not
 *  endorse that heuristic — it reproduces it, then measures the result against the
 *  criterion that actually applies (see the FILLED-BUTTON pairs). */
function optimalTextColor(primary, accent) {
  const avg = (luminance(primary) + luminance(accent)) / 2;
  return (1 + 0.05) / (avg + 0.05) >= 3.0 ? '#ffffff' : '#1e293b';
}

// ---------------------------------------------------------------------------
// Token extraction
// ---------------------------------------------------------------------------

/**
 * Blank out `/* … *\/` and `// …` comments while keeping every line and column, so the
 * line-based block reader below can stay simple. Prose in comments is full of braces
 * (`p-{color}-800`, `${…}`) and would otherwise read as markup.
 */
function stripComments(src) {
  const blanked = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  return blanked
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, (m) => ' '.repeat(m.length)))
    .join('\n');
}

/**
 * Collect the custom properties declared in every TOP-LEVEL block in styles.scss whose
 * selector is exactly `:root` or `html.dark-theme`, in file order, last-wins (the cascade).
 * Only hex-valued declarations are kept; everything else (fonts, shadows, color-mix
 * chains, rgba tints) is not a contrast input.
 *
 * A bare top-level `.dark-theme` token block is refused: ThemeService puts the mode class
 * on <body> too, so its tokens shadow the inline style tokens on <html> for the whole page
 * and every style would show the values measured here for the default one.
 *
 * The parse is line-based and deliberately strict: a block that contains a nested rule is
 * refused rather than half-read, because a half-read block would silently drop the very
 * override that changed a colour.
 */
function readScssThemeTokens() {
  const lines = stripComments(read(STYLES)).split(/\r?\n/);
  const out = { light: {}, dark: {} };
  for (let i = 0; i < lines.length; i++) {
    if (/^\.dark-theme\s*\{\s*$/.test(lines[i])) {
      errors.push(
        `${STYLES}:${i + 1}: a top-level \`.dark-theme\` token block also matches <body> and overrides every style's own dark tokens — scope it to \`html.dark-theme\`.`,
      );
      continue;
    }
    const m = /^(:root|html\.dark-theme)\s*\{\s*$/.exec(lines[i]);
    if (!m) continue;
    const bucket = m[1] === ':root' ? out.light : out.dark;
    let j = i + 1;
    for (; j < lines.length && !/^\}\s*$/.test(lines[j]); j++) {
      if (/[{]/.test(lines[j])) {
        errors.push(
          `${STYLES}:${j + 1}: nested rule inside the top-level ${m[1]} block — the token parser refuses to guess.`,
        );
        return out;
      }
      const d = /^\s*(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/.exec(lines[j]);
      if (d) bucket[d[1]] = d[2].toLowerCase();
    }
    if (j >= lines.length) errors.push(`${STYLES}: unterminated ${m[1]} block starting at line ${i + 1}.`);
    i = j;
  }
  return out;
}

/**
 * The visual styles (ADR-0016), read as TEXT from `ui-styles.ts` by the parser
 * contract that file documents in its header — the same technique
 * check-design-guides.mjs uses on the registry. The gate must not import Angular
 * code (it has to run without a build), and a partial parse would let the whole
 * measurement pass vacuously, so every step below refuses rather than guesses.
 *
 * Per style it extracts:
 *   - `surfaces.light` / `surfaces.dark`: the seven ground colours plus
 *     `controlBorder` and (dark) `controlPlaceholder`;
 *   - `severityGradients`: `from`, `to` and the optional label `text`;
 *   - `brandScale` steps 400/500 and `extraTokens.<mode>['--style-brand-ink']`,
 *     the pair the signature blocks paint on the brand chip.
 * The numeric surface scales are not contrast inputs at token level (no text
 * role is defined on them) and are deliberately not read.
 */
function readUiStyles() {
  const src = stripComments(read(UI_STYLES));
  const out = [];
  // Style blocks are delimited by their `name: '<slug>',` line; the next such
  // line (or EOF) ends the block.
  const heads = [...src.matchAll(/^\s*name:\s*'([a-z0-9-]+)',\s*$/gm)];
  if (!heads.length) {
    errors.push(
      `${UI_STYLES}: no style blocks found (expected \`name: '<slug>',\` lines) — the gate would measure nothing.`,
    );
    return [];
  }
  for (let i = 0; i < heads.length; i++) {
    const name = heads[i][1];
    const body = src.slice(heads[i].index, i + 1 < heads.length ? heads[i + 1].index : src.length);

    // --- surfaces: light block, then dark block ---------------------------
    const sIdx = body.indexOf('surfaces: {');
    const scaleIdx = body.indexOf('surfaceScale: {');
    if (sIdx < 0 || scaleIdx < 0 || scaleIdx < sIdx) {
      errors.push(
        `${UI_STYLES}: style "${name}" has no \`surfaces:\` block before \`surfaceScale:\` — parser contract broken.`,
      );
      continue;
    }
    const surfacesSrc = body.slice(sIdx, scaleIdx);
    const lightIdx = surfacesSrc.indexOf('light: {');
    const darkIdx = surfacesSrc.indexOf('dark: {');
    if (lightIdx < 0 || darkIdx < 0 || darkIdx < lightIdx) {
      errors.push(`${UI_STYLES}: style "${name}" surfaces must hold \`light:\` before \`dark:\`.`);
      continue;
    }
    const fields = (chunk) => {
      const map = {};
      for (const m of chunk.matchAll(/^\s*([a-zA-Z]+):\s*'(#[0-9a-fA-F]{6})',\s*$/gm)) map[m[1]] = m[2].toLowerCase();
      return map;
    };
    const surfaces = {
      light: fields(surfacesSrc.slice(lightIdx, darkIdx)),
      dark: fields(surfacesSrc.slice(darkIdx)),
    };
    const REQUIRED = [
      'ground',
      'card',
      'section',
      'border',
      'hover',
      'textColor',
      'textColorSecondary',
      'controlBorder',
    ];
    let broken = false;
    for (const mode of ['light', 'dark']) {
      for (const f of REQUIRED) {
        if (!surfaces[mode][f]) {
          errors.push(`${UI_STYLES}: style "${name}" ${mode} surfaces are missing a hex \`${f}\`.`);
          broken = true;
        }
      }
    }
    if (broken) continue;

    // --- severity gradients ------------------------------------------------
    const gIdx = body.indexOf('severityGradients: {');
    const severities = {};
    if (gIdx >= 0) {
      const chunk = body.slice(gIdx, body.indexOf('\n  },', gIdx));
      for (const m of chunk.matchAll(
        /^\s*([a-z]+):\s*\{\s*from:\s*'(#[0-9a-fA-F]{6})',\s*to:\s*'(#[0-9a-fA-F]{6})'(?:,\s*text:\s*'(#[0-9a-fA-F]{6})')?\s*\},\s*$/gm,
      )) {
        severities[m[1]] = {
          from: m[2].toLowerCase(),
          to: m[3].toLowerCase(),
          text: (m[4] ?? '#ffffff').toLowerCase(),
        };
      }
    }
    if (Object.keys(severities).length !== 6) {
      errors.push(
        `${UI_STYLES}: style "${name}" parsed ${Object.keys(severities).length} severity gradients, expected 6.`,
      );
      continue;
    }

    // --- brand chip: brandScale steps + the ink token ----------------------
    // The signature blocks paint app-root .app-title-link with var(--primary-400)
    // or var(--primary-500) and put --style-brand-ink on it. Both halves are read
    // here; readBrandChipSteps() below says which step (if any) a style uses.
    const bIdx = body.indexOf('brandScale: {');
    const brand = {};
    if (bIdx >= 0) {
      const chunk = body.slice(bIdx, body.indexOf('\n  },', bIdx));
      for (const m of chunk.matchAll(/'(400|500)':\s*'(#[0-9a-fA-F]{6})'/g)) brand[m[1]] = m[2].toLowerCase();
    }
    if (!brand['400'] || !brand['500']) {
      errors.push(
        `${UI_STYLES}: style "${name}" has no hex brandScale steps 400 and 500 — the brand chip pairs cannot be measured.`,
      );
      continue;
    }
    const eIdx = body.indexOf('extraTokens: {');
    const brandInk = {};
    if (eIdx >= 0) {
      const chunk = body.slice(eIdx);
      const lIdx = chunk.indexOf('light: {');
      const dIdx = chunk.indexOf('dark: {');
      if (lIdx >= 0 && dIdx > lIdx) {
        const ink = (part) => {
          const m = /'--style-brand-ink':\s*'(#[0-9a-fA-F]{6})'/.exec(part);
          return m ? m[1].toLowerCase() : null;
        };
        brandInk.light = ink(chunk.slice(lIdx, dIdx));
        brandInk.dark = ink(chunk.slice(dIdx));
      }
    }
    if (!brandInk.light || !brandInk.dark) {
      errors.push(
        `${UI_STYLES}: style "${name}" must declare a hex \`--style-brand-ink\` in extraTokens.light AND .dark.`,
      );
      continue;
    }

    out.push({ name, surfaces, severities, brand, brandInk });
  }
  return out;
}

/**
 * Which brandScale step each style's signature block paints its title chip with,
 * read from `styles.scss` rather than guessed: inside `html.style-<name>`, the
 * rule `app-root .app-title-link` either fills with `var(--primary-<step>)` or
 * it does not fill at all (blaupause draws an outlined title box). A style with
 * no filled chip puts no ink on brand and is measured for no such pair.
 */
function readBrandChipSteps() {
  const src = read(STYLES);
  const steps = {};
  for (const m of src.matchAll(/^html\.style-([a-z0-9-]+)\s*\{/gm)) {
    const name = m[1];
    const rest = src.slice(m.index + m[0].length);
    const end = /^html\.style-/m.exec(rest);
    const block = end ? rest.slice(0, end.index) : rest;
    const rule = /app-root\s+\.app-title-link\s*\{([^}]*)\}/.exec(block);
    const fill = rule ? /background:\s*var\(--primary-(\d{3})\)/.exec(rule[1]) : null;
    steps[name] = fill ? [fill[1]] : [];
  }
  return steps;
}

/** The default style — the one styles.scss and the boot script must agree with. */
function readDefaultStyleName() {
  const m = /DEFAULT_STYLE_NAME:\s*StyleName\s*=\s*'([a-z0-9-]+)'/.exec(read(UI_STYLES));
  if (!m) {
    errors.push(
      `${UI_STYLES}: DEFAULT_STYLE_NAME not found — check 1 cannot know which style the static layer must match.`,
    );
    return null;
  }
  return m[1];
}

/**
 * The two anti-FOUC rules in index.html: the colours the very first paint uses
 * before any stylesheet or script of the app has run.
 */
function readBootColors() {
  const src = read(INDEX_HTML);
  const out = {};
  for (const mode of ['dark', 'light']) {
    const re = new RegExp(
      `html\\.${mode}-theme\\s*\\{\\s*background-color:\\s*(#[0-9a-fA-F]{3,6});\\s*color:\\s*(#[0-9a-fA-F]{3,6});\\s*\\}`,
    );
    const m = re.exec(src);
    if (!m) {
      errors.push(
        `${INDEX_HTML}: the anti-FOUC rule for html.${mode}-theme is not in the expected \`background-color: …; color: …;\` shape.`,
      );
      continue;
    }
    out[mode] = { background: m[1].toLowerCase(), color: m[2].toLowerCase() };
  }
  return out;
}

/**
 * Every declaration of the top-level `:root` / `html.dark-theme` blocks, raw value and
 * last-wins — the sibling of readScssThemeTokens for values that are not colours
 * (lengths, shorthands, gradients). Check 1c needs those too: a style's signature
 * is carried by --style-bw and --button-border as much as by its hexes.
 */
function readScssRawTokens() {
  const lines = stripComments(read(STYLES)).split(/\r?\n/);
  const out = { light: {}, dark: {} };
  for (let i = 0; i < lines.length; i++) {
    const m = /^(:root|html\.dark-theme)\s*\{\s*$/.exec(lines[i]);
    if (!m) continue;
    const bucket = m[1] === ':root' ? out.light : out.dark;
    // A declaration may be wrapped over several lines (prettier does that to long
    // gradient values), so lines are joined until the semicolon that closes it.
    let pending = '';
    for (let j = i + 1; j < lines.length && !/^\}\s*$/.test(lines[j]); j++) {
      pending += (pending ? ' ' : '') + lines[j].trim();
      if (!pending.endsWith(';')) {
        i = j;
        continue;
      }
      const d = /^(--[a-z0-9-]+)\s*:\s*(.+?)\s*;$/.exec(pending);
      if (d) bucket[d[1]] = d[2];
      pending = '';
      i = j;
    }
  }
  return out;
}

/**
 * The `extraTokens` of one style, with the shared `OUTLINED_INK` spread resolved.
 * Text-parsed like everything else here; a spread of an unknown name is refused
 * rather than silently dropped, because a dropped token is a token this check
 * would then never compare.
 */
function readStyleExtraTokens(name) {
  const src = stripComments(read(UI_STYLES));
  const consts = {};
  for (const m of src.matchAll(/^const ([A-Z_]+) = \{([\s\S]*?)^\};/gm)) {
    const map = {};
    for (const d of m[2].matchAll(/'(--[a-z0-9-]+)':\s*\n?\s*'([^']*)'/g)) map[d[1]] = d[2];
    consts[m[1]] = map;
  }
  const heads = [...src.matchAll(/^\s*name:\s*'([a-z0-9-]+)',\s*$/gm)];
  const idx = heads.findIndex((h) => h[1] === name);
  if (idx < 0) return null;
  const body = src.slice(heads[idx].index, idx + 1 < heads.length ? heads[idx + 1].index : src.length);
  const eIdx = body.indexOf('extraTokens: {');
  if (eIdx < 0) return null;
  const chunk = body.slice(eIdx, body.indexOf('\n  },', eIdx));
  const out = { common: {}, light: {}, dark: {} };
  const bounds = [];
  for (const part of ['common', 'light', 'dark']) {
    const at = chunk.indexOf(part + ': {');
    if (at >= 0) bounds.push([part, at]);
  }
  bounds.sort((a, b) => a[1] - b[1]);
  for (let i = 0; i < bounds.length; i++) {
    const [part, at] = bounds[i];
    const slice = chunk.slice(at, i + 1 < bounds.length ? bounds[i + 1][1] : chunk.length);
    for (const d of slice.matchAll(/'(--[a-z0-9-]+)':\s*\n?\s*'([^']*)'/g)) out[part][d[1]] = d[2];
    for (const sp of slice.matchAll(/\.\.\.([A-Z_]+),/g)) {
      if (!consts[sp[1]]) {
        errors.push(`${UI_STYLES}: extraTokens of "${name}" spread \`${sp[1]}\`, which this gate could not parse.`);
        continue;
      }
      Object.assign(out[part], consts[sp[1]]);
    }
  }
  return out;
}

/**
 * The allow-list and the fallback the anti-FOUC script in index.html uses to turn
 * the stored `theme` value into the `style-<name>` class.
 */
function readBootStyleResolution() {
  const src = read(INDEX_HTML);
  const list = /var STYLE_NAMES = \[([^\]]*)\];/.exec(src);
  const fallback = /STYLE_NAMES\.indexOf\(stored\) >= 0 \? stored : '([a-z0-9-]+)'/.exec(src);
  if (!list || !fallback) {
    errors.push(
      `${INDEX_HTML}: the boot script no longer resolves the style class as \`STYLE_NAMES … : '<default>'\` — check 1c cannot verify the pre-paint default.`,
    );
    return null;
  }
  return { names: [...list[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]), fallback: fallback[1] };
}

/** The exported THEME_COLORS array: 10 brand palettes × 8 hex fields. */
function readThemeColors() {
  const src = read(THEME_SERVICE);
  const start = src.indexOf('export const THEME_COLORS');
  const end = src.indexOf('\n];', start);
  if (start < 0 || end < 0) {
    errors.push(`${THEME_SERVICE}: THEME_COLORS array literal not found.`);
    return [];
  }
  const body = src.slice(start, end);
  const out = [];
  for (const m of body.matchAll(/\{\s*name:\s*'([a-z-]+)',([\s\S]*?)\}/g)) {
    const entry = { name: m[1] };
    for (const f of m[2].matchAll(/([A-Za-z]+):\s*'(#[0-9a-fA-F]{3,6})'/g)) entry[f[1]] = f[2].toLowerCase();
    out.push(entry);
  }
  return out;
}

// ---------------------------------------------------------------------------
// The widget layer — Optimus UI's Aura preset as the kit configures it
// ---------------------------------------------------------------------------
//
// The page-level pairs above come from the kit's own tokens. The WIDGETS
// (checkbox, toggleswitch, tag, …) paint with Aura's component tokens instead,
// which ThemeService builds as `definePreset(Aura, style.presetOverrides)` plus
// the accent's primary ramp (theme.service.ts, applyTheme step 5). Nothing in
// that chain reads the style's surfaces: Aura's own surface palette (slate
// light, zinc dark) stays in charge, and only the rules in styles.scss that
// re-point an Optimus token, or repaint a widget property, bring the kit's
// colours in. So a widget pair is resolved in four layers, last wins:
//   1. Aura base (primitive + semantic + colorScheme[mode]);
//   2. the accent ramp at semantic.primary.50…950 (mirrored from theme.service.ts
//      and compared against its source text, see readPrimaryRamp);
//   3. element-scoped `--p-<component>-<token>: var(--kit-token)` declarations in
//      styles.scss (`.p-select { … }`, `.dark-theme .p-inputtext { … }`);
//   4. property rules in styles.scss that repaint a measured widget directly
//      (`.dark-theme .p-tag.p-tag-<sev>`, the signature blocks' input border).
// The Aura files are data modules; they are imported, not text-parsed, and a
// missing package fails the gate instead of silently measuring nothing.

const AURA_DIR = 'node_modules/@openng/optimus-ui-themes/dist/aura';
/** Every Aura component whose tokens a widget pair below reads. */
const AURA_COMPONENTS = [
  'autocomplete',
  'avatar',
  'badge',
  'button',
  'cascadeselect',
  'checkbox',
  'chip',
  'contextmenu',
  'datatable',
  'datepicker',
  'dialog',
  'drawer',
  'floatlabel',
  'iftalabel',
  'image',
  'inputgroup',
  'inputnumber',
  'inputtext',
  'listbox',
  'megamenu',
  'menu',
  'menubar',
  'message',
  'multiselect',
  'paginator',
  'panelmenu',
  'password',
  'popover',
  'progressbar',
  'progressspinner',
  'radiobutton',
  'select',
  'skeleton',
  'slider',
  'tag',
  'textarea',
  'tieredmenu',
  'toast',
  'toggleswitch',
  'togglebutton',
  'treeselect',
];

/**
 * The one kit focus ring (styles.scss, the rule beside the form-field rules):
 * every selector here must carry `outline: 2px solid var(--primary-color-fg…)`
 * at `outline-offset: 2px` — or `-2px` for the KIT_RING_INSET parts, whose
 * offset the rule right after it moves inside. The list is the contract — a
 * widget that drops out of the rule falls back to Aura's 1px raw-accent ring,
 * which nothing measures.
 */
const KIT_RING_SELECTORS = [
  '.p-inputtext:focus-visible',
  '.p-textarea:focus-visible',
  '.p-checkbox:has(.p-checkbox-input:focus-visible) .p-checkbox-box',
  '.p-radiobutton:has(.p-radiobutton-input:focus-visible) .p-radiobutton-box',
  '.p-toggleswitch:has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider',
  '.p-treeselect:not(.p-disabled).p-focus',
  '.p-autocomplete-dropdown:focus-visible',
  '.p-button:focus-visible',
  '.p-togglebutton:focus-visible',
  '.p-chip-remove-icon:focus-visible',
  '.p-slider-handle:focus-visible',
  '.p-rating-option.p-focus-visible',
  '.p-step-header:focus-visible',
  '.p-steps-item-link:focus-visible',
  '.p-breadcrumb-item-link:focus-visible',
  '.p-fieldset-toggle-button:focus-visible',
  '.p-tabpanel:focus-visible',
  '.p-paginator-first:focus-visible',
  '.p-paginator-prev:focus-visible',
  '.p-paginator-page:focus-visible',
  '.p-paginator-next:focus-visible',
  '.p-paginator-last:focus-visible',
  '.p-datatable-row-toggle-button:focus-visible',
  '.p-datepicker-dropdown:focus-visible',
  '.p-datepicker-day:focus-visible',
  '.p-datepicker-month:focus-visible',
  '.p-datepicker-year:focus-visible',
  '.p-datepicker-select-month:focus-visible',
  '.p-datepicker-select-year:focus-visible',
  '.p-carousel-indicator-button:focus-visible',
  '.p-organizationchart-node-toggle-button:focus-visible',
  '.p-menubar-button:focus-visible',
  '.p-megamenu-button:focus-visible',
  '.p-image-preview-mask:focus-visible',
  '.cookie-btn:focus-visible',
  '.cookie-close-btn:focus-visible',
];

/** The option lists: the input or list keeps DOM focus and the library
 *  marks the active option with `.p-focus` (aria-activedescendant), so the
 *  ring keys on that class and sits inside the option, like a menu item.
 *  `ring` is the kit ring selector; `panel` the Aura token of the surface the
 *  options sit on (the overlay, or the listbox's own field fill). Every
 *  `.p-<name>-option… .p-focus` rule in the Optimus styles must map to an
 *  entry here (OPTIMUS_FOCUS_RULES, checkFocusClassRing), so an option list a
 *  library update adds cannot fall back to the bare tint unnoticed. listbox covers orderlist / picklist,
 *  which render a p-listbox. */
const KIT_RING_OPTIONS = {
  select: { ring: '.p-select-option.p-focus', panel: 'select.overlay.background' },
  multiselect: { ring: '.p-multiselect-option.p-focus', panel: 'multiselect.overlay.background' },
  listbox: { ring: '.p-listbox-option.p-focus', panel: 'listbox.background' },
  autocomplete: { ring: '.p-autocomplete-option.p-focus', panel: 'autocomplete.overlay.background' },
  cascadeselect: {
    ring: '.p-cascadeselect-option.p-focus > .p-cascadeselect-option-content',
    panel: 'cascadeselect.overlay.background',
  },
};

/** The parts of the one ring that sit INSIDE themselves (offset -2px): they
 *  fill a clipping or tightly packed container (tab list, table wrapper, tree
 *  root, menu panel, accordion, option list). Each is also a
 *  KIT_RING_SELECTORS entry. */
const KIT_RING_INSET = [
  '.p-accordionheader:focus-visible',
  '.p-tab:focus-visible',
  '.p-tablist-nav-button:focus-visible',
  '.p-tree-node:focus-visible > .p-tree-node-content',
  '.p-tree-node-content:focus-visible',
  '.p-datatable-tbody > tr:focus-visible',
  '.p-datatable-sortable-column:focus-visible',
  '.p-treetable-tbody > tr:focus-visible',
  '.p-treetable .p-sortable-column:focus-visible',
  '.p-menubar-item.p-focus > .p-menubar-item-content',
  '.p-tieredmenu-item.p-focus > .p-tieredmenu-item-content',
  '.p-contextmenu-item.p-focus > .p-contextmenu-item-content',
  '.p-megamenu-item.p-focus > .p-megamenu-item-content',
  '.p-panelmenu-item.p-focus > .p-panelmenu-item-content',
  '.p-menu-item.p-focus .p-menu-item-content',
  '.p-panelmenu-header:not(.p-disabled):focus-visible .p-panelmenu-header-content',
  // The panelmenu row whose LINK has DOM focus (tabindex 0, where Tab
  // lands; `.p-focus` follows the arrow keys only), and the virtual
  // scroller's container (tabindex 0; fills select / table overlays).
  '.p-panelmenu-item-content:has(> .p-panelmenu-item-link:focus-visible)',
  '.p-virtualscroller:focus-visible',
  '.p-autocomplete-chip-item.p-focus .p-autocomplete-chip',
  ...Object.values(KIT_RING_OPTIONS).map((o) => o.ring),
];
KIT_RING_SELECTORS.push(...KIT_RING_INSET);

/** The field shells whose focus lives on a host class (styles.scss, the two
 *  rules above the one ring): same 2px --primary-color-fg ring at 2px, plus
 *  the border colour, in their own rules because they also repaint the edge. */
const FIELD_RING_SELECTORS = [
  '.p-select.p-focus',
  '.p-cascadeselect.p-focus',
  '.p-multiselect:not(.p-disabled).p-focus',
  '.p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled)',
];

/** EVERY Optimus rule keyed on the library's focus classes (`.p-focus`, and
 *  `.p-focus-visible` on the rating) that paints an indicator — a background,
 *  an outline, a box-shadow or a border colour — by its exact selector in
 *  node_modules/@openng/optimus-ui-styles/dist. Each maps to the kit ring
 *  selector that rings the same element (a KIT_RING_SELECTORS or
 *  FIELD_RING_SELECTORS entry), or to `{ out }` with the reason it is out of
 *  scope, which checkFocusClassRing verifies: `declined` (a
 *  DECLINED_COMPONENTS entry in scripts/design-guides.mjs) or `not-exported`
 *  (the styles package ships the rule, @openng/optimus-ui has no such entry
 *  point, so nothing can render it). A rule that only recolours text or an
 *  icon must sit under one of these selectors (it rides on that ring). A new
 *  or renamed Optimus rule fails the gate until it is listed — so a keyboard
 *  position shown by a tint alone cannot come back unnoticed. */
const OPTIMUS_FOCUS_RULES = {
  // autocomplete
  '.p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled).p-focus':
    '.p-autocomplete-option.p-focus',
  '.p-autocomplete-option-selected.p-focus': '.p-autocomplete-option.p-focus',
  '.p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled)':
    '.p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled)',
  '.p-autocomplete.p-focus .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled)':
    '.p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled)',
  '.p-autocomplete-chip-item.p-focus .p-autocomplete-chip': '.p-autocomplete-chip-item.p-focus .p-autocomplete-chip',
  // cascadeselect
  '.p-cascadeselect:not(.p-disabled).p-focus': '.p-cascadeselect.p-focus',
  '.p-cascadeselect.p-variant-filled.p-focus': '.p-cascadeselect.p-focus',
  '.p-cascadeselect-option:not(.p-cascadeselect-option-selected):not(.p-disabled).p-focus > .p-cascadeselect-option-content':
    '.p-cascadeselect-option.p-focus > .p-cascadeselect-option-content',
  '.p-cascadeselect-option-selected.p-focus > .p-cascadeselect-option-content':
    '.p-cascadeselect-option.p-focus > .p-cascadeselect-option-content',
  // menus
  '.p-contextmenu-item.p-focus > .p-contextmenu-item-content':
    '.p-contextmenu-item.p-focus > .p-contextmenu-item-content',
  '.p-megamenu-item.p-focus > .p-megamenu-item-content': '.p-megamenu-item.p-focus > .p-megamenu-item-content',
  '.p-menu-item.p-focus .p-menu-item-content': '.p-menu-item.p-focus .p-menu-item-content',
  '.p-menubar-item.p-focus > .p-menubar-item-content': '.p-menubar-item.p-focus > .p-menubar-item-content',
  '.p-panelmenu-item.p-focus > .p-panelmenu-item-content': '.p-panelmenu-item.p-focus > .p-panelmenu-item-content',
  '.p-tieredmenu-item.p-focus > .p-tieredmenu-item-content': '.p-tieredmenu-item.p-focus > .p-tieredmenu-item-content',
  // listbox (also orderlist / picklist)
  '.p-listbox:not(.p-disabled) .p-listbox-option.p-listbox-option-selected.p-focus': '.p-listbox-option.p-focus',
  '.p-listbox:not(.p-disabled) .p-listbox-option:not(.p-listbox-option-selected):not(.p-disabled).p-focus':
    '.p-listbox-option.p-focus',
  // multiselect
  '.p-multiselect:not(.p-disabled).p-focus': '.p-multiselect:not(.p-disabled).p-focus',
  '.p-multiselect.p-variant-filled.p-focus': '.p-multiselect:not(.p-disabled).p-focus',
  '.p-multiselect-option:not(.p-multiselect-option-selected):not(.p-disabled).p-focus': '.p-multiselect-option.p-focus',
  '.p-multiselect-option.p-multiselect-option-selected.p-focus': '.p-multiselect-option.p-focus',
  // select
  '.p-select:not(.p-disabled).p-focus': '.p-select.p-focus',
  '.p-select.p-variant-filled:not(.p-disabled).p-focus': '.p-select.p-focus',
  '.p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus': '.p-select-option.p-focus',
  '.p-select-option.p-select-option-selected.p-focus': '.p-select-option.p-focus',
  // treeselect
  '.p-treeselect:not(.p-disabled).p-focus': '.p-treeselect:not(.p-disabled).p-focus',
  '.p-treeselect.p-variant-filled.p-focus': '.p-treeselect:not(.p-disabled).p-focus',
  // rating
  '.p-rating-option.p-focus-visible': '.p-rating-option.p-focus-visible',
  // out of scope
  '.p-dock-item.p-focus': { out: 'declined', component: 'dock' },
  '.p-inputchips:not(.p-disabled).p-focus .p-inputchips-input': { out: 'not-exported', component: 'inputchips' },
  '.p-inputchips:not(.p-disabled).p-focus .p-variant-filled.p-inputchips-input': {
    out: 'not-exported',
    component: 'inputchips',
  },
  '.p-inputchips-chip-item.p-focus .p-inputchips-chip': { out: 'not-exported', component: 'inputchips' },
};

/** The same ring in the widget's own ink (`2px solid currentColor`): the close
 *  buttons of message and toast, which sit on the severity tint, and the image
 *  preview's toolbar actions, which sit on the near-black toolbar plate. */
const NOTICE_RING_SELECTORS = [
  '.p-message-close-button:focus-visible',
  '.p-toast-close-button:focus-visible',
  '.p-image-action:focus-visible',
];

/** The selected-row bar (styles.scss): a pseudo-element on the first cell. */
const ROW_BAR_SELECTOR = '.p-datatable-tbody > tr.p-datatable-row-selected > td:first-child::before';

async function readAura() {
  const load = async (rel) => {
    const file = abs(`${AURA_DIR}/${rel}/index.mjs`);
    if (!fs.existsSync(file)) {
      errors.push(`${AURA_DIR}/${rel}/index.mjs not found — run npm install; the widget pairs cannot be resolved.`);
      return null;
    }
    return (await import(pathToFileURL(file).href)).default;
  };
  const base = await load('base');
  const components = {};
  for (const c of AURA_COMPONENTS) components[c] = await load(c);
  return base && Object.values(components).every(Boolean) ? { base, components } : null;
}

/** Aura names a token by its camelCase path, dotted and lower-cased:
 *  formField.borderColor → form.field.border.color. */
const dottedKey = (k) =>
  String(k)
    .replace(/([a-z0-9])([A-Z])/g, '$1.$2')
    .toLowerCase();

/** Flatten a token object into dotted names. A component's `root` group is not
 *  part of the name (`checkbox.root.borderColor` is `checkbox.border.color`,
 *  CSS `--p-checkbox-border-color`). */
function flattenTokens(obj, prefix, out, dropRoot) {
  for (const [k, v] of Object.entries(obj)) {
    const seg = dropRoot && k === 'root' ? '' : dottedKey(k);
    const name = [prefix, seg].filter(Boolean).join('.');
    if (v && typeof v === 'object') flattenTokens(v, name, out, dropRoot);
    else out[name] = String(v);
  }
  return out;
}

/** Port of theme.service.ts `widgetPrimarySemantic`: the accent ramp handed to
 *  definePreset as semantic.primary. Checked against the source text below.
 *  The ramp base follows the mode — primaryColor in light, primaryFgDark in
 *  dark (RAMP_BASE) — and dark mode re-points Aura's primary.color/hover/active
 *  at steps 500/400/300 (DARK_PRIMARY). */
const RAMP_BASE = { light: 'primaryColor', dark: 'primaryFgDark' };
const DARK_PRIMARY = { color: '{primary.500}', hoverColor: '{primary.400}', activeColor: '{primary.300}' };
const PRIMARY_RAMP = [
  ['50', 'lighten', 0.9],
  ['100', 'lighten', 0.8],
  ['200', 'lighten', 0.6],
  ['300', 'lighten', 0.4],
  ['400', 'lighten', 0.2],
  ['500', 'base', 0],
  ['600', 'darken', 0.1],
  ['700', 'darken', 0.2],
  ['800', 'darken', 0.3],
  ['900', 'darken', 0.4],
  ['950', 'darken', 0.5],
];
function primaryRamp(base) {
  const out = {};
  for (const [step, op, p] of PRIMARY_RAMP)
    out[step] = op === 'base' ? base : op === 'lighten' ? lightenColor(base, p) : darkenColor(base, p);
  return out;
}

/** The ramp in theme.service.ts, read as text: a changed step there must not
 *  leave this gate measuring the old one. */
function readPrimaryRamp() {
  const src = read(THEME_SERVICE);
  const at = src.indexOf('export function widgetPrimarySemantic(');
  const chunk = at >= 0 ? src.slice(at, src.indexOf('\n}\n', at)) : '';
  if (!chunk) {
    errors.push(`${THEME_SERVICE}: widgetPrimarySemantic() not found — the widget ramp mirror cannot be checked.`);
    return;
  }
  const found = {};
  for (const m of chunk.matchAll(/(\d+):\s*(lighten|darken)Hex\(rampBase,\s*([\d.]+)\)/g))
    found[m[1]] = [m[2], Number(m[3])];
  if (/500:\s*rampBase,/.test(chunk)) found['500'] = ['base', 0];
  const drift = PRIMARY_RAMP.filter(([s, op, p]) => !found[s] || found[s][0] !== op || found[s][1] !== p).map(
    ([s]) => s,
  );
  if (drift.length || Object.keys(found).length !== PRIMARY_RAMP.length) {
    errors.push(
      `${THEME_SERVICE}: the semantic.primary ramp no longer matches PRIMARY_RAMP in this gate (steps ${drift.join(', ') || '?'}) — update the mirror.`,
    );
  }
  // The base per mode and the dark primary.color re-point.
  const base = /const rampBase = \(isDark \? colorOption\?\.([A-Za-z]+) : colorOption\?\.([A-Za-z]+)\)/.exec(chunk);
  if (!base || base[1] !== RAMP_BASE.dark || base[2] !== RAMP_BASE.light)
    errors.push(
      `${THEME_SERVICE}: widgetPrimarySemantic no longer takes the ramp base from ${RAMP_BASE.light} (light) / ${RAMP_BASE.dark} (dark) — update RAMP_BASE in this gate.`,
    );
  // The values are themselves `{…}` references, so the group runs to the end of the line.
  const dark = /dark:\s*\{\s*primary:\s*\{([^\n]*)\},?\s*\n/.exec(chunk);
  const got = {};
  for (const m of (dark?.[1] ?? '').matchAll(/([a-zA-Z]+):\s*'([^']+)'/g)) got[m[1]] = m[2];
  if (JSON.stringify(got) !== JSON.stringify(DARK_PRIMARY))
    errors.push(
      `${THEME_SERVICE}: the dark primary re-point is ${JSON.stringify(got)}, this gate mirrors ${JSON.stringify(DARK_PRIMARY)} — update DARK_PRIMARY.`,
    );
}

/**
 * A top-level-and-nested rule walk over styles.scss: every rule with its
 * selector path (outer blocks first) and its declarations. Comments are blanked
 * first; the file uses no SCSS interpolation, so braces are structure.
 */
function readScssRules() {
  const src = stripComments(read(STYLES));
  const rules = [];
  const stack = [];
  let buf = '';
  const flush = () => {
    const d = /^\s*([-a-z]+)\s*:\s*([\s\S]+?)\s*$/.exec(buf);
    if (d && stack.length) stack[stack.length - 1].decls[d[1]] = d[2].replace(/\s*!important$/, '').trim();
    buf = '';
  };
  for (const ch of src) {
    if (ch === '{') {
      stack.push({ sel: buf.trim().replace(/\s+/g, ' '), decls: {} });
      buf = '';
    } else if (ch === '}') {
      flush();
      const r = stack.pop();
      if (r) rules.push({ path: [...stack.map((s) => s.sel), r.sel], decls: r.decls });
    } else if (ch === ';') flush();
    else buf += ch;
  }
  return rules;
}

/**
 * Layers 3 and 4 from styles.scss, per mode: `tokens` holds the re-pointed
 * Optimus custom properties (`--p-select-border-color` → `var(--control-border)`),
 * `tagProps` the direct tag repaints, `inputBorder` the signature blocks'
 * `input.p-inputtext` border colour per style.
 */
function readWidgetOverrides(rules) {
  const out = {
    tokens: { light: {}, dark: {} },
    tagProps: { light: {}, dark: {} },
    inputBorder: {},
    props: {},
    propRules: {},
  };
  const darkOnly = {};
  for (const [ruleIndex, r] of rules.entries()) {
    const sels = r.path[r.path.length - 1].split(',').map((s) => s.trim());
    if (r.path.length === 1) {
      for (const sel of sels) {
        // Every top-level property rule, by selector, last wins — the focus
        // ring and the invalid edge are plain properties, not tokens.
        out.props[sel] = { ...out.props[sel], ...r.decls };
        // Which rules paint an outline for this selector (the one-ring check).
        if ('outline' in r.decls) (out.propRules[sel] ??= []).push(ruleIndex);
        // One class, possibly hyphenated: `.p-select`, `.p-image-toolbar` (a
        // part that renders outside its component's host, so the token is set
        // on the part itself).
        const tok = /^(\.dark-theme )?\.p-[a-z]+(?:-[a-z]+)*$/.exec(sel);
        if (tok) {
          for (const [prop, value] of Object.entries(r.decls)) {
            if (!prop.startsWith('--p-')) continue;
            if (tok[1]) darkOnly[prop] = value;
            else out.tokens.light[prop] = value;
          }
        }
        const tag = /^(\.dark-theme )?\.p-tag\.p-tag-([a-z]+)$/.exec(sel);
        if (tag) {
          for (const mode of tag[1] ? ['dark'] : ['light', 'dark']) {
            out.tagProps[mode][tag[2]] = {
              background: r.decls.background ?? r.decls['background-color'],
              color: r.decls.color,
            };
          }
        }
      }
    }
    // Signature blocks: `input.p-inputtext` (both modes) or
    // `&.dark-theme input.p-inputtext` (dark only — <html> carries the mode class).
    const style = /^html\.style-([a-z0-9-]+)$/.exec(r.path[0] ?? '');
    if (style && r.path.length === 2 && r.decls['border-color']) {
      const slot = (out.inputBorder[style[1]] ??= {});
      if (sels.includes('input.p-inputtext')) {
        slot.light = r.decls['border-color'];
        slot.dark = slot.darkOnly ?? r.decls['border-color'];
      }
      if (sels.includes('&.dark-theme input.p-inputtext')) slot.dark = slot.darkOnly = r.decls['border-color'];
    }
  }
  // `.dark-theme .p-x` outranks `.p-x`, so in dark mode it wins whatever the
  // order of the two rules in the file.
  out.tokens.dark = { ...out.tokens.light, ...darkOnly };
  return out;
}

/**
 * The presetOverrides of each style are merged over Aura by definePreset. The
 * gate does not evaluate that TypeScript; it asserts instead that no override
 * touches a token a widget pair below reads (today they set radii and the dark
 * filled-button colours only). An override that did would be measured as stock.
 */
function checkPresetOverrides() {
  const src = stripComments(read(UI_STYLES));
  const heads = [...src.matchAll(/^\s*presetOverrides:\s*\{/gm)];
  const WATCHED =
    /\b(checkbox|radiobutton|toggleswitch|tag|chip|dialog|skeleton|select|inputtext|textarea|slider|progressbar|togglebutton|autocomplete|contextmenu|datatable|drawer|inputnumber|menu|menubar|multiselect|paginator|panelmenu|popover|progressspinner|tieredmenu|avatar|badge|cascadeselect|datepicker|floatlabel|image|inputgroup|message|password|toast|treeselect|formField|surface|primary|focusRing|overlay|content|navigation|highlight|mask)\s*:/;
  let clean = 0;
  for (const h of heads) {
    let depth = 0;
    let i = h.index + h[0].length - 1;
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}' && --depth === 0) break;
    }
    const body = src.slice(h.index, i);
    const hit = WATCHED.exec(body.replace(/\bprimitive:\s*\{[^}]*\}/, ''));
    if (hit)
      errors.push(
        `${UI_STYLES}: a presetOverrides block sets \`${hit[1]}\`, which the widget pairs read from stock Aura — model it in check-contrast.mjs.`,
      );
    else clean++;
    // The button override may set the FILLED severity colours (the severity
    // block paints over them anyway); the filled contrast button, the text and
    // link colours and the ring are read from stock Aura or from styles.scss.
    if (/focusRing/.test(body))
      errors.push(
        `${UI_STYLES}: a presetOverrides block sets a button focusRing — the kit ring in styles.scss is the measured one; drop it.`,
      );
    const btn = /\bbutton\s*:\s*\{/.exec(body);
    if (btn && /\b(text|link|contrast|outlined)\s*:/.test(body.slice(btn.index)))
      errors.push(
        `${UI_STYLES}: a presetOverrides button block sets text/link/contrast/outlined colours, which the "text & link button" and "filled button (contrast)" rows read from stock Aura — model it in check-contrast.mjs.`,
      );
  }
  if (heads.length && clean === heads.length)
    ok.push(`presetOverrides: ${heads.length} blocks, none touches a widget token this gate reads`);
}

/**
 * Every Optimus rule keyed on a focus class (`.p-focus`, `.p-focus-visible`)
 * in node_modules/@openng/optimus-ui-styles/dist is accounted for
 * (OPTIMUS_FOCUS_RULES): an indicator rule (background, outline, box-shadow,
 * border colour) is listed with the kit ring selector that rings the same
 * element — which must be a KIT_RING_SELECTORS / FIELD_RING_SELECTORS entry
 * that really rings 2px --primary-color-fg, and for an option a
 * KIT_RING_OPTIONS entry (its fills are measured) — or with a verified
 * out-of-scope reason; a text/icon recolour sits under a listed selector.
 * Listed selectors Optimus no longer ships are reported too (stale table), and
 * a scan that finds nothing fails, so it cannot pass by reading nothing.
 */
function checkFocusClassRing(ovr) {
  const dir = 'node_modules/@openng/optimus-ui-styles/dist';
  const INDICATOR = /(^|;)\s*(background(-color)?|outline|box-shadow|border-color)\s*:/;
  const PAINT = /(^|;)\s*color\s*:/;
  // The selector up to the end of the compound that carries the focus class:
  // `.p-menu-item.p-focus .p-menu-item-icon` → `.p-menu-item.p-focus`. A
  // recolour rule belongs to the listed item with the same anchor.
  const anchor = (sel) => /^.*?\.p-focus(?:-visible)?(?![-\w])[^\s>+~]*/.exec(sel)?.[0];
  const anchors = new Set(Object.keys(OPTIMUS_FOCUS_RULES).map(anchor));
  const seen = new Set();
  const unlisted = [];
  const orphans = [];
  let paintOnly = 0;
  for (const name of fs.readdirSync(abs(dir))) {
    const file = path.join(dir, name, 'index.mjs');
    if (!fs.existsSync(abs(file))) continue;
    for (const m of read(file).matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const body = m[2];
      const indicator = INDICATOR.test(body);
      if (!indicator && !PAINT.test(body)) continue;
      const head = m[1].split(/[`;]/).pop();
      for (const raw of head.split(',')) {
        const sel = raw.trim().replace(/\s+/g, ' ');
        if (!/\.p-focus(?:-visible)?(?![-\w])/.test(sel)) continue;
        if (indicator) {
          seen.add(sel);
          if (!(sel in OPTIMUS_FOCUS_RULES)) unlisted.push(`${name}: ${sel}`);
        } else if (anchors.has(anchor(sel))) paintOnly++;
        else orphans.push(`${name}: ${sel}`);
      }
    }
  }
  if (!seen.size) {
    errors.push(`${dir}: no rule keyed on .p-focus found — the focus-class scan read nothing.`);
    return;
  }
  if (unlisted.length)
    errors.push(
      `${dir}: Optimus paints a keyboard position with a focus class in rules the kit has not accounted for — ${unlisted.join(' | ')}. Ring each element in the one kit ring (styles.scss) and list the selector in OPTIMUS_FOCUS_RULES, or list it as out of scope with a reason.`,
    );
  if (orphans.length)
    errors.push(
      `${dir}: focus-class rules recolour a part outside every listed selector — ${orphans.join(' | ')}. List the element they belong to in OPTIMUS_FOCUS_RULES.`,
    );
  const stale = Object.keys(OPTIMUS_FOCUS_RULES).filter((k) => !seen.has(k));
  if (stale.length)
    errors.push(
      `check-contrast.mjs: OPTIMUS_FOCUS_RULES lists selectors the Optimus styles no longer ship — ${stale.join(' | ')}. Re-read the library and update the table.`,
    );
  const exported = libraryEntrypoints();
  const optionRings = new Set(Object.values(KIT_RING_OPTIONS).map((o) => o.ring));
  const bad = [];
  let ringed = 0;
  let outOfScope = 0;
  for (const [sel, target] of Object.entries(OPTIMUS_FOCUS_RULES)) {
    if (typeof target === 'object') {
      outOfScope++;
      if (target.out === 'declined' && !DECLINED_COMPONENTS.has(target.component))
        bad.push(`${sel}: "${target.component}" is not a DECLINED_COMPONENTS entry (scripts/design-guides.mjs)`);
      else if (target.out === 'not-exported' && (!exported || exported.has(target.component)))
        bad.push(
          `${sel}: @openng/optimus-ui ${exported ? `now exports ./${target.component}` : 'is not installed'} — ring it instead`,
        );
      else if (!['declined', 'not-exported'].includes(target.out)) bad.push(`${sel}: unknown reason "${target.out}"`);
      continue;
    }
    ringed++;
    const d = ovr.props[target];
    if (!KIT_RING_SELECTORS.includes(target) && !FIELD_RING_SELECTORS.includes(target))
      bad.push(`${sel}: ${target} is neither a KIT_RING_SELECTORS nor a FIELD_RING_SELECTORS entry`);
    else if (!d || !/^2px solid var\(\s*--primary-color-fg\b/.test(d.outline ?? ''))
      bad.push(`${sel}: ${target} does not ring 2px solid var(--primary-color-fg) in ${STYLES}`);
    else if (/-option\b.*\.p-focus(?![-\w])/.test(target) && !optionRings.has(target))
      bad.push(`${sel}: ${target} is an option ring outside KIT_RING_OPTIONS, so its fills are not measured`);
  }
  if (bad.length) errors.push(`${STYLES}: focus-class ring table — ${bad.join(' | ')}`);
  if (!unlisted.length && !orphans.length && !stale.length && !bad.length)
    ok.push(
      `focus-class ring: all ${seen.size} Optimus .p-focus indicator rules accounted for — ${ringed} ringed by the kit, ${outOfScope} out of scope (declined / not exported); ${paintOnly} text/icon recolours ride on a listed ring`,
    );
}

/**
 * The one kit focus ring and the selected-row bar are plain property rules,
 * so the rows that measure them need the rules to be what they claim: every
 * KIT_RING_SELECTORS entry rings 2px in --primary-color-fg at a 2px offset,
 * and the row bar paints a --primary-color-fg background.
 */
function checkKitRing(ovr) {
  const off = [];
  for (const sel of KIT_RING_SELECTORS) {
    const d = ovr.props[sel];
    const offset = KIT_RING_INSET.includes(sel) ? '-2px' : '2px';
    if (!d || !/^2px solid var\(\s*--primary-color-fg\b/.test(d.outline ?? '') || d['outline-offset'] !== offset)
      off.push(`${sel} (offset ${offset})`);
  }
  if (off.length)
    errors.push(
      `${STYLES}: the one kit focus ring no longer covers ${off.join(', ')} (2px solid var(--primary-color-fg) at the stated outline-offset) — the widget falls back to Aura's 1px raw-accent ring.`,
    );
  else
    ok.push(
      `kit focus ring: ${KIT_RING_SELECTORS.length} selectors ring 2px --primary-color-fg (${KIT_RING_INSET.length} inset at -2px, the rest at 2px)`,
    );
  // One ring, not two: no other rule may carry an outline for a listed part
  // (the selectors are matched literally, so a second rule would have to
  // repeat one of them to override it).
  const ringRules = new Set();
  for (const sel of KIT_RING_SELECTORS) if (ovr.propRules?.[sel]) for (const r of ovr.propRules[sel]) ringRules.add(r);
  if (ringRules.size > 1)
    errors.push(
      `${STYLES}: the kit focus ring's selectors carry an outline in ${ringRules.size} rules — extend the one ring rule instead of adding a second.`,
    );
  const offNotice = NOTICE_RING_SELECTORS.filter((sel) => {
    const d = ovr.props[sel];
    return !d || !/^2px solid currentColor$/i.test(d.outline ?? '') || d['outline-offset'] !== '2px';
  });
  if (offNotice.length)
    errors.push(
      `${STYLES}: the ink ring (2px solid currentColor at 2px offset) no longer covers ${offNotice.join(', ')} — the "message & toast" and "image preview" rows no longer measure it.`,
    );
  // FIELD_RING_SELECTORS: the same ring, 2px outside the field shell.
  const offField = FIELD_RING_SELECTORS.filter((sel) => {
    const d = ovr.props[sel];
    return !d || !/^2px solid var\(\s*--primary-color-fg\b/.test(d.outline ?? '') || d['outline-offset'] !== '2px';
  });
  if (offField.length)
    errors.push(
      `${STYLES}: the field-shell focus ring (2px solid var(--primary-color-fg) at 2px offset) no longer covers ${offField.join(', ')}.`,
    );
  checkFocusClassRing(ovr);
  const bar = ovr.props[ROW_BAR_SELECTOR];
  if (!bar || !/^var\(\s*--primary-color-fg\b/.test(bar.background ?? ''))
    errors.push(
      `${STYLES}: the selected-row bar (${ROW_BAR_SELECTOR}) is gone or no longer paints --primary-color-fg — a selected row is marked by Aura's tint alone again.`,
    );
  else ok.push('selected-row bar present: --primary-color-fg on the first cell');
}

// ---------------------------------------------------------------------------
// The pair table
// ---------------------------------------------------------------------------

const AA_NORMAL = 4.5; // SC 1.4.3, text below 18.66px regular / 24px bold
// (SC 1.4.3 large text would allow 3.0, but the kit has no token-level large-text
// role, so no pair uses that threshold today.)
const NON_TEXT = 3.0; // SC 1.4.11, boundaries that identify a control

/**
 * Known exceptions — pairs that the kit misses TODAY. Listed here rather than fixed
 * silently, because the fix is a visual/token decision that belongs to the design owner,
 * not to the gate author; and rather than by lowering the threshold, because that would
 * blind the gate for every other pair with the same role.
 *
 * An entry that has started to PASS is itself a failure (stale exception), the same way a
 * dead exclusion fails check-design-system: an exception nobody removes is a lie about
 * where the kit stands.
 *
 * Key = the pair id printed in every report line: `<mode>: <fg> on <bg>`.
 */
const KNOWN_EXCEPTIONS = {
  // The former secondary-text near-miss (2 entries) closed with the foundations
  // re-shade of --text-color-secondary #6c757d → #6b7280 (4.59:1 on the panel tone).
  // The former surface-border set (6 entries) closed with the --control-border split:
  // control edges moved to their own 3:1 token, --surface-border is decoration only
  // and is no longer measured under 1.4.11 (see the CONTROL BOUNDARY block).
  // The former dev/prod toggle border (4 entries, one per style) closed when the
  // light-mode idle border moved from p-green-500 (2.28:1 on white) to p-green-600
  // (3.30:1). No known page-level exception remains: every such pair passes.
};

/**
 * Known WIDGET exceptions (design-system 1.1). The widget pairs were first
 * measured here in 2026-09; the clear defects were fixed with the kit's own
 * tokens in the same change (form-field edges → --control-border, the
 * togglebutton label → --text-color-secondary, the lernwerkstatt dark field
 * edge). The rest was closed with kit tokens too (no exceptions), see below; a rule
 * would declare a defect that needs a decision the gate author cannot take
 * alone, with the reason and the fix on the table.
 *
 * A rule matches FAILING pairs only, and states how many it expects. A count
 * that moves in either direction fails the run: more means a new failure is
 * hiding under an old excuse, fewer means part of the exception has been fixed
 * and the rule must shrink with it — the same "stale exception" discipline as
 * the per-id list above.
 */
const KNOWN_EXCEPTION_RULES = [
  // Empty by decision: the kit carries NO contrast
  // exceptions. The four rules the first widget measurement declared were
  // closed with kit tokens, not waived:
  //   toggleswitch-stock-track (20 pairs, lowest 1.26:1) — off track on
  //     --control-border, handle on --surface-card (styles.scss .p-toggleswitch);
  //   slider-stock-track (32 pairs, lowest 1.13:1) — track and handle ring on
  //     --control-border (styles.scss .p-slider);
  //   contrast-palette-dark-widget-ramp (32 pairs, lowest 1.18:1) and
  //   coral-dark-progress-track (8 pairs, lowest 2.58:1) — the dark widget ramp
  //     is built from primaryFgDark and Aura's dark primary.color points at its
  //     500 step (theme.service.ts widgetPrimarySemantic; RAMP_BASE/DARK_PRIMARY).
  // A new rule needs the design owner's explicit decision, recorded in
  // OPEN-QUESTIONS.md — the mechanism stays so that decision has a place to live.
];

/**
 * Build the full pair list for ONE visual style — surfaces, control edge and
 * placeholder come from the style's data (ADR-0016 D7), the kit-level tokens
 * (semantic inline colours, the dev toggle) from styles.scss, the brand
 * palettes from THEME_COLORS. Every id carries the style name, because the same
 * role measures differently under each style.
 */
function buildPairs(style, scss, colors, chipSteps) {
  const pairs = [];
  // CSS `brightness()` as Chromium applies it: sRGB channel multiply, clamped.
  const brightenHex = (hex, factor) =>
    '#' +
    [0, 2, 4]
      .map((i) =>
        Math.min(255, Math.round(parseInt(hex.replace('#', '').slice(i, i + 2), 16) * factor))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('');
  // Mirror of ui-styles.ts#severityHoverBrightness — kept here on purpose: this
  // gate text-parses the styles and must not import the app's TypeScript.
  const HOVER_DARKEN = 0.92;
  const HOVER_BRIGHTEN = 1.1;
  // `text ?? '#ffffff'` even though the parser already defaults it: the mirror
  // must stay word-for-word with ui-styles.ts, or it drifts exactly where a
  // future parser change would break it.
  const worstHover = (from, to, label, factor) => {
    const lab = brightenHex(label ?? '#ffffff', factor);
    return Math.min(contrast(lab, brightenHex(from, factor)), contrast(lab, brightenHex(to, factor)));
  };
  // Mirror of ui-styles.ts#outlinedSeverityInk — same reason as hoverBrightness:
  // this gate text-parses the styles and must not import the app's TypeScript.
  const OUTLINED_INK_TARGET = 4.6;
  const toHsl = (hex) => {
    const p = hex.replace('#', '');
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(p.slice(i, i + 2), 16) / 255);
    const mx = Math.max(r, g, b),
      mn = Math.min(r, g, b);
    const l = (mx + mn) / 2;
    if (mx === mn) return { h: 0, s: 0, l };
    const d = mx - mn;
    const sat = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    const h = (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) / 6;
    return { h, s: sat, l };
  };
  const fromHsl = (h, sat, l) => {
    const f = (n) => {
      const k = (n + h * 12) % 12;
      const a = sat * Math.min(l, 1 - l);
      return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))));
    };
    return '#' + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, '0')).join('');
  };
  const outlinedInk = (base, card) => {
    if (contrast(base, card) >= OUTLINED_INK_TARGET) return base;
    const { h, s: sat, l } = toHsl(base);
    const step = luminance(card) > 0.18 ? -0.01 : 0.01;
    let best = base;
    for (let i = 1; i <= 100; i++) {
      const cand = fromHsl(h, sat, Math.min(1, Math.max(0, l + step * i)));
      best = cand;
      if (contrast(cand, card) >= OUTLINED_INK_TARGET) return cand;
    }
    return best;
  };

  const hoverBrightness = (from, to, label) =>
    worstHover(from, to, label, HOVER_BRIGHTEN) > worstHover(from, to, label, HOVER_DARKEN)
      ? HOVER_BRIGHTEN
      : HOVER_DARKEN;

  const add = (mode, group, sc, min, fgName, fg, bgName, bg, note) =>
    pairs.push({
      id: `${style.name} ${mode}: ${fgName} on ${bgName}`,
      style: style.name,
      mode,
      group,
      sc,
      min,
      fgName,
      fg,
      bgName,
      bg,
      note,
    });

  for (const mode of ['light', 'dark']) {
    const t = scss[mode];
    const s = style.surfaces[mode];
    const ground = s.ground;
    const card = s.card;
    const section = s.section;
    const hover = s.hover;

    // ---- BODY TEXT · SC 1.4.3 (4.5:1) ------------------------------------
    // --text-color is the default body/heading colour (629 usages for its secondary
    // sibling alone); the four surfaces are every background a text run can land on:
    // the page (ground), a card, a sunken section, and a hovered row.
    for (const [bgName, bg] of [
      ['--surface-ground', ground],
      ['--surface-card', card],
      ['--surface-section', section],
      ['--surface-hover', hover],
    ]) {
      add(mode, 'body text', '1.4.3', AA_NORMAL, '--text-color', s.textColor, bgName, bg);
      add(mode, 'body text', '1.4.3', AA_NORMAL, '--text-color-secondary', s.textColorSecondary, bgName, bg);
    }

    // ---- SEMANTIC INLINE HIGHLIGHTS · SC 1.4.3 (4.5:1) -------------------
    // Inline coloured text inside prose (glossary terms, timeline events, formula
    // tokens). Text on the surface it sits on — ground for running prose, card inside
    // a container.
    for (const hue of ['blue', 'orange', 'green', 'red', 'purple', 'pink']) {
      const fg = t[`--semantic-${hue}-fg`];
      if (!fg) continue;
      add(mode, 'semantic text', '1.4.3', AA_NORMAL, `--semantic-${hue}-fg`, fg, '--surface-ground', ground);
      add(mode, 'semantic text', '1.4.3', AA_NORMAL, `--semantic-${hue}-fg`, fg, '--surface-card', card);
    }

    // ---- DEV/PROD TOGGLE · SC 1.4.3 + SC 1.4.11 --------------------------
    // app.component.ts:1245-1271. The label sits on a tinted background the CSS mixes
    // from the toggle's own border colour: color-mix(in srgb, <border> 15%, --surface-card).
    // The 2px border is what identifies the control → 1.4.11.
    for (const state of [
      ['', 'idle'],
      ['-active', 'active'],
    ]) {
      const fg = t[`--dev-toggle-fg${state[0]}`];
      const bd = t[`--dev-toggle-border${state[0]}`];
      if (!fg || !bd) continue;
      const bg = mix(bd, card, 15);
      add(
        mode,
        'dev toggle',
        '1.4.3',
        AA_NORMAL,
        `--dev-toggle-fg${state[0]}`,
        fg,
        `color-mix(--dev-toggle-border${state[0]} 15%, --surface-card)`,
        bg,
        `${state[1]} state`,
      );
      add(
        mode,
        'dev toggle',
        '1.4.11',
        NON_TEXT,
        `--dev-toggle-border${state[0]}`,
        bd,
        '--surface-card',
        card,
        `${state[1]} state, 2px control boundary`,
      );
    }

    // ---- CONTROL BOUNDARY · SC 1.4.11 (3:1) ------------------------------
    // Since the foundations token split, control edges (dark-mode .p-inputtext/.p-select
    // in styles.scss, the theme-preview 2px ring, the color-radius-selector 3px swatch)
    // draw from --control-border, chosen to clear 3:1 on every surface. --surface-border
    // is decoration only (card/table rules), where SC 1.4.11 does not apply — so the
    // decorative token is deliberately NOT measured here; a rule that identifies a
    // control MUST use --control-border, and a review that finds a control edge on
    // --surface-border has found a defect, not an exception.
    const controlBorder = s.controlBorder;
    for (const [bgName, bg] of [
      ['--surface-card', card],
      ['--surface-ground', ground],
      ['--surface-section', section],
    ]) {
      add(
        mode,
        'control boundary',
        '1.4.11',
        NON_TEXT,
        '--control-border',
        controlBorder,
        bgName,
        bg,
        'control boundary role',
      );
    }

    // ---- FLOATING ACTION BUTTON · SC 1.4.3 + SC 1.4.11 -------------------
    // The FABs (app-fab-container, the Easy-Language and ToC FABs) float over
    // whatever content scrolls behind them, so they paint their own opaque fill:
    // --surface-card, hovered --surface-hover, with the label in --text-color.
    // Until 2026-09-22 they were transparent "glass" and axe measured a label at
    // 3.6:1 on the Easy-Language home's orange accent. Their edge is the style's
    // --fab-edge (extraTokens, read by the four signature blocks in styles.scss);
    // it is what separates the button from the page, so it is measured against
    // every page surface the FAB can hover over. The ids carry `.fab-*` so they
    // stay distinct from the body-text pairs with the same colours.
    const fabEdge = readStyleExtraTokens(style.name)?.[mode]?.['--fab-edge'];
    if (!fabEdge) {
      errors.push(
        `${UI_STYLES}: style "${style.name}" declares no hex --fab-edge in extraTokens.${mode} — the FAB edge cannot be measured.`,
      );
    } else {
      add(
        mode,
        'floating action button',
        '1.4.3',
        AA_NORMAL,
        '.fab-label --text-color',
        s.textColor,
        '.fab-button --surface-card',
        card,
        'FAB label at rest',
      );
      add(
        mode,
        'floating action button',
        '1.4.3',
        AA_NORMAL,
        '.fab-label --text-color',
        s.textColor,
        '.fab-button:hover --surface-hover',
        hover,
        'FAB label hovered',
      );
      for (const [bgName, bg] of [
        ['--surface-ground', ground],
        ['--surface-card', card],
        ['--surface-section', section],
      ]) {
        add(
          mode,
          'floating action button',
          '1.4.11',
          NON_TEXT,
          '.fab-button --fab-edge',
          fabEdge,
          bgName,
          bg,
          'FAB edge over the page',
        );
      }
    }

    // ---- FIELD PLACEHOLDER · SC 1.4.3 (4.5:1) ----------------------------
    // Placeholder text is text, so 1.4.3 applies at 4.5:1. Only the dark theme
    // declares --control-placeholder: the light theme leaves the field on the shipped
    // Optimus tokens, while the dark theme repaints it to --surface-section in
    // styles.scss, which is the background this pair must hold against (the shipped
    // placeholder was chosen for the shipped field background, surface.950).
    const placeholder = s.controlPlaceholder;
    if (placeholder) {
      add(
        mode,
        'field placeholder',
        '1.4.3',
        AA_NORMAL,
        '--control-placeholder',
        placeholder,
        '--surface-section',
        section,
        'dark .p-inputtext is painted --surface-section',
      );
    }

    // ---- SEVERITY BUTTON LABEL · SC 1.4.3 (4.5:1) ------------------------
    // ADR-0016 D5: the severity buttons paint
    // linear-gradient(--gradient-<sev>-from → --gradient-<sev>-to) and put
    // --gradient-<sev>-text on it (white unless the style says otherwise).
    // The label crosses the whole gradient, so it is measured at BOTH stops.
    // These colours are per style and mode-independent — the same fill is used
    // in light and dark, which is why a style that flips its severities would
    // show up here as a failure in one mode only.
    for (const [severity, g] of Object.entries(style.severities)) {
      add(
        mode,
        'severity button',
        '1.4.3',
        AA_NORMAL,
        `${severity}.--gradient-${severity}-text`,
        g.text,
        `--gradient-${severity}-from`,
        g.from,
        'gradient stop 1',
      );
      add(
        mode,
        'severity button',
        '1.4.3',
        AA_NORMAL,
        `${severity}.--gradient-${severity}-text`,
        g.text,
        `--gradient-${severity}-to`,
        g.to,
        'gradient stop 2',
      );

      // ---- SEVERITY BUTTON LABEL WHILE HOVERED · SC 1.4.3 ----------------
      // The hover rule puts brightness() on the WHOLE button, so both the fill
      // and the label move (verified on rendered pixels, 2026-09-06). A label
      // that holds at rest can still fall below 4.5:1 hovered — with the former
      // flat brightness(1.1) four styles did, worst lernwerkstatt/danger 3.96:1.
      // The direction now comes from ui-styles.ts#severityHoverBrightness, which
      // measures both and keeps the better one; this gate re-derives the same
      // numbers from the shipped hex values, so a rule change that costs
      // contrast surfaces here even if the TypeScript spec still passes.
      // ---- OUTLINED SEVERITY INK · SC 1.4.3 / 1.4.11 ---------------------
      // R13: the outlined block excludes the severities, so the preset painted
      // these labels with its raw colour — measured on the running app, every
      // style fell under 4.5:1 in light mode (success #22c55e on white, 2.28).
      // The ink is derived from the style (ui-styles.ts#outlinedSeverityInk);
      // this gate mirrors the derivation and measures the result on the card.
      const ink = outlinedInk(g.from, s.card);
      add(
        mode,
        'outlined severity',
        '1.4.3',
        AA_NORMAL,
        `${severity}.--outlined-${severity}-fg`,
        ink,
        '--surface-card',
        s.card,
        'outlined label and border',
      );

      const factor = hoverBrightness(g.from, g.to, g.text);
      const hoveredLabel = brightenHex(g.text ?? '#ffffff', factor);
      add(
        mode,
        'severity button (hover)',
        '1.4.3',
        AA_NORMAL,
        `${severity}.--gradient-${severity}-text @brightness(${factor})`,
        hoveredLabel,
        `--gradient-${severity}-from @brightness(${factor})`,
        brightenHex(g.from, factor),
        'hovered gradient stop 1',
      );
      add(
        mode,
        'severity button (hover)',
        '1.4.3',
        AA_NORMAL,
        `${severity}.--gradient-${severity}-text @brightness(${factor})`,
        hoveredLabel,
        `--gradient-${severity}-to @brightness(${factor})`,
        brightenHex(g.to, factor),
        'hovered gradient stop 2',
      );
    }

    // ---- BRAND CHIP INK · SC 1.4.3 (4.5:1) -------------------------------
    // The signature blocks paint the app title as a chip in the style's own brand
    // colour and put --style-brand-ink on it (styles.scss, `app-root
    // .app-title-link`). The chip is normal-size text, so 4.5:1 applies. brandScale
    // has no dark flip, which is why a style carries the same ink in both modes —
    // and why a style that ever did flip it would surface here as a one-mode fail.
    for (const step of chipSteps[style.name] ?? []) {
      add(
        mode,
        'brand chip',
        '1.4.3',
        AA_NORMAL,
        '--style-brand-ink',
        style.brandInk[mode],
        `brandScale ${step}`,
        style.brand[step],
        'app title chip',
      );
    }

    // ---- BRAND FOREGROUND ROLE · SC 1.4.3 (4.5:1) ------------------------
    // primaryFg/accentFg become --primary-color-fg / --gradient-accent-color-fg
    // (305 usages of the former) and carry links, title gradients, icons and the
    // outlined-button label. Text → 1.4.3. The same tokens also draw the outlined-button
    // BORDER (SC 1.4.11, 3:1); 4.5 is the stricter bar and subsumes it, so the border
    // role is not listed separately.
    const fgFields =
      mode === 'dark'
        ? [
            ['primaryFgDark', '--primary-color-fg'],
            ['accentFgDark', '--gradient-accent-color-fg'],
          ]
        : [
            ['primaryFg', '--primary-color-fg'],
            ['accentFg', '--gradient-accent-color-fg'],
          ];
    for (const c of colors) {
      for (const [field, token] of fgFields) {
        for (const [bgName, bg] of [
          ['--surface-ground', ground],
          ['--surface-card', card],
        ]) {
          add(mode, 'brand foreground', '1.4.3', AA_NORMAL, `${c.name}.${token}`, c[field], bgName, bg);
        }
      }
    }

    // ---- FILLED-BUTTON LABEL · SC 1.4.3 (4.5:1) --------------------------
    // The filled button paints linear-gradient(--primary-color → --gradient-accent-color)
    // and the runtime picks the label colour from the stops' AVERAGE luminance at a 3:1
    // bar (getOptimalTextColor). The label is normal-size text (1rem / weight 500), so
    // the criterion is 4.5:1, and it must hold at BOTH stops — an average cannot rescue
    // the end of a gradient the text actually crosses.
    const bgFields = mode === 'dark' ? ['primaryColorDark', 'gradientAccentDark'] : ['primaryColor', 'gradientAccent'];
    for (const c of colors) {
      const label = optimalTextColor(c[bgFields[0]], c[bgFields[1]]);
      add(
        mode,
        'filled button',
        '1.4.3',
        AA_NORMAL,
        `${c.name}.--primary-color-text`,
        label,
        `${c.name}.--primary-color`,
        c[bgFields[0]],
        'gradient stop 1',
      );
      add(
        mode,
        'filled button',
        '1.4.3',
        AA_NORMAL,
        `${c.name}.--primary-color-text`,
        label,
        `${c.name}.--gradient-accent-color`,
        c[bgFields[1]],
        'gradient stop 2',
      );

      // ---- FILLED BUTTON LABEL WHILE HOVERED · SC 1.4.3 ------------------
      // The same clamp as the severities, on the most used button of the app:
      // with the former flat brightness(1.1), 6 of these 20 accent x mode
      // pairs fell under 4.5:1 (worst sunset/light 4.18:1). The direction now
      // comes from ui-styles.ts#hoverBrightnessFor; this gate re-derives it.
      const hf = hoverBrightness(c[bgFields[0]], c[bgFields[1]], label);
      const hoveredPrimaryLabel = brightenHex(label, hf);
      add(
        mode,
        'filled button (hover)',
        '1.4.3',
        AA_NORMAL,
        `${c.name}.--primary-color-text @brightness(${hf})`,
        hoveredPrimaryLabel,
        `${c.name}.--primary-color @brightness(${hf})`,
        brightenHex(c[bgFields[0]], hf),
        'hovered gradient stop 1',
      );
      add(
        mode,
        'filled button (hover)',
        '1.4.3',
        AA_NORMAL,
        `${c.name}.--primary-color-text @brightness(${hf})`,
        hoveredPrimaryLabel,
        `${c.name}.--gradient-accent-color @brightness(${hf})`,
        brightenHex(c[bgFields[1]], hf),
        'hovered gradient stop 2',
      );
    }

    // ---- ACCENT SURFACE · SC 1.4.3 (4.5:1) -------------------------------
    // Icon circles, highlight boxes and tinted panels: --accent-on-surface is text on
    // --accent-surface, both derived at runtime from the brand's primaryColor with
    // lighten/darken (theme.service.ts:336-345).
    for (const c of colors) {
      const surface = mode === 'dark' ? darkenColor(c.primaryColor, 0.5) : lightenColor(c.primaryColor, 0.8);
      const on = mode === 'dark' ? lightenColor(c.primaryColor, 0.6) : darkenColor(c.primaryColor, 0.2);
      add(
        mode,
        'accent surface',
        '1.4.3',
        AA_NORMAL,
        `${c.name}.--accent-on-surface`,
        on,
        `${c.name}.--accent-surface`,
        surface,
        'derived from primaryColor',
      );
    }
  }
  return pairs;
}

// ---------------------------------------------------------------------------
// Widget pairs — Optimus UI components as the kit renders them
// ---------------------------------------------------------------------------

/** Style surface field → the custom property ThemeService writes it to. */
const SURFACE_TOKEN_OF = {
  ground: '--surface-ground',
  card: '--surface-card',
  section: '--surface-section',
  border: '--surface-border',
  hover: '--surface-hover',
  textColor: '--text-color',
  textColorSecondary: '--text-color-secondary',
  controlBorder: '--control-border',
  controlPlaceholder: '--control-placeholder',
};

const extraTokenCache = new Map();
const extraTokensOf = (name) => {
  if (!extraTokenCache.has(name)) extraTokenCache.set(name, readStyleExtraTokens(name));
  return extraTokenCache.get(name);
};

/** A kit custom property as one style and mode resolve it, or null. */
function kitVar(style, mode, name) {
  const field = Object.keys(SURFACE_TOKEN_OF).find((f) => SURFACE_TOKEN_OF[f] === name);
  if (field && style.surfaces[mode][field]) return style.surfaces[mode][field];
  const extra = extraTokensOf(style.name);
  const e = extra ? { ...extra.common, ...extra[mode] }[name] : undefined;
  if (e && /^#[0-9a-fA-F]{6}$/.test(e)) return e.toLowerCase();
  return scss[mode][name] ?? null;
}

/** A plain colour value → { hex, alpha }, or null for anything else. */
function parseColor(v) {
  const s = String(v).trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(s)) return { hex: '#' + rgb(s).map(toHex).join(''), alpha: 1 };
  const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(s);
  if (m) return { hex: '#' + [m[1], m[2], m[3]].map((n) => toHex(Number(n))).join(''), alpha: m[4] ? Number(m[4]) : 1 };
  return null;
}

/** Layers 1 + 2: every Aura token of one mode, with the accent's primary ramp. */
function widgetScope(aura, mode, accentBase) {
  const map = {};
  flattenTokens(aura.base.primitive, '', map, false);
  const { colorScheme, ...semantic } = aura.base.semantic;
  flattenTokens(semantic, '', map, false);
  flattenTokens(colorScheme[mode], '', map, false);
  for (const [step, hex] of Object.entries(primaryRamp(accentBase))) map[`primary.${step}`] = hex;
  if (mode === 'dark') for (const [k, v] of Object.entries(DARK_PRIMARY)) map[`primary.${dottedKey(k)}`] = v;
  for (const [c, def] of Object.entries(aura.components)) {
    const { colorScheme: cs, ...rest } = def;
    flattenTokens(rest, c, map, true);
    if (cs?.[mode]) flattenTokens(cs[mode], c, map, true);
  }
  return map;
}

/**
 * Resolve one Aura token name to { hex, alpha }. Layer 3 (a kit rule that
 * re-points `--p-<name>` on the element) applies to the REQUESTED token only:
 * Optimus declares the whole reference chain on :root, where
 * `--p-checkbox-border-color: var(--p-form-field-border-color)` is already
 * substituted, so re-pointing the intermediate token on an element changes
 * nothing — and the gate must not pretend it does. Throws on anything it cannot
 * resolve; a guessed colour would be a fake ratio.
 */
function resolveWidget(scope, over, kit, name) {
  let raw = over['--p-' + name.replace(/\./g, '-')] ?? scope[name];
  for (let hop = 0; hop < 25; hop++) {
    if (raw === undefined) throw new Error(`unknown Optimus token ${name}`);
    const v = String(raw).trim();
    const ref = /^\{([^}]+)\}$/.exec(v);
    if (ref) {
      raw = scope[ref[1]];
      continue;
    }
    const kv = /^var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)$/.exec(v);
    // A kit rule may point one Optimus token at another (`var(--p-primary-color)`):
    // that is the Aura token of the same dotted name.
    const pv = kv && /^--p-(.+)$/.exec(kv[1]);
    if (pv && scope[pv[1].replace(/-/g, '.')] !== undefined) {
      raw = scope[pv[1].replace(/-/g, '.')];
      continue;
    }
    if (kv) {
      const hex = kit(kv[1]);
      if (!hex) throw new Error(`${name} points at ${kv[1]}, which no style, mode or stylesheet token defines`);
      raw = hex;
      continue;
    }
    const mixed = /^color-mix\(in srgb,\s*(.+?),\s*transparent\s+([\d.]+)%\)$/.exec(v);
    if (mixed) {
      const inner = /^\{([^}]+)\}$/.exec(mixed[1].trim());
      const base = inner ? resolveWidget(scope, {}, kit, inner[1]) : parseColor(mixed[1]);
      if (!base) throw new Error(`${name}: cannot resolve ${mixed[1]}`);
      return { hex: base.hex, alpha: base.alpha * (1 - Number(mixed[2]) / 100) };
    }
    const c = parseColor(v);
    if (c) return c;
    throw new Error(`${name} resolves to "${v}", which is not a colour this gate can measure`);
  }
  throw new Error(`${name}: reference chain longer than 25 hops`);
}

/** A translucent colour composited over the opaque colour behind it. */
const flatOver = (c, backdrop) => (c.alpha >= 1 ? c.hex : mix(c.hex, backdrop, c.alpha * 100));

/**
 * The widget pairs of ONE style. Which criterion applies is decided per role,
 * as for the page pairs: a control's edge, a state-carrying fill, a check mark
 * or a handle is SC 1.4.11 (3:1); a label is SC 1.4.3 (4.5:1 — tag text is
 * 14px bold, below large-scale). A skeleton block and a progress track have no
 * criterion (decoration; the value is carried by the fill against the track),
 * so they are listed as INFORMATIONAL rows that never fail.
 */
function buildWidgetPairs(style, colors, aura, ovr) {
  const pairs = [];
  const add = (mode, group, sc, min, fgName, fg, bgName, bg, note) =>
    pairs.push({
      id: `${style.name} ${mode}: ${fgName} on ${bgName}`,
      style: style.name,
      mode,
      group,
      sc,
      min,
      fgName,
      fg,
      bgName,
      bg,
      note,
    });
  const info = (mode, group, fgName, fg, bgName, bg, note) =>
    add(mode, group, 'none', null, fgName, fg, bgName, bg, note);

  for (const mode of ['light', 'dark']) {
    const s = style.surfaces[mode];
    const pages = [
      ['--surface-ground', s.ground],
      ['--surface-card', s.card],
    ];
    const over = ovr.tokens[mode];
    const kit = (n) => kitVar(style, mode, n);
    const scopeOf = (accent) => widgetScope(aura, mode, accent);
    const T = (scope, name) => resolveWidget(scope, over, kit, name);
    // Accent-independent tokens: any accent's scope resolves them identically.
    const neutral = scopeOf(colors[0][RAMP_BASE[mode]]);
    const N = (name) => T(neutral, name);
    const opaque = (name, backdrop) => flatOver(N(name), backdrop);

    // ---- CHECKBOX & RADIOBUTTON · SC 1.4.11 -------------------------------
    // The unchecked box is identified by its border alone (the fill is the
    // field background). radiobutton reads the same form-field token; the gate
    // asserts that rather than listing identical rows twice.
    if (N('radiobutton.border.color').hex !== N('checkbox.border.color').hex)
      errors.push('radiobutton.border.color no longer equals checkbox.border.color — give it its own rows.');
    for (const [bgName, bg] of pages)
      add(
        mode,
        'checkbox & radiobutton',
        '1.4.11',
        NON_TEXT,
        'checkbox.border.color',
        opaque('checkbox.border.color', bg),
        bgName,
        bg,
        'unchecked edge; radiobutton.border.color is the same token',
      );

    // ---- TOGGLESWITCH · SC 1.4.11 -----------------------------------------
    // Aura gives the switch a transparent border, so the OFF track is its only
    // edge; the handle identifies the state on it.
    for (const [bgName, bg] of pages)
      add(
        mode,
        'toggleswitch',
        '1.4.11',
        NON_TEXT,
        'toggleswitch.background',
        opaque('toggleswitch.background', bg),
        bgName,
        bg,
        'off track (border is transparent)',
      );
    {
      const track = opaque('toggleswitch.background', s.card);
      add(
        mode,
        'toggleswitch',
        '1.4.11',
        NON_TEXT,
        'toggleswitch.handle.background',
        flatOver(N('toggleswitch.handle.background'), track),
        'toggleswitch.background',
        track,
        'off handle on its track',
      );
    }

    // ---- FORM FIELD EDGE · SC 1.4.11 --------------------------------------
    // Measured against both page surfaces and the field's own fill. The text
    // input's edge is repainted by every signature block (`input.p-inputtext`
    // border-color in html.style-<name>), which outranks the token.
    const sig = ovr.inputBorder[style.name]?.[mode];
    const sigEdge = () => {
      const m = /^var\(\s*(--[a-z0-9-]+)/.exec(sig);
      const hex = m ? kit(m[1]) : parseColor(sig)?.hex;
      if (!hex) throw new Error(`the signature input border of ${style.name} (${mode}) does not resolve: ${sig}`);
      return { hex, alpha: 1 };
    };
    const fields = [
      ['select.border.color', N('select.border.color'), 'select.background'],
      sig
        ? [`input.p-inputtext border-color: ${sig}`, sigEdge(), 'inputtext.background']
        : ['inputtext.border.color', N('inputtext.border.color'), 'inputtext.background'],
      ['textarea.border.color', N('textarea.border.color'), 'textarea.background'],
    ];
    for (const [fgName, edge, fillName] of fields) {
      const fill = opaque(fillName, s.card);
      for (const [bgName, bg] of [...pages, [fillName, fill]])
        add(mode, 'form field edge', '1.4.11', NON_TEXT, fgName, flatOver(edge, bg), bgName, bg, 'resting edge');
    }

    // ---- FORM FIELD TEXT · SC 1.4.3 ---------------------------------------
    for (const c of ['inputtext', 'select', 'textarea', 'cascadeselect', 'multiselect', 'treeselect', 'autocomplete']) {
      const fill = opaque(`${c}.background`, s.card);
      add(
        mode,
        'form field text',
        '1.4.3',
        AA_NORMAL,
        `${c}.color`,
        flatOver(N(`${c}.color`), fill),
        `${c}.background`,
        fill,
        'value text',
      );
      add(
        mode,
        'form field text',
        '1.4.3',
        AA_NORMAL,
        `${c}.placeholder.color`,
        flatOver(N(`${c}.placeholder.color`), fill),
        `${c}.background`,
        fill,
        'placeholder',
      );
    }

    // ---- FORM FIELD ICON · SC 1.4.11 / 1.4.3 --------------------------------
    // The dropdown chevron (the one sign that the box opens a list), the clear
    // icon, the password reveal icon and the datepicker's input icon all read
    // form.field.icon.color in stock Aura; styles.scss re-points each to
    // --text-color-secondary. The gate asserts they still agree and measures
    // the colour on each field's own fill.
    {
      const ICONS = [
        ['select.dropdown.color', 'select.background'],
        ['select.clear.icon.color', 'select.background'],
        ['multiselect.dropdown.color', 'multiselect.background'],
        ['multiselect.clear.icon.color', 'multiselect.background'],
        ['cascadeselect.dropdown.color', 'cascadeselect.background'],
        ['cascadeselect.clear.icon.color', 'cascadeselect.background'],
        ['treeselect.dropdown.color', 'treeselect.background'],
        ['treeselect.clear.icon.color', 'treeselect.background'],
        ['password.icon.color', 'inputtext.background'],
        ['datepicker.input.icon.color', 'inputtext.background'],
      ];
      const ref = N(ICONS[0][0]).hex;
      for (const [t] of ICONS)
        if (N(t).hex !== ref) errors.push(`${t} no longer equals ${ICONS[0][0]} — give it its own field-icon rows.`);
      for (const [t, fillName] of ICONS) {
        // Same colour on the same fill as the row it pairs with.
        if (t.includes('.clear.') || t.startsWith('datepicker.')) continue;
        const fill = opaque(fillName, s.card);
        add(
          mode,
          'form field icon',
          '1.4.11',
          NON_TEXT,
          t,
          flatOver(N(t), fill),
          fillName,
          fill,
          t.startsWith('password')
            ? 'reveal icon; the datepicker input icon is the same colour'
            : 'dropdown chevron; the clear icon is the same colour',
        );
      }
      const dd = opaque('autocomplete.dropdown.background', s.card);
      add(
        mode,
        'form field icon',
        '1.4.11',
        NON_TEXT,
        'autocomplete.dropdown.color',
        flatOver(N('autocomplete.dropdown.color'), dd),
        'autocomplete.dropdown.background',
        dd,
        'autocomplete dropdown button icon (stock Aura)',
      );
      const dpd = opaque('datepicker.dropdown.background', s.card);
      add(
        mode,
        'form field icon',
        '1.4.11',
        NON_TEXT,
        'datepicker.dropdown.color',
        flatOver(N('datepicker.dropdown.color'), dpd),
        'datepicker.dropdown.background',
        dpd,
        'datepicker trigger button icon (showIcon, stock Aura)',
      );
      const addon = opaque('inputgroup.addon.background', s.card);
      add(
        mode,
        'form field icon',
        '1.4.3',
        AA_NORMAL,
        'inputgroup.addon.color',
        flatOver(N('inputgroup.addon.color'), addon),
        'inputgroup.addon.background',
        addon,
        'input-group addon text or icon',
      );
    }

    // ---- FLOAT LABEL · SC 1.4.3 ----------------------------------------------
    // The resting label sits inside the field like a placeholder; floated with
    // variant="on" it sits on a chip cut into the field's top edge, which must
    // be the field's own fill (styles.scss re-points it in dark mode — Aura's
    // surface.950 chip was a dark patch on the kit's --surface-section field).
    {
      const field = opaque('inputtext.background', s.card);
      const chip = opaque('floatlabel.on.active.background', field);
      if (chip !== field)
        errors.push(
          `${style.name} ${mode}: the float-label chip (floatlabel.on.active.background ${chip}) is not the field fill (${field}) — it shows as a patch.`,
        );
      // Every field shell a float or ifta label can sit in shares that fill
      // (the dark textarea, multiselect, treeselect and autocomplete box
      // would otherwise rest on Aura's surface.950), so the rows below stand for all.
      for (const c of ['select', 'textarea', 'multiselect', 'cascadeselect', 'treeselect', 'autocomplete']) {
        const f = opaque(`${c}.background`, s.card);
        if (f !== field)
          errors.push(
            `${style.name} ${mode}: ${c}.background (${f}) is not the field fill (${field}) — the float-label chip shows as a patch on it; give it the kit's field fill.`,
          );
      }
      add(
        mode,
        'float label',
        '1.4.3',
        AA_NORMAL,
        'floatlabel.color',
        flatOver(N('floatlabel.color'), field),
        'inputtext.background',
        field,
        'resting label inside the field',
      );
      add(
        mode,
        'float label',
        '1.4.3',
        AA_NORMAL,
        'floatlabel.active.color',
        flatOver(N('floatlabel.active.color'), chip),
        'floatlabel.on.active.background',
        chip,
        'floated label on its chip (variant="on")',
      );
      add(
        mode,
        'float label',
        '1.4.3',
        AA_NORMAL,
        'floatlabel.focus.color',
        flatOver(N('floatlabel.focus.color'), chip),
        'floatlabel.on.active.background',
        chip,
        'label of the focused field',
      );
      add(
        mode,
        'float label',
        '1.4.3',
        AA_NORMAL,
        'floatlabel.invalid.color',
        flatOver(N('floatlabel.invalid.color'), chip),
        'floatlabel.on.active.background',
        chip,
        'label of an invalid field',
      );
      // p-iftaLabel: the label sits inside the field, above the value.
      for (const [tok, note] of [
        ['iftalabel.color', 'ifta label inside the field'],
        ['iftalabel.focus.color', 'ifta label of the focused field'],
        ['iftalabel.invalid.color', 'ifta label of an invalid field'],
      ])
        add(mode, 'float label', '1.4.3', AA_NORMAL, tok, flatOver(N(tok), field), 'inputtext.background', field, note);
      info(
        mode,
        'float label',
        'floatlabel.on.active.background',
        chip,
        'inputtext.background',
        field,
        'chip against the field fill — 1.00:1 means no patch',
      );
    }

    // ---- TAG · SC 1.4.3 ---------------------------------------------------
    // 14px bold is not large-scale text. Severities with a translucent fill are
    // composited over each page surface; the dark severities repainted in
    // styles.scss (`.dark-theme .p-tag.p-tag-<sev>`) are taken from there.
    const tagPair = (scope, prefix, sev) => {
      const prop = ovr.tagProps[mode][sev] ?? {};
      const fg = prop.color ? parseColor(prop.color) : T(scope, `tag.${sev}.color`);
      const bg = prop.background ? parseColor(prop.background) : T(scope, `tag.${sev}.background`);
      if (!fg || !bg) throw new Error(`tag ${sev}: the styles.scss repaint is not a plain colour`);
      const fgName = `${prefix}tag.${sev}.color${prop.color ? ' (styles.scss)' : ''}`;
      const bgName = `${prefix}tag.${sev}.background${prop.background ? ' (styles.scss)' : ''}`;
      if (bg.alpha >= 1)
        add(
          mode,
          'tag',
          '1.4.3',
          AA_NORMAL,
          fgName,
          flatOver(fg, bg.hex),
          bgName,
          bg.hex,
          sev === 'primary' ? 'no severity set' : `severity ${sev}`,
        );
      else
        for (const [pageName, page] of pages) {
          const fill = flatOver(bg, page);
          add(
            mode,
            'tag',
            '1.4.3',
            AA_NORMAL,
            fgName,
            flatOver(fg, fill),
            `${bgName} over ${pageName}`,
            fill,
            `translucent fill (${Math.round(bg.alpha * 100)}%)`,
          );
        }
    };
    for (const sev of ['secondary', 'success', 'info', 'warn', 'danger', 'contrast']) tagPair(neutral, '', sev);

    // ---- CHIP · SC 1.4.3 + SC 1.4.11 --------------------------------------
    {
      const fill = opaque('chip.background', s.card);
      add(
        mode,
        'chip',
        '1.4.3',
        AA_NORMAL,
        'chip.color',
        flatOver(N('chip.color'), fill),
        'chip.background',
        fill,
        'label',
      );
      add(
        mode,
        'chip',
        '1.4.11',
        NON_TEXT,
        'chip.remove.icon.color',
        flatOver(N('chip.remove.icon.color'), fill),
        'chip.background',
        fill,
        'remove icon',
      );
    }

    // ---- DIALOG · SC 1.4.3 + SC 1.4.11 ------------------------------------
    // The close button is a rounded secondary TEXT p-button
    // (openng-optimus-ui-dialog.mjs, closeButtonProps): its icon is
    // button.text.secondary.color (re-pointed to --text-color-secondary), its
    // keyboard ring the one kit ring (accent loop, "focus ring").
    const dialogPanel = opaque('dialog.background', s.card);
    {
      const panel = opaque('dialog.background', s.card);
      add(
        mode,
        'dialog',
        '1.4.3',
        AA_NORMAL,
        'dialog.color',
        flatOver(N('dialog.color'), panel),
        'dialog.background',
        panel,
        'panel text',
      );
      add(
        mode,
        'dialog',
        '1.4.11',
        NON_TEXT,
        'button.text.secondary.color',
        flatOver(N('button.text.secondary.color'), panel),
        'dialog.background',
        panel,
        'close-button icon',
      );
    }

    // ---- SKELETON · informational ------------------------------------------
    // A loading placeholder is aria-hidden decoration: no SC sets a minimum. The
    // ratio is listed so a guide can say how faint it is without eyedropping.
    for (const [bgName, bg] of pages)
      info(
        mode,
        'skeleton',
        'skeleton.background',
        flatOver(N('skeleton.background'), bg),
        bgName,
        bg,
        'decoration, no WCAG minimum',
      );

    // ---- SLIDER · SC 1.4.11 -----------------------------------------------
    for (const [bgName, bg] of pages) {
      add(
        mode,
        'progressbar & slider',
        '1.4.11',
        NON_TEXT,
        'slider.track.background',
        flatOver(N('slider.track.background'), bg),
        bgName,
        bg,
        'slider track',
      );
      add(
        mode,
        'progressbar & slider',
        '1.4.11',
        NON_TEXT,
        'slider.handle.background',
        flatOver(N('slider.handle.background'), bg),
        bgName,
        bg,
        'slider handle ring',
      );
      info(
        mode,
        'progressbar & slider',
        'progressbar.background',
        flatOver(N('progressbar.background'), bg),
        bgName,
        bg,
        'progress track extent — the value is carried by the fill on the track',
      );
    }

    // ---- TOGGLEBUTTON / SELECTBUTTON · SC 1.4.3 ----------------------------
    // The pressed pill paints --primary-color-fg, so its rows live in the
    // accent loop; the unpressed and hovered labels are accent-free.
    const toggleSeg = opaque('togglebutton.background', s.card);
    {
      const seg = toggleSeg;
      add(
        mode,
        'togglebutton & selectbutton',
        '1.4.3',
        AA_NORMAL,
        'togglebutton.color',
        flatOver(N('togglebutton.color'), seg),
        'togglebutton.background',
        seg,
        'unpressed label',
      );
      const hov = opaque('togglebutton.hover.background', s.card);
      add(
        mode,
        'togglebutton & selectbutton',
        '1.4.3',
        AA_NORMAL,
        'togglebutton.hover.color',
        flatOver(N('togglebutton.hover.color'), hov),
        'togglebutton.hover.background',
        hov,
        'hovered label',
      );
    }

    // ---- MORE FIELD SHELLS · SC 1.4.11 -------------------------------------
    // p-multiselect, the multiple-mode box and the dropdown button of
    // p-autocomplete, and the spin buttons of p-inputnumber (horizontal and
    // vertical layouts). Their edges are re-pointed to --control-border in
    // styles.scss; the spin icon is the button's only content.
    for (const [fgName, fillName, note] of [
      ['multiselect.border.color', 'multiselect.background', 'resting edge'],
      ['listbox.border.color', 'listbox.background', 'resting edge; also the lists of orderlist and picklist'],
      ['autocomplete.border.color', 'autocomplete.background', 'multiple-mode box edge'],
      ['autocomplete.dropdown.border.color', 'autocomplete.background', 'dropdown button edge'],
      ['datepicker.dropdown.border.color', 'datepicker.dropdown.background', 'trigger button edge (showIcon)'],
      ['inputnumber.button.border.color', 'inputtext.background', 'spin button edge'],
      ['cascadeselect.border.color', 'cascadeselect.background', 'resting edge'],
    ]) {
      const fill = opaque(fillName, s.card);
      for (const [bgName, bg] of [...pages, [fillName, fill]])
        add(mode, 'form field edge', '1.4.11', NON_TEXT, fgName, opaque(fgName, bg), bgName, bg, note);
    }
    {
      const fill = opaque('inputtext.background', s.card);
      add(
        mode,
        'form field edge',
        '1.4.11',
        NON_TEXT,
        'inputnumber.button.color',
        opaque('inputnumber.button.color', fill),
        'inputtext.background',
        fill,
        'spin button icon',
      );
    }

    // ---- INVALID EDGE · SC 1.4.11 -----------------------------------------
    // Every field's invalid token points at the same kit colour; the rule
    // `input.p-inputtext.p-invalid` makes it win over the signature blocks'
    // `input.p-inputtext` border (without it, `[invalid]` drew no red edge).
    {
      const INVALID = [
        'inputtext',
        'textarea',
        'select',
        'multiselect',
        'autocomplete',
        'cascadeselect',
        'checkbox',
        'radiobutton',
        'toggleswitch',
      ].map((c) => `${c}.invalid.border.color`);
      const ref = N(INVALID[0]).hex;
      for (const t of INVALID)
        if (N(t).hex !== ref) errors.push(`${t} no longer equals ${INVALID[0]} — give it its own invalid rows.`);
      const win = /^var\(\s*(--[a-z0-9-]+)/.exec(ovr.props['input.p-inputtext.p-invalid']?.['border-color'] ?? '');
      if (!win || kit(win[1]) !== ref)
        errors.push(
          'styles.scss: `input.p-inputtext.p-invalid` no longer paints the invalid token — the signature blocks would hide the invalid edge again.',
        );
      const fill = opaque('inputtext.background', s.card);
      for (const [bgName, bg] of [...pages, ['inputtext.background', fill]])
        add(
          mode,
          'form field edge',
          '1.4.11',
          NON_TEXT,
          'inputtext.invalid.border.color',
          flatOver(N(INVALID[0]), bg),
          bgName,
          bg,
          'invalid edge; textarea, select, multiselect, autocomplete, cascadeselect, checkbox, radiobutton and toggleswitch read the same colour',
        );
    }

    // ---- MENU CHEVRON · SC 1.4.11 -------------------------------------------
    // The submenu chevron is the only visual cue that an item opens a
    // submenu. Measured on the menu panel and on the focused item's tint; the
    // four nesting menus are asserted to agree, so one set of rows stands for all.
    const MENUS = [
      ['menubar', 'menubar.background', 'menubar.submenu.icon.color', 'menubar.item.focus.background'],
      ['megamenu', 'megamenu.background', 'megamenu.submenu.icon.color', 'megamenu.item.focus.background'],
      ['tieredmenu', 'tieredmenu.background', 'tieredmenu.submenu.icon.color', 'tieredmenu.item.focus.background'],
      ['contextmenu', 'contextmenu.background', 'contextmenu.submenu.icon.color', 'contextmenu.item.focus.background'],
      ['panelmenu', 'panelmenu.panel.background', 'panelmenu.submenu.icon.color', 'panelmenu.item.focus.background'],
      ['menu', 'menu.background', null, 'menu.item.focus.background'],
    ];
    const menuPanel = opaque(MENUS[0][1], s.card);
    const menuFocus = opaque(MENUS[0][3], menuPanel);
    for (const [name, panelTok, chevronTok, focusTok] of MENUS) {
      if (opaque(panelTok, s.card) !== menuPanel || opaque(focusTok, menuPanel) !== menuFocus)
        errors.push(`${name}: panel or focus tint no longer equals the menubar's — give it its own menu rows.`);
      if (chevronTok && N(chevronTok).hex !== N(MENUS[0][2]).hex)
        errors.push(`${chevronTok} no longer equals ${MENUS[0][2]} — give it its own chevron rows.`);
    }
    // The megamenu's dropdown panel is its own token (megamenu.overlay.background).
    if (opaque('megamenu.overlay.background', s.card) !== menuPanel)
      errors.push('megamenu: the dropdown panel no longer equals the menubar panel — give it its own menu rows.');
    for (const [bgName, bg] of [
      ['menubar.background', menuPanel],
      ['menubar.item.focus.background', menuFocus],
    ])
      add(
        mode,
        'menu focus',
        '1.4.11',
        NON_TEXT,
        'menubar.submenu.icon.color',
        flatOver(N('menubar.submenu.icon.color'), bg),
        bgName,
        bg,
        'submenu chevron; megamenu, tieredmenu, contextmenu and panelmenu are the same pair',
      );
    // The ITEM ICON: Aura's navigation.item.icon (surface.400 / .500)
    // is 2.56:1 on white in Aura; it is an icon-only item's only
    // carrier, so it is held to 3:1 like the chevron. Every step of every
    // menu (rest, focus, active where Aura has one) is asserted to agree, so
    // one set of rows — measured on the panel and on the focus tint — stands
    // for all six.
    {
      const ICON_STEPS = { menu: ['', 'focus.'], panelmenu: ['', 'focus.'] };
      const iconRef = N('menubar.item.icon.color').hex;
      for (const [name] of MENUS)
        for (const step of ICON_STEPS[name] ?? ['', 'focus.', 'active.']) {
          const tok = `${name}.item.icon.${step}color`;
          if (N(tok).hex !== iconRef)
            errors.push(`${tok} no longer equals menubar.item.icon.color — give it its own item icon rows.`);
        }
      for (const [bgName, bg] of [
        ['menubar.background', menuPanel],
        ['menubar.item.focus.background', menuFocus],
      ])
        add(
          mode,
          'menu focus',
          '1.4.11',
          NON_TEXT,
          'menubar.item.icon.color',
          flatOver(N('menubar.item.icon.color'), bg),
          bgName,
          bg,
          'item icon (rest, focus, active); menu, megamenu, tieredmenu, contextmenu and panelmenu (items and headers) are the same pair',
        );
    }
    info(
      mode,
      'menu focus',
      'menubar.item.focus.background',
      menuFocus,
      'menubar.background',
      menuPanel,
      'Aura focus tint alone — why the kit adds a ring (rows below)',
    );
    // The option lists' keyboard position without the kit ring: the same tint alone.
    {
      const lists = Object.values(KIT_RING_OPTIONS).map((o) => o.panel);
      const panel = opaque(lists[0], s.card);
      info(
        mode,
        'option list focus',
        'select.option.focus.background',
        opaque('select.option.focus.background', panel),
        lists[0],
        panel,
        'Aura focus tint alone (every option list reads list.option.focus.background) — why the kit adds a ring (rows in the accent section)',
      );
    }

    // ---- PANEL OUTLINE · SC 1.4.11 ------------------------------------------
    // Cards, dialogs, drawers (page-facing edge) and popovers draw the style's
    // --style-outline (signature blocks; .p-popover re-points its border
    // token). A panel's fill is barely apart from the ground, so the outline
    // carries the boundary — measured against both page surfaces.
    {
      const outline = kit('--style-outline');
      if (!outline) throw new Error(`--style-outline does not resolve for ${style.name} (${mode})`);
      const pop = /^var\(\s*(--[a-z0-9-]+)/.exec(ovr.tokens[mode]['--p-popover-border-color'] ?? '');
      if (!pop || pop[1] !== '--style-outline')
        errors.push('styles.scss: .p-popover no longer points its border at --style-outline — measure its own edge.');
      for (const [bgName, bg] of pages)
        add(
          mode,
          'panel outline',
          '1.4.11',
          NON_TEXT,
          '--style-outline',
          outline,
          bgName,
          bg,
          'card, dialog, drawer and popover edge',
        );
      for (const tok of ['popover.background', 'drawer.background'])
        info(mode, 'panel outline', tok, opaque(tok, s.card), '--surface-card', s.card, 'panel fill (Aura overlay)');
    }

    // ---- CONTENT PANEL TEXT · SC 1.4.3 ----------------------------------------
    // Aura's generic panel pair — {text.color} on {content.background} — is what
    // tree, editor, the datepicker panel and most other panels paint when the kit
    // does not re-point them. One row, so those guides can cite it.
    {
      const panel = opaque('content.background', s.card);
      add(
        mode,
        'content panel',
        '1.4.3',
        AA_NORMAL,
        'text.color',
        flatOver(N('text.color'), panel),
        'content.background',
        panel,
        "Aura's panel text (tree, editor, datepicker panel, …)",
      );
    }

    // ---- TABLE & PAGINATOR ---------------------------------------------------
    // The fills take --surface-card (styles.scss); the rows show what sits on
    // them. The per-accent selection rows follow in the accent loop.
    {
      const row = opaque('datatable.row.background', s.card);
      const pag = opaque('paginator.background', s.card);
      info(mode, 'table & paginator', 'datatable.row.background', row, '--surface-card', s.card, 'row fill');
      info(mode, 'table & paginator', 'paginator.background', pag, '--surface-card', s.card, 'paginator fill');
      add(
        mode,
        'table & paginator',
        '1.4.3',
        AA_NORMAL,
        'datatable.row.color',
        flatOver(N('datatable.row.color'), row),
        'datatable.row.background',
        row,
        'cell text',
      );
      add(
        mode,
        'table & paginator',
        '1.4.3',
        AA_NORMAL,
        'paginator.nav.button.color',
        flatOver(N('paginator.nav.button.color'), pag),
        'paginator.background',
        pag,
        'idle page number and nav icons',
      );
    }

    // ---- BADGE · SC 1.4.3 ----------------------------------------------------
    // The number/label is 12px bold — normal text. The fill is opaque in every
    // severity; the primary badge paints primary.color (accent loop).
    for (const sev of ['secondary', 'success', 'info', 'warn', 'danger', 'contrast']) {
      const fill = opaque(`badge.${sev}.background`, s.card);
      add(
        mode,
        'badge',
        '1.4.3',
        AA_NORMAL,
        `badge.${sev}.color`,
        flatOver(N(`badge.${sev}.color`), fill),
        `badge.${sev}.background`,
        fill,
        `severity ${sev}`,
      );
    }

    // ---- MESSAGE & TOAST · SC 1.4.3 --------------------------------------------
    // The severity text (summary, icon and close icon share one token) sits on
    // the severity's translucent tint, composited over each page surface. The
    // outlined and simple messages put the text straight on the page; their
    // colour is asserted equal to each other and to the outlined border, so one
    // row stands for all three. A toast floats over whatever is behind it — the
    // same two page surfaces. The close button's focus ring is currentColor —
    // this same text colour on this same tint (NOTICE_RING_SELECTORS), so these
    // rows measure it too, at the stricter 4.5:1.
    for (const sev of ['info', 'success', 'warn', 'error', 'secondary', 'contrast']) {
      const simple = N(`message.${sev}.simple.color`).hex;
      if (N(`message.${sev}.outlined.color`).hex !== simple || N(`message.${sev}.outlined.border.color`).hex !== simple)
        errors.push(`message.${sev}: outlined colour, outlined border and simple colour differ — give each its row.`);
      for (const [pageName, page] of pages) {
        const fill = flatOver(N(`message.${sev}.background`), page);
        add(
          mode,
          'message & toast',
          '1.4.3',
          AA_NORMAL,
          `message.${sev}.color`,
          flatOver(N(`message.${sev}.color`), fill),
          `message.${sev}.background over ${pageName}`,
          fill,
          'message text, icon and close icon on the tint',
        );
        add(
          mode,
          'message & toast',
          '1.4.3',
          AA_NORMAL,
          `message.${sev}.simple.color`,
          flatOver(N(`message.${sev}.simple.color`), page),
          pageName,
          page,
          'simple and outlined message text (and the outlined border)',
        );
        const tfill = flatOver(N(`toast.${sev}.background`), page);
        for (const tok of [`toast.${sev}.color`, `toast.${sev}.detail.color`])
          add(
            mode,
            'message & toast',
            '1.4.3',
            AA_NORMAL,
            tok,
            flatOver(N(tok), tfill),
            `toast.${sev}.background over ${pageName}`,
            tfill,
            tok.endsWith('detail.color') ? 'toast detail line' : 'toast summary, icon and close icon',
          );
      }
    }

    // ---- TEXT & LINK BUTTON · SC 1.4.3 -----------------------------------------
    // A text button has no fill: its label sits on the page. styles.scss
    // re-points the severities to the kit's semantic inks; the primary text
    // button and the link button (accent loop) keep Aura's primary.color.
    for (const sev of ['secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast', 'plain'])
      for (const [pageName, page] of pages)
        add(
          mode,
          'text & link button',
          '1.4.3',
          AA_NORMAL,
          `button.text.${sev}.color`,
          flatOver(N(`button.text.${sev}.color`), page),
          pageName,
          page,
          `text button, severity ${sev}`,
        );

    // ---- FILLED CONTRAST BUTTON · SC 1.4.3 -------------------------------------
    // The one filled severity the kit's severity block leaves to Aura (it has no
    // gradient of its own): surface.950 / surface.0, flipped in dark.
    {
      const fill = opaque('button.contrast.background', s.card);
      add(
        mode,
        'filled button (contrast)',
        '1.4.3',
        AA_NORMAL,
        'button.contrast.color',
        flatOver(N('button.contrast.color'), fill),
        'button.contrast.background',
        fill,
        'severity="contrast" label',
      );
    }

    // ---- AVATAR · SC 1.4.3 -----------------------------------------------------
    // Initials (1rem) or an icon on the avatar's fill; 4.5:1 covers the icon's 3:1.
    {
      const fill = opaque('avatar.background', s.card);
      add(
        mode,
        'avatar',
        '1.4.3',
        AA_NORMAL,
        'avatar.color',
        flatOver(N('avatar.color'), fill),
        'avatar.background',
        fill,
        'label or icon on the fill',
      );
    }

    // ---- IMAGE PREVIEW · SC 1.4.11 ---------------------------------------------
    // The full-screen preview: the overlay mask (mask.background) over the page,
    // the toolbar plate over the mask, the action icons (rotate, zoom, close — the
    // buttons' only content) on the plate, resting and hovered. The previewed
    // image may sit behind the toolbar too; its pixels are content, not tokens.
    for (const [pageName, page] of pages) {
      const backdrop = flatOver(N('mask.background'), page);
      const plate = flatOver(N('image.toolbar.background'), backdrop);
      add(
        mode,
        'image preview',
        '1.4.11',
        NON_TEXT,
        'image.action.color',
        flatOver(N('image.action.color'), plate),
        `image.toolbar.background over mask.background over ${pageName}`,
        plate,
        'toolbar icon at rest',
      );
      const hov = flatOver(N('image.action.hover.background'), plate);
      add(
        mode,
        'image preview',
        '1.4.11',
        NON_TEXT,
        'image.action.hover.color',
        flatOver(N('image.action.hover.color'), hov),
        `image.action.hover.background over the toolbar over ${pageName}`,
        hov,
        'toolbar icon hovered',
      );
    }

    // ---- ACCENT-DEPENDENT WIDGET PAIRS ------------------------------------
    // primary.color is the accent ramp's 500 in both modes (the ramp is built
    // from primaryColor in light, primaryFgDark in dark — RAMP_BASE): the
    // checked box, the on-track, the slider range and the progress value all
    // paint it.
    for (const c of colors) {
      const sc = scopeOf(c[RAMP_BASE[mode]]);
      const P = (name) => T(sc, name);
      const primary = P('primary.color');
      for (const [bgName, bg] of pages)
        add(
          mode,
          'checkbox & radiobutton',
          '1.4.11',
          NON_TEXT,
          `${c.name}.primary.color`,
          flatOver(primary, bg),
          bgName,
          bg,
          'checked fill = toggleswitch on-track = slider range = progressbar value',
        );
      const checked = flatOver(P('checkbox.checked.background'), s.card);
      add(
        mode,
        'checkbox & radiobutton',
        '1.4.11',
        NON_TEXT,
        `${c.name}.checkbox.icon.checked.color`,
        flatOver(P('checkbox.icon.checked.color'), checked),
        `${c.name}.checkbox.checked.background`,
        checked,
        'check mark; the radiobutton dot is the same pair',
      );
      const on = flatOver(P('toggleswitch.checked.background'), s.card);
      add(
        mode,
        'toggleswitch',
        '1.4.11',
        NON_TEXT,
        `${c.name}.toggleswitch.handle.checked.background`,
        flatOver(P('toggleswitch.handle.checked.background'), on),
        `${c.name}.toggleswitch.checked.background`,
        on,
        'on handle on its track',
      );
      const track = flatOver(P('progressbar.background'), s.card);
      const value = flatOver(P('progressbar.value.background'), track);
      add(
        mode,
        'progressbar & slider',
        '1.4.11',
        NON_TEXT,
        `${c.name}.progressbar.value.background`,
        value,
        'progressbar.background',
        track,
        'value on track; slider range on track is the same pair',
      );
      add(
        mode,
        'progressbar & slider',
        '1.4.3',
        AA_NORMAL,
        `${c.name}.progressbar.label.color`,
        flatOver(P('progressbar.label.color'), value),
        `${c.name}.progressbar.value.background`,
        value,
        'showValue readout, 12px bold',
      );
      tagPair(sc, `${c.name}.`, 'primary');

      // --primary-color-fg is written per palette by ThemeService, so the
      // accent loop resolves it itself; the neutral pass above never reads it.
      const fg = c[mode === 'dark' ? 'primaryFgDark' : 'primaryFg'];
      const PC = (name) => resolveWidget(sc, over, (n) => (n === '--primary-color-fg' ? fg : kit(n)), name);

      // ---- MENU FOCUS RING · SC 1.4.11 / 2.4.7 ----------------------------
      // styles.scss rings the `.p-focus` item of every menu (one rule, read
      // here) 2px inside the item: the ring meets the focus tint inside and
      // the menu panel outside.
      {
        const ring = /var\(\s*(--[a-z0-9-]+)/.exec(
          ovr.props['.p-menu-item.p-focus .p-menu-item-content']?.outline ?? '',
        );
        if (!ring) throw new Error('styles.scss: the menu focus ring rule (.p-menu-item.p-focus …) is gone');
        const ringHex = ring[1] === '--primary-color-fg' ? fg : kit(ring[1]);
        for (const [bgName, bg] of [
          ['menubar.item.focus.background', menuFocus],
          ['menubar.background', menuPanel],
        ])
          add(
            mode,
            'menu focus',
            '1.4.11',
            NON_TEXT,
            `${c.name}.${ring[1]} (focus ring)`,
            ringHex,
            bgName,
            bg,
            '2px ring inside the .p-focus item (and the panelmenu row whose link has DOM focus); megamenu, menu, tieredmenu, contextmenu, panelmenu alike',
          );
      }

      // ---- THE KIT FOCUS RING · SC 1.4.11 / 2.4.7 ---------------------------
      // One rule rings every focusable widget in --primary-color-fg, 2px at a
      // 2px offset (KIT_RING_SELECTORS, asserted by checkKitRing). The offset
      // puts the ring on whatever surrounds the widget: the three page
      // surfaces and a dialog panel (its close button). The message and toast
      // close buttons ring in currentColor — the notice text, measured on
      // every tint in "message & toast" (NOTICE_RING_SELECTORS).
      {
        for (const [bgName, bg] of [
          ['--surface-ground', s.ground],
          ['--surface-card', s.card],
          ['--surface-section', s.section],
          ['dialog.background', dialogPanel],
        ])
          add(
            mode,
            'focus ring',
            '1.4.11',
            NON_TEXT,
            `${c.name}.--primary-color-fg (kit focus ring)`,
            fg,
            bgName,
            bg,
            '2px ring at 2px offset: fields, buttons, radios, toggle switch, toggle/select buttons, slider, stepper, datepicker, image preview, cookie buttons; the virtual scroller inset, over rows on these surfaces',
          );
        // Outside rings that land on a widget fill rather than a page surface:
        // the chip remove icon rings inside the chip (0.5rem padding), and the
        // paginator, menubar hamburger and datepicker cells ring on Aura's
        // content.background (paginator.background = menubar.background =
        // the datepicker panel).
        const content = opaque('paginator.background', s.card);
        for (const [bgName, bg, note] of [
          [
            'chip.background',
            opaque('chip.background', s.card),
            '2px ring at 2px offset: chip remove icon, on the chip',
          ],
          [
            'paginator.background',
            content,
            '2px ring at 2px offset: paginator buttons, menubar/megamenu hamburger, datepicker cells (content.background)',
          ],
        ])
          add(
            mode,
            'focus ring',
            '1.4.11',
            NON_TEXT,
            `${c.name}.--primary-color-fg (kit focus ring)`,
            fg,
            bgName,
            bg,
            note,
          );
        // Inset rings (KIT_RING_INSET, offset -2px) lie on the part's own
        // fill: content.background at rest (tabs, accordion header, rows,
        // sort headers, tree nodes), the hover fill under the pointer, the
        // selection highlight on a selected row or tree node.
        const rowRest = flatOver(P('datatable.row.background'), s.card);
        for (const [bgName, bg] of [
          ['datatable.row.background', rowRest],
          ['datatable.row.hover.background', flatOver(P('datatable.row.hover.background'), rowRest)],
          [`${c.name}.datatable.row.selected.background`, flatOver(P('datatable.row.selected.background'), rowRest)],
        ])
          add(
            mode,
            'focus ring',
            '1.4.11',
            NON_TEXT,
            `${c.name}.--primary-color-fg (kit focus ring, inset)`,
            fg,
            bgName,
            bg,
            '2px ring inside the part: tabs, accordion header, table/tree-table rows and sort headers, tree nodes, a virtual scroller in a table',
          );
        // The keyboard's chip in a multiple-mode autocomplete rings
        // inside itself, on the chip's focus tint (it only rings while it
        // wears that tint).
        {
          const chipFocus = flatOver(
            P('autocomplete.chip.focus.background'),
            opaque('autocomplete.background', s.card),
          );
          add(
            mode,
            'focus ring',
            '1.4.11',
            NON_TEXT,
            `${c.name}.--primary-color-fg (kit focus ring, inset)`,
            fg,
            'autocomplete.chip.focus.background',
            chipFocus,
            '2px ring inside the .p-focus chip of a multiple-mode autocomplete',
          );
        }

        // ---- OPTION LIST FOCUS RING ---------------------------------------
        // The `.p-focus` option of every option list (KIT_RING_OPTIONS) rings
        // inside itself, so the ring lies on the option's own fill and, at
        // its outer edge, on the list panel: the panel (an option at rest),
        // the focus/hover tint, the selection highlight and the highlight's
        // focus step. The dark select paints its overlay and its hovered
        // option with kit colours (plain property rules, read here). Lists
        // whose fills agree share one row; the note names them.
        const kitProp = (sel, prop) => {
          if (mode !== 'dark') return null;
          const v = ovr.props[sel]?.[prop];
          const m = v && /^var\(\s*(--[a-z0-9-]+)/.exec(v);
          if (v && !m) throw new Error(`styles.scss: ${sel} ${prop} is "${v}", which this gate does not model`);
          return m ? { name: `${m[1]} (${sel})`, hex: kit(m[1]) } : null;
        };
        const optionRows = new Map();
        for (const [list, { panel: panelTok }] of Object.entries(KIT_RING_OPTIONS)) {
          const kitPanel = list === 'select' ? kitProp('.dark-theme .p-select-overlay', 'background-color') : null;
          const kitHover = list === 'select' ? kitProp('.dark-theme .p-select-option:hover', 'background-color') : null;
          const panel = kitPanel?.hex ?? flatOver(P(panelTok), s.card);
          const fills = [
            ['panel (option at rest)', kitPanel?.name ?? panelTok, panel],
            [
              'focus / hover tint',
              `${list}.option.focus.background`,
              flatOver(P(`${list}.option.focus.background`), panel),
            ],
            [
              'selected',
              `${c.name}.${list}.option.selected.background`,
              flatOver(P(`${list}.option.selected.background`), panel),
            ],
            [
              'selected + focus',
              `${c.name}.${list}.option.selected.focus.background`,
              flatOver(P(`${list}.option.selected.focus.background`), panel),
            ],
          ];
          if (kitHover) fills.push(['hover (any option)', kitHover.name, kitHover.hex]);
          for (const [kind, bgName, bg] of fills) {
            if (!bg) throw new Error(`${bgName} does not resolve for ${style.name} (${mode})`);
            const key = `${kind}|${bg}`;
            if (optionRows.has(key)) optionRows.get(key).lists.push(list);
            else optionRows.set(key, { kind, bgName, bg, lists: [list] });
          }
        }
        for (const { kind, bgName, bg, lists } of optionRows.values())
          add(
            mode,
            'option list focus',
            '1.4.11',
            NON_TEXT,
            `${c.name}.--primary-color-fg (kit focus ring, option)`,
            fg,
            bgName,
            bg,
            `2px ring inside the .p-focus option, on the ${kind}: ${lists.join(', ')} (a virtual scroller over the options rings on the same fills)`,
          );
      }

      // ---- PRESSED TOGGLE / SELECT BUTTON · SC 1.4.11 + 1.4.3 ----------------
      // The pressed pill is the state itself: it must stand >= 3:1 off the
      // unpressed segment it replaces (Aura's white-on-slate pill was 1.10:1),
      // and the pressed label sits on it.
      {
        const checkedSeg = flatOver(PC('togglebutton.checked.background'), s.card);
        const pill = flatOver(PC('togglebutton.content.checked.background'), checkedSeg);
        add(
          mode,
          'togglebutton & selectbutton',
          '1.4.11',
          NON_TEXT,
          `${c.name}.togglebutton.content.checked.background`,
          pill,
          'togglebutton.background',
          toggleSeg,
          'pressed pill against an unpressed segment',
        );
        add(
          mode,
          'togglebutton & selectbutton',
          '1.4.3',
          AA_NORMAL,
          'togglebutton.checked.color',
          flatOver(PC('togglebutton.checked.color'), pill),
          `${c.name}.togglebutton.content.checked.background`,
          pill,
          'pressed label on the pill',
        );
      }

      // ---- PRIMARY BADGE, TEXT AND LINK BUTTON, FLOATED LABEL · SC 1.4.3 -------
      {
        const fill = flatOver(PC('badge.primary.background'), s.card);
        add(
          mode,
          'badge',
          '1.4.3',
          AA_NORMAL,
          `${c.name}.badge.primary.color`,
          flatOver(PC('badge.primary.color'), fill),
          `${c.name}.badge.primary.background`,
          fill,
          'no severity set',
        );
        const text = PC('button.text.primary.color').hex;
        if (PC('button.link.color').hex !== text)
          errors.push(
            'button.link.color no longer equals button.text.primary.color — give the link button its own rows.',
          );
        for (const [bgName, bg] of pages)
          add(
            mode,
            'text & link button',
            '1.4.3',
            AA_NORMAL,
            `${c.name}.button.text.primary.color`,
            flatOver(PC('button.text.primary.color'), bg),
            bgName,
            bg,
            'text button without severity; the link button is the same colour',
          );
      }

      // ---- PROGRESS SPINNER · SC 1.4.11 -----------------------------------
      // All four stops point at --primary-color-fg (styles.scss); the gate
      // asserts they agree and measures the one colour on every page surface.
      {
        const stops = ['one', 'two', 'three', 'four'].map((n) => PC(`progressspinner.color.${n}`).hex);
        if (new Set(stops).size !== 1)
          errors.push(`progress spinner stops differ for ${c.name} (${mode}): ${stops.join(', ')} — measure each.`);
        for (const [bgName, bg] of [...pages, ['--surface-section', s.section]])
          add(
            mode,
            'progress spinner',
            '1.4.11',
            NON_TEXT,
            `${c.name}.progressspinner.color.one…four`,
            stops[0],
            bgName,
            bg,
            'the only sign of "loading"',
          );
      }

      // ---- TABLE SELECTION & CURRENT PAGE · SC 1.4.3 / 1.4.11 ---------------
      // The selected row paints Aura's highlight pair (primary.50 / primary.700
      // light; a 16% primary.400 tint with 87% white dark) over the card-coloured
      // fill; the current page paints primary.color / primary.contrast.color.
      {
        const row = flatOver(P('datatable.row.background'), s.card);
        const sel = flatOver(P('datatable.row.selected.background'), row);
        add(
          mode,
          'table & paginator',
          '1.4.3',
          AA_NORMAL,
          `${c.name}.datatable.row.selected.color`,
          flatOver(P('datatable.row.selected.color'), sel),
          `${c.name}.datatable.row.selected.background`,
          sel,
          'selected row text on the selection tint',
        );
        const pag = flatOver(P('paginator.background'), s.card);
        const cur = flatOver(P('paginator.nav.button.selected.background'), pag);
        add(
          mode,
          'table & paginator',
          '1.4.3',
          AA_NORMAL,
          `${c.name}.paginator.nav.button.selected.color`,
          flatOver(P('paginator.nav.button.selected.color'), cur),
          `${c.name}.paginator.nav.button.selected.background`,
          cur,
          'current page number',
        );
        add(
          mode,
          'table & paginator',
          '1.4.11',
          NON_TEXT,
          `${c.name}.paginator.nav.button.selected.background`,
          cur,
          'paginator.background',
          pag,
          'current-page disc — the state itself (styles.scss: primary.color)',
        );
        info(
          mode,
          'table & paginator',
          `${c.name}.datatable.row.selected.background`,
          sel,
          'datatable.row.background',
          row,
          'selection tint on an unselected row (Aura highlight) — why the row carries a bar (rows below)',
        );
        // The selected-row bar (styles.scss, ROW_BAR_SELECTOR): the state
        // indicator that does not rest on the tint. It meets the tint inside
        // the row and the unselected rows above and below it.
        const bar = /var\(\s*(--[a-z0-9-]+)/.exec(ovr.props[ROW_BAR_SELECTOR]?.background ?? '');
        if (bar) {
          const barHex = bar[1] === '--primary-color-fg' ? fg : kit(bar[1]);
          for (const [bgName, bg] of [
            [`${c.name}.datatable.row.selected.background`, sel],
            ['datatable.row.background', row],
          ])
            add(
              mode,
              'table & paginator',
              '1.4.11',
              NON_TEXT,
              `${c.name}.${bar[1]} (selected-row bar)`,
              barHex,
              bgName,
              bg,
              '4px bar on the row start edge',
            );
        }
      }
    }
  }
  return pairs;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const scss = readScssThemeTokens();
const styles = readUiStyles();
const defaultStyleName = readDefaultStyleName();
const bootColors = readBootColors();
const scssRaw = readScssRawTokens();
const bootStyle = readBootStyleResolution();
const colors = readThemeColors();
const aura = await readAura();
const widgetOverrides = readWidgetOverrides(readScssRules());
readPrimaryRamp();
checkPresetOverrides();
checkKitRing(widgetOverrides);

// --- Check 1: the static layer equals the DEFAULT STYLE ---------------------
// Three sources paint surfaces: the stylesheet (before JS runs), the boot script in
// index.html (before the stylesheet loads) and the runtime (inline tokens from the style
// data). The runtime is derived from ui-styles.ts by construction, so the check that can
// still fail is whether the two STATIC layers agree with the default style. If they do
// not, a first visit and a prerendered page show colours nothing measured.
{
  const def = styles.find((s) => s.name === defaultStyleName);
  if (defaultStyleName && !def) {
    errors.push(`${UI_STYLES}: DEFAULT_STYLE_NAME is "${defaultStyleName}" but no style block of that name parsed.`);
  } else if (def) {
    const TOKEN_OF = SURFACE_TOKEN_OF;
    let mismatches = 0;
    let compared = 0;
    for (const mode of ['light', 'dark']) {
      for (const [field, token] of Object.entries(TOKEN_OF)) {
        const want = def.surfaces[mode][field];
        if (!want) continue; // controlPlaceholder is dark-only
        compared++;
        if (scss[mode][token] !== want) {
          mismatches++;
          errors.push(
            `static drift (${mode}): ${STYLES} says ${token}: ${scss[mode][token] ?? '(absent)'}, the default style "${def.name}" says ${want}.`,
          );
        }
      }
    }
    // The anti-FOUC rules paint ground + body text of the default style.
    for (const mode of ['light', 'dark']) {
      const boot = bootColors[mode];
      if (!boot) continue;
      compared += 2;
      if (boot.background !== def.surfaces[mode].ground) {
        mismatches++;
        errors.push(
          `static drift (${mode}): ${INDEX_HTML} paints ${boot.background} pre-paint, the default style's ground is ${def.surfaces[mode].ground}.`,
        );
      }
      if (boot.color !== def.surfaces[mode].textColor) {
        mismatches++;
        errors.push(
          `static drift (${mode}): ${INDEX_HTML} paints text ${boot.color} pre-paint, the default style's text is ${def.surfaces[mode].textColor}.`,
        );
      }
    }
    if (compared && !mismatches) {
      ok.push(
        `static layer matches the default style "${def.name}": ${compared} values identical in stylesheet, boot script and style data`,
      );
    }
  }
}

// --- Check 1c: the DEFAULT SIGNATURE is there before any script runs ---------
// The colours of check 1 are only half of a style. Its signature — ink border width,
// the outline colour, the offset plane, the outlined-button ring — lives in
// `extraTokens`, and the rules that read them (html.style-werkbund in styles.scss)
// drop entirely when the custom property is undefined. So two things must hold for a
// first visit and for every prerendered page: the boot script must always set the
// default's scope class, and styles.scss must declare the default's extraTokens
// statically. Both are duplicates of ui-styles.ts by necessity (the boot script runs
// before any bundle, the stylesheet has no access to the data), so both are compared
// here value by value.
{
  const extra = defaultStyleName ? readStyleExtraTokens(defaultStyleName) : null;
  if (defaultStyleName && !extra) {
    errors.push(
      `${UI_STYLES}: the extraTokens of the default style "${defaultStyleName}" did not parse — the signature drift check would pass vacuously.`,
    );
  } else if (extra) {
    // `common` belongs in :root: it matches <html> in both modes.
    const want = { light: { ...extra.common, ...extra.light }, dark: { ...extra.dark } };
    const norm = (v) => v.replace(/\s+/g, ' ').trim().toLowerCase();
    let drift = 0;
    let compared = 0;
    for (const mode of ['light', 'dark']) {
      const have = scssRaw[mode];
      for (const [token, value] of Object.entries(want[mode])) {
        compared++;
        if (have[token] === undefined) {
          drift++;
          errors.push(
            `signature drift (${mode}): ${STYLES} declares no static ${token}; the default style "${defaultStyleName}" needs it before the first script runs.`,
          );
        } else if (norm(have[token]) !== norm(value)) {
          drift++;
          errors.push(
            `signature drift (${mode}): ${STYLES} says ${token}: ${have[token]}, the default style "${defaultStyleName}" says ${value}.`,
          );
        }
      }
    }
    if (compared && !drift) {
      ok.push(
        `static signature matches the default style "${defaultStyleName}": ${compared} extraTokens identical in stylesheet and style data`,
      );
    }
  }

  if (bootStyle) {
    const known = styles.map((s) => s.name);
    const missing = known.filter((n) => !bootStyle.names.includes(n));
    const extraNames = bootStyle.names.filter((n) => !known.includes(n));
    if (missing.length || extraNames.length) {
      errors.push(
        `${INDEX_HTML}: the boot script's style list is [${bootStyle.names.join(', ')}], ${UI_STYLES} says [${known.join(', ')}] — a name only the script knows paints a scope class no CSS matches, one only the data knows loses its signature until the app boots.`,
      );
    } else if (bootStyle.fallback !== defaultStyleName) {
      errors.push(
        `${INDEX_HTML}: the boot script falls back to "${bootStyle.fallback}", DEFAULT_STYLE_NAME is "${defaultStyleName}".`,
      );
    } else {
      ok.push(
        `boot script resolves the style class like resolveStoredStyle: ${bootStyle.names.length} names, fallback "${bootStyle.fallback}"`,
      );
    }
  }
}

// --- Check 1b: the style set is complete ------------------------------------
if (styles.length !== 4) {
  errors.push(
    `${UI_STYLES}: ${styles.length} style(s) parsed, expected 4. A style that fails to parse would be measured as zero pairs.`,
  );
} else {
  ok.push(`style set complete: ${styles.map((s) => s.name).join(', ')}`);
}

// --- Check 2: hex integrity -------------------------------------------------
// A token that stopped being a plain hex (a var() chain, a color-mix, a typo) would make
// every ratio built on it meaningless, so it is a failure and not a skip.
{
  let bad = 0;
  const seen = [];
  for (const mode of ['light', 'dark']) {
    for (const [token, value] of Object.entries(scss[mode])) {
      seen.push(value);
      if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(value)) {
        bad++;
        errors.push(`${mode} ${token} is not a plain hex color: ${value}`);
      }
    }
  }
  for (const c of colors) {
    for (const f of [
      'primaryColor',
      'primaryColorDark',
      'gradientAccent',
      'gradientAccentDark',
      'primaryFg',
      'primaryFgDark',
      'accentFg',
      'accentFgDark',
    ]) {
      if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(c[f] ?? '')) {
        bad++;
        errors.push(`THEME_COLORS.${c.name}.${f} is not a plain hex color: ${c[f] ?? '(missing)'}`);
      }
    }
  }
  if (!bad) ok.push(`hex integrity: ${seen.length} stylesheet tokens + ${colors.length} brand palettes × 8 fields`);
}

// --- Check 3: the brand palette is complete --------------------------------
if (colors.length !== 10) {
  errors.push(
    `THEME_COLORS holds ${colors.length} palettes, expected 10 (9 brand + contrast). A palette that fails to parse would be measured as zero pairs.`,
  );
} else {
  ok.push('brand palette complete: 10 THEME_COLORS entries parsed');
}

// --- Check 4: every pair meets its success criterion -----------------------
const chipSteps = readBrandChipSteps();
const widgetPairsOf = (s) => {
  if (!aura) return [];
  try {
    return buildWidgetPairs(s, colors, aura, widgetOverrides);
  } catch (e) {
    errors.push(`widget pairs of style "${s.name}": ${e.message}`);
    return [];
  }
};
const pairs = colors.length
  ? styles.flatMap((s) => [...buildPairs(s, scss, colors, chipSteps), ...widgetPairsOf(s)])
  : [];
const results = [];
const ruleHits = new Map();
for (const p of pairs) {
  let ratio;
  try {
    ratio = contrast(p.fg, p.bg);
  } catch (e) {
    errors.push(`${p.id}: ${e.message}`);
    continue;
  }
  // An informational row has no criterion: it is measured and listed, never judged.
  if (p.min === null) {
    results.push({ ...p, ratio: Math.round(ratio * 100) / 100, passes: null, informational: true, exception: null });
    continue;
  }
  const passes = ratio + 1e-9 >= p.min;
  let exception = KNOWN_EXCEPTIONS[p.id];
  if (!exception && !passes) {
    const rule = KNOWN_EXCEPTION_RULES.find((r) => r.match(p));
    if (rule) {
      ruleHits.set(rule.id, (ruleHits.get(rule.id) ?? 0) + 1);
      exception = { reason: `[${rule.id}] ${rule.reason}` };
    }
  }
  results.push({ ...p, ratio: Math.round(ratio * 100) / 100, passes, exception: exception ? exception.reason : null });
  if (!passes && !exception) {
    errors.push(
      `${p.id} — ${ratio.toFixed(2)}:1, needs >=${p.min}:1 (WCAG SC ${p.sc}, ${p.group}${p.note ? ', ' + p.note : ''}). fg ${p.fg} / bg ${p.bg}`,
    );
  }
  if (passes && exception) {
    errors.push(
      `stale known exception: ${p.id} now measures ${ratio.toFixed(2)}:1 and meets SC ${p.sc}. Remove it from KNOWN_EXCEPTIONS.`,
    );
  }
}
{
  const failing = results.filter((r) => r.passes === false).length;
  const excepted = results.filter((r) => r.exception).length;
  const informational = results.filter((r) => r.informational).length;
  if (pairs.length && failing === excepted) {
    ok.push(
      `contrast: ${results.length} pairs measured, ${results.length - failing - informational} meet their criterion, ${excepted} declared exception(s), ${informational} informational`,
    );
  }
}

// --- Check 5: every declared exception still exists ------------------------
// A KNOWN_EXCEPTIONS key that no longer matches any pair (a token was renamed, a role
// dropped) would sit there forever pretending to describe reality.
for (const id of Object.keys(KNOWN_EXCEPTIONS)) {
  if (!results.some((r) => r.id === id))
    errors.push(`KNOWN_EXCEPTIONS lists "${id}", but no such pair is measured any more — remove it or fix the id.`);
}
if (Object.keys(KNOWN_EXCEPTIONS).length && !errors.some((e) => e.startsWith('KNOWN_EXCEPTIONS lists'))) {
  ok.push(`${Object.keys(KNOWN_EXCEPTIONS).length} known exception(s), all still real`);
}
// The widget rules: each must still cover exactly the failing pairs it declares.
if (aura && pairs.length) {
  let drifted = 0;
  for (const r of KNOWN_EXCEPTION_RULES) {
    const hits = ruleHits.get(r.id) ?? 0;
    if (hits !== r.count) {
      drifted++;
      errors.push(
        `KNOWN_EXCEPTION_RULES "${r.id}" expects ${r.count} failing pair(s), matched ${hits} — ${hits < r.count ? 'part of it is fixed: shrink the count (or drop the rule)' : 'a new failure is hiding under it: fix it or widen the rule on purpose'}.`,
      );
    }
  }
  if (!drifted)
    ok.push(`${KNOWN_EXCEPTION_RULES.length} widget exception rule(s), each covering exactly its declared pairs`);
}

// ---------------------------------------------------------------------------
// Compilat — the numbers guide authors cite
// ---------------------------------------------------------------------------

function renderJson() {
  return (
    JSON.stringify(
      {
        $comment:
          'GENERATED by scripts/check-contrast.mjs --write. Do not edit. Cite these ratios in guides instead of hand-measuring; the gate regenerates them from the tokens and fails on drift.',
        criteria: {
          '1.4.3': 'Contrast (Minimum) — text: 4.5:1 normal, 3:1 large',
          '1.4.11': 'Non-text Contrast — boundaries that identify a control: 3:1',
        },
        sources: [UI_STYLES, STYLES, THEME_SERVICE, INDEX_HTML, `${AURA_DIR}/{base,<component>}/index.mjs`],
        defaultStyle: defaultStyleName,
        knownExceptionRules: KNOWN_EXCEPTION_RULES.map((r) => ({ id: r.id, count: r.count, reason: r.reason })),
        pairs: results.map((r) => ({
          id: r.id,
          style: r.style,
          mode: r.mode,
          group: r.group,
          sc: r.sc,
          min: r.min,
          fg: { token: r.fgName, value: r.fg },
          bg: { token: r.bgName, value: r.bg },
          ratio: r.ratio,
          passes: r.passes,
          ...(r.informational ? { informational: true } : {}),
          ...(r.note ? { note: r.note } : {}),
          ...(r.exception ? { knownException: r.exception } : {}),
        })),
      },
      null,
      2,
    ) + '\n'
  );
}

function renderMd() {
  const L = [];
  L.push('# Contrast compilat');
  L.push('');
  L.push('**GENERATED — do not edit.** Produced by `node scripts/check-contrast.mjs --write` from');
  L.push(`the real token values in \`${UI_STYLES}\` (the four visual styles), \`${STYLES}\``);
  L.push(`(the kit-level tokens) and \`${THEME_SERVICE}\` (the brand palettes). \`node scripts/check-contrast.mjs\``);
  L.push('(part of `npm run build:verify`) recomputes these numbers and fails if this file is stale.');
  L.push('');
  L.push('**Widget rows** (groups named after an Optimus UI component, fg/bg named as Aura tokens such');
  L.push(`as \`checkbox.border.color\`) resolve Aura's preset from \`${AURA_DIR}\` the way the kit`);
  L.push('configures it: stock Aura surfaces (slate light, zinc dark), the accent primary ramp, and every');
  L.push('`styles.scss` rule that re-points or repaints a measured widget. A row prefixed with a palette');
  L.push('name (`ocean.primary.color`) depends on the accent. Informational rows (SC `none`) carry no');
  L.push('WCAG minimum and never fail; they are listed so a guide can quote them.');
  L.push('');
  L.push('**Cite from here.** A contrast figure written into a guide by hand goes stale in silence at');
  L.push('the next token tweak. A figure quoted from this table goes stale loudly, because the gate');
  L.push('regenerates the table and the drift check fires.');
  L.push('');
  L.push('Criteria: **SC 1.4.3** Contrast (Minimum) — text, 4.5:1 normal / 3:1 large ·');
  L.push('**SC 1.4.11** Non-text Contrast — boundaries that identify a control, 3:1.');
  L.push('');
  const excepted = results.filter((r) => r.exception);
  const byId = excepted.filter((r) => !r.exception.startsWith('['));
  const informational = results.filter((r) => r.informational).length;
  L.push(
    `Measured: **${results.length} pairs** (${results.filter((r) => r.mode === 'light').length} light, ${results.filter((r) => r.mode === 'dark').length} dark) · ` +
      `**${results.filter((r) => r.passes).length} meet their criterion** · **${excepted.length} declared exception(s)** · ` +
      `**${informational} informational**.`,
  );
  L.push('');
  if (excepted.length) {
    L.push('## Declared exceptions');
    L.push('');
    L.push('These miss their criterion today. They are declared in `KNOWN_EXCEPTIONS` (per pair) and');
    L.push('`KNOWN_EXCEPTION_RULES` (per widget defect, with the exact number of pairs it covers) in the');
    L.push('gate, so the gate stays sharp for everything else — not waived, and not silently re-thresholded.');
    L.push('Each excepted pair is marked `exception` in the tables below.');
    L.push('');
    if (byId.length) {
      L.push('| pair | ratio | needs | SC | why it is still open |');
      L.push('|---|---|---|---|---|');
      for (const r of byId) L.push(`| \`${r.id}\` | ${r.ratio.toFixed(2)}:1 | ${r.min}:1 | ${r.sc} | ${r.exception} |`);
      L.push('');
    }
    const rules = KNOWN_EXCEPTION_RULES.filter((rule) => excepted.some((r) => r.exception.startsWith(`[${rule.id}]`)));
    if (rules.length) {
      L.push('| rule | pairs | lowest | why it is still open |');
      L.push('|---|---|---|---|');
      for (const rule of rules) {
        const rows = excepted.filter((r) => r.exception.startsWith(`[${rule.id}]`));
        const low = rows.reduce((a, b) => (a.ratio <= b.ratio ? a : b));
        L.push(`| \`${rule.id}\` | ${rows.length} | ${low.ratio.toFixed(2)}:1 (needs ${low.min}:1) | ${rule.reason} |`);
      }
      L.push('');
    }
  }
  // Per style, the tightest pair of each mode — the number to quote when a guide
  // says "the styles hold AA".
  L.push('## Headroom per style');
  L.push('');
  L.push('Lowest measured ratio per style and mode, ignoring the declared exceptions above. The');
  L.push('criterion is stated with each pair: a 3.6:1 control edge (SC 1.4.11, needs 3:1) has more');
  L.push('headroom than a 4.6:1 text pair (SC 1.4.3, needs 4.5:1), so read the number with its SC.');
  L.push('');
  L.push('| style | light: lowest pair | dark: lowest pair |');
  L.push('|---|---|---|');
  for (const styleName of [...new Set(results.map((r) => r.style))]) {
    const cell = (mode) => {
      const rows = results.filter((r) => r.style === styleName && r.mode === mode && !r.exception && !r.informational);
      if (!rows.length) return '—';
      const low = rows.reduce((a, b) => (a.ratio <= b.ratio ? a : b));
      return `${low.ratio.toFixed(2)}:1 (SC ${low.sc}, needs ${low.min}:1) · \`${low.fgName}\` on \`${low.bgName}\``;
    };
    L.push(
      `| **${styleName}**${styleName === defaultStyleName ? ' (default)' : ''} | ${cell('light')} | ${cell('dark')} |`,
    );
  }
  L.push('');

  for (const styleName of [...new Set(results.map((r) => r.style))]) {
    L.push(`## style: ${styleName}${styleName === defaultStyleName ? ' (default)' : ''}`);
    L.push('');
    for (const mode of ['light', 'dark']) {
      L.push(`### ${mode} mode`);
      L.push('');
      const groups = [...new Set(results.filter((r) => r.style === styleName && r.mode === mode).map((r) => r.group))];
      for (const g of groups) {
        const rows = results.filter((r) => r.style === styleName && r.mode === mode && r.group === g);
        L.push(`#### ${g}`);
        L.push('');
        L.push('| foreground | value | background | value | ratio | SC | needs | verdict |');
        L.push('|---|---|---|---|---|---|---|---|');
        for (const r of rows) {
          const verdict = r.informational ? 'info' : r.passes ? 'ok' : r.exception ? 'exception' : 'FAIL';
          L.push(
            `| \`${r.fgName}\` | \`${r.fg}\` | \`${r.bgName}\` | \`${r.bg}\` | **${r.ratio.toFixed(2)}:1** | ${r.sc} | ${r.informational ? '—' : `${r.min}:1`} | ${verdict} |`,
          );
        }
        L.push('');
      }
    }
  }
  return L.join('\n');
}

if (results.length) {
  const md = renderMd();
  const json = renderJson();
  if (WRITE) {
    fs.mkdirSync(path.dirname(abs(COMPILAT_MD)), { recursive: true });
    fs.writeFileSync(abs(COMPILAT_MD), md);
    fs.writeFileSync(abs(COMPILAT_JSON), json);
    console.log(`wrote ${COMPILAT_MD} and ${COMPILAT_JSON} (${results.length} pairs)`);
  } else {
    // --- Check 6: the compilat is fresh -------------------------------------
    for (const [file, want] of [
      [COMPILAT_MD, md],
      [COMPILAT_JSON, json],
    ]) {
      if (!fs.existsSync(abs(file))) errors.push(`${file} is missing — run: node scripts/check-contrast.mjs --write`);
      else if (fs.readFileSync(abs(file), 'utf8').replace(/\r\n/g, '\n') !== want.replace(/\r\n/g, '\n')) {
        errors.push(
          `${file} is stale — the tokens moved on since it was generated. Run: node scripts/check-contrast.mjs --write`,
        );
      } else ok.push(`compilat fresh: ${file}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Self-test (SELFTEST=1) — prove the maths and the parsers are alive
// ---------------------------------------------------------------------------
if (process.env.SELFTEST) {
  // Reference values from WCAG 2.1 / the sRGB definition. If a refactor breaks the
  // luminance curve, every ratio above shifts and nothing else would notice.
  const approx = (a, b, eps = 0.01) => Math.abs(a - b) <= eps;
  if (!approx(contrast('#ffffff', '#000000'), 21))
    errors.push('SELFTEST: white/black is not 21:1 — the contrast formula is broken.');
  else ok.push('SELFTEST: white on black = 21.00:1');
  if (!approx(contrast('#ffffff', '#ffffff'), 1)) errors.push('SELFTEST: identical colors are not 1:1.');
  else ok.push('SELFTEST: identical colors = 1.00:1');
  // #767676 is the canonical "smallest grey that passes AA on white" from the WCAG
  // understanding docs (4.54:1).
  if (!approx(contrast('#767676', '#ffffff'), 4.54, 0.02))
    errors.push(
      `SELFTEST: #767676 on white measured ${contrast('#767676', '#ffffff').toFixed(2)}, expected 4.54 — the luminance curve drifted.`,
    );
  else ok.push('SELFTEST: #767676 on white = 4.54:1 (WCAG reference value)');
  if (!approx(contrast('#000000', '#ffffff'), contrast('#ffffff', '#000000')))
    errors.push('SELFTEST: contrast is not symmetric.');
  else ok.push('SELFTEST: contrast is symmetric');
  // The 3-digit shorthand must expand, or #fff would parse as a different colour.
  if (contrast('#fff', '#000') !== contrast('#ffffff', '#000000'))
    errors.push('SELFTEST: 3-digit hex does not expand to the same color.');
  else ok.push('SELFTEST: 3-digit hex expands');
  // A non-colour must throw rather than resolve to something plausible.
  let threw = false;
  try {
    luminance('var(--x)');
  } catch {
    threw = true;
  }
  if (!threw) errors.push('SELFTEST: a non-hex value did not throw — a mis-parsed token would produce a fake ratio.');
  else ok.push('SELFTEST: a non-hex value throws instead of returning a plausible number');
  // color-mix port: 15% of white into black is a dark grey at 0.15*255 = 38 = #262626.
  if (mix('#ffffff', '#000000', 15) !== '#262626')
    errors.push(`SELFTEST: color-mix port returned ${mix('#ffffff', '#000000', 15)}, expected #262626.`);
  else ok.push('SELFTEST: color-mix(in srgb, white 15%, black) = #262626');
  // lighten/darken ports clamp instead of wrapping (the runtime's own behaviour).
  if (lightenColor('#ffffff', 0.5) !== '#ffffff' || darkenColor('#000000', 0.5) !== '#000000')
    errors.push('SELFTEST: lighten/darken port wraps instead of clamping.');
  else ok.push('SELFTEST: lighten/darken clamp at the ends of the channel range');
  // getOptimalTextColor port: a dark stop pair picks white, a light pair picks slate.
  if (optimalTextColor('#000000', '#111111') !== '#ffffff' || optimalTextColor('#ffffff', '#eeeeee') !== '#1e293b')
    errors.push('SELFTEST: the label-color port does not follow the runtime heuristic.');
  else ok.push('SELFTEST: label-color port picks white on dark stops, slate on light stops');
  // The parsers must actually have found something — an empty parse would make the whole
  // gate pass vacuously, which is the worst failure mode a gate has.
  if (Object.keys(scss.light).length < 5 || Object.keys(scss.dark).length < 5)
    errors.push('SELFTEST: the stylesheet parser found almost no tokens — the gate would pass vacuously.');
  else
    ok.push(
      `SELFTEST: stylesheet parser alive (${Object.keys(scss.light).length} light, ${Object.keys(scss.dark).length} dark tokens)`,
    );
  // The style parser is the gate's new backbone: if it returned nothing, every
  // per-style pair would silently disappear and the run would pass on the
  // handful of kit-level pairs left.
  if (styles.length !== 4 || styles.some((s) => !s.surfaces.light.ground || Object.keys(s.severities).length !== 6)) {
    errors.push(
      'SELFTEST: the ui-styles parser did not return four complete styles — the per-style measurement would be vacuous.',
    );
  } else {
    ok.push(
      `SELFTEST: style parser alive (${styles.length} styles, ${Object.keys(styles[0].severities).length} severities each)`,
    );
  }
  if (!bootColors.light || !bootColors.dark)
    errors.push('SELFTEST: the index.html boot colors did not parse — check 1 lost one of its two static layers.');
  else ok.push('SELFTEST: boot-color parser alive (light + dark)');
  // Widget layer: the name flattening, the resolver and the stylesheet reader.
  {
    const flat = flattenTokens({ root: { borderColor: 'x' }, icon: { checkedColor: 'y' } }, 'checkbox', {}, true);
    if (flat['checkbox.border.color'] !== 'x' || flat['checkbox.icon.checked.color'] !== 'y')
      errors.push(
        'SELFTEST: flattenTokens does not name Aura tokens the way Optimus does (root dropped, camelCase dotted).',
      );
    else ok.push('SELFTEST: flattenTokens names checkbox.root.borderColor as checkbox.border.color');
    const scope = {
      'a.b': '{c.d}',
      'c.d': '#ffffff',
      m: 'color-mix(in srgb, {c.d}, transparent 84%)',
      k: 'var(--kit)',
      r: 'rgba(255, 255, 255, 0.06)',
    };
    const kitStub = (n) => (n === '--kit' ? '#000000' : null);
    const got = [
      resolveWidget(scope, {}, kitStub, 'a.b').hex === '#ffffff',
      Math.abs(resolveWidget(scope, {}, kitStub, 'm').alpha - 0.16) < 1e-9,
      resolveWidget(scope, {}, kitStub, 'k').hex === '#000000',
      resolveWidget(scope, {}, kitStub, 'r').alpha === 0.06,
      // Layer 3 re-points the requested token, never a link further down the chain.
      resolveWidget(scope, { '--p-a-b': '#123456' }, kitStub, 'a.b').hex === '#123456',
      resolveWidget(scope, { '--p-c-d': '#123456' }, kitStub, 'a.b').hex === '#ffffff',
    ];
    let threwW = false;
    try {
      resolveWidget({ x: 'linear-gradient(red, blue)' }, {}, kitStub, 'x');
    } catch {
      threwW = true;
    }
    if (got.includes(false) || !threwW)
      errors.push(`SELFTEST: resolveWidget misresolved (${got.map(Number).join('')}, threw ${threwW}).`);
    else ok.push('SELFTEST: resolveWidget follows refs, color-mix, var() and rgba, and refuses a gradient');
    const o = widgetOverrides;
    if (
      o.tokens.light['--p-checkbox-border-color'] !== 'var(--control-border)' ||
      o.tokens.dark['--p-inputtext-background'] !== 'var(--surface-section)' ||
      !o.tagProps.dark.secondary?.background ||
      styles.some((s) => !o.inputBorder[s.name]?.light)
    )
      errors.push('SELFTEST: the styles.scss widget-override reader lost a rule it must see.');
    else ok.push('SELFTEST: widget-override reader sees token re-points, tag repaints and every signature input edge');
  }
  const widgetCount = pairs.filter((p) => p.group === 'checkbox & radiobutton').length;
  if (!aura || widgetCount < 40)
    errors.push(`SELFTEST: only ${widgetCount} checkbox pairs — the widget layer collapsed.`);
  else ok.push(`SELFTEST: widget layer alive (${widgetCount} checkbox pairs)`);
  if (pairs.length < 400) errors.push(`SELFTEST: only ${pairs.length} pairs were built — the pair table collapsed.`);
  else ok.push(`SELFTEST: pair table alive (${pairs.length} pairs)`);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const line = '='.repeat(66);
console.log(line);
console.log('  check-contrast — WCAG token contrast (SC 1.4.3 / 1.4.11)');
console.log(line);
if (process.env.VERBOSE) for (const s of ok) console.log('  ok   ' + s);
if (errors.length === 0) {
  console.log(`  PASS — ${ok.length} checks green; ${results.length} token pairs measured.`);
  console.log(line);
  process.exit(0);
}
for (const e of errors) console.log('  FAIL ' + e);
console.log(line);
console.log(`  ${errors.length} problem(s). Fix before shipping.`);
process.exit(1);
