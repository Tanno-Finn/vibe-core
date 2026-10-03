---
name: variants-brief
description: >
  From one approved text to the full set of variants — half A writes the Easy-Language
  adaptation of the primary language with a term-parity table, half B writes the translation
  brief (target variants, term sheet, style notes, deterministic checks) and stops at the human
  gate. Run it in editor mode on "mach die Varianten" / "Leichte-Sprache-Fassung" /
  "translation brief".
layer: pack
capabilitiesUsed: ["content:article", "content:glossary", "content:timeline", "file:markdown"]
---

# variants-brief — the Easy adaptation, and the brief for everything else

Your job has two halves. **A** you write yourself: the Easy-Language version of the text in its
own language. **B** you prepare for someone else: the brief that lets a translation flow start —
and it deliberately stops before that flow starts. Ask which half is wanted; the default is
both. Instructions here are English (for you, the agent); **the artifact is in the manifest
language** (German in the shipped examples).

The line between the halves is the reason the job exists: an Easy variant is an **adaptation in
the same language**, which is editorial work; a translation is a different job with a different
risk, and it does not begin without an approved term sheet.

## Step 1 — establish the target set (never hard-code four)

Read `kit.json` → `onboardingExtraQuestions` (the content-languages answer and whether Easy
variants are wanted) and `profile/USER-MANIFEST.MD` → Zone 1 (`language`, `easy_language`).
Derive the target set from those and **write it out** at the top of the artifact — "Sprachen de,
en · Easy: ja → Zielsatz de, de-easy, en, en-easy · Primärsprache de". If the answers are
missing or contradictory, ask once; do not assume a number.

Read `kit.json` → `capabilities` for the content type in hand (`content:article`,
`content:glossary`, `content:timeline`) so you know what kind of structure has to survive into
each variant; without any of them, `file:markdown` is the floor and the structure is whatever
the text has.

## Step 2 — half A: the Easy-Language adaptation

Write it as an **adaptation, not a translation and not a shortening** (`accessibility-workflow`,
plain-language rules):

- Open with a "Worum geht es hier?" sentence — the Easy reader gets the frame before the content.
- Short sentences, roughly one idea each, subject-verb-object, active voice, no double negation,
  one word per thing throughout.
- **The technical term stays** and is marked as one: "*Kondensation* ist ein Fachwort. Das
  heißt: …". Inventing a folksy stand-in is a hard error, not a simplification.
- **Add** what the standard version presupposes (background the reader is assumed to have);
  **drop** decoration and asides. Measure both against the learning goal, not against length.
- No irony, no unexplained metaphor. A metaphor that stays gets an explanation next to it.
- If `directives/languages/<code>.md` exists for the language, read it and follow it. If there
  is none, say so in one line — the generic rules then carry the work.

Then the **Paritätstabelle**: term · sentence in the original · sentence in the Easy version ·
same term? (ja/nein). Below it, two short lists: what you dropped (decoration) and what you
added (presupposed knowledge). Both make the adaptation reviewable.

## Step 3 — half B: the translation brief

You write the **brief**, not the translations. It contains:

- **Ziel-Varianten** — the set from Step 1, minus the ones that already exist.
- **Term sheet**, in the JSON shape of
  [`translation-quality`](../../../../directives/translation-quality.md): every term that must
  not drift, with its class — **C1** coined terms, **C2** the leading metaphor, **C3** technical
  terms (target-language term plus a sandwich explanation on first use), **C4** proper names and
  sources (never translated). Each entry carries the rule, a one-line definition, and where it
  occurs. `"approvedBy": ""` and `"approvedDate": ""` stay empty — filling them is the author's
  act, never yours.
- **Stilnotizen** — two to four sentences: register, the one leading metaphor, what to avoid
  (superlatives, marketing register), how the entry sentence should feel.
- **Deterministische Checks** the receiving side runs before acceptance: every file parses;
  structural parity (same sections, same number of steps and questions); character hygiene (no
  mojibake, correct quotation marks and diacritics for the language); numbers, dates, and source
  citations identical to the original.
- **Stichproben** — name two passages (typically the entry and one self-check question) to be
  read back in each target variant.

End the brief with the line that makes it a gate: **"Wartet auf Freigabe des Term-Sheets
(`approvedBy` leer). Kein Bulk vorher."**

## Step 4 — output

Save to `out/editor/<slug>.varianten.md`. Give the exact path, name the target set, and say
exactly what is blocked on what: the Easy variant is ready to review, the translations are
waiting on an approved term sheet.

## Guardrails

Before handing it over, apply the editor guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md).
Do not restate that policy here. The artifact **must** carry the **E1-B draft stamp** and the
**E2-D AI footer**. E2-B is this job's daily guardrail: "simpler, drop the term" is carried out
as *term stays plus explanation*, with the one-line note.

## Boundaries

- You **do not translate into other languages** here, and you do not start a bulk run. Which
  translation flow the kit uses is not something this pack knows — you hand over the brief.
- You do not change facts. A variant that fixes an error is two changes disguised as one: report
  the error, let the author fix the original, then adapt.
- An Easy variant that would need a fact dropped to work is a finding, not a license.
- Writing the file locally is Green; approving a term sheet is the author's act (SEC-005).
