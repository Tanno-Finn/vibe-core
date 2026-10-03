<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/teacher/pilot/LEITFADEN.md
canonical: de
mirror-lang: en
status: TRANSLATED
source-sha256: 5d3b3f815b691b619656ff4aa05b1d3a933d7eea5bedb0f19eeac876b3941ee6
-->

> English translation of [`LEITFADEN.md`](LEITFADEN.md). The German version is authoritative — in the pilot sessions, use the German original.

# Moderation guide — trying out the teacher pack

One session of 60–90 minutes with 2–3 teachers. The guide is written for the moderator; the
observer works in parallel with the
[`BEOBACHTUNGSBOGEN.en.md`](./BEOBACHTUNGSBOGEN.en.md) (observation sheet).

---

## 0 · Fill in before the session (owner)

| Field | Entry |
|---|---|
| Appointment (date, time, place) | |
| Teacher 1 (code, subject, grade level) | |
| Teacher 2 (code, subject, grade level) | |
| Teacher 3 (code, subject, grade level) — optional | |
| Moderator | |
| Observer | |
| Computer with a running AI coding agent and the teacher pack activated | ☐ tested on: |
| Printer reachable (for printing a handout during the session) | ☐ yes ☐ no |
| The code key (name → L1/L2/L3) is held **only by the moderator**, not on the sheets | ☐ |

The teachers are asked for one thing in advance: **to bring a topic they will actually teach
in the next two weeks** — along with whatever they would have on the desk for it anyway (their
own notes, a text in their own words). Not the water cycle, not a textbook chapter word for
word, no class list.

---

## 1 · Goal of the pilot

The question is **not** "do you like it?". The question is:

> Does a job, in the teacher's preparation situation, produce material that the teacher would
> take into their lesson **as it is** — and where do they step in before they would?

Everything the session delivers serves this one question: usability per job, the teacher's
interventions and their reasons, the points where they get stuck. On top of that come three
checkpoints for the pack's guardrails (draft stamp, AI footer, student data), which are asked
about in the after-session questionnaire.

What the session is **not**: not a training, not a product demo, not a sales pitch. If a
teacher says at the end "I wouldn't use this," that is a full-fledged result.

---

## 2 · Roles

**Moderator.** Leads through the schedule, keeps time, sets the tasks, stays silent while the
teachers work. Is the only person who knows which name belongs to which code.

**Observer.** Sits diagonally behind the working teacher, keeps one observation sheet per
teacher, and notes times, follow-up questions, sticking points, and verbatim quotes. Does not
speak during the work phases.

**Teachers.** Work at the computer one after another (one teacher operates it; the others
watch and may take notes, but may not help). Whoever is not at the computer is observing too —
how the onlookers react is part of the material.

If there is only one person on the kit side, that person takes both roles and keeps a reduced
observation sheet (times and quotes only). That is weaker, but more honest than no
observation at all.

---

## 3 · What the moderator does NOT do

- **Don't explain.** No up-front tutorial, no introduction to jobs, templates, or guardrails.
  The teacher gets the sentence "Tell the agent you want to switch to teacher mode, and then
  tell it what you need" — nothing more. Anything they don't understand after that is a
  finding.
- **Don't help.** If the teacher asks "how do I say that?", the moderator answers: "Say it
  the way you would say it to a colleague." If they get stuck, the moderator waits. Only after
  3 minutes of standstill may the moderator give a hint — and the observer notes that a hint
  was needed.
- **Don't defend.** Criticism is written down, not answered. "That's too long" is a finding,
  not a reason to discuss. The sentence "well, you can always adjust that" is never said.
- **Don't judge.** No praise for "good" prompts, no frown at "bad" ones.
- **Don't type.** The teacher operates the computer themselves. Exception: a technical fault
  that has nothing to do with the pack.

---

## 4 · Schedule (times for 90 minutes; the values in parentheses for 60 minutes)

| Time | Phase | What happens |
|---|---|---|
| 0:00–0:05 | Welcome, consent | The purpose in two sentences (§1, first paragraph). Have [`EINWILLIGUNG.en.md`](./EINWILLIGUNG.en.md) read and signed. Recording only if it is checked there. |
| 0:05–0:10 | Before-session questionnaire | Every teacher fills in [`FRAGEBOGEN-VORHER.en.md`](./FRAGEBOGEN-VORHER.en.md). In silence. |
| 0:10–0:15 | Getting started | The moderator says the one sentence (§3). The first teacher sits down at the computer and names their topic out loud. The observer starts the clock. |
| 0:15–0:35 (0:15–0:30) | **Job 1: worksheet** | Task A (§5). The observer takes notes. Print the result if a printer is available — paper changes the verdict. |
| 0:35–0:50 (0:30–0:42) | **Job 2: differentiation** | Task B. The second teacher takes over the computer and works with **their own** topic. |
| 0:50–0:55 | Break | No debriefing during the break — the observer writes, the moderator stays silent. |
| 0:55–1:10 (0:42–0:52) | **Job 3: cover lesson** | Task C. The third teacher (or the first one again). |
| 1:10–1:20 | Only if time remains: practice quiz, teaching unit | Task D/E. With 60 minutes, this is dropped without replacement. |
| 1:20–1:30 (0:52–1:00) | After-session questionnaire, closing round | Fill in [`FRAGEBOGEN-NACHHER.en.md`](./FRAGEBOGEN-NACHHER.en.md) in silence. Then one round: "One sentence — what are you taking away?" Note it verbatim. |

**Why this order.** The worksheet first, because it is the job with the most concrete,
printable result — that is where it shows fastest whether the teacher engages with the
material. Differentiation second, because it forces the teacher to put their own level of
challenge into words; this is where it becomes visible whether the pack fits their class or a
generic one. The cover lesson third, because it is the hardest test: the material has to work
without the teacher. The quiz and the teaching unit are derived from the first three and yield
less insight per minute when time is short.

**Switching the teacher for each job** is intentional: three topics, three preparation
routines, three ways of talking to the agent. Whoever isn't operating the computer observes
along — and in the after-session questionnaire is asked to rate the jobs they only watched,
too (marked as such).

---

## 5 · Tasks

The tasks are **read aloud, not handed out** — the teacher should have to translate them into
their own words, just as they would alone at their desk. Every task refers to the topic the
teacher brought.

**A — Worksheet (job `worksheet`).**
"Your topic is coming up in your next lesson. Have the agent make you a worksheet you would
hand out tomorrow. When you're done, tell me whether you would hand it out like this — and
what you would still change first."

The moderator's follow-up question after the result (once, neutrally): "Would you photocopy
this as it is now?" Have the answer noted verbatim (observer).

**B — Differentiation (job `differentiation`).**
"Take a task you set in this unit anyway. Have the agent build an easier and a more
challenging version of it — for the students you have in mind for it. Without names."

Follow-up question: "Does the easier version fit the kids you were thinking of?"

**C — Cover lesson (job `cover-lesson`).**
"Imagine you're out tomorrow. Have the agent build a lesson that a colleague from a
different subject can teach with the sheet in hand. Then read the cover-lesson sheet as if
you were that colleague."

Follow-up question: "What would the colleague still need to ask you first?"

**D — Practice quiz (job `practice-quiz`), only if there is time.**
"Have the agent make you ten questions on the topic, mixed types, with answers."

**E — Teaching unit (job `teaching-unit`), only if there is time.**
"Have the agent outline a sequence of four lessons on the topic."

**Do not prescribe:** wording toward the agent, class size, school type, language level.
What the agent asks on its own and what the teacher says unprompted is part of the material.

---

## 6 · Stop criteria

The session is **ended** (not interrupted) if any of the following happens:

1. **Student data on the table.** A teacher starts entering real names, grades, or
   learning-support notes, and the agent does **not** stop. End the session, delete the
   input, record the incident on the observation sheet — this is the most serious finding the
   pilot can produce. If the agent stops, the session continues; that moment is recorded as
   well (after-session questionnaire, question 12).
2. **Technical standstill** for more than 10 minutes (the agent doesn't respond, the computer
   is frozen) that cannot be fixed with one quick action.
3. **Withdrawal of consent** by a teacher. Their sheets are destroyed in front of them; the
   session can continue with the others if they want to.

The session is **interrupted and shortened** (one job fewer) if a job has no result after 25
minutes. That is not a failure of the session — it is a measurement.

---

## 7 · Follow-up (on the same day)

1. **Save the generated materials.** Copy all output from `out/teacher/` into one folder per
   session (`pilot-<date>/L1/`, `L2/`, `L3/`). Look through it first: no name, no class, no
   school in the text. Where something does appear, black it out.
2. **Scan or type up the sheets**; the originals stay with the owner. Codes stay codes.
3. **Write two paragraphs** before the sheets are evaluated: What was the surprise of the day?
   What should the moderator have announced differently? This is the only place where the
   moderator's opinion may enter the material — and it is marked as such.
4. **Note deviations from the guide** (times, skipped jobs, hints given). A session that
   deviated from the plan can only be evaluated if the deviation is documented.
5. Only after the **last** session: [`AUSWERTUNG.en.md`](./AUSWERTUNG.en.md).

---

## 8 · What this pilot does not show

Two to three teachers on one day are a **pilot**, not a study. It shows whether the pack
roughly works in real hands and where it breaks. It does not show whether it would be used in
everyday school life over weeks, whether other subjects or school types react differently, or
how results are distributed between teachers with and without AI experience. The evaluation
therefore states what is backed by evidence — and nothing beyond that.
