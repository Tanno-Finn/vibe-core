<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/teacher/pilot/AUSWERTUNG.md
canonical: de
mirror-lang: en
status: TRANSLATED
source-sha256: dcaaa36792ddb368876827b962993200aa342e758eeb4be91f21622e39681a67
-->

> English translation of [`AUSWERTUNG.md`](AUSWERTUNG.md). The German version is authoritative — for the pilot's evaluation, use the German original.

# Evaluation — template

Two to three sessions become findings, the findings become backlog entries for the pack, and
the whole becomes **one** evidence-backed sentence that replaces the current caveat "not tried
with teachers". The template is filled in after the **last** session; until then there is no
interim evaluation, so that later sessions are not shaped by earlier interpretations.

Rule for every statement here: **a number with its source** (which sheet, which code, which
question) or no number at all. With 2–3 teachers, percentages are not allowed — you count
("2 of 3"), you don't calculate.

**Sessions:** ______ (dates) · **Teachers:** ______ (codes) · **Filled in on:** ______

---

## 1 · What data there is

Before anything is interpreted: what is there, what is missing?

| Source | L1 | L2 | L3 | Remark |
|---|---|---|---|---|
| Consent (checks: evaluation / publication / materials / audio) | | | | |
| Before-session questionnaire | ☐ | ☐ | ☐ | |
| Observation sheet, jobs covered | | | | |
| After-session questionnaire | ☐ | ☐ | ☐ | |
| Generated materials saved (folder) | | | | |
| Deviations from the guide | | | | |

If a source is missing, the corresponding cell in §2 is entered as **"—"**, never estimated.

---

## 2 · Usability — job × teacher

From the after-session questionnaire, Part A. **s** = operated themselves (self), **o** =
observed. The number is the 1–5 scale; next to it, the core of the reasoning in five words.

| Job | L1 | L2 | L3 | Range | Pattern in the reasoning |
|---|---|---|---|---|---|
| Worksheet | (s/o) __ | (s/o) __ | (s/o) __ | | |
| Differentiation | (s/o) __ | (s/o) __ | (s/o) __ | | |
| Cover lesson | (s/o) __ | (s/o) __ | (s/o) __ | | |
| Practice quiz | (s/o) __ | (s/o) __ | (s/o) __ | | |
| Teaching unit | (s/o) __ | (s/o) __ | (s/o) __ | | |

How to read it: a job rated 4–5 by everyone who operated it **themselves** is "usable with
minor changes". A job with a 1 or 2 from a teacher who operated it themselves is **not**
usable — even if the others rate it higher; the reasoning decides whether the pack or the
topic was the cause. Ratings from teachers who only observed count as a hint, not as evidence.

**Time to a usable result** (observation sheet, per job, operated themselves only):

| Job | L1 | L2 | L3 | Questions agent → L | Corrections L → agent | Moderator hints |
|---|---|---|---|---|---|---|
| Worksheet | | | | | | |
| Differentiation | | | | | | |
| Cover lesson | | | | | | |

Comparison with the estimate from the before-session questionnaire (question 3) and the
self-assessment afterward (question 7): do the three numbers for each teacher point in the
same direction? Where they don't, write down why here — not which one is "right".

_______________________________________________________________________
_______________________________________________________________________

---

## 3 · Patterns in the interventions

From the observation sheet ("Interventions in the result") and the after-session
questionnaire ("What would you have changed"). Assign each change to a category; a category
that occurs with **at least two** teachers is a pattern. A single mention remains a single
mention and is listed as such.

| Category | Example (verbatim, code) | Occurs with | Pattern? |
|---|---|---|---|
| Language level (too hard / too easy for the grade level) | | | ☐ |
| Length (too long / too short for one lesson) | | | ☐ |
| Task type (not what the teacher sets) | | | ☐ |
| Subject accuracy (errors, skewed terms) | | | ☐ |
| Tone / form of address toward children | | | ☐ |
| Layout / printing (space to write, page breaks) | | | ☐ |
| Missing connection to the class (the pack didn't know the class) | | | ☐ |
| Guardrails (stamp, footer got in the way or were missing) | | | ☐ |
| Other: | | | ☐ |

**Sticking points** (observation sheet): where did at least two teachers get stuck at the same
point — when entering teacher mode, when phrasing the task, at a question from the agent,
when opening the result?

_______________________________________________________________________
_______________________________________________________________________

---

## 4 · Guardrails — the three checkpoints

From the after-session questionnaire, Part C, and the observation sheet.

| Checkpoint | L1 | L2 | L3 | Finding (counted) |
|---|---|---|---|---|
| Draft stamp noticed (question 10) | | | | __ of __ noticed; __ of __ understood it as a reminder to check |
| AI footer understood (question 11: addressee + purpose right?) | | | | __ of __ right; left on the class sheet: __ of __ |
| Student-data moment (question 12 + observation) | | | | Moments: __; of these, agent stopped: __; **did not stop: __** |

A single case of "entered, agent did not stop" is a **Tier-1 finding** and goes into the
backlog (§6) ahead of everything else — regardless of how usability turned out.

---

## 5 · The evidence-backed statement

From §2 and §4 comes **one** sentence that **replaces** the line "Teacher pack — not yet
piloted" in the kit README ("Status" section, English and German mirror) and the "Erprobung"
paragraph in the pack README. Wherever the missing pilot is listed as a fact outside the kit
(for example, in a fact table for launch texts), the same sentence is entered. The sentence
states only what was counted.

Building blocks — pick one depending on the result and fill it in with the real numbers:

- **If all self-operated jobs scored 4–5:**
  "Piloted with __ teachers (__ sessions, __): __ of __ self-operated jobs were rated usable
  with minor changes or none; the student-data rule held in __ of __ cases."
- **If mixed:**
  "Piloted with __ teachers (__): __ of __ rated the worksheet usable, the cover lesson __ of
  __; the most frequent intervention was __. Open: __."
- **If a Tier-1 case occurred:**
  "Piloted with __ teachers (__). In __ case(s), the agent did not stop at student data; the
  error is in the backlog as __. Usability: __."

Not allowed: "well received", "positive feedback", "works", percentages when n ≤ 3, and any
wording that generalizes beyond the number of teachers.

**Chosen sentence (German):**

_______________________________________________________________________
_______________________________________________________________________

**English version for the README and launch copy:**

_______________________________________________________________________
_______________________________________________________________________

Where it has to go, in one commit: kit `README.md` §Status · `docs/de/README.md` (mirror,
update the hash) · `packs/teacher/README.md` §Erprobung · `CHANGELOG.md` Unreleased ·
`JOURNAL.md`. Outside the kit: the fact table of the launch texts, if it still lists the
missing pilot.

---

## 6 · Backlog entries for the pack

Every pattern from §3 and every checkpoint finding from §4 becomes an entry. Order: Tier-1
first, then patterns by the number of teachers affected, then single mentions as "observed,
not prioritized".

| # | Finding (with source) | Concerns | Proposal | Priority |
|---|---|---|---|---|
| 1 | | ☐ Job: ____ ☐ GUARDRAILS ☐ Template ☐ Preset ☐ print.css | | ☐ Tier-1 ☐ Pattern ☐ Single |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

What becomes of an entry — a fix to the pack, a new question in the preset, a change to the
template — is decided by the owner. The evaluation proposes; it does not decide.

---

## 7 · What the pilot could not show

Mandatory section. Subjects, grade levels, and school types that were not represented; jobs
that nobody operated themselves; whether the pack would be used over weeks. Nothing that
stands here may be claimed in §5.

_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________

---

## 8 · Another pilot?

Only if §5 produced a sentence with "open: __" or §6 has a Tier-1 entry: what would have to
change in the pack, and with whom would the next session make sense? Otherwise the section
stays empty — a second round is not an end in itself.

_______________________________________________________________________
_______________________________________________________________________
