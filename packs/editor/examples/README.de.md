<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/editor/examples/README.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 3931e22a9a01f609b0b396091c232bdd9ad6939fa6228fbf41e103915ab47018
-->

**English:** [This page in English](README.md)

# `editor`-Pack — durchgearbeitete Beispiele

Jeder der sechs Editor-Jobs wurde **einmal ausgeführt**, immer mit derselben Eingabe —
[`_input-wasserkreislauf.md`](./_input-wasserkreislauf.md): dem erfundenen naturwissenschaftlichen Schultext über den
Wasserkreislauf, den auch das Teacher-Pack nutzt, plus den zwei Quellen, die ein Autor vielleicht
mitbringt. Die Artefakte unten sind das **tatsächliche Ergebnis**, das jeder Job erzeugt, damit ein
Prüfer (oder ein Autor, der überlegt, ob er das Pack nutzen will) das Echte sieht statt eines
Versprechens.

Weil das sechs Glieder einer Kette sind, bauen sie aufeinander auf: Die Aussagen-Liste des
Entwurfs ist das, was die Quellenkarte verknüpft, und die Lücken der Quellenkarte sind das, was der
Pre-Flight als offen meldet.

| Job | Ergebnis | Pfad |
|---|---|---|
| `article-draft` | Entwurf in didaktischer Anatomie + Aussagen-Liste A1–A7 | [`wasserkreislauf.entwurf.md`](./wasserkreislauf.entwurf.md) |
| `glossary-entry` | Glossar-Eintrag „Kondensation“ + Leichte-Sprache-Fassung + Paritätszeile | [`glossar-kondensation.md`](./glossar-kondensation.md) |
| `source-wiring` | Quellenkarte A1–A7 + generische Quellen-Datensätze | [`wasserkreislauf.quellenkarte.md`](./wasserkreislauf.quellenkarte.md) |
| `style-pass` | Vier Befunde im Feedback-File-Format + Protokoll-Tabelle | [`wasserkreislauf.review.md`](./wasserkreislauf.review.md) |
| `variants-brief` | de-easy-Adaption mit Paritätstabelle + Übersetzungs-Brief mit Term-Sheet | [`wasserkreislauf.varianten.md`](./wasserkreislauf.varianten.md) |
| `release-check` | Pre-Flight mit neun Punkten + News-Entwurf (ohne Entwurfsstempel — Report, kein Inhalt) | [`wasserkreislauf.preflight.md`](./wasserkreislauf.preflight.md) |

## Was die Beispiele absichtlich zeigen

**Zwei echte Quellen und überall sonst ehrliche Lücken.** Die zwei zitierten Sätze stammen von
Seiten, die am 2026-09-05 abgerufen und gelesen wurden — der Water Science School des U.S.
Geological Survey und der Seite „Precipitation Education“ der NASA, beide wörtlich zitiert, beide
mit dem Abrufdatum als einziger verlässlicher Datierung, weil keine der beiden Seiten ein Datum
trägt. Alles, was die zwei Sätze *nicht* tragen (A5, A6, A7 — die letzte aus einem Satz
herausgelöst, der sonst als belegt durchgegangen wäre — und die allgemeine physikalische
Definition der Kondensation), ist mit `[Quelle fehlt]` oder MISSING markiert, zusammen mit dem
Kandidaten, der die Lücke schließen würde. Das ist Guardrail E1-A in Aktion: Das Pack liefert
lieber ein sichtbares Loch aus als ein erfundenes Zitat.

**Ein roter Pre-Flight.** `wasserkreislauf.preflight.md` sagt bei drei von neun Punkten „nicht
bereit“. Das ist der Job, der funktioniert, nicht der Job, der scheitert — er meldet Zustände, er
schafft sie nicht. Ein Pre-Flight, der immer grün zurückkäme, wäre wertlos.

**Ein Review, das nicht umschreibt.** `wasserkreislauf.review.md` schlägt Ersetzungen innerhalb
der Befunde vor und lässt eine leere Protokoll-Tabelle für die Entscheidungen des Autors. Seine
Befunde sind im Entwurf *mit Absicht* nicht behoben — die abweichende Benennung zwischen dem Text
(„Rückfluss“) und der Aussagen-Liste („Abfluss“) ist immer noch da: Die Kette wird mit ihren
offenen Enden gezeigt, so wie eine echte Redaktionswoche aussieht.

**Hinweis zur Bereinigung:** Das Thema und alle Lehrtexte sind von Grund auf neu geschrieben —
kein Lehrplan, keine Schulbuchpassage, keine echten Personen, keine Produktnamen. Die zwei
zitierten Quellen sind echt und öffentlich; nichts anderes in diesen Dateien wird als Beleg
ausgegeben. Das sind Vorführungen, keine veröffentlichten Inhalte: Jedes Artefakt trägt noch
seinen Entwurfsstempel, außer den zwei Report-Artefakten — dem Review und dem Pre-Flight —, die
die Guardrails bewusst davon ausnehmen.
