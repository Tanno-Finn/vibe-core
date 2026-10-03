<!-- pack -->
# Researcher profile preset

An **activatable preset** for the `researcher` pack. When a user activates researcher mode (or
asks for it during `/onboarding`), the agent adopts these fields into the user's
`profile/USER-MANIFEST.MD` so every researcher job (`source-dossier`, `claim-check`,
`reading-map`, `dated-event`, `conflict-log`) already knows the field, the evidence bar, and the
languages it searches in, and stops re-asking.

**How it's adopted.** The preset is a *proposal*, not a rewrite. The agent:

1. Sets Zone-1 `role: researcher`; keeps the `language` chosen during onboarding (the pack's
   examples are German, but any language works).
2. Adds a **`research:` block to Zone 1** with the six fields below — asking one question at a
   time, offering the example answers, always allowing **"skip"** (same style as
   `/onboarding`). Blanks stay blank; nothing is invented.
3. Leaves the manifest gitignored (it describes a person — PRIV-001); never commits it.

The researcher jobs read this block the same way the base skills read Zone 1: as defaults, not
as a form to re-fill each turn.

## Zone 1 — `research:` block to add

```yaml
role: researcher           # sets the base role field

research:
  domain: ""               # e.g. "Hydrologie", "Wissenschaftsgeschichte", "Arbeitsrecht"
  min_tier: 2              # 1 | 2 | 3 — the weakest source that still counts as evidence
  source_languages: ""     # e.g. "de, en" — the languages searched in
  quote_policy: original   # original | original+translation — how quotes appear in the artifact
  can_fetch: ""            # empty = the agent establishes it per session; "no" = always ask for text
  archive_fallback: true   # allow an archive snapshot when no live URL survives
```

### Field notes (for the agent asking the questions)

- **domain** — decides which sources are primary at all. A primary source is a paper in one
  field, a statute in another, a register entry in a third; without the field, "tier 1" is
  guesswork.
- **min_tier** — the weakest source that may carry a claim, in the tiers of
  [`content-integrity`](../../../directives/content-integrity.md) (1 primary, 2 official,
  3 quality media, 4 wiki = springboard only, 5 blog/social = never evidence). `2` is a sane
  default. Setting `1` does not make weaker sources invisible — they are still listed, marked,
  with the note from R2-A.
- **source_languages** — a claim is often only evidenced in the language it was published in.
  Naming two or three languages widens the search honestly; it does not license machine
  translation of a quote (see `quote_policy`).
- **quote_policy** — `original` keeps the carrying sentence in the source's language, which is
  the only form that can be checked. `original+translation` adds a translation *beside* it,
  never instead of it.
- **can_fetch** — leave empty and let each session establish it; the jobs say what they found.
  `no` is for environments where the agent has no network at all: the jobs then ask for pasted
  text or PDFs from the first message instead of discovering it halfway through.
- **archive_fallback** — whether an archive snapshot may stand in for a dead link. `true` is
  usual; the artifact always marks a snapshot as one, and an archived page never silently
  becomes the canonical URL.

> These are defaults the researcher can override per job at any time ("for this one, primary
> sources only"). The preset removes repeated questions; it never locks the researcher in.
