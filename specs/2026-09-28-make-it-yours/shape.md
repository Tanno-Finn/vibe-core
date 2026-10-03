# Make it yours — the first half hour of a new kit user

**Status:** in progress (C1–C8 of [`plan.md`](plan.md)) · **Date:** 2026-09-28

## What

A supported path from "the kit's showcase" to "my own portal": set the site's name, short
description and operator data in one place; switch off the kit features this site does not need
(glossary, timeline, catalog, sources, learn hub, news, roadmap, progress, feedback, demos);
choose the start page; and remove the kit's sample content (15 sample articles, 44 sample
glossary terms, 119 sample sources, 5 sample learning paths) with one tool run. The seed
entries (`seed-article-1`, `example-demo`, `seed-term-*`, `seed-event-*`, `seed-path-1/2`, the
seed tool and resource, a new `seed-source-1`) stay as blueprints: they reference only each
other and keep every "collection must not be empty" check green. After the switch, a new portal
language needs only the strings of what remains.

## Why (the evidence)

The kit is a construction kit: users make their own content, the shipped articles are samples.
The simulation of 2026-09-25 spent most of its kit time, two thirds of it
in one answer, largely on finding out how to hide samples, rename the site and move the start
page; it improvised `src/config/site-features.ts` and edited the name in 13 files. Italian ended
up only inside one chapter because `check-i18n-keys` requires each of ~4,000 UI strings in every
language, ~2,300 of them from sample articles (plan §1.5).

## Decisions

- **Samples are removed, features are switched** (plan §2): removing feature code by tool is
  fragile (glossary alone touches ~15 files and 3 curated specs); hiding samples forever needs
  ~12 filter points and leaves ~59,000 words for agents to wade through. Undo is `git revert`.
- **The name is a fact in `src/config/site.json`**, read by the app and the scripts; the
  description stays prose in i18n `meta.description`. `src/index.html` and the OG image text are
  written by the tool; a gate catches drift.
- **Start page:** `site.json` `startPage` drives the `''` and `defaultsite` redirects, the logo
  link, the breadcrumb root and prerender tier 0. `/home` stays the kit's landing page and is
  always prerendered (it only shows cards for features that are on), so the build checks that
  assume `home` keep holding (plan §6 risk 4, the cheaper variant).
- **Operator data** moves from `site-operator.ts` into `site.json` and stays committed, as
  `docs/how-to/deploy.md` already says: the imprint is published by law, so it is not private.
- **The kit's defaults leave every feature on and the samples in place**, so the kit as shipped
  looks exactly as before; every commit keeps `build:prod` green.
