<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/teacher/pilot/README.md
canonical: de
mirror-lang: en
status: TRANSLATED
source-sha256: 1e6c152dd6cc4ac9fbb4b3a551a9879a1e011ab583a2fca3b4be97520749a997
-->

**Deutsch:** [Diese Seite auf Deutsch](README.md)

# Pilot kit — trying out the teacher pack with teachers

The teacher pack has **not yet been tried with teachers**. The five jobs, the templates, the
examples, and the guardrails are design work; nobody knows whether a job, in a teacher's real
preparation situation, produces material that the teacher would use **as it is**. This folder
holds everything a small pilot needs for finding out — the kit owner organizes the teachers
and the date themselves.

| File | What it is for | Who fills it in | When |
|---|---|---|---|
| [`LEITFADEN.en.md`](./LEITFADEN.en.md) | Moderation guide for a 60–90-minute session with 2–3 teachers | the moderator reads it and prepares | before the session |
| [`EINWILLIGUNG.en.md`](./EINWILLIGUNG.en.md) | Participant information and consent | every teacher, once | at the start, before anything else |
| [`FRAGEBOGEN-VORHER.en.md`](./FRAGEBOGEN-VORHER.en.md) | The teacher's starting point, in 5 minutes | every teacher | at the start |
| [`BEOBACHTUNGSBOGEN.en.md`](./BEOBACHTUNGSBOGEN.en.md) | What the observer records while the jobs run | the observer, one sheet per teacher | during the session |
| [`FRAGEBOGEN-NACHHER.en.md`](./FRAGEBOGEN-NACHHER.en.md) | The teacher's verdict, in 10 minutes | every teacher | at the end |
| [`AUSWERTUNG.en.md`](./AUSWERTUNG.en.md) | How 2–3 sessions become findings, a backlog, and one evidence-backed statement | the owner | after the last session |

**Languages.** The German version is authoritative. Beside each file sits its English
translation as `*.en.md` (for example, [`LEITFADEN.en.md`](./LEITFADEN.en.md)); a check in
the kit reports as soon as a translation falls behind the German version.

**Printing.** All sheets are Markdown and can be output as A4 with the pack's print stylesheet
([`../assets/print.css`](../assets/print.css)): convert the Markdown to HTML, embed the
stylesheet in a `<style>` element, and put the content inside an element with the class
`sheet` — exactly the way the jobs build their handouts. The writing fields are laid out as
lines, so the sheets also work when filled in by hand.

**What the kit does not do.** It does not schedule dates, does not choose teachers, and does
not replace legal advice on consent. What the owner has to fill in before the first session is
listed at the start of the moderation guide.

**What happens afterward.** Once the evaluation exists, the sentence "not tried with teachers"
in the kit README ("Status" section) and in the pack README ("Erprobung" section) is
**replaced** — not deleted — by the evidence-backed wording from
[`AUSWERTUNG.en.md`](./AUSWERTUNG.en.md) §5. Until then, it stays.
