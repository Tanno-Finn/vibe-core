/**
 * Flag and icon assets for the language picker and the roadmap.
 *
 * The flags are drawn for this kit (simplified SVG, 3:2, no third-party
 * source), so they fall under the kit's CC BY 4.0 license for visual assets
 * (see LICENSING.md). A flag stands next to a language name as decoration
 * only; the name carries the meaning and the accessible label.
 *
 * Only the flags that `src/config/languages.json` references are drawn. A
 * language whose `flag` key has no drawing here renders a neutral text badge
 * with its code instead (see `hasFlag`), so adding a language never needs a
 * third-party image.
 */

/** Hand-written SVG sources, keyed by the `flag` field of languages.json. */
const FLAG_SVGS: Record<string, string> = {
  // Germany: three horizontal bands, black / red / gold.
  de:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">' +
    '<rect width="3" height="2" fill="#FFCE00"/>' +
    '<rect width="3" height="1.3334" fill="#DD0000"/>' +
    '<rect width="3" height="0.6667" fill="#000000"/>' +
    '</svg>',
  // United Kingdom, simplified: blue field, white saltire with a narrow red
  // saltire on top (not counterchanged), white cross with a red cross on top.
  gb:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40">' +
    '<rect width="60" height="40" fill="#012169"/>' +
    '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" stroke-width="8"/>' +
    '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="2.5"/>' +
    '<path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" stroke-width="12"/>' +
    '<path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="7"/>' +
    '</svg>',
};

const toDataUri = (svg: string): string => `data:image/svg+xml,${encodeURIComponent(svg)}`;

/** Flag image URLs (SVG data URIs), keyed by flag code. */
export const FLAGS: Record<string, string> = Object.fromEntries(
  Object.entries(FLAG_SVGS).map(([key, svg]) => [key, toDataUri(svg)]),
);

/** Icon image URLs. */
export const ICONS: Record<string, string> = {
  'easy-language': 'assets/images/leichte-sprache.png',
};

/** Whether a drawn flag exists for this key. Without one, show a code badge. */
export function hasFlag(key: string): boolean {
  return key in FLAGS;
}

/**
 * Get a display asset URL by type and key. An unknown flag key returns an
 * empty string; callers check `hasFlag` first and render a badge instead.
 */
export function getDisplayAsset(type: 'flag' | 'icon', key: string): string {
  if (type === 'flag') {
    return FLAGS[key] ?? '';
  }
  return ICONS[key] ?? ICONS['easy-language'];
}
