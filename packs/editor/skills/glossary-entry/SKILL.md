---
name: glossary-entry
description: >
  Write one glossary entry — term, alternative names, a non-circular definition, a concrete
  example, related terms, sources — together with its Easy-Language twin and a parity line
  proving the term survived the simplification. Run it in editor mode on "Glossar-Eintrag für
  X" / "define X for the glossary" / "what does X mean, for the glossary".
layer: pack
capabilitiesUsed: ["content:glossary", "file:markdown"]
---

# glossary-entry — one term, two reading levels, one parity line

Your job: a glossary entry that a reader who met the term two minutes ago can use, and an
Easy-Language version of it that still contains the term. Instructions here are English (for
you, the agent); **the entry itself is in the manifest language** (German in the shipped
examples).

An entry is small, which is exactly why it goes wrong: circular definitions, an example that
repeats the definition, and an Easy version that quietly drops the word it was supposed to
explain.

## Step 1 — know the term and the audience

Read `profile/USER-MANIFEST.MD` → Zone 1 and, if an editor preset is active,
[`../../presets/editor.preset.md`](../../presets/editor.preset.md) for **subject, audience,
register, minimum source tier**. Ask only for the term itself and — if the term has several
meanings — which field's meaning is wanted. One question, not a form.

## Step 2 — see what the kit already has (kit-blind)

Read `kit.json` → `capabilities`:

- **`content:glossary` present** → check whether the term (or a near-synonym) already exists.
  If it does, say so and offer to improve that entry instead of creating a duplicate. Look up
  the neighboring terms so *Verwandt* points at things that really exist.
- **Absent** → `file:markdown`: the entry is a markdown file, and *Verwandt* lists terms as
  candidates, marked "not in the glossary yet".

## Step 3 — write the entry

Fill [`../../assets/templates/glossary-entry.vorlage.md`](../../assets/templates/glossary-entry.vorlage.md):

- **Begriff** — the term as a reader will meet it.
- **Alternativnamen / Abkürzungen** — spellings, common abbreviations, the English term if the
  field uses it. Nothing invented; leave it empty if there are none.
- **Definition** — two to four sentences. The **first sentence names the genus and the
  distinguishing feature** ("Kondensation ist der Übergang eines Stoffs vom gasförmigen in den
  flüssigen Zustand") and must not use the term to define itself. Later sentences may add where
  it occurs or what it contrasts with.
- **Beispiel** — one concrete, everyday, synthetic case that a reader can picture; it must add
  something the definition did not already say.
- **Verwandt** — two to five neighboring terms, marked as existing or as candidates.
- **Quellen** — at least one source at the preset's minimum tier, in the generic bibliographic
  block, **or** an explicit `[Quelle fehlt]` with the candidate you would look for. Common
  textbook knowledge is allowed to carry a gap marker — but it says so, it does not pretend.

## Step 4 — the Easy-Language twin and the parity line

Write the Easy variant as an **adaptation, not a shortening** (`accessibility-workflow`, plain-
language rules):

- The **term stays** and is introduced as one: "*Kondensation* ist ein Fachwort. Das heißt: …".
  Replacing it with a folksy stand-in is a hard error (`translation-quality`, term preservation).
- Short sentences, one idea each, active voice, no double negation, one word per thing.
- Add what the standard version presupposes; drop decoration, never content.
- Give the same example, in easy words.

Then the **parity line**: `Begriff "<Term>" in beiden Fassungen identisch — ja/nein`. If it is
*nein*, that is a finding, not a style choice: say why and offer the fix. Where an alternative
name is used in one version only, note it there too.

## Step 5 — output

Save to `out/editor/glossar-<slug>.md`. Give the exact path, say which capability path you took,
and name what is still open (usually the source). If the kit declares `content:glossary`, offer
the handover to the kit's own glossary builder — **do not place the file yourself**.

## Guardrails

Before handing it over, apply the editor guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md).
Do not restate that policy here. The entry **must** carry the **E1-B draft stamp** and the
**E2-D AI footer**. E2-B is the one that bites in this job: a request to "make it simpler and
drop the technical word" is carried out as *term stays plus explanation*, with the one-line note.

## Boundaries

- This job writes **one entry**, not an article and not a foreign-language version.
- It does not coin new terms: naming something the field has not named is the author's call
  (a C1 decision in `translation-quality`), and you say so rather than deciding it.
- No invented sources, ever (E1-A). A gap marker is a complete answer.
- Writing the file locally is Green; placing it into the kit is not this job's business.
