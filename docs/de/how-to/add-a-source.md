<!-- kit -->
<!-- TRANSLATION-MIRROR
source: docs/how-to/add-a-source.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 3ae918c9331e050220f3ea0ee62182e64e7eb98a4eefc7ab331f83533a98ae25
-->

# Eine Quelle hinzufügen

Ziel: ein neuer Eintrag im Literaturverzeichnis, den ein Artikel oder eine Demo zitieren
kann. Das Zitat, das jede darauf gestützte Aussage belegt, liegt direkt beim Eintrag. Vier
Dateien ändern sich, und zwei der Schritte scheitern still, wenn du sie auslässt.

Durchgehendes Beispiel: ein erfundenes Paper mit der ID `doe-example-2024`. Autorin, URL und
Zitat unten sind Platzhalter, die die Form zeigen. Sie sind keine echte Quelle, also kopiere
sie nicht in Inhalte.

## 1 · Der Kerndatensatz (`src/assets/data/core/sources/<id>.json`)

Sprachneutrale Fakten, eine Datei pro Quelle. Die ID folgt dem Muster
`<autor>-<thema>-<jahr>`, kleingeschrieben, und der Dateiname muss ihr entsprechen.

```json
{
  "id": "doe-example-2024",
  "type": "paper",
  "authors": "Jane Doe, Max Mustermann",
  "year": "2024",
  "publication": "arXiv",
  "url": "https://example.org/abs/2401.00000",
  "doi": "",
  "accessed": "2026-09-23",
  "tags": ["testing", "llm"],
  "evidence": [
    {
      "claim": "Generated tests caught fewer regressions than hand-written ones in the study",
      "quote": "The copied sentence from the paper goes here, word for word.",
      "locator": "Section 5.2"
    }
  ]
}
```

| Feld | Regel |
|---|---|
| `type` | In den heutigen Daten `paper`, `book`, `article`, `website` oder `other`. |
| `year` | Das Jahr als **vierstelliger String**. Nennt die Quelle selbst kein Datum, schreib `null`. Nicht `"n.d."`: Der Zitations-Formatierer druckt „o. J.“ oder „n.d.“ in der Sprache des Lesers. |
| `doi` | Die nackte DOI (`10.xxxx/…`) ohne `https://doi.org/`-Präfix, oder `""`. Ein arXiv-Preprint hat immer eine: `10.48550/arXiv.<id>`, die ID stammt aus seiner URL `arxiv.org/abs/<id>`. |
| `accessed` | Das Datum, an dem du sie gelesen hast, `JJJJ-MM-TT`. |
| `evidence` | Optional. Eine Liste von `{ claim, quote, locator? }`, ein Eintrag pro Aussage, die der Inhalt auf diese Quelle stützt. Siehe Schritt 4. |

Der Titel steht nicht hier. Er wird übersetzt und gehört deshalb in Schritt 2.

## 2 · Der Titel (`src/assets/data/translations/sources/<lang>/<id>.json`)

Eine Datei pro Sprache, die nur den Titel enthält:

```json
{ "title": "An example paper about generated tests" }
```

Schreib `de` und `en`. Andere Sprachen fallen über die Kette in
`src/config/languages.json` zurück.

## 3 · Registrieren: `index.json` **und** `references.json`

- Trag die ID in `src/assets/data/core/sources/index.json` ein. Der Content-Build liest nur
  Datensätze, die dort stehen; eine nicht gelistete Datei erreicht die Seite nie.
- Trag `"doe-example-2024": { "book": [], "portal": [] }` in
  `src/assets/data/core/sources/references.json` ein. **Dieser Schritt scheitert still:** Der
  Build füllt `portal` aus den Artikeln und Demos, die die Quelle zitieren, aber nur für IDs,
  die schon einen Eintrag haben. Ohne ihn bekommst du eine Warnung `references unknown source`,
  und die Quelle erscheint nie als zitiert.

Dann zitiere sie: Füg die ID zu den `sourceReferences` des Artikels in
`src/assets/data/core/articles/<article-id>.json` hinzu (oder zum Eintrag der Demo in
`src/assets/data/core/demos/index.json`).

## 4 · Die Belege

[`directives/content-integrity.md`](../../../directives/content-integrity.md) verlangt für
jede Aussage den wörtlichen Satz, der sie trägt. `evidence` ist der Ort, an dem dieser Satz
aufbewahrt wird, damit ein Prüfer ihn kontrollieren kann, ohne die
Recherche zu wiederholen.

- **`claim`**: was der Inhalt sagt, in den Worten des Inhalts.
- **`quote`**: aus der Quelle kopiert, nie aus dem Gedächtnis getippt, nie übersetzt. Ein
  deutscher Artikel, der ein englisches Paper zitiert, behält das englische Zitat.
- **`locator`**: optional. Seite, Abschnitt, Abbildung oder Anker, alles, was hilft, den Satz
  wiederzufinden.

`evidence` ist nur für Autoren und Prüfer da. Der Content-Build
(`scripts/build-unified-content.ts`) entfernt das Feld, es gelangt also nie in die
Laufzeit-Bundles (`content.<lang>.json`), und keine Seite kann es anzeigen.

Belege sind **Pflicht für neue Aussagen.** Die Datensätze, die es schon vor diesem Feld gab,
haben keine, und niemand trägt sie nachträglich ein, ohne die Quelle erneut zu lesen. Findest
du keinen Satz, der die Aussage trifft, ist die Aussage nicht belegt. Schwäch sie ab oder
streich sie. Schreib kein Zitat, das nur ungefähr passt.

## 5 · Prüfen

```bash
npm run validate:refs    # die Form des Datensatzes: id, year, doi, evidence
npm run content:build    # baut die Bundles und füllt references.json
```

`validate:refs` schlägt fehl bei einem Jahr, das weder vierstellig noch `null` ist, bei einer
DOI mit URL-Präfix, bei einem `evidence`-Eintrag ohne `claim` oder `quote` und bei einem
unbekannten Schlüssel in einem Eintrag. Ob das Zitat wirklich in der Quelle steht, kann es
nicht erkennen. Das prüft eine Person, die die Quelle liest.
