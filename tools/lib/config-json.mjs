/**
 * config-json.mjs — write a `src/config/*.json` file the way the kit lays it out.
 *
 * The hand-kept config files (site.json, samples.json) group each value with its `"_…"`
 * note and put a blank line before every note, so a person reading them sees one block per
 * setting. JSON.stringify would drop those blank lines and spread every short list over
 * many lines; this writer keeps the layout and follows Prettier's rules for the rest (the
 * repo's `npm run format:check`): objects open over several lines, a list of plain values
 * stays on one line when that line fits in 120 characters. A tool that writes one of these
 * files therefore leaves it as a person would, and writing the same data twice gives the
 * same bytes.
 */

const WIDTH = 120;

const isPlain = (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v);

/** One value at `indent`; `lead` is the text in front of it on its first line (for the width). */
function format(value, indent, lead) {
  if (isPlain(value)) return JSON.stringify(value);
  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.every(isPlain)) {
      const one = `[${value.map((v) => JSON.stringify(v)).join(', ')}]`;
      if (lead.length + one.length + 1 <= WIDTH) return one;
    }
    return `[\n${value.map((v) => `${inner}${format(v, inner, inner)}`).join(',\n')}\n${indent}]`;
  }
  const entries = Object.entries(value);
  if (entries.length === 0) return '{}';
  return `{\n${entries
    .map(([k, v]) => {
      const head = `${inner}${JSON.stringify(k)}: `;
      return `${head}${format(v, inner, head)}`;
    })
    .join(',\n')}\n${indent}}`;
}

/** The whole file: a blank line before every top-level `"_…"` note but the first key. */
export function formatConfigJson(obj) {
  const lines = Object.entries(obj).map(([k, v], i) => {
    const head = `  ${JSON.stringify(k)}: `;
    return `${i > 0 && k.startsWith('_') ? '\n' : ''}${head}${format(v, '  ', head)}`;
  });
  return `{\n${lines.join(',\n')}\n}\n`;
}
