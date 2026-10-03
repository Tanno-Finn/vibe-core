// Sets of stepIds / snippet types that have baked WebP thumbnails under
// /assets/images/thumbnails/. The thin runtime components render these baked images
// accent-independently. <app-thumbnail> treats an id NOT listed here as "no image" and
// shows its designed fallback tile (type colour + icon); scripts/validate-thumbnails.js
// makes the prod build fail when a listed id is missing its light or dark file.
//
// Kit note: these are generic Educational-Amber PLACEHOLDER thumbnails covering only the
// seed content (1 article, 1 demo) and the section/quick-start snippets the home page +
// marquee use. The kit ships no baker; the other articles use the fallback tile.
export const BAKED_ILLUSTRATION = new Set<string>(['sdmo', 'seed-article-1']);
export const BAKED_SNIPPET = new Set<string>([
  'demos',
  'glossary',
  'home',
  'impressum',
  'learningPaths',
  'lessons',
  'news',
  'qs-evolution-genetic',
  'qs-glossary-term',
  'qs-prompting-race',
  'qs-timeline-event',
  'roadmap',
  'sources',
  'timeline',
  'tools',
]);
// Content hash suffix (?v=) so an updated thumbnail is never served stale from cache.
export const THUMBS_VERSION = 'kit-placeholder-1';
