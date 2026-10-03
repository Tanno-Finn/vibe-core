<!-- base -->
# accessibility-workflow — directive

How to **audit and fix** accessibility across a whole app, and how to write the
simplified-language path. The [A11Y base standard](../base/standards/A11Y.md) sets the
*bar* — the seven rules A11Y-001..A11Y-007 and their gate. This directive is the *method*
that reaches that bar: a checklist to catch issues, a three-phase pipeline to audit at
scale, a fix catalog keyed by failure type, and the plain-language rules behind
A11Y-005. It does **not** restate the standard's rules — it references them by ID. For
proving a fix actually holds in a real run see [verification](verification.md); for the
content quality of the simplified path see [content-integrity](content-integrity.md).

## The WCAG checklist

Framework-neutral, per surface (page, view, component, interactive widget). This is the
manual pass — automated tools (below) catch maybe half of what matters; the rest is here.

**Semantic structure**
- Native elements do native jobs: a control that acts is a `button`, a control that
  navigates is a link, a list is a list, headings nest without skipping a level.
- One top-level `main`, one `header`, one `footer`; landmarks are not nested inside each
  other; all visible content sits inside some landmark.

**Keyboard** (A11Y-001)
- Every interactive element is reachable by Tab and activatable by Enter/Space.
- Tab order follows reading order. Nothing is a focus trap — Escape always gets you out of
  a dialog or menu.
- Custom and canvas widgets expose a keyboard path, not just a pointer one (A11Y-003).

**Focus**
- A visible focus indicator on every interactive element; it is never removed without an
  equal or better replacement, and it holds up in every theme.

**Names & roles** (A11Y-002)
- Icon-only controls, image links, and form inputs each have an accessible name.
- No redundant ARIA on elements whose native role already says it; no `aria-hidden` on
  anything focusable.
- The accessible name contains the visible label text (a mismatch breaks voice control).

**Perception** (A11Y-004, A11Y-006)
- Text and essential UI meet AA contrast; check it in *every* theme, not just the default.
- No meaning carried by color alone — pair it with text, icon, or shape.

**Motion & media** (A11Y-007)
- `prefers-reduced-motion` is respected; no essential information lives only in motion.
- No autoplaying audio/video; media is user-controlled.

## Anti-pattern catalog

The failures that recur most. Each maps to a standard rule and a fix strategy below.

| Anti-pattern | Why it fails | Rule |
|---|---|---|
| Clickable `div`/`span` with a click handler | No role, no keyboard, no name | A11Y-001 |
| Icon-only button with no label | Screen reader announces nothing | A11Y-002 |
| Placeholder used *as* the label | Vanishes on input; not a name | A11Y-002 |
| `outline: none` with no replacement | Keyboard users lose their place | A11Y-001 |
| Color is the only error/status signal | Color-blind users miss it | A11Y-006 |
| Contrast tuned for light mode only | Fails the moment the theme flips | A11Y-004 |
| Interactive canvas reachable only by mouse | Excludes keyboard & AT users | A11Y-003 |
| Animation with no reduced-motion fallback | Can cause nausea; may hide info | A11Y-007 |
| Skipped heading level, or `div` soup | No structure for AT to navigate | — |
| Same visible label on many buttons | "Button" x12, indistinguishable | A11Y-002 |
| Duplicate `id` in the DOM | Breaks label/`describedby` wiring | — |
| Autoplaying media | Disrupts and distracts | A11Y-007 |

## The three-phase audit pipeline

For auditing a whole app rather than one component. The shape is always the same:
**scan wide with several tools → consolidate into one deduplicated list → fix in parallel
packages.** Do it whenever a large surface has drifted, or before a release that touches
many pages.

### Phase 1 — Scan

Run **more than one** automated accessibility tool over **all** routes against a running
build. Different engines catch different things — a rule-based DOM checker, a full-page
auditing tool, and an HTML-sniffer-style checker overlap only partly, and the union is far
stronger than any one alone. Enumerate routes from the data that drives them (the content
index, the route table) rather than a hand-kept list, so nothing is silently skipped.
Write raw per-route, per-tool output to a scratch/ignored directory — this is evidence, not
a deliverable.

> Automated tools are a floor, not a ceiling. A clean scan is *necessary*, never
> *sufficient* — the manual checklist still runs. Do not name specific vendor tools as a
> requirement; pick the strongest few available and say which you used.

The kit's own gate, `npm run check:a11y` (see [A11Y](../base/standards/A11Y.md)), is one
engine over a fixed sample of routes, run on every change. It is the floor under this
sweep, not a substitute for it.

### Phase 2 — Consolidate

Raw output is noisy and triple-counted. Normalize every tool's format into one finding
shape — `{ rule, severity, route, selector, snippet, sources[] }` — then:

- **Deduplicate** on `route + normalised-selector + rule`. Strip framework-injected
  attributes from the selector first, or the "same" issue looks unique on every page. On a
  collision keep the highest severity and merge the source-tool list.
- **Detect shared components.** The same selector+rule on many routes is *one* fix in a
  shared component, not N fixes — flag it once so it isn't worked N times.
- **Rank by severity** (critical > serious > moderate > minor) so the worst goes first.

The output is one consolidated list plus a human-readable summary.

### Phase 3 — Fix in parallel packages

Split the consolidated findings into balanced work packages — grouped by feature area, sized
by effort (weight the count by severity, not raw issue count) — and hand each to its own
worker. See [orchestration](orchestration.md) for how to fan workers out and back in, and
[multi-agent-git](multi-agent-git.md) for the commit discipline that keeps parallel workers
from clobbering each other (stage only your own files; never `git add -A`).

Each worker: reads its package → fixes or documents each finding → runs the manual checklist
for its routes → commits only its own files → reports and stops. When all are done,
**re-scan and compare** — the drop in findings is the proof the pass worked
([verification](verification.md)).

## Fix-strategy catalog

Keyed by failure type. The through-line: **semantic HTML first, ARIA only when structure
can't carry the meaning**, and the smallest change that resolves the finding
([QUAL-006](../base/standards/QUALITY.md)) — don't refactor around it.

| Failure | Strategy |
|---|---|
| **Missing accessible name** (button, input, image link) | Add a real `label`, or an `aria-label`/`aria-labelledby`. In a loop, build the name from context so each is unique ("Open <item title>"), not a bare repeated word. |
| **Clickable non-interactive element** | Replace with a `button` or link. If it must stay a generic element, it needs a role, `tabindex="0"`, and key handlers — but replacement is almost always better. |
| **No / removed focus indicator** | Provide a visible `:focus-visible` style using a theme variable; never leave `outline: none` without a replacement. |
| **Broken focus order / trap** | Fix source order to match reading order; give dialogs a focus trap that Escape releases and that returns focus to the opener. |
| **Contrast failure** | Fix the token, not the pixel — the theme layer should own contrast. The classic dark-mode trap: a tinted background paired with same-scale foreground passes in light mode and fails in dark because the color scale doesn't invert. Use a **semantic pair** (a surface token + an on-surface token whose values are mode-aware) instead of two raw scale steps. Verify in *both* themes with screenshots (the kit's `check:screenshot` tool takes them, see [kit-tools](kit-tools.md)). |
| **Color-only meaning** | Add a non-color cue: text, an icon (marked decorative), or a shape/pattern. |
| **Canvas / custom widget, no keyboard path** | Give it a keyboard cursor or focusable proxies, an ARIA role, and a live region that announces state changes. A visual-only demo is a broken demo for AT users (A11Y-003). |
| **Reduced-motion ignored** | Gate non-essential animation behind `prefers-reduced-motion: reduce`; provide a still fallback that carries any information the motion conveyed (A11Y-007). |
| **Focusable element inside `aria-hidden`** | Remove the `aria-hidden`, or take the child out of the tab order (`tabindex="-1"`). |
| **ARIA on the wrong element / not allowed for role** | Add the role the attribute needs, or drop the attribute. Containers that aren't widgets usually need no label at all. |
| **Nested interactive elements** | Un-nest — pull the inner control out, or make the inner element non-interactive. |
| **Skipped heading level** | Renumber so levels don't jump; if a component owns its heading level, make it a parameter. |
| **Landmark errors** | One top-level `main`/`header`/`footer`; don't nest landmarks; wrap orphaned content in the right landmark (`nav`, `aside`, or a labeled `section`). |
| **Duplicate `id`** | Make ids unique (suffix with an index or entity id) so `for`/`aria-describedby` wiring resolves. |
| **Label / accessible-name mismatch** | Align the accessible name to the visible text, or drop the override when visible text already suffices. |
| **Redundant ARIA** | Delete it. A `button` doesn't need `role="button"`; a labeled control doesn't need a duplicate `aria-label`. |
| **Third-party component limitation** | If the barrier is inside a component you can't edit, fix what you can from the host side and **document the residual as a known limitation** in the commit — don't hide it.

## Plain / simplified-language rules

A11Y-005 asks for a **simplified-language path** for primary content. This is how to write
it. Simplified language reaches readers with reading difficulties, non-native speakers, and
anyone under stress — a meaningful slice of any audience.

**It's an adaptation, not a translation.** The author decides what to add and what to cut,
measured against the learning goal — not the sentence list of the original. Add prerequisite
knowledge the original assumed; cut decoration, asides, and fun facts that raise cognitive
load. See [content-integrity](content-integrity.md) for keeping that adaptation faithful,
and [translation-quality](translation-quality.md) for carrying it into other languages.

**The core rules** (the ones with the strongest evidence behind them):
- One idea per sentence; short sentences (a working target is ~8–12 words).
- Subject–verb–object; no nested or fronted clauses. **Stacking several hard structures in
  one sentence is the real comprehension killer** — more than any single structure.
- Everyday words; explain a technical term the moment it first appears (keep the term —
  don't dumb the content down to inaccuracy).
- Say what *is*, not what *isn't* — never double-negate.
- Same word for the same thing every time; don't elegant-variation your terminology.
- Numbers as digits.
- Start each content type with a one-line "what is this" so the reader has context.
- Address and tone: consistent throughout, literal (the audience reads literally — avoid
  irony and unexplained metaphor).

**Don't over-apply folk rules.** Field evidence shows several classic prohibitions are weak
in isolation — a plain passive, a simple negation, a genitive, an ordinary subordinate
clause are each fine when the sentence around them is otherwise clear. Ban them only when
they *stack*. Optimize for the reader's understanding, not for a rule checklist.

**On standards and labels.** National plain-language norms exist and are useful reference
material — cite one only as a marked example (e.g. the German DIN plain-language standard),
never as a rule that binds every project; don't frame the practice as one country's. And do
**not** claim a certified plain-language seal or user-panel validation you didn't actually
run — call the path "simplified" / "plain" language and let it stand on its own.

**Where the bar comes from — the reference standards.** When someone asks "says who?",
these are the primary anchors (each language guide adds its local pendant, see
[language-guide-authoring](language-guide-authoring.md) §8):

| Standard | What it is | How it binds |
|---|---|---|
| [ISO 24495-1](https://www.iso.org/standard/78907.html) | International plain-language principles (relevance, findability, understandability, usability) | The umbrella; national norms concretize it |
| [WCAG 2.2 SC 3.1.5](https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html) *Reading Level* | Asks for a simpler alternative when text exceeds lower-secondary reading level | **AAA** — a simplified path is a voluntary excellence feature, not a legal minimum |
| WCAG 2.2 SC 3.1.1 / 3.1.2 (`lang` attributes) | Page and passage language must be programmatically set | **AA — mandatory.** Correct `lang` per variant and per foreign passage is not optional |
| National norms (marked examples) | e.g. for German: DIN 8581-1 *Einfache Sprache* (full norm, ~B1, no user-panel duty) and DIN SPEC 33429 *Leichte Sprache* (recommendations incl. user panels); public-sector web rules may add binding variants | Reference material — binding only where local law says so (typically public-sector bodies) |

Honest-citation caveats: sentence-length figures circulating for these norms vary by
edition and are often not primary-sourced — state your own working target (the ~8–12 words
above) as *yours*, don't attribute it to a norm you haven't verified. The kit's simplified
path is the "simpler alternative" in the SC 3.1.5 sense; A11Y-005 makes it a kit standard
precisely *because* no law will force it.
