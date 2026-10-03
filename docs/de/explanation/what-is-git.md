<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/explanation/what-is-git.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 548a19c2a58ef0293176be1b3491f6773e95b7ca3414bd3559818409dd764aa3
-->

# Was ist git, und warum

Man hat dir vermutlich gesagt, `git clone` auszuführen, oder du hast „git“ als etwas gesehen,
das dieses Kit braucht, und bist dir nicht sicher, was das ist. Gute Nachricht: Die Idee ist
einfach, und du musst keine Expertin oder kein Experte werden, um dieses Kit zu benutzen. Diese
Seite erklärt *was git ist* und *warum das Kit sich darauf stützt* — nicht, wie man jeden Befehl
eintippt. Dafür sind die offiziellen Docs die freundlichste Landkarte:
<https://git-scm.com>.

## Die Ein-Satz-Version

**Git ist ein Werkzeug, das sich jede gespeicherte Version eines Ordners voller Dateien merkt.**
Jedes Mal, wenn du (oder der Agent) ihm sagst „speichere den aktuellen Stand“, legt es eine
vollständige Momentaufnahme beiseite. Später kannst du auf jede Momentaufnahme zurückblicken,
zwei davon vergleichen oder zu einer zurückkehren — und dabei geht unterwegs nie etwas
stillschweigend verloren.

Zwei Alltagsbilder, falls sie helfen:

- **Speicherpunkte in einem Videospiel.** Du spielst vorwärts, und an guten Momenten speicherst
  du. Läuft der nächste Abschnitt schlecht, lädst du den letzten Spielstand und versuchst es
  erneut. Git ist ein Speicherpunkt-System für einen Ordner voller Dateien — außer dass es
  *alle* Speicherstände behält, nicht nur den letzten.
- **Änderungsverfolgung, die nie vergisst.** Wie die Versionshistorie in einer Textverarbeitung,
  aber für ein ganzes Projekt, und dauerhaft: Du kannst immer sehen, was sich wann und warum
  geändert hat.

## Warum sich dieses Kit darauf stützt

Dieses Kit ist dafür gebaut, von einem KI-Agenten bearbeitet zu werden, und git ist das, was
es sicher macht, dabei zuzusehen.

- **Der Agent arbeitet in kleinen Prüfpunkten.** Während er an einer Aufgabe arbeitet, speichert
  er seinen Fortschritt in kleinen, beschrifteten Momentaufnahmen („Checkpoint-Commits“) statt
  in einer großen, undurchsichtigen Änderung am Ende. Weil jeder Schritt sein eigener
  Speicherpunkt ist, lässt sich jeder Schritt für sich rückgängig machen, ohne die gute Arbeit
  drumherum wegzuwerfen.
- **So kannst du angstfrei experimentieren.** Willst du den Agenten eine gewagte Idee ausprobieren
  lassen? Der aktuelle Stand ist bereits gespeichert. Gefällt dir nicht, wohin es geführt hat,
  gehst du zurück zur letzten guten Momentaufnahme. Nichts, was du vorher hattest, ist weg.
  Dieses Sicherheitsnetz ist es, was dir erlaubt, „mach ruhig, versuch's“ zu sagen statt „bitte
  brich nichts kaputt“.
- **So wird das Projekt ausgeliefert und wächst.** Wenn das Kit veröffentlicht wird, oder wenn
  jemand anderes eine Verbesserung beitragen möchte, ist git die gemeinsame Sprache für „hier ist
  genau, was ich geändert habe“. Dasselbe Werkzeug, das deine lokalen Experimente schützt, ist
  das, was es vielen Menschen erlaubt, am selben Projekt zu bauen, ohne sich gegenseitig im Weg
  zu stehen.

## Die Handvoll Wörter, denen du wirklich begegnest

Du kannst dieses Kit benutzen und nur diese vier kennen. Alles andere kannst du später lernen,
oder nie.

- **Repository** (oder „Repo“) — der Ordner, den git beobachtet, samt seiner gesamten
  gespeicherten Historie. Dieses Kit *ist* ein Repository. Kopierst du es auf deinen Rechner,
  bekommst du die Dateien *und* ihre Historie.
- **Commit** — eine gespeicherte Momentaufnahme, mit einer kurzen Nachricht, die sie beschreibt
  (wie *„Glossar-Seite hinzugefügt“*). Ein Commit ist ein Speicherpunkt. Der Agent macht diese
  während der Arbeit, damit die Historie sich wie eine beschriftete Spur des Geschehenen liest.
- **Clone** — deine eigene Kopie eines Repositorys anlegen, Historie inklusive. `git clone`
  bedeutet schlicht „gib mir meine eigene Kopie zum Arbeiten.“ Das ist der Befehl, den man dir
  vermutlich gezeigt hat.
- **Push** — der *separate*, spätere Schritt, der deine Commits mit der Außenwelt teilt.

Der letzte Punkt trägt eine Beruhigung, die es wert ist, wiederholt zu werden:

> **Committen ist lokal, privat und rückgängig machbar.** Ein Commit zu machen schreibt nur auf
> die Kopie auf deinem eigenen Rechner — es veröffentlicht nichts. Nichts verlässt deinen
> Rechner, bis ein *separater* „Push“-Schritt kommt, und in diesem Kit wird dieser Schritt nie
> ohne dich gemacht. Der Agent kann also so oft speichern, wie er will, während du in deinem
> eigenen Tempo entscheidest, ob überhaupt jemals etwas geteilt wird.

## Noch kein git? (zum Beispiel als ZIP heruntergeladen)

Wenn du das Kit als ZIP heruntergeladen hast oder jemand dir den Ordner kopiert hat, hat der
Ordner die Dateien, aber keine Historie — git beobachtet ihn noch nicht, es gibt also kein
Sicherheitsnetz. Der Agent bemerkt das und **bietet an**, eines einzurichten; er tut nichts, bevor
du ja sagst. Was er dann macht, ist klein und bleibt auf deinem Rechner:

- `git init` macht den Ordner zu einem Repository — git legt darin einen versteckten Ordner
  `.git` an, in dem es die Momentaufnahmen aufbewahrt.
- Ein **erster Commit** speichert alles so, wie es gerade ist, damit es einen Punkt gibt, zu dem
  man zurückkehren kann.

**Es wird nichts hochgeladen.** Kein Konto, kein Server, kein GitHub; das passiert erst mit einem
Push, und den macht der Agent nie ohne dich. Auch dein eigenes Material ist abgedeckt: Die
Arbeitsblätter, Entwürfe und Notizen, die die Packs unter `out/` speichern, landen in denselben
Momentaufnahmen wie alles andere.

**git ist gar nicht installiert?** Der Agent sagt dir, wie du es für deinen Rechner bekommst:

- **Windows** — das Installationsprogramm von <https://git-scm.com/downloads/win> (die
  vorgeschlagenen Einstellungen passen), oder in PowerShell: `winget install --id Git.Git -e`.
- **macOS** — im Terminal `xcode-select --install` ausführen, oder das Installationsprogramm,
  das auf <https://git-scm.com/downloads/mac> verlinkt ist.
- **Linux** — über die Paketverwaltung, zum Beispiel `sudo apt install git`.

Danach das Terminal (und den Agenten) schließen und neu öffnen, damit git gefunden wird. Wenn du
lieber gar nichts installierst: Der Cloud-Weg in [Erste Schritte](../tutorial/getting-started.md)
bringt git schon mit.

## Nichts, wovor man Angst haben müsste

Falls das dein erster Kontakt mit Versionskontrolle ist, halte dich an zwei Dinge und lass den
Rest später kommen: Git *erinnert sich* an Arbeit, es riskiert sie nicht; und jede Speicherung
ist *rückgängig machbar* und *bleibt auf deinem Rechner*. Du musst dir keine Befehle merken, um
davon zu profitieren — der Agent übernimmt das Tagesgeschäft, und wenn dich die Mechanik einmal
interessiert, ist <https://git-scm.com> der richtige Ort dafür.
