/**
 * site-host spec — printouts name the real host, never a placeholder domain:
 * in the browser it is the page's own host; hostOf() reduces a configured
 * siteUrl to its host and gives '' for anything that is not an absolute URL.
 */
import { hostOf, siteHost } from './site-host';

describe('siteHost', () => {
  it('names the host the page is served from in the browser', () => {
    expect(siteHost()).toBe(window.location.host);
    expect(siteHost()).not.toContain('example.com');
  });
});

describe('hostOf', () => {
  it('reduces an absolute URL to its host, keeping a port', () => {
    expect(hostOf('https://learn.your-domain.example/')).toBe('learn.your-domain.example');
    expect(hostOf('  http://localhost:2000/de/home  ')).toBe('localhost:2000');
  });

  it('gives an empty string for an empty or non-absolute value', () => {
    expect(hostOf('')).toBe('');
    expect(hostOf(undefined)).toBe('');
    expect(hostOf(null)).toBe('');
    expect(hostOf('your-domain.example')).toBe('');
  });
});
