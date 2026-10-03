# ADR-0012 — Content is CC BY 4.0, not CC BY-SA; code stays MIT

**Status:** accepted · **Date:** 2026-07-29

## Context

The kit is dual-licensed: code under MIT, written content (docs, directives, example
educational material) under a Creative Commons license. The original choice was
**CC BY-SA 4.0** (share-alike). The kit's primary audience is teachers and small teams
who remix the material into their own courses, slides, and handouts — usually merging it
with material under other licenses.

Share-alike is a copyleft condition: adaptations must be redistributed under the same,
a later, or a compatible license. Mere collections are exempt, but the moment the
material is genuinely merged — rewritten into a worksheet alongside all-rights-reserved
or NC material — the teacher has to either keep the sources separable or drop one of
them. That judgment call is exactly the friction we want to remove. Guidance for
openly licensed educational material generally favors the most permissive license a
project can live with, precisely because remix is the intended use.

A single license for everything was considered and rejected: Creative Commons itself
advises against CC licenses for software (no patent grant, no source-distribution
terms), and CC BY is not an OSI-approved software license. (CC0 is the exception CC
itself allows for software, but it would also waive attribution on the content — the
one condition we want to keep.) Code needs a software license; MIT is the
interoperable default.

## Decision

- **Code, scripts, config, skills, hooks: MIT** (unchanged).
- **Content, documentation, prose: CC BY 4.0** — attribution required, no share-alike.

## Consequences

- Downstream adaptations only need attribution; they may live under any license.
  Remixing into mixed-license teaching material is now friction-free.
- The commons loses copyleft protection: someone may build closed material on top of
  the content. Accepted — the kit is freely available, so the practical damage of a
  closed fork is low, and the reach gained from easy remixing is worth more.
- All license notices (LICENSING.md, README, CONTRIBUTING, footer badge and deed URLs,
  Impressum texts in every language variant) were updated in the same change. Any new
  content notice must say CC BY 4.0.
- **The change is not retroactive.** CC licenses are irrevocable: anything already
  published under CC BY-SA stays usable under those terms by whoever received it. New
  distributions carry CC BY.
- **This unilateral relicensing was possible because the repository has a single
  content author** (verified via `git shortlog -sne --all` at the time of this
  decision: one author, all commits). Once external content contributions are merged,
  a license change would need every contributor's consent.
- **CC BY content cannot absorb copyleft material.** Contributions must not paste in
  CC BY-SA or GPL-derived text; CONTRIBUTING.md states this.
