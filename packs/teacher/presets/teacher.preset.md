<!-- pack -->
# Teacher profile preset

An **activatable preset** for the `teacher` pack. When a user activates teacher mode (or asks
for it during `/onboarding`), the agent adopts these fields into the user's
`profile/USER-MANIFEST.MD` so every teacher job (`worksheet`, `practice-quiz`, `differentiation`,
`cover-lesson`, `teaching-unit`) already knows the class it's writing for and stops re-asking.

**How it's adopted.** The preset is a *proposal*, not a rewrite. The agent:

1. Sets Zone-1 `role: teacher`; keeps the `language` chosen during onboarding (the pack's examples are German, but any language works).
2. Adds a **`teaching:` block to Zone 1** with the five teacher fields below — asking one
   question at a time, offering the example answers, always allowing **"skip"** (same style as
   `/onboarding`). Blanks stay blank; nothing is invented.
3. Leaves the manifest gitignored (it describes a person — PRIV-001); never commits it.

The teacher jobs read this block the same way the base skills read Zone 1: as defaults, not as a
form to re-fill each turn.

## Zone 1 — `teaching:` block to add

```yaml
role: teacher              # sets the base role field

teaching:
  subject: ""              # e.g. "Biologie", "Deutsch", "Sachunterricht", "Mathematik"
  grade_band: ""           # e.g. "Klasse 3–4", "Sek I (5–10)", "Oberstufe (11–13)"
  school_type: ""          # e.g. "Grundschule", "Realschule", "Gymnasium", "Gesamtschule", "BBS"
  class_size: ""           # e.g. "28" — sizes copies & group tasks (a number or "unknown")
  language_level: standard # standard | simplified — writing level for pupil-facing material
```

### Field notes (for the agent asking the questions)

- **subject** — drives vocabulary and task types. If a teacher covers several subjects, record
  the primary one here and note the rest in Zone 2.
- **grade_band** — the single biggest lever on difficulty and sentence length. Prefer a band over
  a single grade.
- **school_type** — shifts register and expectations; optional, skippable.
- **class_size** — lets the jobs mention copy counts and size group work; a rough number is fine.
- **language_level** — `simplified` makes every pupil-facing sheet follow Easy-Language rules
  (one idea per sentence, concrete verbs, no nested clauses). If the manifest already has
  `easy_language: true`, default this to `simplified` and confirm.

> These are defaults the teacher can override per job at any time ("this one's for a stronger
> group"). The preset removes repeated questions; it never locks the teacher in.
