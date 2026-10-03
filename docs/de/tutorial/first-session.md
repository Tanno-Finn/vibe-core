<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/tutorial/first-session.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 29332289ac4b089a5eefc81cd64fac8494233a414750a3be06199a75355d1c74
-->

# Deine erste Session mit dem Agenten

Das ist ein Rundgang durch dein **erstes echtes Gespräch mit einem KI-Agenten** in diesem
Repo — von einer frischen Kopie bis zu deiner ersten echten Änderung, committet und sichtbar.
Es dauert etwa fünfzehn Minuten. Du musst **kein** Entwickler sein: du
sprichst die ganze Zeit in normaler Sprache mit dem Agenten, und er übernimmt das Tippen.

Wenn der Code noch nicht auf deinem Rechner ist, mach zuerst
[Erste Schritte](getting-started.md) — dieser Rundgang endet mit einer laufenden App; der hier
beginnt mit einem laufenden Agenten. Die beiden sind ein Paar: der eine bringt die *App* zum
Laufen, der andere den *Agenten*.

Am Ende hast du den Agenten kennengelernt, gesehen, was er kann, eine kleine echte Änderung
gemacht und beobachtet, wie er diese Änderung in die Bücher des Projekts schreibt — sodass
nichts, was du hier tust, je ein Rätsel bleibt, das du nicht zurückverfolgen kannst.

---

## Bevor du loslegst

Zwei Dinge:

1. **Der Code, auf deinem Rechner oder in der Cloud.** Entweder ein lokaler Klon (aus
   [Erste Schritte](getting-started.md)) oder das Repo offen in GitHub Codespaces. Die App
   muss dafür nicht *laufen* — der Agent arbeitet an den Dateien, nicht an der Live-Seite.
2. **Ein KI-Coding-Agent.** Wenn du noch keinen hast, lies
   [Den richtigen KI-Coding-Agenten wählen](../explanation/choosing-an-ai-agent.md) (fünf
   Minuten, Kriterien statt Marken), installiere einen und richte ihn auf den Ordner dieses
   Repos. Nicht sicher, was ein „Agent“ überhaupt ist? Diese Seite erklärt es gleich zu Beginn.

Mehr braucht es nicht. Keine zusätzliche Einrichtung — der Agent liest seine eigenen
Anweisungen aus [`AGENTS.md`](../../../AGENTS.md), sobald er das Repo ansieht.

---

## 1. Starte den Agenten und sag Hallo

Öffne den Agenten im Projektordner und begrüße ihn einfach — *„hi“*, oder sag ihm in einer
Zeile, was du gern machen möchtest. Du brauchst weder einen Befehl noch eine besondere
Formulierung.

Bei einem frischen Repo passiert eines von zwei Dingen:

- **Du hast noch kein Manifest.** Der Agent merkt, dass `profile/USER-MANIFEST.MD` fehlt, und
  *bietet* zuerst ein kurzes Onboarding-Interview *an*, mit einem Satz, warum: Danach antwortet
  er in deiner Sprache, auf deinem Niveau und in deiner Länge und baut für dein Publikum, dessen
  Geräte und den Weg, auf dem das Material ankommt — weniger Umwege, weniger Kosten. Er bietet
  an; er zwingt nie. Wir empfehlen, ja zu sagen. Willst du lieber sofort loslegen, tut er das,
  legt ein Start-Profil mit Standardwerten an und erinnert dich **einmal**, kurz, nach deinem
  ersten Ergebnis. So oder so: Erwähnst du unterwegs etwas über dich („ich unterrichte eine
  achte Klasse“, „meine Schüler nutzen iPads“), sagt er dir, dass er das in deinem Profil
  notiert, damit ein späteres Interview überspringt, was er schon weiß.
- **Du hast das Browser-Formular schon ausgefüllt.** Wenn du das Formular
  [`docs/onboarding.html`](../../onboarding.html) ausgefüllt und auf **Export** geklickt hast,
  füge stattdessen diesen Textblock als erste Nachricht ein. Es fragt genau das, was auch das
  Interview fragt — dieselben Fragen, dieselben sieben Watch-Themen mit ihren Stufen —, sodass
  beide Wege beim selben Manifest landen; deines wird daraus eingerichtet.

### Das Onboarding-Gespräch

Wenn du das Interview machst, sind es eine Handvoll freundlicher Fragen in fünf kurzen Runden —
zuerst deine Sprache, dann:

- **Zusammenarbeit** — was du bauen willst, ob etwas Kaputtes *mit* dir Schritt für Schritt
  repariert oder einfach repariert und dir gezeigt werden soll, wie tief du Erklärungen willst,
  und eine leichte Frage danach, was du beruflich machst oder worin du dich richtig gut
  auskennst. Das ist keine Lebenslauf-Frage: Der Agent erklärt dir Technisches damit lieber mit
  Bildern aus einer Welt, die du schon kennst, statt mit Fachjargon — und es ist die am besten
  überspringbare Frage des ganzen Interviews. (Bilder sind ein Angebot — höchstens eins pro
  Erklärung, und bei einer Warnung kommt immer zuerst der genaue Satz. „Lass die Vergleiche“
  beendet sie dauerhaft.)
- **Barrierefreiheit** — ob du oder die Menschen, für die du baust, die Seite ohne Maus, mit
  einem Screenreader oder in sehr einfacher Sprache brauchen. Barrierefreiheit abzuschalten
  wird nur für einen Wegwerf-Prototypen angeboten.
- **Was der Agent für dich im Blick behält** — sieben Themen, die er unaufgefordert beobachtet:
  Sicherheit und Geheimnisse, Datenschutz, Barrierefreiheit, technische Schulden, Kosten,
  Auffindbarkeit (SEO) und Tempo. Jedes läuft auf einer von drei Stufen: `quiet` (der Radar
  läuft weiter, Funde werden notiert; du siehst sie, wenn du fragst, oder bei `status`),
  `normal` (ein schlichter Satz in dem Moment, in dem etwas auffällt, dazu eine Rückfrage an
  natürlichen Pausen) oder `active` (dasselbe, und er bietet zusätzlich an, sich Dinge auch
  ohne akuten Fund anzusehen). Fünf starten auf `normal`, zwei — Auffindbarkeit und Tempo — auf
  `quiet`, weil die fünf älteren vor Schaden schützen und die zwei neueren ein Ergebnis
  verbessern. *„Lass einfach alles auf Standard“* ist eine vollständige Antwort auf diese ganze
  Runde. Und die Stufen regeln nur, wie gesprächig der Agent im Alltag ist: echte
  Sicherheitswarnungen, die harten Regeln und die Ansage vor allem, was Geld kostet, berühren
  sie nie.
- **Deine Umgebung** — Betriebssystem, was für ein Gerät und ob git da ist, damit spätere
  Anleitungen zu dem Rechner passen, den du wirklich hast. Hat der Ordner noch kein git (zum
  Beispiel, weil du ein ZIP heruntergeladen hast), bietet der Agent an, dieses Sicherheitsnetz
  einzurichten, und wartet auf dein Ja — [Was ist git, und warum](../explanation/what-is-git.md)
  erklärt es.
- **Wie deine Arbeit ankommt** — wie fertiges Material zu deinen Lernenden oder deinem Publikum
  kommt (über die Schulplattform wie Moodle, einen Webserver, einen Webseiten-Dienst, auf Papier
  oder USB-Stick, oder nur auf deinem Rechner), welche Geräte sie nutzen, ob jemand einen
  Screenreader verwendet, wie das Internet ist, wer dir technisch helfen kann und ob es
  Datenschutz-Regeln gibt. Die Runde beginnt mit einer Frage und stellt den Rest nur, wo er
  zählt; *„weiß ich nicht“* ist eine gute Antwort. Für die Wege ins Netz ist
  [Die gebaute Seite deployen](../how-to/deploy.md) die Anleitung für später.

**Jede Frage ist überspringbar**, und Überspringen lässt nie eine Lücke: Jede Runde hat
benannte Standards, und eine übersprungene Antwort landet *als Standard markiert* im Manifest —
eine spätere Session weiß dann, dass sie angenommen und nicht gesagt wurde. Du darfst auch
mittendrin aufhören: *„das reicht erst mal“* ist eine gültige Antwort. Der Agent schließt das
Profil mit diesen Standards ab und notiert, wo du aufgehört hast; wenn du wiederkommst und
erneut `onboarding` sagst, fängt er nicht von vorn an, sondern liest das Beantwortete und fragt
nur noch das Offene. („Von vorn anfangen“ ist die eine Formulierung, die deine Antworten
verwirft.)

Am Ende sagt dir der Agent, *was sich jetzt ändert*, statt deine Antworten herunterzubeten —
ein kurzes „so arbeite ich mit dir“, jede Zeile auf etwas zurückführbar, das du gesagt hast,
und ein Vorschlag für deinen nächsten Schritt.

Welchen Weg du auch genommen hast, der Agent hat jetzt ein `profile/USER-MANIFEST.MD` und
spricht ab hier deine Sprache und respektiert deine Vorlieben.

---

## 2. Finde heraus, was er kann — sag „help“

Tippe **`help`** (oder *„was kannst du?“*). Der Agent listet seine **Skills** auf — die
benannten Aufgaben, die er ausführen kann — jede mit einem Einzeiler zum Zweck, in deiner
Sprache. Du siehst Dinge wie:

- **`/onboarding`** — das Interview, das du vielleicht gerade gemacht hast.
- **`/help`** — diese Liste.
- **`/status`** — wo das Projekt steht, in klarer Sprache.
- **`/new-content`** — einen Artikel, einen Glossareintrag, ein Timeline-Ereignis oder eine
  Seite anlegen.
- **`/ship`** — die „ist das wirklich fertig?“-Prüfungen laufen lassen, bevor eine Änderung
  abgeschlossen wird.

Du musst sie dir nicht merken. `help` ist immer da, um dich zu erinnern; sieh es als eine Karte
der Türen, nicht als Handbuch, das du durchlesen musst. Nimm, was zu deinem Vorhaben passt, und
sag es.

---

## 3. Mach eine kleine, echte Änderung

Der schnellste Weg, einem Agenten zu vertrauen, ist zuzusehen, wie er etwas Echtes und
Sicheres ändert. Dieses Kit liefert ein paar **Platzhalter-Glossareinträge** mit
(`seed-term-1`, `seed-term-2`, …), damit es etwas Harmloses zum Üben gibt. Ersetzen wir einen
davon durch einen echten Begriff.

Sag zum Beispiel:

> *„Nimm /new-content und ersetze einen der Glossar-Seed-Begriffe durch einen echten — den
> Begriff ‚Prompt‘, erklärt für Einsteiger.“*

Der `/new-content`-Skill wird:

1. **Prüfen, was dieses Kit tatsächlich herstellen kann** (er liest `kit.json`, statt zu raten)
   und bestätigen, dass ein Glossareintrag dazugehört.
2. **Dir die Form zurücklesen** in einem Satz — *„ein Glossareintrag für Einsteiger zu
   ‚Prompt‘, auf Deutsch“* — und auf dein Ja warten, bevor er irgendetwas schreibt.
3. **Den Eintrag schreiben** an der richtigen Stelle, nach den eigenen Konventionen des Kits,
   und dir sagen, wo er ihn gespeichert hat.

Du hast den Begriff gewählt und die Form freigegeben; der Agent hat das Datei-Gefummel
erledigt. Genau diese Teilung — du entscheidest, er tippt — ist der ganze Sinn. Nichts hiervon
wird veröffentlicht oder irgendwohin gesendet: eine Datei lokal zu schreiben ist eine sichere,
umkehrbare Handlung.

> **Etwas fühlte sich falsch an?** Sag es ihm. *„Mach es einfacher“*, *„das ist zu lang“*,
> *„mach das rückgängig.“* Der Agent rechnet mit Iteration, und weil die Änderung lokal ist,
> kannst du immer einen Schritt zurück.

---

## 4. Sieh zu, wie er die Änderung in die Bücher schreibt

Das ist der Teil, der das Kit für Nicht-Entwickler vertrauenswürdig macht: der Agent
ändert nicht nur Dateien, er **führt ein lesbares Protokoll**, damit du immer sehen kannst, was
passiert ist, ohne Code zu lesen. Zwei Dinge fallen dir nach einer echten Änderung auf:

- **Ein Checkpoint-Commit.** Wenn etwas funktioniert — ein sauberer Build nach einer echten
  Änderung — sichert der Agent einen Checkpoint: einen Git-Commit, dessen Nachricht in *deiner*
  Sprache geschrieben ist und die Geschichte des Geänderten erzählt, mit einem kurzen
  maschinenlesbaren Anhang für die Werkzeuge. Du musstest nicht darum bitten; seine eigene
  Arbeit unterwegs zu committen ist eine der ständigen Gewohnheiten des Agenten. (Ein
  `git push` macht er aber nie — etwas nach außen zu senden, entscheidest du.)
- **Ein Kontoauszug.** Nach einem Arbeitsblock gibt dir der Agent eine zwei- bis vierzeilige
  Zusammenfassung in klarer Sprache: was sich geändert hat, ob der Build grün ist und was als
  Nächstes kommt. Das ist die laufende Quittung, die du überfliegst, statt Diffs zu lesen.

Außerdem findest du einen neuen Eintrag in **[`JOURNAL.md`](../../../JOURNAL.md)** im Repo-Wurzel
— dem nur-anhängenden Tagebuch des Projekts, ein kurzer Abschnitt pro Session:
was gemacht wurde, wie es verifiziert wurde, was offenblieb. Öffne es und lies den Eintrag zu
der Session, die du gerade gemacht hast. Diese Datei sorgt zusammen mit den Commits dafür, dass
ein *anderer* Agent (oder du, nächste Woche) das Projekt aufgreifen und genau wissen kann, wo
es steht.

Um all das jederzeit zusammengefasst zu sehen, sag einfach **`status`**.

---

## 5. Wohin deine Fragen und seine Fragen gehen

Manchmal stößt der Agent auf eine Entscheidung, die wirklich deine ist — *„soll das in beiden
Sprachen bleiben?“*, *„welches der beiden Layouts bevorzugst du?“* —, die aber die Arbeit gerade
nicht stoppen sollte. Solche Fragen verschwinden nicht im Chat-Verlauf. Der Agent schreibt sie,
datiert, in **[`OPEN-QUESTIONS.md`](../../../OPEN-QUESTIONS.md)** im Repo-Wurzel: den Kontext,
ein paar Optionen und seinen vorgeschlagenen Standard.

Es ist eine kleine, gemeinsame To-do-Liste von Entscheidungen, die auf dich warten. Du kannst
direkt in der Datei antworten oder es dem Agenten einfach im Gespräch sagen; beantwortete Fragen
werden als erledigt markiert, damit die Liste ehrlich bleibt. Wenn du `status` ausführst, wird
alles Offene dort für deine Aufmerksamkeit sichtbar gemacht. Sieh es als den Ort, an dem der
Agent dir höflich auf die Schulter tippt — später, nicht mitten in der Aufgabe.

---

## Wie geht's weiter?

Du hast eine ganze Schleife durchlaufen: Start → Onboarding → help → eine echte Änderung → die
Bücher → offene Fragen. Von hier aus:

- **Wissen, wofür jeder Ordner da ist?** [Was ist wo](../explanation/repo-map.md) ist eine
  Landkarte des Repositorys in klarer Sprache — was dir gehört, was der Agent liest, was du
  gefahrlos ignorieren kannst.
- **Die App im Browser zum Laufen bringen?** Falls noch nicht geschehen, macht
  [Erste Schritte](getting-started.md) genau das.
- **Bereit, etwas Größeres zu bauen?** Sag es dem Agenten einfach, oder sag `help` und wähl
  eine Tür. Bei allem, was du veröffentlichst oder deployst, hält er inne und fragt zuerst —
  das ist eine Entscheidung, die er immer dir überlässt.

Steckst du fest, oder hat der Agent etwas getan, das du nicht erwartet hast? Sag `status`, um
dich zu orientieren, und denk daran: jede Änderung, die er gemacht hat, ist ein Commit, den du
zurückverfolgen oder rückgängig machen kannst.
