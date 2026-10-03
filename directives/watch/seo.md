<!-- base -->
# watch: seo — playbook

Findability: whether people can reach this site through a search engine at all. Tuned by
`watch.seo` in the user manifest; the level semantics live in
[stewardship](../stewardship.md), not here.

## Why this matters (the plain-words pitch)

**Findability is whether your page turns up when someone searches for what it is about.**

For most sites a search engine is the front door — more people arrive through it than
through any link you send yourself. Whether a search engine can place a page well is
decided while the page is built, not afterwards: a title that says what the page is, one
clear topic per page, headings in order, a short description, text that is really text and
not a picture of text, links that work. Almost all of it is free craft, not an advertising
budget. Ignore it while building and you retrofit it later, page by page; share your site
only by link and you barely need it at all.

Two honesties belong in the same breath. Nobody can promise a position in a result list —
the craft can be checked, the ranking cannot. And the craft overlaps heavily with
accessibility: a real heading structure and a genuine text alternative for an image help a
screen reader and a search engine for the same reason. Where the two topics meet, do the
work once.

## Radar — what trips it

Evidence, not vibes: name the file and line, or the count.

**While working** (fires in the moment, `normal` and above):

- A new route is added without a `seo.pages.<routeKey>.title` / `.description` pair in the
  translation files, so it falls back to the site default — `src/app/services/meta-seo.service.ts`
  reads those keys and returns `null` when they are missing.
- A page has no `<h1>`, more than one, or jumps a heading level (h2 to h4). Same finding as
  the accessibility radar; raise it once, not twice.
- An image carrying meaning gets an empty `alt`, or text ships only inside an image.
- A new page is not covered by `prerender-routes.txt` although its content is static — a
  page that only exists after script execution is a page a crawler may never see rendered.
  Regenerate with `npm run generate:prerender-routes`.
- A link is added that does not resolve, or a route is renamed without a redirect for the
  old path.
- Two pages are given the same title, or a page is split into a variant that duplicates
  most of another page's text, with no canonical URL declared
  (`canonicalUrl` in the meta service).

**At natural pauses** (accumulate, raise at a pause, `normal` and above):

- Routes exist whose title or description keys are still missing — report the count and
  the list, not one nagging line per route.
- New pages were added since the sitemap was last generated (`npm run sitemap`,
  `scripts/generate-sitemap.js`), or new languages were switched on without their entries.
- `public/robots.txt` still blocks paths that are meant to be public, or fails to point at
  the sitemap.
- Structured data (`src/app/services/structured-data.service.ts`) describes a shape the
  page no longer has.

**Only on `active`:** offer a pass over all routes without an acute finding — titles and
descriptions reviewed as a set, so they read as one site rather than seven improvisations.

**On `quiet`:** everything above still runs and is recorded. Nothing is said unless the
user asks, or unless a finding is a real risk in its own right — a page unintentionally
blocked from indexing, or private content that would become publicly findable. The second
one is a privacy finding and is raised regardless of this level.

## Check-in — how to raise it

The shape, adapted to the moment — never read out as a template:

> *finding, with its location* — the four new pages have no description text yet
> (`seo.pages.*.description` missing for `/de/lessons`, `/de/glossary`, and two more).
> *what it costs, in plain words* — a search engine then invents the two lines under your
> title from whatever text it finds first, which is usually not the sentence you would
> choose.
> *the three options* — I can draft the four descriptions for you to read over
> (about ten minutes), note it as a task for later, or we leave it: if this site is only
> ever shared by link, it genuinely does not matter.
> *then wait.* The user picks.

Cadence follows [stewardship](../stewardship.md): once per topic per session, at a natural
pause, never mid-task. A waved-off nudge goes to `OPEN-QUESTIONS.md` with the reason and
does not come back until the facts change — if the user says the site is link-only, that
answer covers the whole topic, not just today's four pages, and the right follow-up is to
offer setting `watch.seo` to `quiet`.

Before `/ship`, one short finding for this topic as part of the posture report, if the
topic is not `quiet`: how many public routes have their own title and description, whether
the sitemap matches the routes, whether anything public is accidentally blocked. Facts,
counted. No prognosis.

## Paydown — how to actually fix it

No separate operative directive owns this; the recipe is here.

1. **Title and description per route.** Add `seo.pages.<routeKey>.title` and
   `.description` in every language variant the site ships, then let the user read them.
   The title names the page and the site ("Glossary — <site>"), stays roughly under sixty
   characters, and is unique across routes. The description is one or two sentences of what
   the page actually offers, written for a person, not stuffed with keywords; it is a
   summary, not a slogan. Never invent claims a page does not deliver.
2. **One topic per page.** Two half-topics on one page compete with each other and match
   neither search. Splitting is usually the better fix; where two pages must overlap,
   declare the canonical URL on the lesser one.
3. **Heading structure.** Exactly one `<h1>` that repeats the page's promise, then `h2`
   and `h3` in order with no skipped levels. Headings describe sections; they are not a
   styling device.
4. **Text as text.** Anything that must be findable lives in the markup: real text, real
   `alt` on meaningful images, transcripts or captions for audio and video. This is the
   same fix the accessibility standard asks for — do it once, count it twice.
5. **Make it visible without scripting.** Static pages belong in `prerender-routes.txt`
   (`npm run generate:prerender-routes`), so the shipped HTML already carries the content.
6. **Sitemap and crawl rules.** Regenerate the sitemap after adding routes or languages
   (`npm run sitemap`); check that `public/robots.txt` opens what should be public, blocks
   what should not, and names the sitemap. Language variants of the same page point at each
   other, and each declares its own canonical URL — the meta service does both.
7. **Links.** Fixing a broken internal link is worth more than any tuning: a link that
   leads nowhere costs a reader and a crawler equally. Old paths that were renamed get a
   redirect rather than a dead end.
8. **Structured data, only where it is true.** Describe what the page really is. Markup
   that claims a shape the page does not have is worse than none.

Order to work in when several are open: broken links, then missing titles and
descriptions, then heading structure, then sitemap and crawl rules, then everything else.
That is roughly the order of effect per minute spent.

## Limits

- **No ranking promises, ever.** The craft is checkable; a position in a result list is
  not. Say "this makes the page describable" — never "this will get you to the top".
- **No traffic estimates, no keyword strategy, no competitor claims.** They would need data
  this kit does not have. If the user wants that, say plainly that it is outside what can
  be honestly done here.
- **Nothing silent.** As with every watch topic: findings are said, fixes are offered,
  the user decides ([stewardship](../stewardship.md)). Renaming pages, rewriting texts, or
  restructuring navigation for findability are the user's calls, not a side effect of some
  other task.
- **Never at the expense of honesty or accessibility.** Wording that games a search at the
  cost of being accurate, or a heading structure bent for a search engine rather than a
  reader, is a finding in itself, not a fix.
- **Never at the expense of privacy.** "Findable" and "public" are the same thing. Before
  making anything more findable, check whether it was meant to be found at all
  (PRIV rules); a page that should stay private is a privacy finding at any watch level.
- **No safety-tier changes.** This playbook never softens or triggers a Yellow or Red
  warning ([SAFETY](../../base/SAFETY.md)).
