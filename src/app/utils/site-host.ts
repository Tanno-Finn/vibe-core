/**
 * The host name this site is served from, for text a reader sees on paper:
 * the print header and footer and the learning-path certificate.
 *
 * Why this exists: those spots used to print a hard-coded "example.com" — a
 * domain the operator does not own, on every printout. The same order the
 * imprint uses for its attribution sample applies here: in the browser (where
 * every print happens) the page's own host; on the server the configured
 * `environment.siteUrl`; with neither known, an empty string, and the caller
 * leaves the spot out. Missing beats wrong.
 *
 * Usage:
 *   import { siteHost } from '../../utils/site-host';
 *   const host = siteHost(); // "your-domain.example", or '' when unknown
 */
import { environment } from '../../environments/environment';

export function siteHost(): string {
  if (typeof window !== 'undefined' && window.location?.host) {
    return window.location.host;
  }
  return hostOf(environment.siteUrl);
}

/** Host part of an absolute URL ("https://a.example/x" → "a.example"), '' if there is none. */
export function hostOf(url: string | null | undefined): string {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return '';
  try {
    return new URL(trimmed).host;
  } catch {
    return '';
  }
}
