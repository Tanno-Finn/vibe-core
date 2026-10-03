<!-- base -->
# security-workflow — directive

How to **audit** the security of this kit — the defensive check-up a project gets before
it goes public and whenever its dependencies change. The
[SECURITY base standard](../base/standards/SECURITY.md) sets the *bar* (SEC-001..006,
all `[hard]`); this directive is the *method* that verifies the bar is actually met.
It does not restate the rules — it references them by ID. For proving a fix holds see
[verification](verification.md); for who decides what, see [stewardship](stewardship.md).

## Know the threat surface (this kit's shape)

This is a **static frontend**: no server, no database, no login. That removes whole
attack classes (SQL injection, session hijacking, server-side RCE) — say so honestly
instead of auditing ghosts. What remains is real:

1. **Supply chain** — every npm package runs with full build-time privilege on the
   developer's machine and ships code to every visitor.
2. **Secrets in the repo** — once committed, public forever (SEC-001).
3. **Injection into the page** — anywhere user- or content-derived strings reach the DOM
   as markup.
4. **Third-party requests** — every external script/font/CDN is someone else's code and
   an availability + privacy dependency. This kit ships with **zero** external requests;
   that property is worth defending.
5. **Hosting configuration** — headers and transport are set where the site is served,
   not in this repo, so they're checked at deploy time.

## The audit pipeline

Same shape as the [accessibility audit](accessibility-workflow.md): **scan → consolidate
→ fix smallest-first → re-scan as proof.** Run it before the first publish, after any
dependency change, and periodically on a living project.

### 1. Dependency audit

- Run the package manager's own audit (`npm audit`) and read it critically: triage by
  severity **and** by reachability — a critical advisory in a build-only dev tool is not
  the same as one in code that ships to the browser. Report both, prioritize the latter.
- Review what changed in the lockfile whenever dependencies moved; an unexpected new
  transitive package is a question, not background noise.
- Prefer upgrading to patched versions over suppressing advisories. A suppressed
  advisory is an override and must be visible, never silent (SEC-006 in spirit).

### 2. Secret scan

- Scan the working tree **and the git history** — deleting a committed secret from the
  tree does not remove it from history (SEC-001's whole point).
- Look for the classic shapes: API keys, tokens, connection strings, private keys,
  `.env` files with real values. `.env.example` with placeholders is the only allowed
  pattern.
- A found secret is an incident, not a lint warning: tell the user immediately, treat
  the credential as burned (it must be rotated where it was issued), and never paste
  the value anywhere — including the report (SEC-002).

### 3. Code-pattern sweep

Grep the source for the handful of patterns that carry injection or leak risk, and
justify every hit or fix it:

- Raw HTML sinks (`innerHTML` bindings, sanitizer bypasses like `bypassSecurityTrust*`,
  `eval`-family calls) — each one needs a reason why its input can't carry hostile
  markup, in writing.
- External URLs in `src/` — against the zero-external-request property; every new one is
  a finding.
- Links opening new tabs without `rel="noopener"`; forms or fetches posting to
  endpoints that aren't the configured ones.

### 4. Hosting & transport checklist (deploy time)

The repo can't set these, so `/ship` asks about them when publishing is on the table:
HTTPS enforced, sensible security headers (a content-security policy, `noindex` off,
frame protection), and no directory listings. Record what the host does and doesn't
provide — an honest "this host can't set CSP" beats an assumed protection.

## Report and fix

Consolidate findings into one severity-ranked list — `{ finding, where, severity, why it
matters in plain language, suggested fix }` — and hand it to the user
([stewardship](stewardship.md): inform, recommend, let them choose). Fix with the
smallest change that resolves the finding (QUAL-006), then **re-run the scans**: the
before/after delta is the proof the pass worked. Findings the user consciously accepts
go to `OPEN-QUESTIONS.md` with a revisit date — accepted risk is a decision, silence is
not.
