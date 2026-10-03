<!-- TRANSLATION-MIRROR
source: SECURITY.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 00443dc584d6f0e72e2dc0632e244f55cd3c8bef50ca5710d01d5c5e4013e94d
-->

**English:** [This page in English](../../SECURITY.md)

# Sicherheitsrichtlinie

## Eine Sicherheitslücke melden

Bitte melde Sicherheitsprobleme **privat**. Eröffne für eine vermutete Sicherheitslücke kein
öffentliches Issue.

Nutze dafür GitHubs private Meldung von Sicherheitslücken in diesem Repository: den Reiter
**Security** → **Report a vulnerability**. Damit öffnest du ein privates Advisory, das nur die
Maintainer sehen, sodass das Problem bewertet und behoben werden kann, bevor es öffentlich
wird.

> Die private Meldung von Sicherheitslücken muss ein Admin des Repositorys erst einschalten
> (Settings → Code security → „Private vulnerability reporting“), bevor dieser Button
> erscheint. Siehst du ihn nicht, hat der Maintainer sie noch nicht aktiviert. Weich dann bitte
> auf GitHubs allgemeinen Weg zum Melden von Missbrauch aus, oder weise in einem knappen,
> öffentlichen Issue ohne heikle Details darauf hin und bitte den Maintainer, sie zu aktivieren.

Bitte gib in deiner Meldung an:

- worin das Problem besteht und welche Auswirkung es deiner Meinung nach hat,
- die Schritte, um es nachzustellen (ein minimales Beispiel hilft am meisten),
- die Version, den Commit oder den Branch, auf dem du es beobachtet hast.

Du kannst mit einer Eingangsbestätigung deiner Meldung rechnen, mit einer Einschätzung, ob
das Problem in den Geltungsbereich fällt, und, falls ja, mit einer Behebung und einer
abgestimmten Veröffentlichung, sobald die Behebung verfügbar ist. Bitte lass eine angemessene
Frist, um das Problem anzugehen, bevor es öffentlich diskutiert wird.

## Geltungsbereich

Das ist ein **Frontend**-Kit: eine statische Single-Page-Application ohne eigenen Server,
eigene Datenbank oder eigene Anmeldung. Angulars Server-Renderer läuft nur beim Build (um die
Seiten vorab in statisches HTML zu rendern) und im lokalen Dev-Server; das Kit liefert keinen
Einstiegspunkt für einen Laufzeit-Server (`server.ts`) mit, und das deploybare Ergebnis,
`dist/vibecore/browser/`, besteht aus einfachen Dateien. Die wichtigsten Arten von Problemen
sind darum zum Beispiel Cross-Site-Scripting in der Art, wie Inhalte gerendert werden
(einschließlich Markup, das im vorab gerenderten HTML landet), unsicherer Umgang mit nicht
vertrauenswürdigen Eingaben im Browser, Sicherheitslücken in Abhängigkeiten oder eine
Schwachstelle im Build oder in den Werkzeugen.

Wenn du einen Node-Server für das Rendern auf Abruf hinzufügst, geh von Angulars Vorlage
`AngularNodeAppEngine` aus: Setz `allowedHosts`, schalte `x-powered-by` ab, sende die
Security-Header aus [der Deploy-Anleitung](how-to/deploy.md) und füge einen Error-Handler
hinzu, der keine Stack-Traces preisgibt.

Wenn du das Kit um ein Backend erweiterst (siehe
[Ein Backend hinzufügen](how-to/add-a-backend.md)), bist du für die Sicherheit dieses Servers
selbst verantwortlich. Die unverhandelbaren Punkte der Anleitung (nie Secrets im Client
ausliefern, nie dem Browser vertrauen, auf dem Server validieren) sind aber die Grundlage.

## Der Sicherheits-Hook für Agenten

Das Kit liefert einen `PreToolUse`-Hook für Claude Code mit,
`.claude/hooks/guard-red-actions.mjs`, der unumkehrbare oder nach außen gerichtete Aktionen
verweigert, die ein KI-Agent in deiner Arbeitskopie ausführen könnte: Force-Push und andere
Umschreibungen der Historie, das Schreiben oder Lesen echter Secret-Dateien, das Löschen des
Projekts oder seines `.git`, Veröffentlichen und Deployen sowie Änderungen am Hook selbst,
auch sein Verschieben oder Umbenennen. Er ist eine zweite Schicht hinter den schriftlichen
Regeln in [`base/SAFETY.md`](../../base/SAFETY.md), keine Sandbox: Er liest Befehlszeilen und
Dateipfade, und was er nicht sehen kann, steht dort im Abschnitt „What the hook cannot see“.
Er verweigert, wenn er seine Eingabe nicht parsen kann, aber ein Hook, der in einen Timeout
läuft oder nicht starten kann, lässt den Aufruf durch.

Ein Weg, einen Befehl, den der Hook verweigern soll, an ihm vorbeizubringen (eine neue
Schreibweise eines Force-Push, eine Pfadform, die er nicht normalisiert, ein Werkzeug, das er
nicht sieht), fällt in den Geltungsbereich. Melde ihn privat wie oben beschrieben; ein
Regressionstest für den Fall ist das Nützlichste, was du beilegen kannst.

## Bekannte Advisories zu Abhängigkeiten

`npm audit` soll ohne Befund durchlaufen, Entwicklungsabhängigkeiten eingeschlossen, und
derzeit wird kein Advisory wissentlich mitgeführt. Die Prüfung der Barrierefreiheit steuert
axe-core über Puppeteer, nicht über `@axe-core/cli`, dessen Abhängigkeit `chromedriver`
`adm-zip` mit bekannten Advisories hereinzieht (GHSA-vwc7-r8mq-g2x9, GHSA-7q85-xj36-vmfc);
so soll es bleiben.

Alles, was `npm audit` meldet, ist ein Fehler: Leg die Version über `overrides` in
`package.json` fest und vermerke es im Changelog. Falls ein Advisory jemals wissentlich
mitgeführt werden muss, halte es hier mit Begründung fest, statt es stummzuschalten.

## Unterstützte Versionen

Dieses Projekt steht bei 1.x. Unterstützt werden nur das neueste Release und der aktuelle
Stand des Standard-Branches. Es gibt keine Rückportierung auf ältere Minor- oder
Patch-Versionen; aktualisiere auf das neueste Release, um eine Behebung zu bekommen.

| Version | Unterstützt |
|---|---|
| 1.0.x | Ja |
| < 1.0 | Nein |
