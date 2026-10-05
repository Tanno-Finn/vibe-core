<!-- base -->
# guide-authoring — directive

How to write a design-system **guide article** — the artifacts, the tabs, and the quality
bar. *Consuming* the design system is covered by [design-system](design-system.md); this
is the authoring side. The concrete patterns live in the workshop (`src/app/dev/articles/`,
`src/assets/design-system/guides/`) — the Button guide is the reference implementation.

The scaffold is a skill: **`/new-guide`** walks the corpus check, the category decision, the
three artifacts and the closing gate run in one pass. This directive stays the authority on
what each artifact must contain — the skill executes it, it does not restate it.

## The five artifacts (shipped together, one commit)

1. **Registry entry** — `src/app/dev/articles/article-registry.ts`, under its PARSER
   CONTRACT: fixed field order `id, title, titleDe, category, tags, summary, summaryDe,
   related, agentDocPath, loadComponent`, single-quoted literals (German text uses „…“
   and the typographic ’, never a straight `'`), single-line arrays. The route
   `/dev/design/guide/<id>` is generated from the entry — no manual route work. `related`
   may point at guides that do not exist yet, and then the id carries the **`planned:`
   prefix** (`'planned:multiselect'`) in the registry AND in the doc frontmatter. The gate
   rejects a bare id that resolves to nothing: from the outside a forward reference and a
   typo look identical, so the intent is written down. A prefixed entry renders no chip
   and joins no `bundle`; drop the prefix in the commit that ships the guide.
2. **Article component** — `src/app/dev/articles/<id>/<id>-article.component.ts`: renders
   `<app-guide-shell [entryId]="'<id>'">` and projects tab bodies via
   `<ng-template appGuideTab="…">`. Tabs available: `examples`, `usage`, `design`,
   `development`, `i18n` (a subset is fine — only delivered tabs render) plus an optional
   `history` template that renders as a quiet footer. Conventions: annotated sources
   close the Usage tab; the accessibility/quality checklist closes Development; the
   Agent tab is always provided by the shell itself. The decorator takes
   `imports: ARTICLE_IMPORTS` and `styles: [ARTICLE_STYLES]`, two exported constants
   above the class, so the German twin shares them.
3. **German twin** — `src/app/dev/articles/<id>/<id>-article.de.component.ts`, the
   same article in German; see "English canonical, German twin" below.
4. **Agent doc** — `src/assets/design-system/guides/<id>.agent.md`: frontmatter
   (`id, title, category, tags, summary, related` — must equal the registry — plus
   `tabs`, see "Contract and encyclopedia", plus `measured-against`, see "The version
   pin", plus `covers`, see "What a guide covers") + the nine
   mandatory sections: When to use · When not to use · Key API · Accessibility ·
   Pitfalls · Sources · Semantic mapping · Rules · Default snippet, closed by the
   standard pointer line. No sections beyond
   the nine — in particular no per-call-site inventories of the host app ("kit
   reality"); those are commit-body material. Compact — **the ceiling is per covered
   component, and the gate measures it**: 8,500 bytes for one component, 1,500 more for
   each further one the doc's `covers:` list names, and the aim 2,000 under the ceiling
   (6,500 for one component, 8,000 for two, 9,500 for three); over the ceiling fails, over
   the aim warns, counted over the authored body (the frontmatter is gate-derived
   metadata, not a budget you can spend). Stated as prose alone the rule
   drifted upward until most docs sat within a few hundred bytes of the ceiling. When a
   byte target and a file:line citation or
   measured number collide, the evidence wins and the overrun is declared in the
   commit body (wave-A family practice, 4.5–8.1 KB). Trim prose, never provenance —
   where provenance means the citation (version, file:line, token), not the
   measurement story; see "Provenance, not process".
   imperative, agent-first — this file is what `scripts/design-guides.mjs` serves, and
   the UI's Agent tab renders the same bytes (single source, drift-free by design).
5. **Green gates** — `node scripts/check-design-guides.mjs` enforces all of the above
   (registry ↔ component ↔ doc ↔ metadata ↔ sections ↔ routes), and
   `node scripts/check-guide-translations.mjs` the English ↔ German parity. Both run
   inside `build:verify` and the harness; a guide that fails either doesn't ship.

Chrome i18n (tab labels, category names) already exists ×4 languages — a new guide needs
new keys only for a new *category*, nothing per-article.

## English canonical, German twin

Every guide ships an English canonical article and a German twin
([ADR-0018](../docs/adr/0018-german-guide-twins-by-inheritance.md)). The route renders the
twin when the base language is `de` (`de` and `de-easy`) and the English article for `en`
and `en-easy`; a guide without a twin falls back to English. The **agent doc stays
English** — it is the contract for AI agents, and the Agent tab tells a German reader so.

- **The twin extends the English class** (`export class <Name>ArticleDeComponent extends
  <Name>ArticleComponent`), with its own `selector` (`app-<id>-article-de`), the shared
  `imports: ARTICLE_IMPORTS` and `styles: [ARTICLE_STYLES]`, and a German `template`.
  State, handlers, measured values and code snippets are inherited. Copy `providers` and
  `encapsulation` from the English decorator when it has them.
- **English text held in class fields** (a measured-values object such as `m`, menu
  items, option labels, readout strings) is overridden in the twin with `override
  readonly …`, complete, every key — not spread from the parent.
- **Translate** all visible prose, headings, table text, demo labels and the values of
  `aria-label`, `title`, `alt`, `placeholder` and label-like inputs, per
  [`languages/de.md`](languages/de.md): *du*, generic masculine, „…“, decimal comma in
  prose numbers. **Keep verbatim** code identifiers, API names, CSS values, versions,
  file:line citations, the titles of cited sources, and everything inside `<pre>`,
  `<code>`, `<kbd>` — including the inherited code snippets.
- **Same skeleton.** The twin has the same tabs and the same element / attribute /
  binding tree as the English template; only text and translatable attribute values
  differ, and inline elements (`code`, `strong`, `a`, `{{ … }}` …) may move within their
  sentence. `node scripts/check-guide-translations.mjs <id>` checks one guide and names
  the first divergence with a line in each file; `check-house-style.mjs` checks the
  German style of every twin.
- **Register the twin** by running `node scripts/sync-guide-translations.mjs`: it writes
  the generated id → twin loader map (`guide-translations.generated.ts`); never edit that
  file by hand. The parity gate fails while the map is stale.
- **Keeping the pair in step.** A change to an English article changes its twin in the
  same commit — a new paragraph, a renamed binding, a new measured value. The parity gate
  catches structural drift; reworded prose it cannot see, so the commit that rewords the
  English updates the German too.

## Contract and encyclopedia

The agent doc and the article tabs are not two renderings of one text. The **agent doc is
the contract**: what an agent must always know to use the component correctly, small
enough to stay loaded (the nine sections, aiming at ≲6.5 KB per component covered — see
"What a guide covers" for the ceiling the gate actually enforces). The **article tabs are the
encyclopedia**: token derivations, measurement tables, i18n mechanics, rendered
do/don't pairs — depth that is worth its tokens only when a task lands on it. Write for
that split. A fact an agent needs *every* time it touches the component belongs in the
doc; a fact it needs when it restyles, translates, or debugs the component belongs in the
tab and is *pointed at* from the doc.

The pointer is the `tabs:` frontmatter field — an indented block mapping, one curated
line per tab, and the gate checks it against the article's `appGuideTab` templates in
both directions:

```yaml
tabs:
  examples: Rendered variants, the size and severity matrix, and a live playground
  design: Aura token chain, focus-ring and contrast measurements per theme
  i18n: Which strings come from your template and which from the library config
  history: Document changelog
```

Rules for the mapping:

- **Every projected tab is declared, `history` included.** It renders as a footer rather
  than a tab, but it is an `appGuideTab` template and slices like any other.
- **The line says what is IN the tab, not how it got there** — the register rule from
  "Provenance, not process" applies here too. "Aura token chain and focus-ring
  measurements", not "the measurements taken during the review". Max 140 characters.
- **Escalation criterion, for the agent reading it:** load a tab when the task touches
  its ground — restyling → `design`, translating → `i18n`, wiring the component →
  `usage`, debugging behavior → `development`. Otherwise the contract is enough.

Extraction is `node scripts/design-guides.mjs tab <id> <tab>`. It slices the markup at the
`appGuideTab` marker and substitutes the component's own **flat string constants** — the
`readonly m = { … }` measurement object, the `readonly …Snippet = \`…\`` code samples — so
a measurement table arrives with its numbers and a code sample with its code. Write those
constants as plain string literals, template literals without `${}`, or `'a' + 'b'`
concatenations, and they resolve. Anything computed at runtime (a signal, a `@for` loop
variable, a ternary) cannot resolve, prints as written, and is counted on stderr; put a
fact a reader needs in a constant, not in a computed expression. `--raw` returns the
unsubstituted markup.

Every agent doc therefore ends with the same line, verbatim:

```
Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
```

The gate additionally verifies that every file and `app-…` selector a guide names still
exists in the tree — a guide once went on citing `glossary-tooltip.component.ts` long
after that file was deleted. Library citations (`openng-optimus-ui-select.mjs:1677`,
`@openng/optimus-ui-themes/dist/aura/base/index.mjs`) are out of scope by construction; kit
citations are not.

## Harvest contracts: the block markup an agent reads across the corpus

A tab body is markup, and markup is only queryable across a corpus of guides if the same
kind of content carries the same marker everywhere. The markers are CSS class names the
articles already use — which makes them an **interface**, not styling, and the gate holds
you to it: a marker that is present in the tree must be recognized by the harvester, so a
rename in a refactor fails the build instead of silently halving an answer.

The gate enforces RECOGNITION, not presence. A guide that carries no reference table is
never failed for that; a table the harvester cannot see is. (One presence rule predates
this and stays: a guide with a Usage tab must yield at least one do/don't pair, because
the pairs are that tab's job.)

### Which blocks are the vocabulary, and why these

First measured over the then-twenty guides on 2026-08-18; refreshed on 2026-08-19 over
all 29 guides with the harvester itself (`node scripts/design-guides.mjs blocks <kind>`),
which counts the blocks as it serves them:

| block           | marker                        | harvested blocks | guides | deviation found |
| --------------- | ----------------------------- | ---------------: | -----: | --------------- |
| do/don't pair   | `dd__cell dd__cell--bad/good` |        101 pairs |  29/29 | none |
| reference table | `table-wrap` around `<table>` |              225 |  29/29 | none — wrapping, `<thead>`/`<tbody>` and captions are gate-enforced |
| provenance note | `src-note`                    |              377 |  29/29 | none — every instance a `<p>`, every caption a real heading |
| code recipe     | `code-block`                  |              209 |  29/29 | 7 additional `code-block--inline`; template-recipe snippets legitimately contain literal `{{ … }}` |
| pitfall         | — none —                      |        4 `<h3>`  |      — | no marker of any kind |

Those four class markers are the corpus's block vocabulary; write them as below.

**Pitfalls are deliberately not one of them.** Two reasons, both measured. The tabs carry
no marker to key on — four `<h3>` headings in the whole corpus mention the word — so a
pitfall harvest would need a marker retrofitted into every existing article. And the
cross-cut already exists one layer up: `## Pitfalls` is a mandatory agent-doc section,
so `design-guides.mjs sections pitfalls` answers the question across every guide
today. A new marker would be an author tax with an existing substitute.

### The do/don't markup is a harvest contract

`design-guides.mjs blocks dodont` returns every do/don't pair in the corpus in one call —
label, rationale, and the markup of the rendered example. Every `dd__cell` in the tree must
be recognized by the harvester, and every guide with a Usage tab must yield at least one
pair. Write a pair as

```html
<div class="dd">
  <div class="dd__cell dd__cell--bad">
    <span class="tag tag--bad">Don't — a group whose name is only a heading</span>
    <div class="dd__stage"><!-- the rendered example --></div>
    <p class="dd__why">Why it fails, in one sentence.</p>
  </div>
  <div class="dd__cell dd__cell--good"><!-- the same four parts, --good / tag--good --></div>
</div>
```

Two consequences worth knowing before you deviate: a label written as a binding
(`[label]="…"`) harvests as an empty label unless the binding is a plain string constant,
and a renamed class silently halves the harvest — which is precisely why the gate checks
the count rather than trusting the habit.

### Reference tables

Every table in a tab is wrapped, and the wrapper is the marker. The table's own structure
carries the rest: `<thead>` names the columns, `<tbody>` holds the rows, the nearest
preceding `<h3>`/`<h4>` is its caption, and a `src-note` directly after it is its
provenance.

Not this — a bare table under no heading, with the column meanings only in prose:

```html
<p>Small is 14px, default 16px, large 18px.</p>
<table>
  <tr><td>font-size</td><td>0.875rem</td><td>1rem</td><td>1.125rem</td></tr>
</table>
```

This — wrapped, headed, with a header row and its provenance beside it:

```html
<h3>Size tokens</h3>
<div class="table-wrap">
  <table>
    <thead><tr><th>Token</th><th><code>size="small"</code></th><th>default</th></tr></thead>
    <tbody>
      <tr><td>font-size</td><td>0.875rem (14px)</td><td>1rem (16px)</td></tr>
    </tbody>
  </table>
</div>
<p class="src-note">Values from <code>&#64;openng/optimus-ui-themes/dist/aura/button/index.mjs</code>.</p>
```

The wrapper is not decoration: it is what makes the table scroll on a narrow screen
instead of pushing the page sideways, and it is what a cross-guide query keys on. A table
whose rows are generated by `@for` still harvests — the row template comes back and the
block is marked dynamic — but a value a reader needs belongs in a literal cell or in a
string constant, not in a runtime expression.

Keyboard access comes from the shell, not from the guide: a `table-wrap` or a `pre` that
actually overflows (on a phone, most of them) becomes a focusable group named "Table" or
"Code example" (in German "Tabelle", "Codebeispiel") with the kit's focus ring, and loses it
again once it fits
(`src/app/dev/articles/scroll-regions.ts`, SC 2.1.1). So a guide sets no `tabindex`,
`role` or `aria-label` on them; an author-set `tabindex` makes the shell leave the element
alone.

`design-guides.mjs blocks table` returns every one of them in one call — caption, column
names, rows, and the `src-note` that vouches for them; `--brief` drops the rows and keeps
the header, which is the shape to reach for when the question is "which guide measured
this at all". The gate counts `<table>` elements, which it can do without knowing the
wrapper class at all: a table that has slipped out of a wrapper, or a wrapper that has
been renamed, reads as present-but-unharvested and fails the build. Give a table a real
`<caption>` when its heading does not name it — three in the corpus do, and the harvest
prefers it over the heading above.

### Provenance notes

The half-sentence of evidence "Provenance, not process" demands has one shape in the tabs:
a `<p class="src-note">` next to the claim it backs. It is a `<p>`, not a `<div>` and not
an aside — one paragraph, sitting after the table, list, or example it vouches for.

Not this — provenance dissolved into the surrounding prose, unfindable across the corpus:

```html
<p>These numbers come from the Aura preset, and we also checked the rendered output.</p>
```

This — one marked paragraph naming the artifact:

```html
<p class="src-note">
  Token names and defaults from <code>&#64;openng/optimus-ui-themes/dist/aura/slider/index.mjs</code>;
  the rendered values are computed style, both themes.
</p>
```

A `src-note` says what the claim was read off. It is not a place to smuggle the session
transcript back in — the three tests under "Provenance, not process" apply to it word for
word.

Name the artifact in a `<code>` span. `design-guides.mjs blocks source` returns every note
in the corpus with the heading it sits under and the list of spans it cites — which is how
"the version pin moved, what has to be re-read" becomes one call instead of a document
per guide. 327 of the 377 notes carry at least one; the ones that do not are the notes
that record what was NOT measured, which is a legitimate second job for the marker.
`--brief` cuts each note to a locator. The gate requires every `src-note` marker in the
tree to be harvested, so a note that leaves its `<p>` fails the build rather than leaving
a claim standing without visible evidence.

### Code recipes

A block a reader is meant to copy is a `<pre class="code-block"><code>…</code></pre>`.
Sizing or inline variants add a modifier (`class="code-block code-block--inline"`); the
`code-block` token stays.

The content is the part that decides whether the recipe survives leaving the page. Write
it as a **flat string constant** — a `readonly importSnippet = …` declaration holding a
plain string literal — which the tab extractor substitutes, so the recipe arrives complete
in `tab`, in `search` and in a cross-guide harvest. A recipe assembled at runtime (a
computed signal, a `@for` loop
variable, an array joined in the class body) is correct in the browser and empty
everywhere else:

```html
<!-- Not this: outside the browser this block is the string "{{ pgCode() }}" -->
<pre class="code-block"><code>{{ pgCode() }}</code></pre>

<!-- This: a flat constant resolves wherever the tab is read -->
<pre class="code-block"><code>{{ importSnippet }}</code></pre>
```

There is deliberately **no gate** on the content rule. Live code is legitimate where the
block IS the live output — a playground that prints the markup its own controls produce
cannot be a constant — and 32 of the corpus's 209 snippet blocks are of that kind, so a
gate would turn a design decision into a swath of red guides. The gate holds the marker; the constant is
an authoring rule, carried by new guides from their first commit.

`design-guides.mjs blocks snippet` returns every recipe with the heading it sits under and
what it still leaves to runtime: a literal block comes back as code, a block that is
nothing but an interpolation is reported as generated rather than served as if it were
copyable. `--brief` keeps the headings and the counts. The gate requires every
`code-block` marker to be harvested; both sides read the class as a token list, so a
modifier is free and a rename is not.

## Quality bar

- **Evidence over prose.** Any claim about library behavior needs a live test, the
  library's actual source under `node_modules`, or an upstream issue link. Measured
  values (sizes, state styles, timing) name their provenance — the theme preset file,
  the kit stylesheet, or a primary reference — as a citation of half a sentence, in the
  register defined under "Provenance, not process". No belief-based tables; equally, no
  session protocols in reader-facing text — the how-I-found-out transcript belongs in
  the commit body.
- **Fresh content only.** Never import text from other design systems or docs — consult
  primary sources (W3C APG, WCAG, vendor documentation) yourself, and annotate each
  listed source with one line on why it counts.
- **Kit-anchored.** Document this kit's real conventions — tokens, `styles.scss`
  utilities, the translation-service label pattern. Grep for them; don't guess.
- **Show, don't tell.** Live rendered examples beat static claims; do/don't pairs render
  both sides (marked by text, not color alone); give at least one interactive example
  when the component has meaningful state.
- **Say what happens on a narrow screen.** Every guide makes ONE explicit statement about
  responsive/layout behavior, in the Design tab. A reader who has to open a browser at
  360 px to find out whether a control reflows, scrolls, truncates, or does nothing has
  been handed a question, not documentation — and "nothing" is a legitimate, useful
  answer as long as it is written down.

  Not this — silence, or a claim with no boundary:

  > The toolbar adapts to smaller screens.

  This — the behavior, its breakpoint or its absence, and what the caller must do:

  > No intrinsic responsive behavior: the control keeps its intrinsic width at every
  > viewport and overflows its container below roughly 22 rem. Layout guidance: give it a
  > `min-width: 0` flex parent, or switch to the stacked variant under `48rem`.

  There is deliberately **no gate** for this. A required-section check would turn the
  guides that predate the rule red for a rule written after they shipped; the existing
  corpus picks it up when a content pass next touches them. New guides carry it from the
  first commit.
- External links carry `rel="noopener noreferrer"`.

## Provenance, not process

The quality bar demands evidence; this section fixes the register evidence may appear in.
A guide states **what holds**; the transcript of **how the author found out** belongs in
the commit body, never in the shipped page. Downstream projects inherit these guides as
their own documentation — a sentence that describes this workshop's test setup instead of
the library is noise to every reader the guide is for.

Three tests, applied to every sentence in an article tab and in the agent doc:

1. **Durability.** It describes the library, the kit's stylesheet/token layer, or a web
   standard — something that still holds after the next refactor. Statements about
   individual call sites of the host app (counts, per-file inventories, "N of M do X",
   dated "kit reality" snapshots) do not qualify: they rot faster than any review cycle
   and are meaningless downstream. State the kit **convention** instead, and name at most
   one reference implementation as a pattern pointer — without line numbers into `src/app`
   (app line numbers drift; `node_modules` citations are pinned by the stated version and
   are fine).
2. **Citation, not narrative.** Provenance is a half-sentence a reader can check: library
   version plus `file:line` into the shipped source, a preset/token name, a stylesheet
   selector, or the measurement artifact ("measured in the accessibility tree", "computed
   style, both themes"). It is never the setup: no tooling names, no host/port, no app
   routes used as test rigs, no wait times, run counts, or step-by-step session accounts.
3. **Author-independence.** If the sentence would read differently had the author learned
   the fact another way, it describes the author, not the component — cut it. This covers
   first-person process ("the first draft got this wrong", "re-measured after review"),
   reviewer anecdotes, retraction stories, and "reported, not fixed" dispositions. A guide
   is not a lab notebook and not a bug tracker: a call-site defect found while authoring
   is fixed or filed, and the guide keeps only the rule whose violation produced it.

What this explicitly does **not** relax:

- Every claim still needs its evidence (quality bar, unchanged). The evidence is trimmed
  to its citation, not removed — "Trim prose, never provenance" now reads: trim the
  *story* of the evidence, keep its *reference*.
- A surprising or method-sensitive number may keep **one** generic reproduction recipe,
  phrased as an imperative to the reader in *their* build ("verify in the browser's
  accessibility tree: the combobox name must be the label, not the current value";
  "emulate `prefers-reduced-motion` and read the computed `animation-duration`"). Two
  sentences at most; no routes, no tooling stack.
- Live examples may refer to themselves as demonstrations ("press Save to see the loading
  state"). What they may not do is serve as cited evidence for reference-table values —
  the table cites the token/source, the demo merely shows it.

The `history` footer records what changed **in the document** — one line per version,
date plus the change. Measurement journals, correction sagas, and review credits live in
the commit body of the commit the entry corresponds to.

### The version pin

Provenance has one machine-readable half. Every agent doc carries, in its frontmatter:

```
measured-against: '@openng/optimus-ui@2.0.2'
```

`<package>@<version>` — the build the guide's claims were actually read off, not the
range `package.json` declares. Read it from the lockfile (or `node_modules/<pkg>/package.json`)
and write what you measured; a guide whose line numbers came from 21.1.9 says 21.1.9 even
if the manifest says `^21.1.5`.

Rules, all three enforced by `check-design-guides.mjs`:

- **A new guide carries the field from day one.** It is in `REQUIRED_FRONTMATTER`;
  a doc without it fails the gate, and a value that is not a `<package>@<version>` pin
  fails too.
- **Re-measure against a new version, and the pin moves with the findings.** Bumping the
  pin is a claim that the guide's `file:line` citations, dead-API notes, and token values
  were re-checked against that build — so bump it in the commit that re-checks them, never
  as a sweep of its own.
- **One pin per doc**, naming the library the guide is *about*. Cross-references to other
  packages stay in the prose, where they are already cited by version.
- **A kit-only guide pins the framework.** A guide about the kit's own code — the layouts
  guides, any future guide with no library surface — has no library claim to pin, so it
  carries `@angular/core@<version>` from the lockfile instead (the build its component
  readings and template semantics were measured on). This is the layouts guides' shipped
  practice, written down as the norm.

It is worth having because "is this guide still measured against what we ship" used to
need a human reading every guide document. It is now one call:
`design-guides.mjs topics` prints the corpus-wide pin (and any split, which is the
interesting case), and `list --json` carries it per guide for a diff against `package.json`.
The field costs nothing against the byte ceiling — that is measured over the authored body,
frontmatter excluded.

### What a guide covers

Every agent doc names, in its frontmatter, the library components it explains:

```
covers: [tree, treetable, treeselect]
```

The values are **entrypoint names of the library package** (`@openng/optimus-ui/<name>`
— `badge`, `overlaybadge`, `confirmpopup`, `treetable`), lowercase, no selector prefix.
A foundations or layouts guide with no library surface carries `covers: []`. The field is
doc-only, like `tabs` and `measured-against`: the registry does not repeat it.

**Covered means explained, not mentioned.** A component is covered when the doc carries
its contract — inputs and outputs in Key API, its roles and keyboard in Accessibility,
its failure modes in Pitfalls, its bundle in Sources. A When-to-use line that routes the
reader elsewhere ("a fixed format → `p-inputmask`") covers nothing; a pointer to a tab
that holds the depth covers nothing either — the doc is the contract, and an agent that
loads only the doc must not believe it has the component's contract when it has a
signpost. In doubt, the narrow reading. Two things hang off the list, and a generous list
gets both wrong:

- **The byte ceiling.** 8,500 bytes for one component, plus 1,500 for each further one;
  the aim is 2,000 under the ceiling. A single line for every guide taxed the size of
  the subject: after the raise to 8,500 the three guides at the cap were the three
  carrying three components each (9, 11, and 52 bytes of room), and one fix had already
  paid for a blocker by deleting a sourced accessibility fact. The step is measured on
  the two-component guides that were not pressed against the cap — a sibling's share of
  Key API, Accessibility, and Pitfalls is 1.2–3.4 KB there (median 2.1), against a median
  4.3 KB for a component documented alone — so 1,500 funds one more contract at the
  density the corpus already writes siblings, not a second standalone treatment. A
  one-component guide sits exactly where it was.
- **The coverage figure.** `node scripts/design-guides.mjs coverage` counts the corpus
  against the package's own `exports` (minus the infrastructure set in
  `design-guides.mjs`) from the `covers:` lists alone, and `topics` carries the one-line
  result. It used to be resolved by hand against guide titles; the hand count was seven
  higher than the narrow reading, all seven being components a doc routes to or points
  at without explaining. **What the denominator counts** — the rule, applicable to an
  export nobody has classified yet: an entrypoint is a component when an application
  author writes it into their own template for behavior of its own, whether a widget
  element (`p-listbox`, `p-scroller`) or a directive that gives an element the author
  owns its own interaction contract (`[pKeyFilter]`, `[pAutoFocus]`, `[pFocusTrap]`,
  `[pStyleClass]`, `[pRipple]`, `[pDraggable]`). It is infrastructure when it exists so
  those components can be built and an author reaches it only through one: the base
  classes and the config/API surface, the DOM, style, and type helpers, the pass-through
  and class-binding plumbing (`[pBind]`, `[pClass]`), the projection markers those
  components read (`p-header`, `p-footer`), and the motion and overlay engines a widget
  embeds. Exporting a selector decides nothing — half the infrastructure set exports one.

The gate (`check-design-guides.mjs`, check 17) rejects a list that is missing, not a
list, empty on a `library` guide, names something the installed package does not export
or that is infrastructure (`motion`, `api`, the base classes), omits the component the
guide is named after, or claims a component another guide already claims — **one
component, one guide**; the others point at it through `related`. With the package not
installed the shape rules still run and one warning says the export check did not.

### Contrast figures are cited, never hand-measured

A contrast ratio is provenance of exactly the kind rule 2 above asks for — and the one
kind an author is most tempted to produce by hand, from a color picker or an eyedropper
on a screenshot. Do not. Every token-level ratio the kit can state is computed on each
build by `scripts/check-contrast.mjs` from the real token values in `src/styles.scss` and
`src/app/services/theme.service.ts`, and written to the compilat:

- [`docs/generated/CONTRAST.MD`](../docs/generated/CONTRAST.MD) — grouped tables, per theme
- [`docs/generated/contrast.json`](../docs/generated/contrast.json) — the same rows, machine-readable

**Quote from there.** A number typed in by hand is wrong the moment a token moves, and
wrong in silence; a number quoted from the compilat is regenerated with the tokens, and the
gate fails the build when the file goes stale. Cite it the way any other measurement is
cited — the pair and the criterion, not the tooling: *"`--text-color` on `--surface-card`
is 8.18:1 in light mode (SC 1.4.3 needs 4.5:1)"*.

Two things the compilat does **not** do, and where the honest sentence differs:

- It measures **tokens**, not rendered components. A ratio for a color pair the gate lists
  is a fact; a claim about what a specific library component renders still needs its own
  measurement in the accessibility tree or computed style, because the component may
  compose those tokens with opacity, gradients, or its own preset values.
- Some pairs **miss** their criterion today. They are not hidden: the gate declares each
  one, with a reason and a TODO, and the compilat lists them in its first table. A guide
  that touches such a pair says so and links the compilat — it does not quietly cite the
  passing neighbor instead.

## Keep this directive in lockstep

Any change to the guides framework — the tab set, the registry contract, the agent-doc
sections, the CLI, the gate — updates **this directive in the same commit**. That is the
docs-with-the-change Definition of Done from
[`base/standards/QUALITY.md`](../base/standards/QUALITY.md) applied to the framework
itself: a stale authoring guide mass-produces broken guides.
