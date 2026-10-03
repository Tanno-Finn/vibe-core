<!-- pack -->
# Editor profile preset

An **activatable preset** for the `editor` pack. When a user activates editor mode (or asks for
it during `/onboarding`), the agent adopts these fields into the user's
`profile/USER-MANIFEST.MD` so every editor job (`article-draft`, `glossary-entry`,
`source-wiring`, `style-pass`, `variants-brief`, `release-check`) already knows the subject, the
audience, and the register it is writing for, and stops re-asking.

**How it's adopted.** The preset is a *proposal*, not a rewrite. The agent:

1. Sets Zone-1 `role: editor`; keeps the `language` chosen during onboarding (the pack's
   examples are German, but any language works).
2. Adds an **`editorial:` block to Zone 1** with the six fields below — asking one question at a
   time, offering the example answers, always allowing **"skip"** (same style as
   `/onboarding`). Blanks stay blank; nothing is invented.
3. Leaves the manifest gitignored (it describes a person — PRIV-001); never commits it.

The editor jobs read this block the same way the base skills read Zone 1: as defaults, not as a
form to re-fill each turn.

## Zone 1 — `editorial:` block to add

```yaml
role: editor               # sets the base role field

editorial:
  subject: ""              # e.g. "Geographie", "Ernährungslehre", "Rechtskunde" — the portal's subject
  audience: ""             # e.g. "Sek I", "Berufsschule", "interessierte Erwachsene"
  register: du             # du | Sie — how the teaching text addresses the reader
  min_source_tier: 2       # 1 | 2 | 3 — the weakest source that still counts as evidence
  ai_disclosure: drafts    # drafts | published — where the AI note appears
  content_languages: ""    # empty = take it from kit.json / onboarding
```

### Field notes (for the agent asking the questions)

- **subject** — drives vocabulary, the kind of sources that count, and which confusions are
  worth a *Vergleich* section. If the portal covers several subjects, record the main one and
  note the rest in Zone 2.
- **audience** — the single biggest lever on sentence length, presupposed knowledge, and how far
  a self-check question may reach. A band ("Sek I") beats a single year.
- **register** — `du` or `Sie`, once, for all teaching text. `style-pass` check 7 reports every
  drift against this field, so setting it wrong is worse than leaving it blank.
- **min_source_tier** — the weakest source that may carry a claim, in the tiers of
  [`content-integrity`](../../../directives/content-integrity.md) (1 primary, 2 official,
  3 quality media, 4 wiki = springboard only, 5 blog/social = never evidence). `2` is a sane
  default for an educational portal; `1` makes the researcher role's work mandatory.
- **ai_disclosure** — `drafts` (the default): the AI footer travels on the artifacts the pack
  produces, and published reader-facing text carries whatever the owner decides elsewhere.
  `published`: the owner wants a reader-facing note on published content too, and
  `release-check` asks for it as point 6. The pack never invents this policy — it records it.
- **content_languages** — leave empty unless the portal ships in a different set than the kit
  was set up with. `variants-brief` derives the target set from `kit.json` and the manifest, and
  it never hard-codes a number.

> These are defaults the author can override per job at any time ("this one is for a lay
> audience"). The preset removes repeated questions; it never locks the author in.
