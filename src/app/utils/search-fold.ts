/**
 * Fold a string for search comparison: lower-case, and compound joiners dropped.
 *
 * Easy German writes compounds with a Mediopunkt (*Code·review*, house style of
 * 2026-09-23), standard German and English with a hyphen or closed (*Code-Review*,
 * *Codereview*). A visitor types whichever form they know, so the joiners — the
 * middle dot and the hyphen family — must not decide whether a term is found.
 * Apply it to both sides of a comparison.
 */
export function foldForSearch(text: string): string {
  return text.toLowerCase().replace(/[·‧‐‑-]/g, '');
}
