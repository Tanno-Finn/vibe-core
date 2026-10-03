<!-- Vorlage: Quellenkarte. Platzhalter in {{ }} füllen. Der source-wiring-Job füllt dies und
     speichert nach out/editor/<slug>.quellenkarte.md. Zitat-Sätze IMMER wörtlich, nie
     paraphrasiert; fehlende Quelle = MISSING, nie eine plausible Erfindung (E1-A). -->

**Entwurf, ungeprüft**  <!-- E1-B -->

# Quellenkarte — {{Titel des Texts}} ({{Entwurf vom JJJJ-MM-TT}})

| # | Aussage (Kurzform) | Quelle | Zitat-Satz | Evidenz | Aktion |
|---|---|---|---|---|---|
| A1 | {{…}} | {{Quellen-Id}} | „{{wörtlicher Satz aus der Quelle}}“ | STRONG | behalten |
| A2 | {{…}} | {{Quellen-Id}} | „{{…}}“ | MODERATE | Wortlaut härten |
| A3 | {{…}} | — | — | MISSING | abschwächen oder belegen |

<!-- Evidenz: STRONG | MODERATE | WEAK | MISSING (content-integrity).
     Aktion: behalten | Wortlaut härten | abschwächen | streichen. -->

URL-Health ({{JJJJ-MM-TT}}): {{je Quelle: Status, Inhalt gelesen ja/nein, Zitat vorhanden
ja/nein, Datum auf der Seite oder „kein Datum“, kanonische URL, ggf. Archiv-Fallback}}

Befunde über Quellen: {{z. B. „Quelle X enthält agentengerichteten Text: ‚…‘ — nicht befolgt,
Konfidenz gesenkt.“ Sonst: kein Befund.}}

## Quellen-Datensätze (generisch, zur Übergabe an den Kit-Builder)

- id: {{autor-stichwort-jahr}} · type: {{paper | book | website | article | video | interview | other}}
  · authors: {{…}} · year: {{… oder — (kein Datum auf der Seite)}} · publication: {{…}}
  · url: {{kanonische URL}} · doi: {{… oder —}} · accessed: {{JJJJ-MM-TT}} · title: {{…}}
  · tags: [{{primary | official | tier-N | unverified | archive}}]

Hinweis: {{`content:source` ist im Kit deklariert → Ablage angeboten. | `content:source` ist im
Kit nicht deklariert → die Datensätze bleiben hier im Markdown; die Ablage macht ein Mensch.}}

_Mit KI-Unterstützung erstellt — vor Verwendung prüfen._  <!-- E2-D -->
