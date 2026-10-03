<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/teacher/examples/README.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 412ac7fa052f655d52c64797482569660a1d24d41d95ab1a1c93d69fcf860e15
-->

**English:** [This page in English](README.md)

# `teacher`-Pack — durchgearbeitete Beispiele (Belege aus Probeläufen)

Jeder der fünf Teacher-Jobs wurde **einmal ausgeführt**, immer mit derselben erfundenen, sauber
bereinigten Eingabe — [`_input-wasserkreislauf.md`](./_input-wasserkreislauf.md), einem
allgemeinen naturwissenschaftlichen Schultext über den Wasserkreislauf, der stellvertretend für
einen `content:article` steht. Die Artefakte unten sind das **tatsächliche Ergebnis**, das jeder Job
erzeugt, damit ein Prüfer (oder eine Lehrkraft, die überlegt, ob sie das Pack nutzen will) das
Echte sieht statt eines Versprechens.

| Job | Ergebnis | Pfad | Dargestellt als |
|---|---|---|---|
| `worksheet` | Arbeitsblatt + Lösungen | [`worksheet-wasserkreislauf.html`](./worksheet-wasserkreislauf.html) | A4-HTML (`file:html-print`, print.css eingebettet) |
| `practice-quiz` | Übungsquiz + Lösungsschlüssel | [`practice-quiz-wasserkreislauf.html`](./practice-quiz-wasserkreislauf.html) | A4-HTML |
| `cover-lesson` | Vertretungsstunde (2 Blätter) | [`cover-lesson-wasserkreislauf.html`](./cover-lesson-wasserkreislauf.html) | A4-HTML |
| `differentiation` | Drei Ebenen + Scaffolds | [`differentiation-wasserkreislauf.md`](./differentiation-wasserkreislauf.md) | Markdown (`file:markdown`) |
| `teaching-unit` | 5-Stunden-Reihe | [`teaching-unit-wasserkreislauf.md`](./teaching-unit-wasserkreislauf.md) | Markdown |

**So siehst du dir die HTML-Handouts an:** Öffne die `.html`-Datei in einem beliebigen Browser und
drucke sie (Strg/Cmd + P). Jede ist eine einzelne, in sich geschlossene Datei — das
Druck-Stylesheet ist eingebettet, also funktioniert sie offline, ohne externe Dateien. Arbeitsblatt,
Quiz und Vertretungsstunde setzen ihren Lösungsschlüssel bzw. ihr zweites Blatt hinter einen
Seitenumbruch, damit der Teil für die Schüler allein gedruckt werden kann.

**Hinweis zur Bereinigung:** Das Thema und alle Texte sind erfundenes Allgemeinwissen (der
Wasserkreislauf) — kein echter Lehrplan, kein Schulbuch, keine Schülerdaten, keine Markennamen. Das
sind Vorführungen, kein für den Unterricht freigegebenes Material; ein echtes Handout durchläuft
vor dem Einsatz trotzdem die Guardrails des Teacher-Packs.
