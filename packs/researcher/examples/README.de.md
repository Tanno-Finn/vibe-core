<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/researcher/examples/README.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: dc49850db844de95ca1153d9dfb4bf3a84f24dbcfcf43d701760ba556b8a5624
-->

**English:** [This page in English](README.md)

# `researcher`-Pack — durchgearbeitete Beispiele

Jeder der fünf Researcher-Jobs wurde **einmal ausgeführt**, immer mit derselben Eingabe —
[`_input-aussagen-wasserkreislauf.md`](./_input-aussagen-wasserkreislauf.md), der Aussagen-Liste
`A1 … A7` genau so, wie sie von der Redaktionsseite ankommt (aus dem durchgearbeiteten Beispiel
des Editor-Packs,
[`packs/editor/examples/wasserkreislauf.entwurf.md`](../../editor/examples/wasserkreislauf.entwurf.md)).
Die Artefakte unten sind das **tatsächliche Ergebnis**, das jeder Job erzeugt, damit ein Prüfer das
Echte sieht statt eines Versprechens — einschließlich der Stellen, an denen die Recherche leer
zurückkam.

| Job | Ergebnis | Pfad |
|---|---|---|
| `source-dossier` | Fünf Quellen mit Tier, Provenienz, Zitatsatz, Abrufstatus + generische Datensätze | [`wasserkreislauf.dossier.md`](./wasserkreislauf.dossier.md) |
| `claim-check` | Verdikt je Aussage A1–A7 + Konfidenz-Zusammenfassung | [`wasserkreislauf.claimcheck.md`](./wasserkreislauf.claimcheck.md) |
| `reading-map` | Einstieg, Vertiefung, Primärquellen — mit der Notiz, welche Titel gelesen sind | [`wasserkreislauf.lesekarte.md`](./wasserkreislauf.lesekarte.md) |
| `dated-event` | Ereignisdatensatz **ohne** Datum, weil der Belegsatz fehlt | [`halley-verdunstung.ereignis.md`](./halley-verdunstung.ereignis.md) |
| `conflict-log` | Positionstabelle 1686 gegen 1687, Einordnung als Inferenz, Formulierungsvorschlag | [`halley-datum.widerspruch.md`](./halley-datum.widerspruch.md) |

## Was die Beispiele absichtlich zeigen

**Zwei Quellen gelesen, zwei nicht.** Die Seiten von USGS und NASA wurden am 2026-09-05 abgerufen
und gelesen und werden wörtlich zitiert, mit dem Abrufdatum als einziger verlässlicher Datierung,
weil keine der beiden Seiten ein Datum trägt. Die zwei historischen Primärquellen — Halleys
Abschätzung der Verdunstung und Perraults Buch über den Ursprung der Quellen — waren **nicht**
erreichbar: Die DOI löst auf, aber die Verlagsseite antwortete mit 403, und die Katalogoberfläche
der Bibliothek ebenfalls. Sie bleiben `[unverified]`, ihre Titel und Jahre sind als aus
Erwähnungen in Sekundärquellen stammend markiert statt aus den Quellen selbst, und das Dossier sagt,
was jede Lücke schließen würde. Diese vier Zeilen sind die eigentliche Lektion des Packs; ein
Dossier ohne sie würde das Gegenteil von dem lehren, was es zu lehren behauptet.

**Eine Aussage, die stimmte und trotzdem unbelegt war.** A7 („die Wärme der Sonne treibt die
Verdunstung an“) fuhr auf der Redaktionsseite im Satz von A2 mit, bis sie herausgelöst wurde. Das
NASA-Zitat sagt, dass Wasser verdunstet und aufsteigt; es sagt nicht, was das antreibt.
`claim-check` hält MISSING fest — für eine Aussage, die niemand bezweifelt. Das ist das
Nützlichste, was dieses Pack tut, und das Beispiel gibt es, um zu zeigen, wie es passiert, statt es
zu beschreiben.

**Ein Ereignis ohne Datum.** `halley-verdunstung.ereignis.md` lässt `date` leer und verweigert die
Übergabe an den Timeline-Builder, obwohl dieses Kit `content:timeline` deklariert und obwohl
„1687“ völlig plausibel aussähe. Kein Belegsatz, kein Datum (R1-B) — der Datensatz sagt genau, was
fehlt und was es liefern würde.

**Ein Widerspruch protokolliert, nicht entschieden — und ehrlich darüber, wie dünn er ist.** Die
Abweichung 1686/1687 bekommt eine Positionstabelle mit *zwei Zeilen und durchweg leerer
Zitatspalte*, weil für sie keine einzige Quelle gelesen wurde: Verglichen werden eine
DOI-Zeichenkette, die beobachtet wurde, und ein Jahr, das mit der Anfrage hereinkam. Keine der
beiden Zeilen bekommt ein Tier, denn ein Tier bewertet ein Dokument, und es gibt keins. Eine
ausdrücklich mit `Inference:` eingeleitete Einordnung zu Jahrgangsangaben von Bänden, ein
empfohlener Wortlaut und eine Liste dessen, was den Widerspruch klären würde, vervollständigen das
Protokoll. Die verlockende Fassung dieser Datei — „Lehrbücher nennen 1687“ als Zeile zum
Gegenabgleich — wird im Protokoll als das benannt, was sie nicht ist.

**Eine Quelle entfernt, statt sie für den Anschein zu behalten.** Der Platz Q5 im Dossier ist ein
gestrichener Lexikoneintrag: Er wäre ein legitimes Sprungbrett gewesen, aber in diesem Durchgang
hat ihn niemand geöffnet, also steht er nicht als Quelle da. Die Nummer bleibt als sichtbare Lücke.

**Zwei gelesene Quellen von fünf Namen auf der Seite.** Dieses Verhältnis ist das ehrliche
Ergebnis eines Recherchedurchgangs, und die Artefakte sagen das in ihren
Konfidenz-Zusammenfassungen, statt es zu vergraben.

**Hinweis zur Bereinigung:** keine echten Personen außer den historischen Autoren, die in ihrer
bibliografischen Rolle genannt werden, keine Daten von Schülern oder Kunden, keine Produktnamen.
Zwei zitierte Quellen sind echt und öffentlich; nichts anderes in diesen Dateien wird als Beleg
ausgegeben.
