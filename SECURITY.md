**Deutsch:** [Diese Seite auf Deutsch](docs/de/SECURITY.md)

# Security policy

## Reporting a vulnerability

Please report security issues **privately** — do not open a public issue for a suspected
vulnerability.

Use GitHub's private vulnerability reporting on this repository: the **Security** tab →
**Report a vulnerability**. That opens a private advisory visible only to the maintainers, so
the issue can be assessed and fixed before it is disclosed.

> Private vulnerability reporting has to be turned on by a repository admin (Settings → Code
> security → "Private vulnerability reporting") before that button appears. If you don't see it,
> the maintainer hasn't enabled it yet — please fall back to GitHub's general abuse-report flow
> or note it in a minimal, non-sensitive public issue asking the maintainer to enable it.

When you report, please include:

- what the issue is and the impact you think it has,
- the steps to reproduce it (a minimal example helps most),
- the version, commit, or branch you observed it on.

You can expect an acknowledgement of your report, an assessment of whether it is in scope, and —
if it is — a fix and a coordinated disclosure once a fix is available. Please give a reasonable
window to address the issue before any public discussion.

## Scope

This is a **frontend** kit: a static single-page application with no server, database, or
authentication of its own. Angular's server renderer runs only at build time (to prerender the
pages into static HTML) and inside the local dev server; the kit ships no runtime server entry
(`server.ts`) and the deployable artifact, `dist/vibecore/browser/`, is plain files. The most
relevant classes of issue are therefore things like cross-site scripting in how content is
rendered — including markup that reaches the prerendered HTML — unsafe handling of untrusted
input in the browser, dependency vulnerabilities, or a build/tooling weakness.

If you add a Node server for on-demand rendering, start from Angular's `AngularNodeAppEngine`
template: set `allowedHosts`, disable `x-powered-by`, send the security headers from
[the deploy guide](docs/how-to/deploy.md), and add an error handler that does not leak stack
traces.

If you extend the kit with a backend (see
[Add a backend](docs/how-to/add-a-backend.md)), the security of that server is your
responsibility — but the guide's non-negotiables (never ship secrets in the client, never trust
the browser, validate on the server) are the baseline.

## The agent safety hook

The kit ships a `PreToolUse` hook for Claude Code, `.claude/hooks/guard-red-actions.mjs`,
that refuses irreversible or outward actions an AI agent might take in your checkout:
force-push and other history rewrites, writing or reading real secret files, deleting the
project or its `.git`, publishing and deploying, and edits to the hook itself, including
moving or renaming it. It is a second layer behind the written rules in
[`base/SAFETY.md`](base/SAFETY.md), not a sandbox: it reads command lines and file paths,
and what it cannot see is listed there under "What the hook cannot see". It denies when it
cannot parse its input, but a hook that times out or cannot start lets the call through.

A way to get a command the hook is meant to refuse past it — a new spelling of a force-push,
a path form it does not normalize, a tool it does not see — is in scope. Report it
privately as above; a regression test for the case is the most useful thing to include.

## Known dependency advisories

`npm audit` is expected to run clean — development dependencies included — and no advisory
is knowingly carried today. The accessibility check drives axe-core through Puppeteer, not
through `@axe-core/cli`, whose `chromedriver` dependency pulls in `adm-zip` with known
advisories (GHSA-vwc7-r8mq-g2x9, GHSA-7q85-xj36-vmfc); keep it that way.

Anything `npm audit` reports is a defect: pin it through `overrides` in `package.json` and
say so in the changelog. If an advisory ever has to be carried knowingly, record it here with
the reason, rather than silencing it.

## Supported versions

This project is at 1.x. Only the latest release and the current state of the default branch are
supported. There is no back-porting to older minor or patch versions — upgrade to the latest
release to get a fix.

| Version | Supported |
|---|---|
| 1.0.x | Yes |
| < 1.0 | No |
