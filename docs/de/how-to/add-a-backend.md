<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/how-to/add-a-backend.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: a654aac2c9a287023981d527f29302df02c50b14be33f579030cad2934736802
-->

# Ein Backend hinzufügen (falls du eines brauchst)

Dein Ziel: dynamisches Verhalten hinzufügen — ein Kontaktformular, das wirklich versendet,
gespeicherte Benutzerkonten, serverseitige Analytics, geschützten Inhalt — zu einem Kit, das
ohne Server ausgeliefert wird. Diese Anleitung hilft dir zu entscheiden, **ob** du ein Backend
brauchst, und zeigt dir, **wo** du eines anschließt, falls ja. Sie schreibt dabei keine Sprache,
kein Framework und keine Datenbank vor.

## Das Kit ist absichtlich reines Frontend

Ab Werk hat vibecore weder Server noch Datenbank. Inhalte leben in Dateien, der
Produktions-Build ist ein Ordner statischer Dateien (siehe
[Die gebaute Seite deployen](deploy.md)), und alles, was Besucher sehen, wird
in ihrem eigenen Browser gerendert. Das ist eine bewusste Design-Entscheidung, und sie bringt
dir:

- **Deploybarkeit.** Eine statische Seite lässt sich überall billig hosten, ohne etwas am
  Laufen halten oder patchen zu müssen.
- **Keine Geheimnisse, die durchsickern können.** Ohne Server gibt es beim Ausliefern der Seite
  keinen API-Key und kein Datenbank-Passwort — also nichts, was versehentlich offenliegen kann.
- **Geringer Wartungsaufwand.** Keine Laufzeitumgebung, die überwacht, skaliert oder um 3 Uhr
  nachts am Leben gehalten werden muss.

Ein Backend hinzuzufügen gibt einen Teil davon wieder auf. Bevor du das tust, prüfe, ob du
wirklich eines brauchst.

## Zuerst entscheiden, ob du überhaupt ein Backend brauchst

Viele Dinge, für die man normalerweise zu einem Backend greift, lassen sich **ohne einen
eigenen Server** erledigen — indem das Frontend direkt einen Drittanbieter-Dienst aufruft, oder
indem alles rein clientseitig bleibt:

- **Ein Kontaktformular** → auf einen Formular-/E-Mail-Zustelldienst zeigen, der ein POST vom
  Browser entgegennimmt. Kein eigener Server nötig.
- **Einfache Analytics** → ein gehosteter Analytics-Anbieter, den du als Client-Snippet
  einbindest.
- **Kommentare** → ein einbettbares Drittanbieter-Kommentar-Widget.
- **Suche über die eigenen Inhalte** → oft clientseitig machbar, da der Inhalt ohnehin schon
  als Dateien ausgeliefert wird.

**Du brauchst tatsächlich ein eigenes Backend, wenn eine oder mehrere der folgenden Aussagen
zutreffen:**

- **Ein Geheimnis muss geheim bleiben.** Ein Aufruf braucht einen API-Key, ein Token oder eine
  Zugangsdaten, die für Besucher *nicht* sichtbar sein dürfen. Alles, was der Browser sehen
  kann, kann jeder sehen (mehr dazu weiter unten) — also muss das Geheimnis auf einem Server
  liegen, den du kontrollierst und der den Aufruf stellvertretend für den Browser macht.
- **Du besitzt dauerhaften Zustand.** Benutzerkonten, geräteübergreifend gespeicherter
  Fortschritt, eingereichte Datensätze — alles, was zwischen Besuchen und Nutzern
  erhalten bleiben und vertrauenswürdig sein muss.
- **Du musst Regeln durchsetzen, nicht nur anzeigen.** Geschützter Inhalt, Ratenbegrenzung,
  Zahlungen, Berechtigungen — alles, wo ein entschlossener Nutzer *daran gehindert* werden muss,
  etwas zu tun, statt ihm bloß den Button *nicht anzuzeigen*.
- **Kein Drittanbieter-Dienst passt**, und die Logik muss tatsächlich irgendwo laufen, das du
  kontrollierst.

Trifft nichts davon zu, bevorzuge einen gehosteten Dienst, den das Frontend aufruft — so
behältst du die oben genannten Vorteile des statischen Hostings. Trifft eines zu, lies weiter.

## Wo die Anschlussstellen sind

Das Kit wurde exportiert, wobei die serverabhängigen Teile entfernt, ihre **Frontend-Anschlüsse
aber erhalten** wurden — du hast also saubere Stellen, um eine API anzuschließen. Das sind die
natürlichen Integrationspunkte:

- **Bewusste No-op-Service-Stubs** in `src/app/services/`. Jeder war in der Anwendung, aus der
  dieses Kit destilliert wurde, ein echter, mit einem Backend sprechender Service; der Export
  hat den Rumpf durch einen Stub ersetzt, der kompiliert und läuft, aber nichts tut. Ihre
  Datei-Header sagen das ausdrücklich. Die wichtigsten:
  - **`analytics.service.ts`** (`AnalyticsService`) — `initialize()` und
    `trackConsentDecision()` sind No-ops. Hier würdest du Telemetrie an einen
    Analytics-Endpunkt senden.
- **Ein reines Frontend-Feature ohne Persistenz dahinter:** `user-progress.service.ts`
  (`UserProgressService`) verfolgt den Lernfortschritt — abgeschlossene Quiz, Checkpoints
  und Lernpfade —, aber der Zustand liegt im `localStorage` und geht nicht weiter, und das
  erst, wenn der Besucher der Speicherung zugestimmt hat
  (`PrivacyConsentService.hasProgressConsent()`; vorher bleibt er im Arbeitsspeicher). Das
  ist die natürliche Anschlussstelle, um den Fortschritt an ein Konto zu synchronisieren;
  behalte dabei die Einwilligungsprüfung bei.
- **Ein echter Client ohne Server dahinter:** `feedback.service.ts` (`FeedbackService`) baut
  bereits eine Nutzlast und sendet sie per POST an einen Kontakt-/Feedback-Endpunkt — er ist im
  Frontend voll verdrahtet und braucht nur noch einen Endpunkt, der sie entgegennimmt. Er ist
  ein gutes Vorbild dafür, wie „der Browser ruft deine API auf“ in dieser Codebasis aussieht.
- **Endpunkt-Konfiguration** in `src/environments/environment.ts`. Felder wie
  `analyticsEndpoint` und `timeGateEndpoint` sind absichtlich leere
  Zeichenketten — ein leerer Wert deaktiviert den zugehörigen Aufruf. Trag deine eigenen URLs
  ein, um das Verhalten einzuschalten.
- **Der Kit-Vertrag** `kit.json` deklariert die `capabilities` der App (Inhalts- und
  Seitentypen, die das Kit bereitstellt). Lies ihn, um zu verstehen, welche Anschlussflächen
  existieren, bevor du eine erweiterst — ein Backend sollte eine vorhandene Anschlussstelle
  bedienen, nicht eine parallele danebensetzen.

Das Muster ist in jedem Fall dasselbe: Der Browser stellt eine Anfrage an eine URL, die dir
gehört, und dein Backend beantwortet sie. Du füllst nur die andere Seite eines Aufrufs, den das
Frontend schon zu stellen weiß.

## Durchgerechnetes Beispiel: der Feedback-Endpunkt

Der Feedback-Dialog ist die eine Anschlussstelle, die im Frontend voll verdrahtet ist und nur
auf einen Server wartet. Er ist standardmäßig abgeschaltet und wird genauso konfiguriert wie
die Endpunkte oben:

- **Konfigurieren** über `feedback.endpoint` in `src/environments/environment.ts` (und
  `environment.prod.ts`), gesetzt auf eine URL, die dir gehört. Solange dieser Wert eine leere
  Zeichenkette ist, wird der Feedback-Button (das Megafon-FAB) gar nicht erst angezeigt — kein
  toter Button, kein fehlschlagendes Absenden. Sobald du die URL setzt, erscheint der Button
  und beginnt zu senden.
- **Was dein Endpunkt entgegennehmen muss:** ein HTTP-`POST` mit einem JSON-Body. Das Frontend
  setzt nie einen Auth-Header, der Endpunkt ist also öffentlich erreichbar — siehe die Hinweise
  zu Spam und Geheimnissen weiter unten. Die Form, entnommen aus `FeedbackService`, ist:

  ```jsonc
  {
    "type": "positive | negative | idea | bug",
    "message": "string (optional)",
    "email": "string (optional)",
    "screenshot": "string (optional)",
    "honeypot": "",          // Anti-Spam: Anfrage ablehnen, wenn dies nicht leer ist
    "metadata": {            // automatisch erfasst
      "pageUrl": "string", "pageTitle": "string", "language": "string",
      "theme": "string", "viewport": { "width": 0, "height": 0 },
      "browser": "string", "timestamp": "ISO-8601 string",
      "category": "string (optional)", "rating": 0
    }
  }
  ```

- **Was er zurückgeben muss:** bei Erfolg JSON `{ "success": true }`. Gib HTTP `429` zurück,
  wenn du einen Client ratenbegrenzt (der Dialog zeigt dafür eine eigene „zu viele
  Nachrichten“-Meldung); jeder andere Nicht-2xx-Status erscheint als generischer Fehler.
- **Skizze (framework-unabhängig).** Egal welchen Stack du wählst, der Handler sieht in etwa so
  aus:

  ```
  on POST /feedback:
    if body.honeypot is not empty:   return 200 { success: true }   # Bots stillschweigend verwerfen
    if rate_limit_exceeded(client):  return 429
    validate(body); sanitize(body.message, body.email)              # dem Client nie trauen
    store_or_email(body)                                            # DB-Eintrag, Ticket oder E-Mail
    return 200 { success: true }
  ```

Halte die Anti-Spam-Behandlung serverseitig: Das `honeypot`-Feld und jede Ratenbegrenzung sind
nur wirksam, wenn der Server sie durchsetzt. Und beachte die allgemeine Regel weiter unten: Der
Endpunkt bekommt kein Geheimnis vom Browser, also lebt jede Zugangsdaten, die er braucht (ein
Mail-API-Key, ein Datenbank-Passwort), ausschließlich auf dem Server.

## Nicht verhandelbar, egal welchen Stack du wählst

Diese Punkte gelten unabhängig von Sprache, Framework oder Datenbank, für die du dich
entscheidest. Es sind keine Stil-Vorlieben — sie falsch zu machen ist genau der Weg, wie Seiten
kompromittiert werden.

- **Geheimnisse landen nie im Frontend.** Alles unter `src/` — jeder Service, jeder
  Konfigurationswert, jede Environment-Datei — wird ins öffentliche Bundle kompiliert und ist
  von jedem lesbar, der die Seite öffnet. API-Keys, Tokens und Passwörter müssen **ausschließlich**
  auf deinem Server liegen und dürfen nie im Frontend-Code oder in `environment*.ts` landen.
  Wenn der Browser ein Geheimnis erreichen kann, ist es keins.
- **Dem Browser ist nicht zu trauen.** Alles, was vom Client gesendet wird, kann eingesehen,
  verändert oder gefälscht werden — Request-Bodys, Header, versteckte Felder, „deaktivierte“
  Buttons, clientseitige Prüfungen. Behandle jede eingehende Anfrage als potenziell feindselig,
  egal wie deine eigene Oberfläche sie normalerweise erzeugen würde.
- **Auf dem Server validieren und autorisieren.** Prüfe jede Eingabe erneut und setze jede
  Berechtigung und jedes Limit serverseitig durch. Clientseitige Validierung ist eine
  Annehmlichkeit für ehrliche Nutzer; sie ist keine Sicherheit. Wenn eine Regel
  zählt, muss der Server sie durchsetzen.

## Zusammenfassung

1. Zuerst fragen, ob du überhaupt ein Backend brauchst — viele Wünsche erfüllt bereits ein
   Drittanbieter-Dienst, den das Frontend aufruft.
2. Ein eigenes Backend brauchst du, wenn ein Geheimnis verborgen bleiben muss, du dauerhaften
   Zustand besitzt, oder du eine Regel *durchsetzen* musst statt sie nur anzuzeigen.
3. Schließ es an den vorhandenen Anschlussstellen an: den No-op-Service-Stubs in
   `src/app/services/`, den leeren Endpunkt-Feldern in `environment.ts` und den in `kit.json`
   deklarierten Capabilities.
4. Was auch immer du baust: Geheimnisse vom Client fernhalten, dem Browser nichts glauben,
   serverseitig validieren.
