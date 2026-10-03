<!-- TRANSLATION-MIRROR
source: README.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 76bd508980cd7943071f456afbfbb3b19ff3805c196819e5708ebfe9146cb61a
-->

**English:** [This page in English](../../README.md)

# vibecore

**Ein agent-first Starter-Kit für den Bau eines edukativen Begleitportals** — interaktive
Demos, ein Glossar, eine Timeline und didaktische Artikelseiten — in Angular. Einfach gesagt:
Du bekommst eine fertige Lern-Website als Vorlage; ein KI-Coding-Agent, der dieses Repository
liest, lernt seine Hausregeln und füllt es mit deinem Thema, während du entscheidest, was
hineinkommt. Die Regeln, denen der Agent folgt — was er allein tun darf, wonach er fragen muss,
was er nie anfassen darf — liefert das Kit mit, und sie werden maschinell geprüft, nicht nur
aufgeschrieben.

> **Scope in einem Atemzug.** Das ist ein *Frontend*-Kit: eine Angular-App plus ein
> Agenten-Betriebssystem drumherum. Es ist **kein** Backend, kein CMS und kein gehosteter
> Dienst — es gibt keinen Server, keine Datenbank, kein Login. Inhalte leben in Dateien; du
> deployst die gebaute Seite als statische Assets.

---

## In 60 Sekunden loslegen — wähl die Tür, die zu dir passt

- **Du benutzt schon einen KI-Coding-Agenten** (Claude Code, oder einen anderen) → richte ihn
  einfach auf dieses Repo. Er liest [`AGENTS.md`](../../AGENTS.md) (Claude Code liest
  [`CLAUDE.md`](../../CLAUDE.md), das es importiert) und lernt die Standards, Skills und
  Sicherheitsregeln von selbst. Versuch *„help“* oder *„onboarding“* zu sagen. Neu darin, mit
  einem Agenten zu arbeiten? [Deine erste Session](tutorial/first-session.md) führt dich
  Schritt für Schritt durch.
- **Du hast noch keinen Agenten, oder bist dir nicht sicher, welchen du nehmen sollst** → lies
  zuerst [Den richtigen KI-Coding-Agenten wählen](explanation/choosing-an-ai-agent.md) (fünf
  Minuten, Kriterien statt Marken) und installiere den, der zu dir passt. Öffne dann
  [`docs/onboarding.html`](../onboarding.html) in deinem Browser (doppelklicken — funktioniert
  offline), beantworte ein paar Fragen, klicke auf **Export**, und füge das Ergebnis in deinen
  neuen Agenten ein, damit er dich einrichten kann.
- **Du willst einfach nur die App laufen lassen** → Erste Schritte weiter unten bringt einen
  Dev-Server hoch.

---

## Erste Schritte

**Voraussetzungen:** [Node.js](https://nodejs.org) (dieses Repo legt **24** in `.nvmrc` fest,
mindestens 24.15; es läuft auch mit 22.22.3+ innerhalb von 22.x oder mit 26+) und
[git](https://git-scm.com). Neu bei git? Sieh dir [Was ist git, und warum](explanation/what-is-git.md)
an.

```bash
npm install      # Abhängigkeiten installieren (einmalig)
npm start        # Dev-Server → http://localhost:2000
```

Das erste `npm start` baut auch die Content-Bundles und beobachtet sie danach — gib der App
also einen Moment, bevor sich die Browser-Seite füllt.

Die Helfer des Kits für PDFs, Bildschirmfotos und den Barrierefreiheits-Check brauchen einen
Browser. Neuere npm-Versionen laden ihn nicht mehr von selbst; `node tools/doctor.mjs` sagt dir,
ob einer da ist, und falls nicht, holt `npx puppeteer browsers install chrome` ihn einmalig.

**Je Betriebssystem:**

- **Windows** — benutze PowerShell oder Git Bash. Wird `npm` nicht gefunden, installiere Node
  über den Link oben und öffne das Terminal neu. Lange Pfade sollten aktiviert sein
  (Windows-11-Standard).
- **macOS** — hast du kein Node, ist der Installer von nodejs.org der einfachste Weg, oder
  `brew install node@24`, falls du Homebrew nutzt.
- **Linux** — installiere Node über deine Distribution oder
  [nvm](https://github.com/nvm-sh/nvm) (`nvm install` liest `.nvmrc`). Dann die beiden Befehle
  oben.
- **„Ich habe überhaupt keine Entwicklungsumgebung“** — du musst nichts installieren. Öffne
  dieses Repository in **GitHub Codespaces** (grüner *Code*-Button → *Codespaces* →
  *Create*), führe dann `npm install && npm run start:codespaces` aus. Codespaces leitet Port
  2000 für dich an einen Browser-Tab weiter. Das ist der empfohlene Weg auf einem gesperrten
  oder leistungsschwachen Rechner.

Vollständiger Schritt-für-Schritt-Rundgang: [Erste Schritte](tutorial/getting-started.md).

---

## Was drinsteckt

- **Eine geschichtete Architektur.** *base* (das Agenten-Betriebssystem — Standards,
  Sicherheit, Bookkeeping, generische Skills) hängt nur vom Kit-**Vertrag**
  ([`kit.json`](../../kit.json)) ab; das *kit* ist diese konkrete Angular-App; optionale
  *packs* fügen rollenspezifische Jobs hinzu. Siehe
  [Die Pack-Ebene](explanation/the-pack-layer.md).
- **Task-Skills**, die der Agent auf Anfrage ausführt — `/onboarding`, `/help`, `/status`,
  `/new-content`, `/new-component`, `/research`, `/ship` und mehr, jeder eine `SKILL.md` unter
  `.claude/skills/`.
- **Ein Sicherheitsmodell** — jede Aktion ist Grün (einfach tun), Gelb (tun, aber erwähnen)
  oder Rot (anhalten und fragen), mit einem einheitlichen Warnformat. Siehe
  [`base/SAFETY.md`](../../base/SAFETY.md); ein PreToolUse-Hook stützt die harten Regeln
  mechanisch ab.
- **Eine Fürsorgepflicht** — der Agent passt unaufgefordert auf dich auf, und zwar in sieben
  Themen, die du im Onboarding einzeln einstellst (`quiet` · `normal` · `active`): Sicherheit
  und Geheimnisse, Datenschutz, Barrierefreiheit, technische Schulden, Kosten, Auffindbarkeit
  und Tempo — dazu eine Lizenzprüfung bei jeder Abhängigkeit, die nie einstellbar ist. Bevor
  etwas öffentlich geht, nennt er ehrlich den Sicherheits- und Barrierefreiheits-Stand, große
  Entscheidungen werden als ADRs festgehalten, und vor dem Selberbauen prüft er, ob es schon
  eine fertige Bibliothek gibt. Er *spricht Dinge an* — er baut dein Projekt nie ungefragt um.
  Siehe [`directives/stewardship.md`](../../directives/stewardship.md).
- **Eine Design-System-Werkstatt** unter `/dev` (nur Entwicklungs-Builds, aus der Produktion
  entfernt) — eine filterbare Komponenten-Galerie, in der die Live-Demo jeder Komponente direkt
  neben der genauen kanonischen Doku sitzt, die der Agent liest.
- **Ein Teacher-Pack** ([`packs/teacher/`](../../packs/teacher/README.de.md)) — Arbeitsblatt-, Quiz-,
  Differenzierungs-, Vertretungsstunden- und Unterrichtseinheiten-Jobs, mit
  Klassenzimmer-Guardrails. Aktivieren durch Ansprechen (*„switch to teacher mode“*).
- **Ein Editor-Pack** ([`packs/editor/`](../../packs/editor/README.de.md)) — die Redaktionskette, um das Kit
  mit dem eigenen Fachthema zu füllen: article-draft, glossary-entry, source-wiring, style-pass,
  variants-brief und release-check, mit Guardrails, die erfundene Quellen, ungestempelte
  Entwürfe und fremden Text aus dem Inhalt heraushalten (*„switch to editor mode“*).
- **Ein Researcher-Pack** ([`packs/researcher/`](../../packs/researcher/README.de.md)) — die Belegschicht,
  an die die Redaktion ihre Aussagen übergibt: source-dossier, claim-check, reading-map,
  dated-event und conflict-log, jeweils mit festen Provenienz-Feldern und ohne Datum, für das
  kein Satz einer Quelle bürgt (*„switch to researcher mode“*).
- **Zweisprachig & barrierefrei** — Inhalt und Oberfläche sind für mehrere Sprachen und
  Varianten in Leichter Sprache strukturiert, und die Komponenten sind auf WCAG AA gebaut.

---

## Dokumentation

Gegliedert entlang der vier [Diátaxis](https://diataxis.fr)-Modi:

| Modus | Für | Hier anfangen |
|---|---|---|
| **Tutorial** (lernen) | Die App zum Laufen bringen und deine erste Agent-Session | [Erste Schritte](tutorial/getting-started.md) · [Deine erste Session](tutorial/first-session.md) |
| **How-to** (eine Aufgabe) | Deployen, eine Seite, eine Quelle oder ein Backend hinzufügen | [How-to-Anleitungen](how-to/) · [Deployen](how-to/deploy.md) · [Eine Seite hinzufügen](how-to/add-a-page.md) · [Eine Quelle hinzufügen](how-to/add-a-source.md) · [Ein Backend hinzufügen](how-to/add-a-backend.md) |
| **Explanation** (verstehen) | Warum das Kit so geformt ist | [Directives & Skills](explanation/directives-and-skills.md) · [Die Pack-Ebene](explanation/the-pack-layer.md) · [Was ist wo](explanation/repo-map.md) · [Den richtigen Agenten wählen](explanation/choosing-an-ai-agent.md) · [Was ist git](explanation/what-is-git.md) |
| **Reference** (Fakten) | Der Vertrag und die Regeln | [`AGENTS.md`](../../AGENTS.md) · [`docs/CONSTITUTION.MD`](../CONSTITUTION.MD) · [`kit.json`](../../kit.json) · [Entscheidungsprotokolle](../adr/) |

---

## Anforderungen & Skripte

**Node** `^22.22.3 || ^24.15.0 || >=26` — der Bereich, den Angular selbst verlangt (siehe `.nvmrc`). Keine weiteren globalen Werkzeuge nötig.

| Befehl | Was er tut |
|---|---|
| `npm start` | Dev-Server auf Port 2000 (mit Content-Watch) |
| `npm run start:codespaces` | Dasselbe, gebunden an `0.0.0.0` für Codespaces/Remote |
| `npm run build:prod` | Produktions-Build → `dist/vibecore/browser/` (mit Integritätsprüfungen) |
| `npm test` / `npm run test:ci` | Unit-Tests (Vitest) |
| `npm run lint` | ESLint (ein grüner Baum — das ist ein CI-Gate) |
| `npm run check:a11y` | Automatischer Barrierefreiheits-Check (axe-core in Headless-Chrome) über die gebauten Seiten — nach `build:prod` ausführen |
> Benutze `npm run build:prod`, nicht ein nacktes `ng build` — ein roher Build überspringt die
> Content-Schritte und die Integritäts-Pipeline. Ein Guard verweigert `npm run ng -- build`, aber
> ein direkt eingetipptes `ng build` kommt durch — die Gewohnheit ist es, die dich schützt.

**Nichts davon geht ins Internet.** Installieren, Bauen, Testen und sämtliche Gates laufen
offline, sobald die Dependencies installiert sind. Die einzige Ausnahme ist
`scripts/corpus-measure.mjs`, ein von Hand gestartetes Recherche-Werkzeug für die Arbeit an
Sprach-Guides: Es lädt Seiten von Hosts herunter, die du selbst angibst, es lädt nichts
hoch, und kein npm-Script und kein Build-Schritt ruft es auf.

---

## Bauen & Deployen

`npm run build:prod` erzeugt eine statische Seite in `dist/vibecore/browser/`. Hoste sie
überall dort, wo statische Dateien ausgeliefert werden, mit einer Regel: unbekannte Routen
müssen auf `index.html` zurückfallen (es ist eine Single-Page-App). Wie du hostest — Static-
Host, Objektspeicher, eigener Webserver — ist deine Wahl; das Kit macht dazu keine Annahme.

---

## Status, Mitwirken & Lizenz

Veröffentlicht und versioniert. Jede Version, und was sich in ihr geändert hat, steht in
[`CHANGELOG.md`](../../CHANGELOG.md); die Versionen folgen
[Semantic Versioning](https://semver.org), ein Breaking Change kommt also nur mit einem
Major-Sprung.

- **Mitwirken:** siehe [`CONTRIBUTING.md`](CONTRIBUTING.md). Eine Änderung ist fertig,
  wenn sie grün baut, die Prüfungen besteht und ihre Doku im selben Commit mitreist.
- **Sicherheit:** melde Schwachstellen vertraulich — siehe [`SECURITY.md`](SECURITY.md).
- **Rollen-Packs — reviewt, aber noch nicht im Ernstfall:** das Editor- und das
  Researcher-Pack ([`packs/editor/`](../../packs/editor/README.de.md),
  [`packs/researcher/`](../../packs/researcher/README.de.md)) liefern zu jedem Job ein ausgearbeitetes
  Beispiel, sind aber noch keine echte Redaktions- oder Recherchewoche lang gelaufen.
- **Teacher-Pack — noch nicht erprobt:** die fünf Jobs in
  [`packs/teacher/`](../../packs/teacher/README.de.md) wurden noch nicht mit echten Lehrkräften
  ausprobiert. Ein Pilot-Kit (Moderationsleitfaden, Fragebögen, Beobachtungsbogen,
  Einwilligung, Auswertungsvorlage; Deutsch, mit englischer Übersetzung) liegt in
  [`packs/teacher/pilot/`](../../packs/teacher/pilot/) bereit. Diese Zeile wird durch eine
  gemessene Aussage ersetzt, sobald eine Auswertung vorliegt — nicht vorher.
- **Lizenz:** Quellcode unter **MIT** ([`LICENSE`](../../LICENSE)); Dokumentation und Inhalt
  unter **CC BY 4.0**. Details in [`LICENSING.md`](LICENSING.md).
