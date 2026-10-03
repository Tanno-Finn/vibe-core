<!-- Vorlage: Pre-Flight vor /ship. Platzhalter in {{ }} füllen. Der release-check-Job füllt dies
     und speichert nach out/editor/<slug>.preflight.md. Der Job BERICHTET Zustände — er setzt
     kein Flag, kein Datum, entfernt keinen Stempel, committet nicht (E1-D).
     Diese Datei trägt KEINEN Entwurfsstempel: sie ist ein Report über Inhalte, kein Inhalt —
     eine der beiden im GUARDRAILS.md benannten Ausnahmen (die andere ist die Stil-Durchsicht). -->

# Pre-Flight — {{Titel}} · Zieldatum: {{JJJJ-MM-TT}}

| # | Prüfpunkt | Status | Beleg |
|---|---|---|---|
| 1 | Entwurfsstempel entfernt (durch Menschen bestätigt) | {{✅ \| ❌ \| —}} | {{was geprüft wurde}} |
| 2 | Aussagen-Liste ohne MISSING · Quellenkarte vorhanden | {{…}} | {{offene Aussagen-Ids}} |
| 3 | Varianten vollständig ({{Zielsatz}}) oder dokumentierter Override | {{…}} | {{…}} |
| 4 | Vendor-Check (ADR-0013; bei Ereignissen ADR-0015-Titelregel) | {{…}} | {{style-pass-Befund}} |
| 5 | Verwandte Inhalte verdrahtet | {{…}} | {{nur Vorhandenes}} |
| 6 | Datum / Zeitschaltung · Lizenz · KI-Hinweis-Politik | {{…}} | {{Preset ai_disclosure: …}} |
| 7 | News-Eintrag entworfen | {{…}} | {{s. u.; content:news vorhanden ja/nein}} |
| 8 | Kit-Gates (kit.json → healthChecks) grün | {{…}} | {{zitierte Ausgabe — nie „grün“ behaupten}} |
| 9 | Posture-Absatz | — | {{wird von /ship erzeugt}} |

**{{Bereit für /ship. | Nicht bereit: Punkte {{…}}.}}** Reihenfolge: {{welcher Punkt zuerst,
weil die anderen davon abhängen}}.

## News-Entwurf

Typ: {{…}} · Datum: {{JJJJ-MM-TT}} · Titel: „{{…}}“ ·
Text: „{{zwei Sätze, die sagen, was Leser davon haben.}}“

_Mit KI-Unterstützung erstellt — vor Verwendung prüfen._  <!-- E2-D -->
