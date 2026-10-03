<!-- TRANSLATION-MIRROR
source: CONTRIBUTING.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: a9aa34da72433fcb9d9117aa8e2c3eb2418bf4a2e3778f11a1d127c33e0cb0eb
-->

**English:** [This page in English](../../CONTRIBUTING.md)

# Mitwirken

Danke, dass du überlegst, etwas beizutragen. Dieses Projekt ist ein agent-first Starter-Kit,
darum legt es an sich selbst dieselbe Messlatte an, die es seinem Agenten vorgibt: Eine
Änderung ist fertig, wenn sie grün baut, ihre Prüfungen besteht und ihre Dokumentation im
selben Commit mitkommt.

Wer an diesem Projekt mitwirkt, verpflichtet sich, seinen
[Verhaltenskodex](CODE_OF_CONDUCT.md) einzuhalten.

## Wie du helfen kannst

- **Einen Fehler melden** oder **ein Feature vorschlagen**: Eröffne ein Issue (Vorlagen führen
  dich durch).
- **Die Doku verbessern**: Die Dokumentation ist Teil des Produkts; Korrekturen und
  verständlichere Erklärungen sind genauso willkommen wie Code.
- **Eine Änderung einreichen**: Siehe den Ablauf für Pull Requests weiter unten.

## Bevor du mit einer Code-Änderung anfängst

1. Forke das Repository und lege einen Branch vom Standard-Branch aus an.
2. Stell zuerst sicher, dass du es bauen kannst: `npm install`, dann `npm start` (siehe
   [Erste Schritte](tutorial/getting-started.md)).

## Die Prüfungen, die eine Änderung bestehen muss

Das sind genau die Prüfungen, die die CI ausführt (`.github/workflows/ci.yml`). Führ sie also
lokal aus, bevor du einen Pull Request eröffnest:

| Prüfung | Befehl | Muss sein |
|---|---|---|
| Lint | `npm run lint` | null Probleme |
| Formatierung | `npm run format:check` | keine Datei außerhalb des Prettier-Stils |
| Integrität des Agentensystems | `node scripts/verify-harness.mjs` | alle Prüfungen grün |
| Selbsttest des Sicherheits-Hooks | `node .claude/hooks/guard-red-actions.test.mjs` | alle Fälle bestehen |
| Unit-Tests (die Baseline-Prüfung der CI) | `npm run test:baseline` | grün, auf oder über der Baseline |
| Produktions-Build (inkl. Integrität) | `npm run build:prod` | besteht |
| Barrierefreiheit der gebauten Seiten | `npm run check:a11y` (nach `build:prod`) | kein neuer `[hard]`-Verstoß |
| Secret-Scan | gitleaks, nur in der CI (deine Commits bei jedem Push und Pull Request, die ganze Historie wöchentlich); lokal `gitleaks git`, falls du es installiert hast | kein Fund |

Beide Testbefehle führen dieselben Specs aus: die kuratierte Vitest-Auswahl, die in
`test.include` von `angular.json` steht. Eine Spec, die dort nicht steht, läuft bei keinem
der beiden. `npm run test:ci` (`ng test --watch=false`) führt sie aus und schlägt bei einem
roten Test fehl. `npm run test:baseline` (`scripts/check-test-baseline.mjs`) führt sie genauso
aus und schlägt zusätzlich fehl, wenn die Zahl der grünen Dateien oder Tests unter die
festgehaltene Untergrenze fällt oder wenn ein Test übersprungen oder als todo markiert ist.
Die Baseline-Prüfung ist das, was die CI direkt aufruft, und `npm run build:prod` führt sie
ebenfalls aus: nach dem Kompilieren und den Integritätsprüfungen, bevor das Build-Manifest
geschrieben wird und `scripts/verify-build.js` das Ergebnis als letzten Schritt des Builds
prüft. Eine Änderung, die unter `test:ci` grün ist, kann also trotzdem an der
Baseline-Prüfung scheitern, wenn sie einen Test entfernt oder übersprungen hat. Für sich allein
ausgeführt (`node scripts/verify-build.js`) ist diese letzte Prüfung die, die du machen
solltest, bevor du ein `dist/` veröffentlichst: Sie schlägt fehl, wenn das Build-Manifest fehlt
oder älter ist als die Build-Ausgabe, so wie nach einem rohen `ng build`.

## Was „fertig“ hier heißt

- **Doku kommt mit dem Code.** Wenn du Verhalten änderst, aktualisiere die betroffene Doku in
  derselben Änderung: die kanonische Doku einer Design-System-Komponente, die `SKILL.md` eines
  Skills, eine How-to-Anleitung. Das Kit behandelt veraltete Doku als Fehler.
- **Keine Schulden hinter Unterdrückungen versteckt.** Bring Lint nicht mit `eslint-disable`,
  `as any` oder `@ts-ignore` zum Schweigen; behebe das eigentliche Problem. Der Code wird mit
  Absicht bei null Lint-Problemen gehalten.
- **Zeitlos und bereinigt halten.** Texte für Nutzer nennen keine bestimmten Anbieter, Preise
  oder festgelegten Versionen, außer in einem klar datierten Kasten, und enthalten nie
  Personennamen, private Domains oder Zugangsdaten.
- **Kleine, prüfbare Commits.** Commit-Nachrichten sagen, was sich geändert hat und warum.
- **Kommentare sind derzeit zweisprachig.** Bezeichner und Dokumentation sind Englisch; ein
  Teil der Kommentare im Code ist Deutsch (die Herkunft des Kits). In Beiträgen ist beides in
  Ordnung, und es ist willkommen, einen deutschen Kommentar ins Englische zu übersetzen, während
  du eine Datei bearbeitest.

## Pull Requests

Eröffne einen Pull Request gegen den Standard-Branch und füll die Vorlage aus. Beschreib, was
sich geändert hat, warum und wie du es geprüft hast. Ein Maintainer prüft nicht-triviale
Änderungen vor dem Merge; rechne bei allem, was über die Korrektur eines Tippfehlers hinausgeht,
mit einem zweiten Paar Augen.

## Lizenz von Beiträgen

Mit deinem Beitrag stimmst du zu, dass er unter denselben Bedingungen lizenziert ist wie das
Projekt: Code unter MIT und Inhalte unter CC BY 4.0 (siehe [`LICENSING.md`](LICENSING.md)).
Du bestätigst, dass du den Beitrag selbst geschrieben hast oder anderweitig die Rechte besitzt,
ihn zu diesen Bedingungen zu lizenzieren. Füge keine Texte, Bilder oder Code ein, die unter
einer Share-Alike- oder Copyleft-Lizenz stehen (CC BY-SA, GPL und ähnliche): Die Lizenzen
dieses Projekts können diese Bedingungen nicht mittragen. Material von Dritten darf nur unter
einer Lizenz aufgenommen werden, die mit MIT (Code) oder CC BY 4.0 (Inhalte) verträglich ist,
und muss mit Quellenangabe versehen sein.

## Ein Hinweis zu den Agenten-Werkzeugen

Ein großer Teil dieses Repositorys ist Gerüst für einen KI-Coding-Agenten (siehe
[`AGENTS.md`](../../AGENTS.md)). Du musst keinen Agenten benutzen, um beizutragen, denn jeder
Befehl oben funktioniert auch von Hand. Wenn du aber einen benutzt, kennt er diese Regeln schon
und kann die Prüfungen für dich ausführen.
