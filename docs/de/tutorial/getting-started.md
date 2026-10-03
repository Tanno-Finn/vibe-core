<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/tutorial/getting-started.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 4290eda3c5e0851f7061f653550049ef4a8ad93e9362170d4310e9b794e4033e
-->

# Erste Schritte

Das ist ein Erste-Schritte-Rundgang: von einer frischen Kopie des Repositorys bis zur
geöffneten App im Browser. Beim ersten Mal dauert das etwa zehn Minuten. Du musst **kein**
Entwickler sein — jeder Befehl steht ausgeschrieben da, und am Ende gibt es
einen Weg ganz ohne Installation, falls du auf deinem eigenen Rechner nichts einrichten
möchtest.

Am Ende läuft der Entwicklungsserver unter `http://localhost:2000`, und du kennst die
Handvoll Befehle, die du im Alltag brauchst.

---

## Bevor du anfängst

Du brauchst zwei Dinge installiert:

1. **Node.js** — die Laufzeitumgebung, mit der die App gebaut ist. Dieses Repository legt
   Version **24** fest (in einer Datei namens `.nvmrc`), braucht mindestens 24.15,
   funktioniert aber auch mit 22.22.3+ oder 26+. Wenn du nicht sicher bist, ob du es hast:
   Öffne ein Terminal und führe `node --version` aus. Zeigt das eine Versionsnummer im
   unterstützten Bereich an, bist du startklar. Steht dort „command not found“, installiere Node von
   [nodejs.org](https://nodejs.org) (der „LTS“-Download passt).
2. **git** — das Werkzeug, mit dem das Repository auf deinen Rechner kopiert wird. Prüfen mit
   `git --version`. Noch nie git benutzt und fragst dich, was das überhaupt ist? Lies zuerst
   [Was ist git, und warum](../explanation/what-is-git.md) — ist kurz. Das Projekt stattdessen
   als ZIP heruntergeladen? Geht auch; der Agent bemerkt die fehlende Historie und bietet an, git
   lokal einzurichten, nur mit deinem Ja und ohne etwas hochzuladen.

> **Der Weg ohne Installation:** Wenn du nichts installieren kannst oder willst, spring direkt zu
> [Option B: GitHub Codespaces](#option-b-github-codespaces) weiter unten. Dort läuft alles im
> Browser.

---

## Option A: auf dem eigenen Rechner laufen lassen

### 1. Den Code holen

```bash
git clone <repository-url>
cd vibecore   # (oder wie auch immer der Ordner heißt, den git clone angelegt hat)
```

Ersetze `<repository-url>` durch die Adresse des Repositorys (der grüne *Code*-Button auf der
Projektseite zeigt sie an).

### 2. Die Abhängigkeiten installieren

```bash
npm install
```

Das liest die Abhängigkeitsliste des Projekts und lädt sie in einen lokalen
`node_modules`-Ordner herunter. Das kann beim ersten Mal ein paar Minuten dauern und gibt dabei
viel Fortschrittstext aus — das ist normal. Das musst du nur wiederholen, wenn sich die
Abhängigkeiten ändern.

### 3. Den Entwicklungsserver starten

```bash
npm start
```

Zwei Dinge passieren: Die App kompiliert einmal die Content-Bundles und startet dann einen
Live-Server, der neu baut, sobald du eine Datei änderst. Sobald eine Zeile wie
`➜ Local: http://localhost:2000/` erscheint, öffne diese Adresse in deinem Browser.

Der allererste Ladevorgang kann einen Moment dauern, während der Content noch fertig gebaut
wird. Wenn die Seite ein paar Sekunden lang leer aussieht: abwarten und einmal neu laden.

Um den Server zu stoppen, drücke **Strg + C** im Terminal.

### Hinweise je Betriebssystem

- **Windows** — benutze **PowerShell** oder **Git Bash** (beide bringen git mit). Wird `npm`
  direkt nach der Node-Installation nicht erkannt, schließe das Terminal und öffne es neu, damit
  es das neue Programm findet. Windows 11 hat standardmäßig lange Pfade aktiviert, die dieses
  Projekt braucht.
- **macOS** — der Installer von nodejs.org ist der einfachste Weg. Wenn du Homebrew benutzt,
  funktioniert auch `brew install node@24`. Die eingebaute Terminal-App reicht völlig.
- **Linux** — installiere Node über den Paketmanager deiner Distribution oder über
  [nvm](https://github.com/nvm-sh/nvm); mit nvm liest `nvm install` im Projektordner die
  `.nvmrc` und wählt automatisch die richtige Version.

---

## Option B: GitHub Codespaces

Wenn dir die Installation von Node und git zu viel ist, oder dein Rechner gesperrt oder zu
schwach ist, kannst du alles in der Cloud aus deinem Browser heraus laufen lassen — nichts wird
lokal installiert.

1. Klicke auf der GitHub-Seite des Repositorys den grünen **Code**-Button.
2. Wähle den Tab **Codespaces**, dann **Create codespace**.
3. Warte, bis sich der Editor in deinem Browser öffnet. Er führt `npm install` automatisch für
   dich aus.
4. Führe im Terminal unten Folgendes aus:

   ```bash
   npm run start:codespaces
   ```

5. Codespaces erkennt Port 2000 und bietet an, ihn zu öffnen — klicke **Open in Browser**.

Das ist der empfohlene Weg für einen ersten Blick ohne jede lokale Einrichtung.

---

## Die Befehle, die du wirklich brauchst

| Befehl | Wann |
|---|---|
| `npm start` | Jedes Mal, wenn du lokal an der App arbeiten willst |
| `npm run build:prod` | Um die auslieferbare statische Seite zu erzeugen (in `dist/vibecore/browser/`) |
| `npm test` | Um die Unit-Tests laufen zu lassen |
| `npm run lint` | Um den Code-Stil zu prüfen (das Projekt hält das bei null Problemen) |

> Baue immer mit `npm run build:prod`, nicht mit einem nackten `ng build` — ein roher Build
> überspringt die Integritätsprüfungen. Das Projekt verweigert `npm run ng -- build`, kann aber ein
> direkt eingetipptes `ng build` nicht aufhalten.

---

## Wie geht es weiter?

- **Arbeitest du mit einem KI-Agenten in diesem Repo?** Er liest
  [`AGENTS.md`](../../../AGENTS.md) und kann von hier aus übernehmen. Frag ihn nach *„help“*, um
  zu sehen, was er kann.
- **Willst du verstehen, wie das Projekt organisiert ist?**
  [Directives & skills](../explanation/directives-and-skills.md) erklärt die beiden Arten von
  Anweisung, denen der Agent folgt, und [Die Pack-Ebene](../explanation/the-pack-layer.md) deckt
  optionale Rollen-Bundles wie das Teacher-Pack ab.
- **Bereit für deine erste Arbeits-Session?** [Deine erste Session](first-session.md) führt dich
  durch das Onboarding, eine kleine echte Änderung und deinen ersten Checkpoint.
- **Bereit zu veröffentlichen?** Sieh dir die How-to-Anleitungen unter
  [`docs/how-to/`](../how-to/) an.

Hängengeblieben? Der häufigste Stolperstein beim ersten Durchlauf ist eine zu alte
Node-Version — prüfe `node --version` noch einmal gegen den unterstützten Bereich oben auf
dieser Seite.
