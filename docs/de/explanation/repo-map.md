<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/explanation/repo-map.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 892007a598266c7d00b06b8edbdb53438cb0f59b21c88871cf63ec177ea401e4
-->

# Was ist wo

Öffne dieses Repository in einem Dateibrowser, und du siehst ein paar Dutzend Ordner und
Dateien. Das ist viel, wenn du es nicht selbst gebaut hast. Diese Seite ist die menschliche
Landkarte: kein technisches Inventar, sondern eine Antwort in klarer Sprache auf *„was ist das,
wer liest es, und muss ich es je anfassen?“* — damit du den größten Teil des Baums mit gutem
Gewissen ignorieren kannst und genau weißt, wo du hinschauen musst, wenn du doch etwas willst.

Du musst keine dieser Dateien lesen, um das Kit zu nutzen — dein Agent liest sie für dich. Diese
Karte ist für die Momente, in denen du neugierig bist oder ohne offenen Agenten herumklickst.

## Die zehn Orte, die wirklich zählen

Alles andere ist entweder generiert, Standard-Werkzeug oder Konfiguration, die du selten
öffnest. Diese hier lohnt es sich zu erkennen.

| Ort | Was es ist (und wofür es *da* ist) | Wer es liest | Fasst du es an? |
|---|---|---|---|
| [`AGENTS.md`](../../../AGENTS.md) | Der einseitige Vertrag, den jeder KI-Agent zuerst liest — die Standards, die Sicherheitsregeln und Verweise auf alles andere. Er ist der *Grund*, warum ein Agent hier weiß, wie er sich verhalten soll, ohne dass man es ihm sagt. | Dein Agent (und du, bei Neugier) | Selten — sie ist bewusst kurz und stabil |
| [`.claude/skills/`](../../../.claude/skills/) | Die **benannten Aufgaben** des Agenten — `onboarding`, `help`, `status`, `new-content` und mehr. Jeder Ordner ist ein Skill, den der Agent auf Zuruf ausführen kann. Das ist, *was der Agent kann*. | Dein Agent | Nein — du *rufst* sie durch Sprechen auf, du bearbeitest sie nicht |
| [`directives/`](../../../directives/) | Die **Playbooks** des Agenten — wie er arbeitet: wie er committet, wie er übersetzt, wie er mit vielen Dateien auf einmal umgeht. Leitfaden, keine Schranken. Das ist *wie der Agent gut arbeitet*, destilliert. | Dein Agent | Normalerweise nein |
| [`base/`](../../../base/) | Das **Agenten-Betriebssystem**: die vier Standards (Barrierefreiheit, Datenschutz, Sicherheit, Qualität), das Sicherheitsmodell, die Bookkeeping-Regeln. Das nicht verhandelbare Fundament, das nicht von dieser konkreten App abhängt. | Dein Agent | Nein — das ist der Maschinenraum |
| [`profile/`](../../../profile/) | **Du, in einer Datei.** Nach dem Onboarding hält `profile/USER-MANIFEST.MD` deine Sprache, Ziele und Vorlieben fest, damit jede Agent-Session schon weiß, wie du gern arbeitest. | Dein Agent; es handelt *von* dir | Indirekt — das Onboarding füllt es; du kannst es bearbeiten |
| `src/` | Die **eigentliche App** — der Angular-Code (`src/app/`) und ihre Inhalte und Bilder (`src/assets/`). Das ist das Produkt selbst: die Seiten, Demos, das Glossar und die Timeline, die Menschen sehen werden. | Dein Agent; du, um den Inhalt zu sehen | Ja, irgendwann — aber meist *über* den Agenten |
| [`docs/`](../) | Die **menschliche Dokumentation**, die du gerade liest — Tutorials, How-to-Anleitungen, Erklärungen, auf Englisch und Deutsch (`docs/de/`). Für Menschen geschrieben, nicht für die Maschine. | Du | Nur wenn du die Doku verbessern willst |
| [`specs/`](../../../specs/) | Wo **nicht-triviale Arbeit geformt wird**, bevor sie gebaut wird — ein datierter Ordner pro Idee, damit eine große Änderung erst auf Papier durchdacht wird. Der *Laut-Denken*-Raum des Projekts. | Dein Agent; du, um mitzuverfolgen | Gelegentlich, mit dem Agenten |
| [`JOURNAL.md`](../../../JOURNAL.md) · [`OPEN-QUESTIONS.md`](../../../OPEN-QUESTIONS.md) | Die **Bücher des Projekts.** Das Journal ist das laufende Tagebuch dessen, was in jeder Session geschah; open-questions ist die kurze Liste von Entscheidungen, auf die der Agent *dich* wartet. Zusammen sorgen sie dafür, dass du immer siehst, wo es steht. | Beide — der Agent schreibt, du liest (und antwortest) | Ja — du liest das Journal, du beantwortest die Fragen |
| [`packs/`](../../../packs/) | **Optionale Zusatz-Bündel** für eine Rolle oder einen Workflow — zum Beispiel ein `teacher`-Pack, das Arbeitsblatt- und Quiz-Jobs ergänzt. Aus, bis du eines durch Nachfragen einschaltest. Das sind *zusätzliche Fähigkeiten, die du dazuwählst*. | Dein Agent, wenn ein Pack aktiv ist | Nein — du aktivierst eines durch Sprechen |

## Dinge, die du gefahrlos ignorieren kannst

Wenn du diese beim Herumklicken siehst, sind sie nicht für dich — sie sind generiert oder
Standard-Klempnerei, und nichts davon lohnt es sich von Hand zu lesen oder zu bearbeiten:

- **`node_modules/`** — die heruntergeladenen Bibliotheken, aus denen die App gebaut wird.
  Riesig, automatisch, nie bearbeitet. `npm install` erzeugt es.
- **`dist/`** und **`dist-content/`** — die *gebaute* Ausgabe der App. Von einem Build erzeugt;
  bei jedem Mal überschrieben. Das deployst du, das bearbeitest du nicht.
- **`.angular/`**, **`tmp/`**, **`.idea/`** — Caches und Editor-Kritzelraum. Kann man komplett
  ignorieren.
- **`kit.json`**, **`angular.json`**, **`package.json`**, die `tsconfig*.json`-Dateien —
  Konfiguration, die der Agent und die Build-Werkzeuge lesen. Echt, aber selten etwas, das du
  selbst öffnest.

## „Wo finde ich…“

Die vier häufigsten Dinge, die du tatsächlich ändern willst — und die ehrliche Antwort auf jedes
ist meist *„frag einfach den Agenten“*, aber hier ist, wo es liegt:

| Ich will… | Es liegt in… | Der einfache Weg |
|---|---|---|
| **Text ändern** auf einer Seite | `src/assets/` (Inhalt) oder den Artikel-/Glossar-/Timeline-Daten | Frag den Agenten, oder starte `/new-content` |
| **Die Farben ändern** oder das Aussehen | [`docs/DESIGN-SYSTEM.MD`](../../DESIGN-SYSTEM.MD) definiert die Design-Tokens; die Komponenten nutzen sie | Frag den Agenten — er arbeitet vom Design-System aus, nicht von verstreutem CSS |
| **Eine neue Seite hinzufügen** | `src/app/` (die Routen und Komponenten der App) | Frag den Agenten, oder starte `/new-component` / `/new-content` |
| **Die Sprache ändern**, oder eine hinzufügen | Inhalt liegt in Sprachordnern unter `src/assets/`; menschliche Doku spiegelt nach `docs/de/`, die Doku eines Packs liegt neben dem Original (`README.de.md`) | Frag den Agenten — Übersetzung hat ihren eigenen sorgfältigen Ablauf |

Achte auf das Muster: Für alles Echte ist die Tür dieselbe — **sag dem Agenten, was du willst.**
Diese Karte ist da, damit der Ort, wenn er dir sagt, *wo* er etwas geändert hat, dir schon etwas
bedeutet.

---

Für das *Warum* hinter der Form des Repos — base vs. kit vs. packs — siehe
[Die Pack-Ebene](the-pack-layer.md) und [Directives & Skills](directives-and-skills.md). Um
diese Karte in einer Live-Session anzuwenden, siehe das Tutorial
[Deine erste Session mit dem Agenten](../tutorial/first-session.md).
