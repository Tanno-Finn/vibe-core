<!-- kit -->
<!-- TRANSLATION-MIRROR
source: docs/how-to/make-it-yours.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 7eee868b7fd7193ab67e53df1b3db1cc9ba05ed22d9d41513984af96ddf70dc9
-->

**English:** [This page in English](../../how-to/make-it-yours.md)

# Das Kit zu deinem eigenen Portal machen

Ziel: Das Kit hört auf, das Schaufenster des Kits zu sein, und wird dein Portal. Es trägt
deinen Namen und eine kurze Beschreibung, worum es geht. Es nennt dich im Impressum als
Betreiberin oder Betreiber. Es öffnet auf der Seite, die du wählst, und zeigt nur die Teile,
die du nutzt. Und die Beispielinhalte des Kits sind weg, sodass du, dein Agent und alle, die
übersetzen, nur noch mit dem zu tun haben, was wirklich deins ist. Ein Werkzeug erledigt all
das mit drei Befehlen. Nichts wird ohne dich committet, und jeder Schritt lässt sich
rückgängig machen.

**Wenn du einen Agenten steuerst:** Sag *„Mach dieses Kit zu meinem eigenen Portal, nach
docs/how-to/make-it-yours.md.“* Der Agent fragt dich nach dem Namen, der Beschreibung in
jeder Sprache, der Startseite, den Teilen, die du nicht brauchst, und deinen Angaben fürs
Impressum, und führt dann die Befehle unten aus. Du siehst dir das Ergebnis im Browser an
und entscheidest, ob du es behältst.

## Was bleibt: die Vorlagen

Das Kit bringt zwei Arten von Inhalt mit. **Beispiele** sind zum Anschauen da: 15 Artikel,
44 Glossarbegriffe, 119 Quellen und 5 Lernpfade über die Arbeit mit KI-Agenten. Sie gehen.
**Vorlagen** zeigen, wie jede Art von Seite gebaut ist: der Seed-Artikel, die Beispiel-Demo,
fünf Glossarbegriffe, drei Zeitstrahl-Ereignisse, zwei Lernpfade, eine Quelle, ein Werkzeug
und eine Ressource, alle mit Namen `seed-…` oder `example-…`. Sie bleiben, weil dein Agent
sie kopiert, wenn er deine eigenen Inhalte schreibt. Außerdem halten sie jede Prüfung des
Builds grün, die sagt „diese Liste darf nicht leer sein“. Solange ein Teil der Website
eingeschaltet ist, sind seine Vorlagen dort sichtbar. Ersetze oder überarbeite sie also,
bevor du online gehst.

## 1 · Nachsehen, wo du stehst

```powershell
node tools/make-it-yours.mjs
```

Das liest nur. Es sagt dir in einfachen Sätzen:

- den Namen der Website und ihre Startseite, und welche Teile an oder aus sind,
- wie viele Beispielinhalte noch da sind,
- welche Angaben im Impressum noch Platzhalter sind (ein Build für eine echte Webadresse
  verweigert sich, solange sie da sind),
- wie viele Texte eine neue Sprache übersetzen müsste, und
- den nächsten Schritt.

## 2 · Name, Beschreibung, Startseite, Teile, Betreiber

Dein Agent schreibt deine Antworten in eine kleine Datei im Projekt, zum Beispiel
`tmp/answers.json`:

```json
{
  "name": "Mathe mit Frau Schulz",
  "shortName": "Mathe",
  "logoIcon": "pi pi-calculator",
  "startPage": "home",
  "features": { "news": false, "roadmap": false },
  "operator": {
    "name": "Anna Schulz",
    "address": "Schulstraße 1, 12345 Musterstadt, Germany",
    "email": "anna.schulz@example.org"
  },
  "description": {
    "de": "Übungen und Erklärungen für den Matheunterricht der 7b.",
    "de-easy": "Hier übst du Mathe. Für die Klasse 7b.",
    "en": "Exercises and explanations for class 7b's math lessons.",
    "en-easy": "Here you practice math. For class 7b."
  }
}
```

Dann sieht er sich den Plan an und schreibt ihn:

```powershell
node tools/make-it-yours.mjs --site tmp/answers.json --dry-run
node tools/make-it-yours.mjs --site tmp/answers.json
```

Was jede Antwort bewirkt:

- **`name`** steht in der Kopfzeile, in der Fußzeile, in jedem Seitentitel, auf dem Ausdruck
  und in Suchergebnissen. `shortName` ist ein optionaler kürzerer Name für das Logo in der
  Kopfzeile: Setzt du ihn, zeigt die Kopfzeile ihn auf jeder Bildschirmgröße statt `name`,
  Fußzeile, Seitentitel und Suchergebnisse behalten `name`. `logoIcon` ist eine optionale
  [PrimeIcons](https://primeng.org/icons)-Klasse für das Logo.
- **`description`** sind ein, zwei Sätze pro Sprache, Einfache Sprache eingeschlossen. Ein
  neuer Name braucht sie in jeder Sprache deiner Website. Suchmaschinen und Link-Vorschauen
  zeigen sie an.
- **`startPage`** ist die Seite, auf der Besucher landen (`home`, `glossary`, `learn` …). Sie
  muss eine eingeschaltete Seite der Website sein.
- **`features`** schaltet Teile ab: `glossary`, `timeline`, `catalog`, `sources`, `learn`,
  `news`, `roadmap`, `progress`, `feedback`, `demos`. Ein Teil, den du nicht nennst, bleibt
  an.
- **`operator`** ist, wer die Website betreibt, so wie Impressum und Datenschutzhinweis es
  brauchen (Name, Postanschrift, E-Mail und `supervisoryAuthority` mit Name, Anschrift und
  Website der Datenschutz-Aufsichtsbehörde). Felder, die du weglässt, behalten ihren
  bisherigen Wert.

Das Werkzeug schreibt `src/config/site.json` und die Beschreibung jeder Sprache. Wenn du
einen Namen oder eine Beschreibung angibst, passt es außerdem die zwei Dateien an, die
gelesen werden, bevor die Website startet: den Seitentitel und die Link-Vorschau-Angaben in
`src/index.html` und den Titel des Vorschaubilds `src/assets/images/og-image.svg`. Antworten
nur mit deinen Betreiberangaben lassen diese beiden Dateien unverändert. Eine falsche Antwort (ein unbekannter Teil, eine
Startseite, die es nicht gibt oder die abgeschaltet ist, eine fehlende Sprache) hält es an,
bevor es etwas schreibt, und es sagt, was zu korrigieren ist.

## 3 · Die Beispielinhalte entfernen

Dieser Schritt löscht Hunderte Dateien, deshalb braucht er **git** als Sicherheitsnetz. Er
läuft nicht, solange dein Ordner Änderungen hat, die git noch nicht gespeichert hat.
Committe sie vorher, damit die Entfernung für sich allein steht und ein Befehl sie
rückgängig macht.

```powershell
node tools/make-it-yours.mjs --remove-samples --dry-run
node tools/make-it-yours.mjs --remove-samples
```

Der Probelauf listet alles auf, was gehen würde, und ändert nichts. Bevor der echte Lauf
etwas löscht, prüft das Werkzeug drei Dinge:

- die Textprüfung (`node scripts/check-i18n-keys.mjs`) ist grün,
- die Liste der Beispiele (`src/config/samples.json`) passt noch zu den Dateien, und
- nichts, was bleibt (eine Vorlage, eine Seite, ein Menütext), zeigt noch auf ein Beispiel.

Schlägt eine davon fehl, sagt es, was nicht stimmt, und ändert nichts. Scheitert das
Schreiben mittendrin, legt es jede Datei zurück.

Dann löscht es die Beispielartikel, Glossarbegriffe, Quellen und Lernpfade, in jedem
Sprachordner, auch in einer halb fertigen zusätzlichen Sprache. Es entfernt auch ihre
Routen, ihre Einträge in den Verzeichnissen, die Oberflächentexte, die nur sie benutzt
haben, und ihre Vorschauen in Einfacher Sprache. Gemessen an einer Wegwerf-Kopie des Kits
(2026-09-28): **667 Dateien gelöscht, 20 geändert**. Die Oberflächentexte pro Sprache gingen
von 3.863 auf 1.476 zurück. Für eine neue Sprache wie Italienisch zählte
`node tools/lang-status.mjs it` danach 1.504 Oberflächentexte mit 8.861 Wörtern zum
Übersetzen statt 3.921 Texten mit 63.961 Wörtern, und 302 Wörter Inhalt statt 8.053. Ein
zweiter Lauf des Werkzeugs findet nichts mehr zu entfernen.

## Speichern oder rückgängig machen

Das Werkzeug committet nie. Sieh dir zuerst die Website an (`npm start`) und speichere die
Entfernung dann als einen Commit, mit den Zeilen, die das Werkzeug ausgegeben hat:

```powershell
git add -u -- src/app src/assets src/config
git diff --cached --name-only
git commit -m "chore(content): remove the kit's sample content"
```

Rückgängig machen nach dem Commit: `git revert HEAD`. Das kann dein Agent für dich tun.

## Danach: eigene Inhalte, eigene Sprache

- **Eigene Inhalte:** Bitte deinen Agenten um einen Artikel, einen Glossareintrag oder ein
  Zeitstrahl-Ereignis (`/new-content`). Er baut auf den Vorlagen auf. Gib deinen eigenen
  Artikeln eine Kennung, die nicht mit `art-` beginnt, solange die Beispiele des Kits noch da
  sind, oder trage sie unter `notSamples` in `src/config/samples.json` ein.
- **Eine weitere Sprache:** [Eine Sprache hinzufügen](add-a-language.md). Schalte vorher die
  Teile ab, die du nicht brauchst, und entferne die Beispiele, denn dann bleibt nur noch ein
  Bruchteil der Texte zu übersetzen.
- **Bevor du online gehst:** Im Impressum fehlt noch das Thema deiner Website („[Thema der
  Website]“) in `src/assets/i18n/modules/<sprache>/impressum.json`, und das Vorschaubild
  `src/assets/images/og-image.png` entsteht aus dem SVG mit `node scripts/render-og.mjs`.
  Dann folge [Die gebaute Seite deployen](deploy.md).
- **Aussagen darüber, wie du arbeitest:** Die Erklärung zur Barrierefreiheit und der Hinweis
  zur Einfachen Sprache sagen, dass ein Mensch die Texte durchgelesen hat, die in Einfacher
  Sprache und die Fassungen auf Deutsch und Englisch („ein Mensch hat sie durchgelesen“, „Ein
  Mensch liest die Texte danach durch“, „a person has read them through“, „A person reads the
  texts afterwards“), und dass es keine redaktionelle Prüfung gibt. So arbeitet die Demo des
  Kits, nicht unbedingt du. Behalte diese Sätze nur, wenn sie für deine Website stimmen; sonst
  schreib sie um, in `src/assets/i18n/modules/<sprache>/accessibility.json`
  (`limitLanguageText`, `limitTranslationsText`) und `easyLanguage.json`
  (`dialog.fullPortalNotice`). `node scripts/check-imprint.mjs` listet jede, die noch im
  Wortlaut des Kits dasteht, und auch stärkere Behauptungen derselben Art, die eine
  redaktionelle Prüfung versprechen („redaktionell begleitet“, „Menschen prüfen die Texte“,
  „reviewed editorially“, „People check the texts“); es weist nur darauf hin und hält keinen
  Build an.

## Was das Werkzeug nicht prüft

Ob deine Texte zu deiner Website passen, ob dein Impressum rechtlich vollständig ist (nur,
dass kein Platzhalter des Kits übrig ist), und ob jede Seite noch angezeigt wird. Dafür
führst du `npm run build:prod` aus. Komponenten, die nur die Beispielartikel benutzt haben,
bleiben im Projekt. Sie werden nicht benutzt und landen nicht in der Website.
