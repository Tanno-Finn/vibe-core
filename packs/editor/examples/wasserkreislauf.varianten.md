**Entwurf, ungeprüft**

# Varianten — Der Wasserkreislauf

Kit-Konfiguration (kit.json → onboardingExtraQuestions, Manifest): Sprachen de, en ·
Easy-Variante: ja → Zielsatz: de, de-easy, en, en-easy. Primärsprache: de.
Vorhanden: de (Entwurf, nach Stil-Durchsicht). Zu erzeugen: de-easy (Teil A dieses Artefakts),
en und en-easy (Teil B, Brief).

## A · Leichte Sprache (de-easy)

Worum geht es hier? Es geht um den Weg des Wassers auf der Erde.

Du stehst im Regen. Das Wasser auf deiner Jacke war vielleicht einmal im Meer. Bald ist es
wieder dort. Am Ende kennst du die vier Stationen von diesem Weg.

**Wasserkreislauf** ist ein Fachwort. Das heißt: Wasser bewegt sich immer im Kreis. Es geht vom
Meer in die Luft. Dann über das Land. Dann zurück ins Meer.
Ein Bild dafür: ein Förderband ohne Anfang und Ende.
Aber Achtung: Ein Förderband ist immer gleich schnell. Wasser ist manchmal schnell und manchmal
sehr langsam.

Die vier Stationen:

1. **Verdunstung.** Das heißt: Wasser wird zu Dampf. Die Sonne macht das Wasser warm. Dann
   steigt es in die Luft. Dampf ist Wasser in der Luft. Man sieht ihn nicht.
2. **Kondensation.** Das heißt: Aus Dampf wird wieder Wasser. Oben in der Luft ist es kalt.
   Der Dampf wird zu winzigen Tropfen. Viele Tropfen zusammen sind eine Wolke.
3. **Niederschlag.** Das heißt: Wasser fällt vom Himmel. Die Tropfen werden schwer. Dann
   fallen sie als Regen oder als Schnee.
4. **Rückfluss.** Das heißt: Das Wasser geht zurück. Es fließt in Bächen und Flüssen ins Meer.
   Oder es geht in den Boden. Dann heißt es Grundwasser.

Das Wichtigste: Wasser geht nicht verloren. Es wechselt nur den Ort. Und es wechselt seine
Form. Die Sonne ist der Motor. Ohne Wärme gibt es keine Verdunstung.

Paritätstabelle:

| Begriff | Original | Easy | gleich? |
|---|---|---|---|
| Wasserkreislauf | „beschreibt, wo Wasser auf der Erde ist und wie es sich … bewegt“ | „Wasser bewegt sich immer im Kreis“ | ja (Begriff bleibt), Erklärung ergänzt |
| Verdunstung | „Übergang von flüssigem Wasser in Wasserdampf an der Oberfläche“ | „Wasser wird zu Dampf. Die Sonne macht das Wasser warm.“ | ja |
| Kondensation | „Gas → flüssig, braucht Abkühlung“ | „Aus Dampf wird wieder Wasser. Oben in der Luft ist es kalt.“ | ja |
| Niederschlag | „fallen sie als Regen, Schnee oder Hagel zu Boden“ | „Wasser fällt vom Himmel … als Regen oder als Schnee“ | ja (Hagel gestrichen, siehe unten) |
| Grundwasser | „versickert im Boden zum Grundwasser“ | „Oder es geht in den Boden. Dann heißt es Grundwasser.“ | ja |
| Rückfluss | „Über Bäche und Flüsse geht das Wasser zurück ins Meer“ | „Das Wasser geht zurück.“ | ja |

Gestrichen (Dekoration): „vor Wochen vielleicht“ → „vielleicht einmal“; „Hagel“ als dritte
Niederschlagsform (zwei Beispiele reichen, die dritte Form trägt nichts zum Lernziel bei); der
Vergleich Verdunstung/Kondensation als Tabelle (in der Easy-Fassung als Reihenfolge erzählt).
Ergänzt (vorausgesetztes Wissen): „Dampf ist Wasser in der Luft. Man sieht ihn nicht.“; „Viele
Tropfen zusammen sind eine Wolke.“
Sprach-Guide: kein `directives/languages/de.md` vorhanden → die generischen
Leichte-Sprache-Regeln der Direktive `accessibility-workflow` wurden angewendet.

Offen für den Autor: Der Selbstcheck ist in dieser Fassung nicht enthalten. Er braucht eine
eigene Adaption (Frage 2 ist in Leichter Sprache eine Transferfrage zu viel) — Vorschlag: nur
Frage 1 und 3, in kurzen Sätzen.

## B · Übersetzungs-Brief (en, en-easy)

Ausgangstext: die deutsche Fassung **nach** Abarbeitung der Stil-Befunde 1 und 2. Wird der Brief
vorher gestartet, wandert das Wort-Problem („Rückfluss/Abfluss“) in beide Zielsprachen.

Term-Sheet (JSON, Direktive translation-quality):

```json
{ "approvedBy": "", "approvedDate": "",
  "styleNotes": "Alltagsnaher Einstieg, durchgehend du-Register (englisch: direktes 'you'), eine einzige Leitmetapher (Förderband), keine Superlative, keine Zahlen ohne Quelle. Die Bruchstelle jeder Analogie muss erhalten bleiben — sie ist der didaktische Kern, nicht Beiwerk.",
  "terms": [
    { "term": "Förderband", "class": "C2", "rule": "ein Zielbegriff je Sprache, identisch in Titel, Definition und Easy-Fassung", "definition": "Leitmetapher für den Kreislauf", "occursIn": ["definition", "easy"] },
    { "term": "Verdunstung", "class": "C3", "rule": "Fachbegriff der Zielsprache, bei Erstnennung mit Sandwich-Erklärung", "definition": "Übergang flüssig zu gasförmig", "occursIn": ["definition", "steps", "comparison"] },
    { "term": "Kondensation", "class": "C3", "rule": "wie oben", "definition": "Übergang gasförmig zu flüssig", "occursIn": ["steps", "comparison", "glossary"] },
    { "term": "Niederschlag", "class": "C3", "rule": "wie oben", "definition": "Regen, Schnee, Hagel", "occursIn": ["steps"] },
    { "term": "Rückfluss", "class": "C3", "rule": "ein Zielbegriff, nicht abwechselnd mit einem Synonym", "definition": "Weg des Wassers zurück ins Meer oder ins Grundwasser", "occursIn": ["steps", "takeaways"] },
    { "term": "Grundwasser", "class": "C3", "rule": "wie oben", "definition": "Wasser im Boden", "occursIn": ["steps", "easy"] },
    { "term": "U.S. Geological Survey", "class": "C4", "rule": "nie übersetzen, Schreibweise exakt", "definition": "Quelle Q-USGS", "occursIn": ["sources"] },
    { "term": "NASA Precipitation Education", "class": "C4", "rule": "nie übersetzen, Schreibweise exakt", "definition": "Quelle Q-NASA", "occursIn": ["sources"] }
  ] }
```

Besonderheit für en und en-easy: Die beiden Belegzitate sind **englische Originalsätze**. In der
englischen Fassung stehen sie wörtlich, ohne Rückübersetzung aus dem Deutschen — der häufigste
stille Fehler bei diesem Text.

Deterministische Checks vor der Abnahme: jede Datei parst · Struktur-Parität (gleiche
Abschnitte, vier Schritte, drei Selbstcheck-Fragen, gleiche Tabellenzeilen) · Zeichenhygiene
(keine Mojibake, korrekte Anführungszeichen der Zielsprache) · Zahlen, Daten und Quellenangaben
identisch mit dem Original · Aussagen-Ids A1–A7 unverändert.
Stichprobe: Einstieg und Selbstcheck 2, in en und en-easy gegengelesen; zusätzlich die
Bruchstelle der Förderband-Analogie.

**Wartet auf Freigabe des Term-Sheets (`approvedBy` leer). Kein Bulk vorher.**

_Mit KI-Unterstützung erstellt — vor Verwendung prüfen._
