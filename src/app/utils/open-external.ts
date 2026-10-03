/**
 * Open a content-supplied URL in a new tab — http(s) only.
 *
 * Why this exists: Angular's URL sanitizer only guards `[href]` bindings.
 * `window.open(url)` is a raw DOM call, so a `javascript:` (or `data:`)
 * URL that reaches it executes in the page's own origin. The URLs behind
 * the "visit source" buttons come from content JSON — catalog entries,
 * timeline event links, source records — which the kit's users author and
 * edit themselves. A single typo'd or pasted scheme is enough.
 *
 * The check is a scheme allowlist, not a blocklist: anything that is not
 * plainly `http://` or `https://` is refused, so `javascript:`, `data:`,
 * `vbscript:`, `blob:`, protocol-relative `//evil.example` and whitespace
 * smuggling (`java\nscript:…`) all fall through to a no-op.
 *
 * Usage:
 *   import { openExternal } from '../../utils/open-external';
 *   openExternal(entry.url);
 *
 * @returns true if a window was opened, false if the URL was refused.
 */
export function openExternal(url: string | null | undefined): boolean {
  if (!url) return false;
  if (typeof window === 'undefined') return false;

  // Trim first: leading control characters/whitespace are stripped by the
  // browser when it parses the scheme, so they must not defeat the test.
  const candidate = url.trim();
  if (!/^https?:\/\//i.test(candidate)) return false;

  window.open(candidate, '_blank', 'noopener,noreferrer');
  return true;
}
