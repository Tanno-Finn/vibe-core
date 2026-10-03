<!-- pack -->
**Deutsch:** [Diese Seite auf Deutsch](README.de.md)

# `teacher` pack — worked examples (dry-run proofs)

Each of the five teacher jobs was **run once** on the same fictional, scrub-clean input —
[`_input-wasserkreislauf.md`](./_input-wasserkreislauf.md), a generic school-science text on the
water cycle that stands in for a `content:article`. The artifacts below are the **actual output**
each job produces, so a reviewer (or a teacher deciding whether to use the pack) can see the real
thing rather than a promise.

| Job | Output | Path | Rendered as |
|---|---|---|---|
| `worksheet` | Arbeitsblatt + Lösungen | [`worksheet-wasserkreislauf.html`](./worksheet-wasserkreislauf.html) | A4 HTML (`file:html-print`, print.css inlined) |
| `practice-quiz` | Übungsquiz + Lösungsschlüssel | [`practice-quiz-wasserkreislauf.html`](./practice-quiz-wasserkreislauf.html) | A4 HTML |
| `cover-lesson` | Vertretungsstunde (2 Blätter) | [`cover-lesson-wasserkreislauf.html`](./cover-lesson-wasserkreislauf.html) | A4 HTML |
| `differentiation` | Drei Ebenen + Scaffolds | [`differentiation-wasserkreislauf.md`](./differentiation-wasserkreislauf.md) | Markdown (`file:markdown`) |
| `teaching-unit` | 5-Stunden-Reihe | [`teaching-unit-wasserkreislauf.md`](./teaching-unit-wasserkreislauf.md) | Markdown |

**How to view the HTML handouts:** open the `.html` file in any browser and print (Strg/Cmd + P).
Each is a single self-contained file — the print stylesheet is inlined, so it works offline with
no external asset. The worksheet, quiz, and cover-lesson put their answer key / second sheet after
a page break so the pupil-facing part can be printed alone.

**Scrub note:** the topic and all text are invented general knowledge (the water cycle) — no real
curriculum, textbook, pupil data, or brand names. These are demonstrations, not classroom-approved
material; a real handout still passes the teacher guardrails before use.
