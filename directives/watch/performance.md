<!-- base -->
# watch: performance — playbook

Speed: whether the thing stays usable on an old phone on a bad connection. Tuned by
`watch.performance` in the user manifest, default `quiet`; the level semantics live in
[stewardship](../stewardship.md), not here.

## Why this matters (the plain-words pitch)

**A page that feels brisk on your new laptop can be painfully slow on a five-year-old
phone on a train — and a large share of visitors arrive on exactly that.**

Speed is not a trick applied at the end. It is the sum of many small decisions taken while
building: how large the images are, how much code the page loads before it shows anything,
what could be fetched later instead of now. That is also why it is worth a watchdog: the
decline is gradual. Every single picture is harmless. The twentieth one tips the page over,
and by then nobody remembers which one it was.

The good news is that the fixes are dull and effective — smaller images in a modern format,
loading the parts of the site people have not reached yet only when they get there. Almost
none of it is visible in the result, which is the point: nobody sees a compressed picture,
everybody feels a page that appears in one second instead of eight.

## Radar — what trips it

Evidence, not vibes: name the number and where it came from.

**While working** (fires in the moment, every level — a threshold crossing is a fact, not
chatter):

- The build's own budget warns or fails. `angular.json` sets it for this kit: the initial
  bundle warns at **2 MB** and errors at **3 MB**, a single component's styles warn at
  **100 kB** and error at **200 kB**. A warning is the finding — by the time it errors the
  build is already refusing.
- An image is added at its original size or in a heavyweight format, or several are, or a
  picture is used where a piece of text or an inline vector would do.
- Something is imported at the top of a page that only a small part of the page needs, and
  that therefore now loads for everyone on first view.
- Work is started when a component initializes that keeps running — a timer, an animation
  loop — with nothing that stops it when the component goes away.
- A route is added that renders nothing until scripts have run, although its content is
  static. Static routes belong in `prerender-routes.txt` (`npm run generate:prerender-routes`),
  so the shipped HTML already carries the content — the same fix findability asks for; do it
  once, count it twice.

**At natural pauses** (accumulate, raise at a pause, `normal` and above):

- The initial bundle has grown noticeably since the last publish — compare against the
  previous build's inventory in `.build-manifest.json` (written by
  `scripts/write-build-manifest.js` at the end of `npm run build:prod`, never by a bare
  `ng build`).
- The prerendered route count has drifted away from the routes the site actually has.
- The total weight of what a first-time visitor downloads has crossed a line the user cares
  about — say the number, in megabytes, not a grade.

**On `quiet`** (the default): threshold crossings are still said — a budget warning, an
image that visibly doubles a page's weight — because those are findings, not opinions.
What stops is everything periodic: no unprompted profiling, no "this could be faster"
without a number attached, no optimization offered for its own sake.

**On `active`:** additionally offer, at a pause, one measured pass — what the first view
weighs, what the largest single contributors are, what the cheapest three fixes would save.

## Check-in — how to raise it

The shape, adapted to the moment — never read out as a template:

> *finding, with its number* — the start page now loads about 4 MB of images; three photos
> account for most of it, each around 1.2 MB at full camera resolution.
> *what it costs, in plain words* — on a phone on mobile data that is several seconds of
> staring at nothing before the page appears; on a laptop you would never notice.
> *the options* — I can resize and re-encode them to fit their actual display size, which
> saves roughly three quarters and is invisible on screen (about twenty minutes), note it
> as a task before publishing, or leave it if this page is only ever opened on a desk.
> *then wait.* The user picks.

Cadence follows [stewardship](../stewardship.md): once per topic per session, at a natural
pause, never mid-task. Because the default is `quiet`, the bar for speaking is a crossed
threshold rather than a suspicion. A waved-off nudge goes to `OPEN-QUESTIONS.md` with the
reason and does not come back until the facts change.

Before `/ship`, one short finding as part of the posture report if the topic is not
`quiet`: the initial bundle against its budget, the weight of a first view, whether the
static routes are prerendered. Facts, counted. No prognosis, and no grade.

## Paydown — how to actually fix it

1. **Images first, always.** They are almost always the largest share and the cheapest win.
   Resize to the size the page actually displays — not the camera's — encode in a modern
   format, and give width and height so the layout does not jump while they load. Anything
   below the first screenful loads lazily.
2. **Ship less code on first view.** Load a route's code when the route is reached rather
   than at start; keep heavy libraries out of the shared start bundle. The budget in
   `angular.json` is the scoreboard: if it stops warning, the change worked.
3. **Have the content already in the HTML.** Static routes in `prerender-routes.txt`
   (`npm run generate:prerender-routes`) arrive with their text present rather than
   assembled afterwards — visibly faster on a slow device, and findable at the same time.
4. **Stop what nobody is watching.** Timers and animation loops end when their component
   does. A loop that keeps running is a battery cost on a phone and, in a rendering
   framework, can keep the page from ever settling.
5. **Fewer, smaller dependencies.** A package that does one thing you could do in twenty
   lines is weight on every visitor forever. Before adding one, ask what it replaces.
6. **Measure before and after, on the shipped build.** The development server is not
   evidence — the numbers that count come from `npm run build:prod` and its manifest.
   Quote the pair: what it was, what it is now.

Order to work in when several are open: images, then first-view code, then prerendering,
then the rest. That is roughly the order of effect per minute spent.

## Limits

- **A deliberately short playbook.** This topic optimizes a result rather than preventing
  damage, which is why its default is `quiet` (ADR-0017). Depth here would earn its keep
  only against a project that has a measured problem.
- **No numbers without a source.** Speed claims come from the shipped build or they are not
  made. No grades, no scores, no "significantly faster" without the before and after.
- **No optimization as a side effect.** Findings are said, fixes are offered, the user
  decides ([stewardship](../stewardship.md)). Restructuring code for speed is never
  smuggled into an unrelated task.
- **Never at the expense of accessibility or honesty.** Removing a text alternative,
  dropping a focus indicator, or cutting content to save bytes is a finding in itself, not
  a fix.
- **No safety-tier changes.** This playbook never softens or triggers a Yellow or Red
  warning ([SAFETY](../../base/SAFETY.md)).
