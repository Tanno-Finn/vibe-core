/**
 * Where an article's back button leads and what it says. The kit's articles
 * go "back to the learning area" (/learn); while site.json switches the `learn`
 * feature off, that page redirects, so the button goes to the start page and
 * says so instead of carrying a label that no longer matches where it lands.
 */
import { SiteRules } from '../../config/site';

export interface LearnBackLink {
  /** Router path with a leading slash. */
  readonly route: string;
  /** i18n key of the button label. */
  readonly labelKey: string;
}

export function learnBackLink(site: SiteRules): LearnBackLink {
  return site.isRouteOn('learn')
    ? { route: '/learn', labelKey: 'lernbereich.backToLernbereich' }
    : { route: `/${site.startPage}`, labelKey: 'common.backToStartPage' };
}
