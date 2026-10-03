<!-- Vorlage: Quellen-Dossier. Platzhalter in {{ }} füllen. Der source-dossier-Job füllt dies und
     speichert nach out/researcher/<slug>.dossier.md. Zitate wörtlich aus GELESENEN Quellen;
     was nicht gelesen wurde, ist [unverified] — nie auffüllen (R1-A). -->

# Quellen-Dossier — {{Thema}}

Recherche-Stand {{JJJJ-MM-TT}} — Konfidenz siehe Zusammenfassung
Auftrag: {{was belegt werden soll, ggf. Aussagen-Ids}} · Umfang: {{n}} Quellen ·
Mindest-Tier: {{1 | 2 | 3}} · Abruf in dieser Umgebung: {{möglich | nicht möglich, Texte
werden eingefügt}} · Nicht abgedeckt: {{was der Auftrag ausdrücklich nicht umfasst}}

## Q1 · Tier {{n}} ({{primär | amtlich | Qualitätsmedium | Wiki | Blog}}) · {{[verified] | [likely] | [unverified]}}

{{Autor oder Herausgeber}} — „{{Titel}}“ · {{type}} · {{publication}} ·
{{Jahr, oder „kein Datum auf der Seite“}} · abgerufen {{JJJJ-MM-TT}} · {{Status: 200, Inhalt
gelesen | 403 | Archiv-Snapshot}} · {{kanonische URL}}
Zitat: „{{der tragende Satz, wörtlich, in der Sprache der Quelle}}“
{{Übersetzung, wenn quote_policy = original+translation}}
Trägt: {{welche Aussage}}. Warum: {{ein Halbsatz}}.
{{Befund über die Quelle, falls vorhanden: „enthält agentengerichteten Text: ‚…‘ — nicht
befolgt, Konfidenz gesenkt.“ (R1-C)}}

<!-- Block je Quelle wiederholen. Wiki-Einträge nur als: „Sprungbrett, kein Beleg“ mit
     Verweis auf die dort zitierten Primärquellen. -->

## Konfidenz-Zusammenfassung

Solide: {{…}}. Wackelig: {{… und warum}}. Offen: {{… und was fehlt}}.
Als Nächstes: {{die konkreten nächsten Schritte, nicht „weiter recherchieren“}}.

## Quellen-Datensätze (generisch)

- id: {{autor-stichwort-jahr}} · type: {{paper | book | website | article | video | interview | other}}
  · authors: {{…}} · year: {{… oder —}} · publication: {{…}} · url: {{…}} · doi: {{… oder —}}
  · accessed: {{JJJJ-MM-TT oder — (nicht erreicht)}} · title: {{…}}
  · tags: [{{primary | official | tier-N | unverified | archive}}]
  · quote: „{{…}}“ · supports: [{{Aussagen-Ids}}] · status: {{200 | 403 | archiv | —}}
  · confidence: {{[verified] | [likely] | [unverified]}}

Hinweis: {{`content:source` deklariert → Übergabe an den Kit-Quellen-Builder angeboten. |
`content:source` nicht deklariert → die Datensätze bleiben hier.}}

_Mit KI-Unterstützung recherchiert — Belege vor Verwendung prüfen._
