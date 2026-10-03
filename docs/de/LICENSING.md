<!-- TRANSLATION-MIRROR
source: LICENSING.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 670679546137e2999c4c8e0392abbd35bd3dd8b9fb6f77c7343ba84a6a19713a
-->

**English:** [This page in English](../../LICENSING.md)

# Lizenzen

Dieses Projekt steht unter zwei Lizenzen: Der Code und die Inhalte, die es mitliefert, tragen
unterschiedliche Lizenzen, weil sie unterschiedliche Arten von Werken sind.

## Quellcode: MIT

Der gesamte Quellcode (die Angular-Anwendung, die Build- und Werkzeug-Scripts, die Skills und
Hooks des Agenten und die Konfiguration) steht unter der **MIT-Lizenz**. Siehe
[`LICENSE`](../../LICENSE). Kurz gesagt: Nutz ihn, ändere ihn, liefere ihn aus, kommerziell
oder nicht, solange du den Urheberrechtsvermerk beibehältst.

## Inhalte, Dokumentation und Texte: CC BY 4.0

Die geschriebenen Inhalte (die Dokumentation unter `docs/`, die Directives und Standards, alle
Beispielartikel, Glossareinträge oder Lehrtexte, die mit dem Kit ausgeliefert werden) stehen
unter der Lizenz **Creative Commons Namensnennung 4.0 International** (**CC BY 4.0**):
<https://creativecommons.org/licenses/by/4.0/>. Kurz gesagt: Verwende sie weiter und bearbeite
sie, auch kommerziell, solange du die Quelle nennst, auf die Lizenz verlinkst und angibst, ob
du etwas geändert hast. Es gibt keine Share-Alike-Bedingung: Eine Bearbeitung darf unter
beliebigen Bedingungen veröffentlicht werden, die dem Bearbeiter passen, solange die
Namensnennung erhalten bleibt und das übernommene CC-BY-Material nicht selbst zusätzlichen
Einschränkungen unterworfen wird. Warum, steht in
[ADR-0012](../adr/0012-content-license-cc-by-not-sa.md).

## Was wofür gilt

| Wenn es … ist | Lizenz |
|---|---|
| Code, Scripts, Konfiguration, Skills, Hooks | MIT |
| Dokumentation, Directives, Texte, Beispiel-Lehrinhalte | CC BY 4.0 |
| Bilder, Illustrationen, Icons und andere visuelle Assets, die für das Kit erstellt wurden | CC BY 4.0 |
| Inhalts- und Übersetzungsdaten unter `src/assets` (i18n, data): Dateien in Code-Form, die Text enthalten | CC BY 4.0 |
| Mitgelieferte Schriften | SIL Open Font License 1.1 (siehe [`docs/THIRD-PARTY-FONTS.md`](../THIRD-PARTY-FONTS.md); der Lizenztext wird mit dem Build als `assets/fonts/LICENSES.txt` ausgeliefert) |

Ist die Art einer Datei nicht eindeutig, gilt der genauere Hinweis in der Datei oder neben ihr.
Gibt es keinen Hinweis, stehen codeartige Dateien unter MIT und textartige Dateien unter
CC BY 4.0.

### Ein Hinweis zu den Flaggenbildern

Die Flaggen neben den Sprachnamen (`src/app/services/flags.ts`) sind vereinfachte
SVG-Zeichnungen, die für das Kit geschrieben wurden, eine je `flag`-Schlüssel in
`src/config/languages.json` (derzeit Deutschland und das Vereinigte Königreich). Sie sind
eigene Werke und stehen wie jedes andere visuelle Asset hier unter CC BY 4.0. Eine Sprache
ohne Zeichnung zeigt statt einer Flagge ein Text-Badge mit ihrem Code, sodass das Hinzufügen
einer Sprache nie ein Bild von Dritten hereinzieht. (Bis 2026-09 lieferte das Kit ein
Flaggen-Sprite und eingebettete Flaggen-Icons unbekannter Herkunft mit; beide wurden entfernt,
statt sie neu zu lizenzieren.)

### Ein Hinweis zum Piktogramm für Leichte Sprache

`src/assets/images/leichte-sprache.svg` und das daraus erzeugte PNG sind eigene Werke dieses
Projekts, für das Kit gezeichnet, und stehen wie jedes andere visuelle Asset hier unter
CC BY 4.0. Es bildet mit Absicht **nicht** das etablierte europäische Logo für leicht lesbare
Sprache nach, denn das ist ein geschütztes Zeichen seines Inhabers und wird nur auf Anfrage
lizenziert. Das Kit liefert stattdessen sein eigenes Motiv aus Buch und Haken mit, damit ein
Klon kein fremdes Zeichen enthält, für das er keine Lizenz hat.

## Abhängigkeiten von Dritten

Abhängigkeiten, die über `npm` hereinkommen, behalten ihre eigenen Lizenzen; die Lizenzen
dieses Projekts decken nur den Code und die Inhalte in diesem Repository ab, nicht seine
Abhängigkeiten.
