<!-- Vorlage: Varianten (Easy-Adaption + Übersetzungs-Brief). Platzhalter in {{ }} füllen.
     Der variants-brief-Job füllt dies und speichert nach out/editor/<slug>.varianten.md.
     Der Zielsatz wird aus kit.json + Manifest abgeleitet — nie hart „vier“ annehmen. -->

**Entwurf, ungeprüft**  <!-- E1-B -->

# Varianten — {{Titel}}

Kit-Konfiguration (kit.json → onboardingExtraQuestions, Manifest): Sprachen {{…}} ·
Easy-Variante: {{ja | nein}} → Zielsatz: {{…}}. Primärsprache: {{…}}.

## A · Leichte Sprache ({{Sprachcode}})

Worum geht es hier? {{Ein Satz, der den Rahmen setzt.}}

{{Die Adaption: kurze Sätze, ein Gedanke je Satz, aktiv, keine doppelte Verneinung.
Fachbegriff bleibt und wird als Fachwort eingeführt: „X ist ein Fachwort. Das heißt: …“}}

Paritätstabelle:

| Begriff | Original | Easy | gleich? |
|---|---|---|---|
| {{Begriff}} | „{{Satz aus dem Original}}“ | „{{Satz in Easy}}“ | {{ja | nein, weil …}} |

Gestrichen (Dekoration): {{…}}
Ergänzt (vorausgesetztes Wissen): {{…}}
Sprach-Guide: {{`directives/languages/<code>.md` konsultiert | kein Sprach-Guide vorhanden,
generische Regeln angewendet}}

## B · Übersetzungs-Brief ({{Ziel-Varianten}})

Term-Sheet (JSON, Direktive translation-quality):

```json
{ "approvedBy": "", "approvedDate": "",
  "styleNotes": "{{Register, Leitmetapher, was zu vermeiden ist — zwei bis vier Sätze.}}",
  "terms": [
    { "term": "{{…}}", "class": "{{C1 | C2 | C3 | C4}}", "rule": "{{…}}", "definition": "{{…}}", "occursIn": ["{{…}}"] }
  ] }
```

Deterministische Checks vor der Abnahme: {{Parse jeder Datei · Struktur-Parität (gleiche
Abschnitte, gleiche Anzahl Schritte/Fragen) · Zeichenhygiene · Zahlen, Daten und Quellen
identisch}}
Stichprobe: {{zwei Passagen, die je Zielvariante gegengelesen werden}}

**Wartet auf Freigabe des Term-Sheets (`approvedBy` leer). Kein Bulk vorher.**

_Mit KI-Unterstützung erstellt — vor Verwendung prüfen._  <!-- E2-D -->
