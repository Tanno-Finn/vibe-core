<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/how-to/use-the-kit-tools.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: ffb0ea16c5c99861f14f5b6d2c266ce6633ad38d1f36a0d99f4960c0ab600dcd
-->

# Die Werkzeuge des Kits benutzen

Dein Ziel: ein Arbeitsblatt als PDF oder Word-Datei ausgeben, es auf Barrieren prüfen,
Bildschirmfotos einer Seite machen, eine Seite für E-Mail oder Moodle in eine einzige Datei packen
oder die Website auf einen Schulserver bringen, mit den kleinen, getesteten Helfern, die das Kit
mitbringt. Du
musst dafür nicht programmieren. Jedes Werkzeug ist ein einziger Befehl, und normalerweise führt
dein KI-Agent ihn für dich aus. Diese Seite ist für den Fall, dass du eines selbst starten oder
verstehen willst, was der Agent getan hat.

## Was du brauchst

- Das Kit, einmal mit `npm install` eingerichtet (siehe [Erste Schritte](../tutorial/getting-started.md)).
  Dabei wird auch der Browser geladen, den die Werkzeuge im Hintergrund benutzen; es öffnet sich
  kein Fenster.
- Ein Terminal im Projektordner. Unter Windows nimm **PowerShell**. Git Bash verändert Angaben, die
  mit `/` beginnen, und dann funktioniert `--route` nicht.

Jedes Werkzeug arbeitet **offline** und liest und schreibt nur Dateien **im Projektordner**. Es
überschreibt keine Datei, außer du hängst `--force` an, und es lädt nie etwas hoch.

Wenn ein Werkzeug meldet, dass auf diesem Computer etwas fehlt, starte den Check-up:

```powershell
node tools/doctor.mjs
```

Er prüft Node, die installierten Pakete, den Browser und die Schreibrechte, je eine Zeile, und sagt
in einem Satz, wie du behebst, was fehlt.

## Nachsehen, welche Werkzeuge es gibt

```powershell
npm run tools
```

Das zeigt jedes Werkzeug mit einer Zeile dazu, was es tut. Jedes Werkzeug erklärt sich selbst:

```powershell
node tools/pdf.mjs --help
```

## Ein PDF vom Arbeitsblatt machen und prüfen, ob es passt

```powershell
node tools/pdf.mjs out/teacher/worksheet.html --max-pages 1
```

Das PDF landet neben der HTML-Datei (`out/teacher/worksheet.pdf`). Das Werkzeug sagt, wie viele
Seiten es hat. Mit `--max-pages 1` meldet es ein Problem, wenn das Blatt auf eine zweite Seite
rutscht. Außerdem warnt es, wenn eine Tabelle oder ein Bild zu breit für das Papier ist. Häng
`--bw-check` an, wenn das Blatt schwarz-weiß kopiert wird. Dann listet es farbige Schrift und
Hintergründe auf, die grau werden können.

## Eine Word-Datei, mit der Screenreader umgehen können

```powershell
node tools/docx.mjs out/teacher/worksheet.html
```

Das schreibt `out/teacher/worksheet.docx` mit echten Überschriften, Listen und Tabellen und mit der
eingestellten Dokumentsprache. So sagt ein Screenreader die Gliederung an und liest den Text mit
der richtigen Stimme. Die Sprache kommt aus der HTML-Datei (`<html lang="de">`). Bei einer
Markdown-Datei gibst du sie an: `--lang de`. Ein Absatz in einer anderen Sprache (zum Beispiel
`<p lang="it">`) wird als diese Sprache markiert. Bilder werden noch nicht übernommen: Die
Word-Datei zeigt ihre Beschreibung in Klammern, etwa `[Bild: Wasserkreislauf]`.

Arabisch, Persisch, Hebräisch und andere Sprachen, die von rechts nach links laufen, kommen
richtig heraus: Absätze, Tabellen und die Seite sind gespiegelt. Das Werkzeug erkennt das an der
Sprache (`<html lang="ar">`) oder an `dir="rtl"`.

## Ein Dokument in andere Sprachen übersetzen

Sag dem Agenten: *„Übersetze dieses Arbeitsblatt ins Türkische und ins Arabische“* (der Skill
`/translate`). Du bekommst je Sprache eine HTML-, PDF- und Word-Datei neben dem Original, jede als
ungeprüfter Entwurf markiert. Der Agent prüft mit den Werkzeugen oben die Sprachmarkierung, das
Layout und die Seitenzahl. Ob die Übersetzung stimmt, kann nur jemand sagen, der die Sprache
spricht: Lass jede Fassung lesen, bevor sie hinausgeht.

## Eine Seite auf Barrieren prüfen

```powershell
node tools/a11y.mjs out/teacher/learning-page.html
```

Die Seite wird im hellen und im dunklen Modus geprüft, nach denselben Barrierefreiheitsregeln, die
das Kit für seine eigene Website verwendet. Wenn sich deine Seite ändert, sobald jemand einen Knopf
drückt (Lösungen zeigen, auf Einfache Sprache umschalten), häng für jeden Knopf ein `--click` an,
damit auch dieser Zustand geprüft wird:

```powershell
node tools/a11y.mjs out/teacher/learning-page.html --click "#show-answers"
```

`--tab-order 10` listet zusätzlich die ersten zehn Stellen auf, die jemand mit der Tab-Taste
erreicht.

Um eine Seite des Portals selbst zu prüfen, baue die Website einmal (`npm run build:prod`) und nenne
die Seite:

```powershell
node tools/a11y.mjs --route /de/demos
```

## Bildschirmfotos machen

```powershell
node tools/shot.mjs out/teacher/learning-page.html --scheme both
```

Du bekommst Bilder für einen Computerbildschirm und ein Handy, hell und dunkel. Sie liegen in
`out/tools/shot/`, einem Ordner, den git nicht speichert, und nie neben deinem Material. Das
Werkzeug schreibt dir, wo jedes Bild liegt. Für eine Seite des Portals nimm `--route /de/home`, wie
oben.

## Prüfen, wie leicht ein Text zu lesen ist

```powershell
node tools/reading-level.mjs out/teacher/learning-page.html --easy
```

Für jeden Abschnitt bekommst du die Zahl der Sätze, wie viele Wörter ein Satz im Schnitt und
höchstens hat, und einen Lesbarkeitswert (LIX: unter 30 ist sehr leicht, über 60 sehr schwer).
Zu lange Sätze werden aufgelistet: über 15 Wörter mit `--easy`, über 25 ohne. Bei deutscher
Einfacher Sprache listet es außerdem lange Wörter ohne Mediopunkt auf, etwa *Wasserkreislauf*
statt *Wasser·kreislauf*. Das ist ein Hinweis. Zahlen können nicht beweisen, dass ein Text leicht
ist. Das können dir nur Menschen aus deiner Zielgruppe sagen.

Die Texte der Portalseiten gehen auch: `--i18n home --lang de-easy` prüft die Texte der Startseite
in Einfacher Sprache.

## Nachsehen, wie weit eine Sprache ist

Bevor du entscheidest, eine Sprache ins Portal aufzunehmen (zum Beispiel Italienisch), zähl nach,
was dafür nötig ist:

```powershell
node tools/lang-status.mjs it
```

Du bekommst die Zahl der Oberflächentexte und Inhaltseinträge (Glossar, Zeitleiste, Quellen …),
die es in dieser Sprache schon gibt, die, die noch eine Kopie des Ausgangstexts sind, und die Zahl
der Wörter, die noch zu übersetzen sind, für die Sprache und ihre Variante in Einfacher Sprache.
Außerdem steht da, ob die Sprache schon eingerichtet ist. Wie du eine Sprache hinzufügst, steht in
[Eine Sprache zum Portal hinzufügen](add-a-language.md).

## Eine neue Seite im Portal anlegen

Eine neue Seite der Website braucht mehr als die Seite selbst: ihre Texte in jeder Sprache, einen
Test, einen Eintrag im Menü. `new-page` richtet all das so ein, wie das Kit es erwartet. Dein Agent
schreibt zuerst eine kleine Datei mit dem Titel und einer Beschreibung in einem Satz für jede
Sprache, Einfache Sprache eingeschlossen, und startet dann:

```powershell
node tools/new-page.mjs water-cycle --kind page --strings tmp/water-cycle.json
```

Für eine interaktive Demo nimm `--kind demo`. Das Werkzeug legt die Dateien an und gibt zwei kurze
Code-Stücke aus, die von Hand in die Routenlisten kommen. Mit `--dry-run` siehst du den Plan, ohne
dass sich etwas ändert. Das ganze Rezept steht in [Eine Seite hinzufügen](add-a-page.md).

## Das Kit zu deinem eigenen Portal machen

Das Kit kommt als Schaufenster: mit eigenem Namen, Beispielartikeln und einem Glossar über
KI-Agenten. `make-it-yours` macht daraus deine Website. Ohne Optionen sagt es nur, wo du
stehst und was als Nächstes zu tun ist:

```powershell
node tools/make-it-yours.mjs
```

Mit `--site answers.json` schreibt es Namen, Beschreibung und Startseite deiner Website, die
Teile, die du abschaltest, und deine Angaben fürs Impressum. Mit `--remove-samples` löscht
es die Beispielinhalte des Kits und behält die Vorlagen, auf denen dein Agent aufbaut. Beide
kennen `--dry-run`, und nichts wird ohne dich committet. Die Schritte und was du antwortest,
stehen in [Das Kit zu deinem eigenen Portal machen](make-it-yours.md).

## Eine Seite per E-Mail schicken oder in Moodle stellen

Eine Lernseite benutzt oft ein Stylesheet, Bilder oder eine Schrift aus Dateien, die daneben liegen.
Verschickst du sie allein, fehlen die. `bundle` packt alles in eine einzige Datei:

```powershell
node tools/bundle.mjs out/teacher/learning-page.html
```

Du bekommst `out/teacher/learning-page.single.html`, die für sich allein funktioniert. Das Werkzeug
listet auf, was es nicht einpacken konnte, zum Beispiel ein Bild aus dem Internet oder einen Link auf
eine andere Seite. In **Moodle** fügst du die Datei als Material **Datei** hinzu, nicht als **Textseite**:
Eine Moodle-Textseite entfernt die Knöpfe und Quizfragen, die die Seite interaktiv machen. Über
10 MB warnt das Werkzeug, weil viele Mailsysteme so eine Datei ablehnen.

## Die Website so ansehen, wie Lernende sie bekommen

`npm start` zeigt die Website, während du daran arbeitest. Die fertige Website ist das, was
Lernende bekommen. Baue sie einmal und sieh sie dir dann an:

```powershell
npm run build:prod
node tools/preview.mjs
```

Das Werkzeug schreibt eine Adresse wie `http://127.0.0.1:2100/`. Öffne sie in deinem Browser. Sie
funktioniert nur auf diesem Computer. Mit **Strg+C** hältst du es an.

## Die Website auf einen Schulserver bringen

```powershell
node tools/export-site.mjs
```

Das packt die gebaute Website in eine ZIP-Datei in `out/site/` und schreibt daneben
`SERVER-SETUP.md`, auf Deutsch und Englisch, für die Person, die den Schulserver betreut: wohin die
Dateien gehören und die eine Regel, die der Server braucht, damit sich jede Seite öffnet. Ist es ein
Apache-Server, häng `--apache` an, dann liegt die Regel schon in der ZIP-Datei. Das Werkzeug lehnt
eine Website ab, die die Prüfungen beim Bauen nicht bestanden hat. Starte dann
`npm run build:prod` noch einmal. Die ZIP-Datei hochladen ist dein Schritt: Das Kit stellt nie
selbst etwas online. Die Website muss heute in den Hauptordner des Servers (das „Web-Root“), nicht
in einen Unterordner.

## Was das Ergebnis dir sagt

Jedes Werkzeug endet mit einem Rückgabewert. Dein Agent liest ihn; du siehst ihn als letzte
Meldung:

| Wert | Bedeutung | Was du tust |
|---|---|---|
| 0 | Fertig, nichts Blockierendes. | Schau dir das Ergebnis an. |
| 1 | Die Prüfung hat ein Problem gefunden (zu viele Seiten, eine Barrierefreiheitsregel verletzt). | Behebe es und starte das Werkzeug noch einmal. |
| 2 | Der Befehl stimmte nicht (Datei nicht gefunden, Datei außerhalb des Projekts, Ausgabe gibt es schon). | Lies die Meldung; mit `--force` wird eine Datei ersetzt. |
| 3 | Auf diesem Computer fehlt etwas (der Browser, die gebaute Website). | Die Meldung sagt in einem Satz, wie du es behebst. |

Jedes Werkzeug endet außerdem mit **„Not checked“**: Dinge, die eine Maschine nicht beurteilen
kann, etwa ob eine Bildbeschreibung Sinn ergibt oder ob Einfache Sprache wirklich einfach ist. Das
bleibt deine Entscheidung oder die von jemandem aus deiner Zielgruppe.

Die vollständige Referenz für Agenten mit allen Optionen steht in
[`tools/README.md`](../../../tools/README.md).
