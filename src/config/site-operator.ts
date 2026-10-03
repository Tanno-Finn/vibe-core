/**
 * Site operator — who runs this site. The identity the imprint (Impressum, § 5 DDG)
 * and the privacy notice (Art. 13 DSGVO/GDPR) publish.
 *
 * These are facts, not prose: the same name, postal address and e-mail address stand
 * on the page in every language. They live in `src/config/site.json` (`operator`), next
 * to the site's name; this module only hands them to the app under the name every
 * importer already uses. The surrounding explanatory text (legal basis, retention
 * periods, the data-processing description) is language-specific and stays in
 * `src/assets/i18n/modules/<lang>/impressum.json`.
 *
 * The kit ships PLACEHOLDERS on purpose — nobody knows your identity but you. Replace
 * every value in site.json before you deploy. `npm run build:prod` refuses a build for a
 * real domain while any of them (or a bracketed fill-in instruction in impressum.json) is
 * still in place; see docs/how-to/deploy.md ("Fill in the imprint and privacy notice")
 * and scripts/check-imprint.mjs.
 */
import { SITE } from './site';

export interface SiteOperator {
  /** Name of the person or organisation responsible for the site (§ 5 DDG). */
  readonly name: string;
  /** Full postal address that can receive mail — a P.O. box is not enough. */
  readonly address: string;
  /** Contact e-mail, used for the imprint and for data-subject requests. */
  readonly email: string;
  /** The data-protection supervisory authority responsible for the operator (Art. 13 (2) (d) DSGVO). */
  readonly supervisoryAuthority: {
    readonly name: string;
    readonly address: string;
    readonly website: string;
  };
}

export const SITE_OPERATOR: SiteOperator = SITE.operator;
