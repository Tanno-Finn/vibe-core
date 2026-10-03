<!-- kit -->
<!-- TRANSLATION-MIRROR
source: docs/how-to/add-a-language.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: dda602ee56f8e74d9903b97e473694f6675f219e2725b27953867d6efed92a2d
-->

# Eine Sprache zum Portal hinzufügen

Ziel: Das Portal spricht eine Sprache mehr, zum Beispiel Italienisch. Die Sprache bekommt
eine eigene Adresse (`/it/…`), einen eigenen Eintrag in der Sprachauswahl, eine eigene
Variante in Einfacher Sprache und einen grünen Produktions-Build. Das ist Routinearbeit,
kein Projekt: Fast alles hängt an einer einzigen Konfigurationsdatei. Die meiste Arbeit
steckt im Übersetzen, und damit muss die Einrichtung nicht warten.

**Gemessen, nicht geschätzt.** Bevor diese Anleitung entstand, wurde Italienisch (`it`) in
einer Wegwerf-Kopie des Kits eingebaut und bis zu einem grünen `npm run build:prod`
gebracht. Die Einrichtung dauerte etwa **10 Minuten**. Darin stecken vier geänderte
Dateien, 369 kopierte Textdateien, zwei Produktions-Builds (je etwa 3 Minuten) und ein
Testlauf. Die einzige Überraschung war ein Test, der die Sprachen von Hand aufzählt
(Schritt 6). Jeder Schritt unten stammt aus diesem Lauf.

Durchgehendes Beispiel: Italienisch, Code `it`, Variante in Einfacher Sprache `it-easy`.
Für eine andere Sprache ersetzt du den Code überall.

**Wenn du einen Agenten steuerst:** Sag *„Füge Italienisch zum Portal hinzu, nach
docs/how-to/add-a-language.md. Kopiere vorerst die englischen Texte als Platzhalter.“* Der
Agent erledigt die Schritte 1–7. Du entscheidest die drei Fragen aus Schritt 0 und machst
die Browser-Prüfung aus Schritt 8.

## Was eine Sprache braucht

**Minimum** (der Build ist grün, und die Sprache ist erreichbar und auswählbar):

- ein Eintrag in `src/config/languages.json` (Schritt 1),
- ihr Code in der Weiterleitung für Adressen ohne Sprachkürzel in `src/index.html`
  (Schritt 2),
- ein vollständiger Satz Oberflächentexte für die Sprache **und** ihre Variante in
  Einfacher Sprache, als Platzhalter aus dem Englischen kopiert, solange nichts übersetzt
  ist (Schritt 3),
- eine Übersetzungsdatei für jeden Glossar-, Zeitleisten-, Werkzeug-, Ressourcen- und
  Quelleneintrag, anfangs ebenfalls als Kopie (Schritt 4),
- der eine Test, der die Sprachen von Hand aufzählt, angepasst (Schritt 6, nur bei
  `"seo": true`).

**Vollständig** (was Leserinnen und Leser am Ende bekommen sollen):

- jeder Oberflächentext und jeder Inhaltseintrag wirklich übersetzt, auch die Variante in
  Einfacher Sprache, geschrieben nach den Regeln dieser Sprache,
- der Übersetzungshinweis auf der Startseite (Schritt 3) entfernt oder umformuliert,
  sobald nichts mehr englisch ist,
- optionaler Feinschliff: eine Flaggenzeichnung, das Datumsformat, ein Sprachleitfaden
  (Schritt 5).

## Erst abschalten, was du nicht brauchst

Eine neue Sprache braucht die Texte und Inhalte der Funktionen, die deine Seite nutzt, und
nichts von einer Funktion, die du abgeschaltet hast. Das Kit hat zehn Funktionen, die du in
`src/config/site.json` abschalten kannst: Glossar, Zeitleiste, Katalog, Quellen,
Lernbereich, Neuigkeiten, Roadmap, Fortschritt, Feedback und Demos
(`"features": { "news": false }`). Entscheide deshalb, **bevor** jemand übersetzt, welche
davon deine Seite nutzt. Jede Funktion, die du vorher abschaltest, ist Text, den niemand
übersetzen muss.

Gemessen am Kit, wie es ausgeliefert wird (2026-09-28), mit
`node tools/lang-status.mjs it --json`, für Italienisch:

- **Alle Funktionen an** (Voreinstellung des Kits): 3.921 Oberflächenschlüssel mit
  63.961 Wörtern zum Übersetzen, dazu 8.053 Wörter Inhalt (Glossar, Zeitleiste,
  Werkzeuge, Ressourcen, Quellen).
- **Glossar, Zeitleiste, Katalog, Quellen, Neuigkeiten und Roadmap aus:**
  3.447 Oberflächenschlüssel mit 62.634 Wörtern und gar kein Inhalt.

Die meisten übrigen Wörter gehören zu den 15 Beispielartikeln des Kits (2.311 Schlüssel,
53.765 Wörter). Artikel sind Inhalt, keine Funktion, und bleiben deshalb an. Lässt man sie
aus der Rechnung, ist der Unterschied deutlich: 1.610 Schlüssel und 18.249 Wörter mit allen
Funktionen, 1.136 Schlüssel und 8.869 Wörter mit diesen sechs Funktionen aus, also weniger
als die Hälfte. Die Variante in Einfacher Sprache `it-easy` schrumpft genauso (Inhalt von
5.095 Wörtern auf keine).

Die Beispielartikel, Glossarbegriffe, Quellen und Lernpfade sind das Schaufenster des Kits,
nicht dein Inhalt, und ein Werkzeuglauf entfernt sie:
[Das Kit zu deinem eigenen Portal machen](make-it-yours.md). Gemessen an einer Wegwerf-Kopie
(2026-09-28, alle Funktionen an): Nach `node tools/make-it-yours.mjs --remove-samples`
braucht Italienisch 1.504 Oberflächenschlüssel mit 8.861 Wörtern (it-easy 8.431) und
302 Wörter Inhalt (it-easy 473). Entferne also die Beispiele und schalte ab, was du nicht
nutzt, bevor jemand übersetzt.

Was das Abschalten für eine neue Sprache ändert:

- `check-i18n-keys.mjs` verlangt von der neuen Sprache die Texte einer abgeschalteten
  Funktion nicht. Englisch behält sie, weil der Code der Funktion noch da ist.
- `check-content-coverage.mjs` überspringt die Inhaltssammlungen einer abgeschalteten
  Funktion.
- `node tools/lang-status.mjs it` zählt nur, was an ist, und nennt die abgeschalteten
  Funktionen.

Schaltest du eine Funktion später wieder an, verlangt der Build ihre Texte wieder und nennt
die fehlenden. Die Texte der Entwickler-Werkstatt (`devWorkshop.json`, nur während der
Entwicklung in Gebrauch) braucht eine neue Sprache nie: Dort zeigt die Werkstatt Englisch.

## 0 · Erst drei Entscheidungen

1. **Der Code.** Nimm den zweibuchstabigen ISO-Code (`it`, `fr`, `pl`). Die Variante in
   Einfacher Sprache heißt immer `<code>-easy`. Jede Sprache hat eine, denn eine Sprache
   ohne sie kennt das Kit nicht.
2. **Öffentlich oder Beta?** Mit `"seo": true` bekommt die Sprache vorgerenderte Seiten,
   Sitemap-Einträge und hreflang-Verweise, wie Deutsch und Englisch. Mit `"seo": false`
   bleibt sie erreichbar und auswählbar, ist aber als Beta markiert und für Suchmaschinen
   unsichtbar. Nimm `false`, solange die Texte Platzhalter sind, und schalte auf `true`,
   wenn sie übersetzt sind.
3. **Woher der Platzhaltertext kommt.** Englisch ist die Quelle der Oberflächentexte. Für
   Inhalte (Glossar, Zeitleiste und so weiter) ist Deutsch der vollständigste Bestand des
   Kits. Beides taugt als Platzhalter. Nimm das, was deine Übersetzer am besten lesen.

## 1 · Die Sprache eintragen (`src/config/languages.json`)

Diese Datei ist die einzige Quelle der Wahrheit. Die App, die Sprachauswahl, die
Rückfallketten, die Prerender-Liste, die Sitemap und hreflang lesen alle aus ihr. Füge
unter `languages` einen Eintrag hinzu:

```json
{
  "code": "it",
  "easyCode": "it-easy",
  "name": "Italian",
  "nativeName": "Italiano",
  "easyName": "Easy Italian",
  "easyNativeName": "Italiano semplice",
  "flag": "it",
  "hreflang": "it",
  "locale": "it-IT",
  "seo": true,
  "prerenderTier": 1
}
```

Das Beispiel zeigt den fertigen Zustand, so wie der Probelauf ihn nutzte. Solange die Texte
noch Platzhalter sind, schreib `"seo": false` (Schritt 0) und schalte auf `true`, sobald sie
übersetzt sind.

`prerenderTier` zählt nur bei `"seo": true`. `1` rendert jede Seite vor (Start, Übersichten
und Artikel), `2` Start und Übersichten, `3` nur die Startseite. Der Probelauf nahm `1` und
kam damit auf 90 vorgerenderte Seiten statt 60. Lass `defaultLanguage`, `keySourceLanguage`
und `contentReferenceLanguage` unverändert, außer die neue Sprache soll die Standardsprache
der Seite werden. Die Kommentare oben in der Datei erklären die drei.

## 2 · Die Weiterleitung für Adressen ohne Sprachkürzel (`src/index.html`)

Ein kleines Skript in `src/index.html` schickt `/glossary` weiter nach `/de/glossary`. Es
läuft, bevor die App lädt, kann `languages.json` also nicht lesen und führt eine eigene
Liste:

```js
var codes = ['de', 'en', 'it'];
```

Gleiche Reihenfolge wie in `languages.json`. Merken musst du dir den Schritt nicht, denn
`check-i18n-keys.mjs` lässt den Build scheitern, wenn Liste und Konfiguration
auseinanderlaufen.

## 3 · Oberflächentexte: `src/assets/i18n/modules/<code>/` und `<code>-easy/`

Kopiere die kompletten englischen Ordner:

- `src/assets/i18n/modules/en/` → `src/assets/i18n/modules/it/`
- `src/assets/i18n/modules/en-easy/` → `src/assets/i18n/modules/it-easy/`

Das sind je 69 Dateien. **Warum kopieren statt weglassen:** Die App *kann* zur Laufzeit
zurückfallen (`it` → Englisch, `it-easy` → `it` → Englisch), aber der Build lässt es
nicht zu. `check-i18n-keys.mjs` verlangt jeden Schlüssel der eingeschalteten Funktionen in
jeder Sprache, weil ein fehlender Schlüssel früher unbemerkt als roher Schlüsselname oder in
der falschen Sprache beim Publikum ankam. Die Texte abgeschalteter Funktionen und
`devWorkshop.json` dürfen fehlen; alles zu kopieren ist einfacher und schadet nicht. Eine kopierte englische Datei ist der ehrliche Platzhalter: Der Build
bleibt grün, und man sieht, welche Dateien noch englisch sind.

**Einen Text sofort übersetzen:** `translationNotice` in `home.json` (beide Ordner). Die
Startseite zeigt diesen Hinweis in jeder Sprache außer Deutsch und Englisch. Sein
englischer Text sagt *„This notice is not displayed in English …“*, was unter einer
italienischen Flagge falsch ist. Der Probelauf nahm *„La versione italiana è in
lavorazione: alcune parti sono ancora in inglese.“* Mit diesem Hinweis sagt das Kit dem
Publikum, dass Teile noch unübersetzt sind. Solange er steht, ist das Publikum gewarnt.

Dann übersetzt du in deinem Tempo. Eine grobe Größe, gemessen mit allen Funktionen an:
Die Oberfläche der Seite selbst hat etwa 10.000 Wörter. Die 15 Beispielartikel
(`article*.json`) bringen rund 54.000 weitere. Sie sind der Beispielinhalt des Kits, den du
vermutlich ohnehin ersetzt. Die Vorschau einer Seite in Einfacher Sprache steht in
`easyLanguage.json`. Fehlt die Vorschau einer Seite in irgendeiner Sprache, verschwindet
der Knopf für Einfache Sprache auf dieser Seite für alle. Halte die Datei deshalb
vollständig.

## 4 · Inhalte: `src/assets/data/translations/<sammlung>/<code>/`

Glossar, Zeitleiste, Werkzeuge, Ressourcen und Quellen bestehen aus einer Kerndatei pro
Eintrag plus einer Übersetzungsdatei pro Sprache. Kopiere die Ordner der eingeschalteten
Funktionen (mit abgeschaltetem Glossar braucht `glossary` keinen Ordner):

| Sammlung | `it` | `it-easy` | Dateien je Ordner (Kit) |
|---|---|---|---|
| `glossary` | kopieren | kopieren | 49 |
| `timeline` | kopieren | kopieren | 3 |
| `ai-tools` | kopieren | kopieren | 2 |
| `ai-resources` | kopieren | kopieren | 2 |
| `sources` | kopieren | **keiner** | 119 |

**Warum jeder Eintrag eine Datei braucht:** Ohne sie bekäme ein italienischer Leser über die
Rückfallkette deutschen Text. `check-content-coverage.mjs` behandelt das als harten Fehler
(„falsche Sprache ausgeliefert“), und keine Ausnahme lockert ihn. `sources` hat
absichtlich keinen Ordner für Einfache Sprache, weil ein Titel das Werk exakt benennen
muss. Fehlt ein Eintrag in `it-easy`, fällt er auf `it` zurück, und dasselbe Gate zählt das
als Rückstand in Einfacher Sprache. Das Kit erlaubt dafür einen Rückstand von 0, also
kopiere auch die `-easy`-Ordner. Die Alternative ist, die Obergrenze im `BASELINE` des
Gates bewusst anzuheben.

Die Inhalte haben etwa 8.000 Wörter, fast alles im Glossar. Der Build druckt einen **LOCALE
FALLBACK REPORT** mit Zahlen pro Sprache. Schau ihn nach jedem Build an.

## 5 · Optionaler Feinschliff

- **Flagge:** `src/app/services/flags.ts`. Ohne Zeichnung zeigt die Sprachauswahl ein
  neutrales Kürzel-Schild, und das reicht. Der Probelauf fügte ein dreistreifiges SVG in
  fünf Zeilen hinzu.
- **Datum und Zahlen:** `src/app/utils/date-locale.ts` legt die Region für `de` und `en`
  fest. Andere Sprachen formatieren unter ihrem bloßen Code (`it` → *15/07/2026*,
  *15 luglio 2026*). Trag `it: 'it-IT'` nur ein, wenn du eine bestimmte Region brauchst.
- **Zitierstil:** Die Quellenseite kennt deutsche und englische Zitierbezeichnungen. Jede
  andere Sprache bekommt den englischen Stil (`src/app/pages/sources/citation-formats.ts`).
- **Sprachleitfaden:** `directives/languages/<code>.md` plus `<code>.setup.md` enthält
  Grammatik, Typografie und die Regeln für Einfache Sprache, für Übersetzer und Agenten.
  Das Kit bringt schon Leitfäden für 33 Sprachen mit, darunter `it`. Für eine Sprache ohne
  Leitfaden folge `directives/language-guide-authoring.md`. Die Regeln für
  Übersetzungsqualität stehen in `directives/translation-quality.md`.

## 6 · Der eine Test, der die Sprachen von Hand aufzählt

`src/app/services/meta-seo.service.spec.ts` erwartet als hreflang-Liste genau
`de, en, x-default`. Mit einer neuen Sprache mit `"seo": true` scheitern fünf seiner Tests
und damit auch `build:prod`, weil der Build die Testsuite ausführt. Trag die neue Sprache
in die erwarteten Listen ein: eine Zeile mehr pro Liste, und die Längenprüfung von 3 auf 4.
Mit `"seo": false` ändert sich die Liste nicht, und es ist nichts zu tun.

## 7 · Build und Gates

Führe `npm run build:prod` aus. Diese Gates müssen grün bleiben, und alle laufen darin mit:

- `check-i18n-keys.mjs`: jeder Oberflächenschlüssel der eingeschalteten Funktionen in
  jeder Sprache, dazu die Weiterleitungsliste aus Schritt 2.
- `check-content-coverage.mjs`: keine Inhalte in falscher Sprache, der Rückstand in
  Einfacher Sprache innerhalb seiner Obergrenze (Sammlungen abgeschalteter Funktionen
  werden übersprungen).
- die kuratierte Testsuite (`check-test-baseline.mjs`), dort zeigt sich Schritt 6.
- `verify-build.js`: Jede Sprache mit `"seo": true` wurde tatsächlich vorgerendert
  („3/3 SEO languages prerendered“).

Danach prüfst du, dass `dist/vibecore/browser/.build-manifest.json` unter `verification`
`"passed": true` enthält und dass `dist/vibecore/browser/it/home/index.html` existiert und mit
`<html lang="it" …>` beginnt.

## 8 · Im Browser prüfen

`npm start`, dann http://localhost:2000/it/home öffnen:

- Die Sprachauswahl zeigt *Italiano* und *Italiano semplice*, und der Wechsel klappt in
  beide Richtungen.
- Die Adresse behält `/it/` auf jeder Seite, die du öffnest, und ein bloßes
  http://localhost:2000/glossary landet auf `/it/glossary`, sobald Italienisch deine
  gespeicherte Wahl ist.
- Die Seitensprache stimmt. Ein Screenreader sollte Italienisch ansagen: in den
  Entwicklerwerkzeugen des Browsers `<html lang="it">`. Die Variante in Einfacher Sprache
  nutzt ebenfalls `lang="it"`, weil es für einfaches Italienisch keinen eigenen Code gibt.
- Der Übersetzungshinweis steht auf der Startseite, auf Italienisch.
- Glossar, Zeitleiste und ein Artikel öffnen sich ohne rohe Schlüssel wie
  `home.hero.subtitle`.
- Schalte Einfache Sprache auf der Startseite und in einem Artikel ein.

Der Probelauf hat das vorgerenderte HTML geprüft (das `lang`-Attribut, den Eintrag in der
Sprachauswahl, den Hinweis), keine Live-Sitzung im Browser.

## Einfache Sprache

Jede Sprache hat eine Variante in Einfacher Sprache, und das Kit erwartet sie vollständig
(Schritte 3 und 4). Anfangs darf sie eine Kopie der Grundsprache oder des einfachen
Englisch sein. Zu echtem einfachem Italienisch wird sie, wenn jemand sie nach den Regeln in
Abschnitt 8 des Sprachleitfadens schreibt (für Italienisch `directives/languages/it.md`
§8). Die deutschen und englischen Bestände in Einfacher Sprache zeigen, wie das Ergebnis
aussieht.

## Aufwand, realistisch

- **Einrichtung (Schritte 0–7):** unter einer Stunde mit einem Agenten, zwei
  Produktions-Builds eingerechnet. Der Probelauf brauchte 10 Minuten.
- **Übersetzung:** die eigentliche Arbeit. Oberfläche und Inhalte kommen mit allen
  Funktionen auf etwa 18.000 Wörter, und auf weniger als die Hälfte, wenn die Funktionen
  abgeschaltet sind, die du nicht brauchst (siehe „Erst abschalten, was du nicht
  brauchst“). Die 15 Beispielartikel bringen rund 54.000 dazu, und du ersetzt sie
  vermutlich ohnehin. Die Variante in Einfacher Sprache ist noch einmal so viel, nur in
  einfacheren Worten.
  Maschinelle Übersetzung liefert einen Entwurf in Minuten. Eine menschliche Durchsicht des
  ganzen Portals ist Arbeit von Tagen, und sie kann nebenher laufen, während die Sprache als
  Beta (`"seo": false`) mit dem Hinweis aus Schritt 3 online ist.
- **Selbst nachzählen:** `node tools/lang-status.mjs it` zählt die Texte und Inhaltseinträge,
  die für `it` und `it-easy` noch fehlen, und die Wörter, die übrig sind ([Die Werkzeuge des Kits benutzen](use-the-kit-tools.md#nachsehen-wie-weit-eine-sprache-ist)).

## Wo die neue Sprache noch nicht abgedeckt ist

Das blockiert nichts, ist aber gut zu wissen:

- `check-house-style.mjs` prüft nur deutsche und englische Texte. Italienischer Text
  bekommt keine Hausstil-Prüfung.
- `scripts/check-a11y.mjs` führt seine Barrierefreiheits-Prüfung im Browser nur für `de`
  und `en` aus.
- Ob die Startseite den Übersetzungshinweis zeigt, entscheidet eine feste Liste (`de`,
  `de-easy`, `en`, `en-easy` in `src/app/pages/home/home.component.ts`), also erscheint
  der Hinweis bei jeder hinzugefügten Sprache.
- Platzhalter-Kopien sind englischer Text, der als Italienisch ausgezeichnet ist
  (`lang="it"`), also liest ein Screenreader Englisch mit italienischer Aussprache vor. Ein
  Grund mehr, mit `"seo": false` zu starten und bald zu übersetzen.

## Sprachen, die von rechts nach links laufen (Arabisch, Hebräisch, Persisch …)

**Heute nicht unterstützt.** Das Kit setzt kein `dir`-Attribut und bringt keine Stile für
Rechts-nach-links mit, also bleibt jedes Layout links-nach-rechts, egal in welcher
Sprache. Mit den Schritten oben erscheint zwar arabischer Text, aber falsch angeordnet. Um
das zu unterstützen, braucht es zuerst einen Schreiber für `dir="rtl"` neben dem für `lang`
(`src/app/services/meta-seo.service.ts`), danach eine Durchsicht jedes `left`/`right` in
den Komponenten-Stilen. Das ist ein eigenes Projekt. Plane es mit dem Agenten als Spec
(`specs/`), bevor du es jemandem versprichst.

Doku und Journal-Eintrag gehören in denselben Commit (`base/BOOKKEEPING.md`).
