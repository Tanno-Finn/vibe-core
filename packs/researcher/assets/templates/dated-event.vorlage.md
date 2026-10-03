<!-- Vorlage: Ereignis mit Datierungsbeleg. Platzhalter in {{ }} füllen. Der dated-event-Job
     füllt dies und speichert nach out/researcher/<slug>.ereignis.md.
     OHNE Belegsatz kein Datum (R1-B): date bleibt leer oder gröber, datingEvidence sagt, was
     fehlt, und das Ereignis wird nicht an einen Kit-Builder übergeben.
     Titel ohne Vendor/Produktnamen (ADR-0015). -->

# Ereignis — {{Kurzbeschreibung}}

Recherche-Stand {{JJJJ-MM-TT}} — Konfidenz siehe Zusammenfassung

date: {{JJJJ-MM-TT | JJJJ-MM | JJJJ | — (kein Belegsatz)}} · Granularität: {{Tag | Monat | Jahr}}
Warum nicht feiner: {{was in der Quelle nicht lesbar war}}
title: {{vendorfreier Titel — er wandert allein durch Listen und Suche}}
description: {{zwei bis drei Sätze: was passiert ist und warum der Moment zählt. Keine
Superlative, kein Ranking.}}
details: {{optional, je Punkt mit Quelle}}
people: [{{…}}] · organizations: [{{…}}]
sources: [{{Ids aus dem generischen Block, mindestens eine Primärquelle}}]
datingEvidence: {{„wörtlicher Satz oder Feld, das das Datum trägt“ — Quelle, abgerufen
JJJJ-MM-TT | — (fehlt: …)}}
Art des Datums: {{Erscheinungsdatum | Einreichdatum | Bandjahr | Datum des Ereignisses selbst}}
Kreuzreferenzen: {{zwei bis drei unabhängige Quellen; Abweichungen → conflict-log}}

Übergabe: {{`content:timeline` deklariert und Belegsatz vorhanden → Übergabe angeboten. |
Kein Belegsatz → keine Übergabe, das Ereignis bleibt hier (R1-B).}}

## Konfidenz-Zusammenfassung

Konfidenz insgesamt: {{[verified] | [likely] | [unverified]}}. Gelesen wurde für diesen
Datensatz: {{welche Quellen — oder „nichts“}}. Belegt ist: {{…}}. Kandidatenangaben (nicht von
der Quelle): {{…}}.

_Mit KI-Unterstützung recherchiert — Belege vor Verwendung prüfen._
