/**
 * feature-scope.mjs — which UI strings and content collections a site needs, given
 * the features it switched off in `src/config/site.json`.
 *
 * Nothing is read here: the callers pass the feature catalog (`src/config/features.json`)
 * and the switches (`site.json` `features`), so the gates (`check-i18n-keys.mjs`,
 * `check-content-coverage.mjs`), the bundle builder's gap report and `tools/lang-status.mjs`
 * apply one rule. A missing catalog or empty switches mean "every feature on".
 *
 * The rules:
 *   * A key belongs to a feature when one of the feature's `i18n` entries names it or a
 *     parent of it (`glossary` owns `glossary.title`, `app.nav.glossary` owns itself), and
 *     no `i18nShared` entry of that feature does (those are read by other parts of the site).
 *   * A key is OFF when every feature it belongs to is switched off. An OFF key stays in
 *     the key-source language (the code that reads it is still there), but no other locale
 *     has to carry it.
 *   * A key under `devOnly.i18n` is read only by the dev workshop (src/app/dev/, stripped
 *     from production builds). The key-source language carries it: it is the runtime
 *     fallback of every locale, so the workshop never shows a raw key. Any other locale may
 *     leave it out entirely and then shows the workshop in the key-source language; a
 *     locale that carries some of an entry's keys must carry all of them, so a translated
 *     workshop cannot drift into half-translated.
 *   * A collection is OFF when every feature that lists it under `collections` is off.
 */

/** Does an entry name the key or a parent of it? (`a.b` covers `a.b`, `a.b.c` and the array item `a.b[0]`) */
const covers = (entry, key) => key === entry || key.startsWith(`${entry}.`) || key.startsWith(`${entry}[`);

/** Feature ids site.json switches off, in catalog order. */
export function switchedOff(catalog, switches) {
  return Object.keys(catalog?.features ?? {}).filter((id) => switches?.[id] === false);
}

/**
 * The scope of one site: `catalog` is features.json (or undefined), `switches` is
 * site.json's `features` object (or undefined).
 */
export function createFeatureScope(catalog, switches) {
  const features = catalog?.features ?? {};
  const off = new Set(switchedOff(catalog, switches));
  const devEntries = catalog?.devOnly?.i18n ?? [];

  /** The features a key belongs to (not counting their `i18nShared` paths). */
  const ownersOfKey = (key) =>
    Object.entries(features)
      .filter(([, f]) => f.i18n.some((e) => covers(e, key)) && !(f.i18nShared ?? []).some((e) => covers(e, key)))
      .map(([id]) => id);

  /** The switched-off feature a key belongs to, when every owner is off; else undefined. */
  const offFeatureOfKey = (key) => {
    const owners = ownersOfKey(key);
    return owners.length > 0 && owners.every((id) => off.has(id)) ? owners[0] : undefined;
  };

  /** The `devOnly.i18n` entry a key falls under, or undefined. */
  const devEntryOfKey = (key) => devEntries.find((e) => covers(e, key));

  /** Is a content collection owned only by switched-off features? */
  const isCollectionOff = (name) => {
    const owners = Object.entries(features).filter(([, f]) => (f.collections ?? []).includes(name));
    return owners.length > 0 && owners.every(([id]) => off.has(id));
  };

  /**
   * Split the key-source keys into what `locale` must carry and what it may leave out.
   * `localeKeys` is the set of keys the locale has (it decides the dev-only all-or-nothing
   * rule); the key-source language itself must carry everything.
   * Returns `{ required, off, devOnly }` (arrays of keys, input order).
   */
  const splitKeys = (refKeys, localeKeys, { isKeySource = false } = {}) => {
    const result = { required: [], off: [], devOnly: [] };
    if (isKeySource) {
      result.required = [...refKeys];
      return result;
    }
    const carriedDev = new Set(devEntries.filter((e) => [...localeKeys].some((k) => covers(e, k))));
    for (const key of refKeys) {
      const dev = devEntryOfKey(key);
      if (offFeatureOfKey(key)) result.off.push(key);
      else if (dev && !carriedDev.has(dev)) result.devOnly.push(key);
      else result.required.push(key);
    }
    return result;
  };

  return {
    offFeatures: [...off],
    ownersOfKey,
    offFeatureOfKey,
    devEntryOfKey,
    isCollectionOff,
    splitKeys,
  };
}
