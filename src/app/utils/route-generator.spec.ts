/**
 * generatePageIdRedirects spec — the short-link layer behind printed URLs like
 * `/euai`. Every route with a page ID gets a redirect from that ID (and from
 * its lowercase form), unless the redirect would loop, collide with a real
 * path, or steal another route's own ID.
 */
import { ExtendedRoute, extendedRoutes } from '../app.routes';
import { generatePageIdRedirects } from './route-generator';

const page = (path: string, pageId?: string, extra: Partial<ExtendedRoute> = {}): ExtendedRoute => ({
  path,
  pageId,
  ...extra,
});

/** `[from, to]` pairs — the part of a redirect route that matters. */
const pairs = (routes: ExtendedRoute[]) => routes.map((r) => [r.path, r.redirectTo]);

describe('generatePageIdRedirects', () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => warn.mockRestore());

  it('redirects the page ID and its lowercase alias to the route, as hidden full-match routes', () => {
    const redirects = generatePageIdRedirects([page('articles/art-eu-ai-act', 'EUAI')]);

    expect(redirects).toEqual([
      { path: 'EUAI', redirectTo: 'articles/art-eu-ai-act', pathMatch: 'full', hidden: true },
      { path: 'euai', redirectTo: 'articles/art-eu-ai-act', pathMatch: 'full', hidden: true },
    ]);
  });

  it('adds no alias when the page ID is already lowercase', () => {
    expect(pairs(generatePageIdRedirects([page('glossary', 'glos')]))).toEqual([['glos', 'glossary']]);
  });

  it('skips routes without a page ID, redirects and hidden routes', () => {
    const redirects = generatePageIdRedirects([
      page('glossary'),
      page('old', 'OLDX', { redirectTo: 'glossary' }),
      page('secret', 'SECR', { hidden: true }),
    ]);

    expect(redirects).toEqual([]);
  });

  it('never creates a redirect from a path to itself', () => {
    expect(generatePageIdRedirects([page('home', 'home')])).toEqual([]);
  });

  it('keeps the first route when two share a page ID, and warns about the second', () => {
    const redirects = generatePageIdRedirects([page('first', 'DUPE'), page('second', 'DUPE')]);

    expect(pairs(redirects)).toEqual([
      ['DUPE', 'first'],
      ['dupe', 'first'],
    ]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Duplicate page ID detected: DUPE'));
  });

  it('does not shadow a real route whose path equals the page ID', () => {
    const redirects = generatePageIdRedirects([page('glossary'), page('articles/x', 'glossary')]);

    expect(redirects).toEqual([]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('conflicts with existing route path'));
  });

  it('does not create a lowercase alias that would shadow a real path', () => {
    const redirects = generatePageIdRedirects([page('news'), page('articles/news-intro', 'NEWS')]);

    expect(pairs(redirects)).toEqual([['NEWS', 'articles/news-intro']]);
  });

  it('leaves the lowercase form to a route that declares it as its own page ID, whatever the order', () => {
    const redirects = generatePageIdRedirects([page('upper', 'ABCD'), page('lower', 'abcd')]);

    expect(pairs(redirects)).toEqual([
      ['ABCD', 'upper'],
      ['abcd', 'lower'],
    ]);
    expect(warn).not.toHaveBeenCalled();
  });

  it('produces no duplicate redirect path for the routes the app actually ships', () => {
    const redirects = generatePageIdRedirects(extendedRoutes);
    const paths = redirects.map((r) => r.path);
    const realPaths = new Set(extendedRoutes.filter((r) => !r.redirectTo && !r.hidden).map((r) => r.path));

    expect(redirects.length).toBeGreaterThan(0);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.filter((p) => realPaths.has(p))).toEqual([]);
  });
});
