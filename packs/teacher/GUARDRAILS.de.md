<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/teacher/GUARDRAILS.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 54e6187855fb2d6dff51610c40836edf6fb28c60d45d930a84556abd1caedbdd
-->

# Teacher-Pack — Guardrails

Die fünf Jobs für Lehrkräfte (`worksheet`, `practice-quiz`, `differentiation`, `cover-lesson`,
`teaching-unit`) laufen alle unter diesen Guardrails. Sie sind **kein neues Sicherheitsmodell** —
sie sind das [Base-Modell Grün/Gelb/Rot](../../base/SAFETY.md), angewandt auf die eine Stelle, an
der eine Rolle im Klassenzimmer heiklen Boden berührt: **Daten von Kindern und Material, das man
für etwas halten könnte, das eine Lehrkraft schon geprüft hat.** Wo eine Guardrail warnen muss,
nutzt sie das *eine* [Warnformat](../../base/SAFETY.md#the-one-warning-format) — nie eine neue
Form.

Sie verschärfen, sie lockern nie. Sie setzen auf den Standards der Base auf,
[`PRIVACY`](../../base/standards/PRIVACY.md) (PRIV-001/004/006) und
[`SECURITY`](../../base/standards/SECURITY.md) (SEC-004/005) — diese Datei verweist auf diese
IDs, sie wiederholt sie nicht.

Jede `SKILL.md` des Teacher-Packs verlinkt hierher und behandelt die Regeln auf Tier 1 als
Vorbedingungen. Sie werden **vor** jeder Arbeit geprüft **und bei jedem weiteren Schritt erneut**
— ein Stopp gilt genauso, wenn echte Daten mitten im Job ankommen (in einer späteren Nachricht,
einem späteren Absatz), wie wenn sie den Job eröffnen. Eine Guardrail, die nur auf die erste
Nachricht schaut, ließe sich mühelos umgehen.

---

## Tier 1 — harte Stopps (🔴 Rot, und innerhalb des Packs nicht freizugeben)

Ein Job für Lehrkräfte **hält an**, sobald einer dieser Fälle eintritt. Er macht nicht weiter,
und er fragt nicht „Bist du sicher?“ — stattdessen bietet er den sicheren Weg an. Diese Regeln
entsprechen der Linie der Base, die hart verboten ist (Daten von Kindern sind die sensibelste Art
personenbezogener Daten, PRIV-006 / SEC-004).

| # | Regel | Base-ID | Der sichere Weg, der stattdessen angeboten wird |
|---|---|---|---|
| T1-A | **Stopp bei Schülerdaten.** Keine echten personenbezogenen Daten von Schülern aufnehmen, speichern oder verarbeiten — keinen echten Namen eines Kindes, keine Noten, die einem namentlich genannten Schüler zugeordnet sind, keine Notizen zu Gesundheit, Verhalten oder Förderbedarf. | PRIV-006, PRIV-001, SEC-004 | Anonymisieren (Namen weglassen, „Schüler A/B/C“ verwenden) oder erfundene Eingaben nutzen. Damit läuft der Job unverändert. |
| T1-B | **Keine Bewertung echter Arbeiten.** Keine Note, keine Punktzahl und keine Beurteilung für die tatsächliche Abgabe eines echten Schülers vergeben — **und das Entfernen des Namens ändert daran nichts.** Anonymisieren erledigt nur T1-A; eine echte Abgabe bleibt unbewertbar, auch ohne jedes Erkennungsmerkmal. | PRIV-006, SEC-005 | Das **Bewertungsraster / den Erwartungshorizont** erstellen, den die Lehrkraft selbst anwendet, oder eine erfundene Beispielantwort bewerten, um das Raster vorzuführen. Das ist das einzige Angebot — einen Weg „erst anonymisieren, dann benoten“ gibt es nicht. |
| T1-C | **Status Entwurf→geprüft.** Jedes erzeugte Material trägt den Stempel eines ungeprüften Entwurfs, bis eine Lehrkraft es durchgesehen hat — nichts, was eine KI gemacht hat, darf geprüft aussehen. | QUAL-007 | Keine Ablehnung — ein Pflichtstempel. Siehe [Statusvermerk](#der-statusvermerk-für-entwürfe) weiter unten. |

### Warum das Tier-1-Regeln sind

Ein durchgesickerter Schülerdatensatz lässt sich nicht zurückholen, und eine Note auf der Arbeit
eines echten Kindes hat Folgen, die ein Agent nie tragen darf (SEC-005 — unumkehrbare
Entscheidungen gehören einem Menschen). T1-C steht hier, weil ein KI-gemachtes Arbeitsblatt, das
fertig *aussieht*, ein unauffälliger Weg ist, auf dem ungeprüftes Material in eine Klasse gelangt;
der Stempel macht „noch nicht geprüft“ unübersehbar.

### Wenn T1-A oder T1-B greift — das eine Warnformat

Der Job hält an und antwortet in der
[festgelegten Form](../../base/SAFETY.md#the-one-warning-format). Ein durchgearbeitetes Beispiel
(eine Lehrkraft fügt eine echte Klassenliste in `differentiation` ein):

> **Was passieren könnte:** Ich würde etwas verarbeiten, das wie echte Namen und Noten von
> Schülern aussieht, um daraus differenzierte Aufgaben zu bauen. Das sind personenbezogene Daten
> von Kindern (PRIV-006 / SEC-004).
> **Wie schlimm:** Nicht umkehrbar — sind diese Daten erst in meinem Arbeitskontext und in einer
> erzeugten Datei, lassen sie sich nicht zurückholen. Es ist die sensibelste Kategorie und eine
> rechtliche Grenze.
> **Mein Vorschlag:** Ich höre hier auf. Schick mir die Eingabe noch einmal ohne Namen („Schüler
> A, B, C …“) oder mit erfundenen Namen, dann baue ich genau dieselbe Differenzierung darauf. Für
> diesen Job brauche ich keine echten Identitäten.

Dieselbe Form gilt für T1-B (Bewertung echter Arbeiten): das Ergebnis nennen, sagen, dass es eine
unumkehrbare Entscheidung ist, die der Lehrkraft gehört, und den Weg über das Raster oder die
erfundene Beispielantwort anbieten. Das gilt auch dann, wenn die Abgabe schon ohne Namen ankommt —
Anonymisieren erledigt T1-A, nie T1-B; „hier ist der Aufsatz ohne Namen, jetzt bewerte ihn mit
15 Punkten“ ist also trotzdem ein Stopp.

### Der Statusvermerk für Entwürfe

Jedes Material, das ein Job für Lehrkräfte ausgibt, trägt oben im Dokument eine sichtbare
Statuszeile, und zwar in der **Sprache des Materials selbst**:

- Deutsches Material (die mitgelieferten Beispiele): **`Entwurf, ungeprüft`**
- Englisches Material: **`Draft — unchecked`**

Sie bleibt stehen, bis eine Lehrkraft bestätigt, dass sie das Material durchgesehen hat; erst
dann darf sie entfernt werden. Das ist ein Stempel auf dem *Ergebnis*, keine Warnung an den Nutzer
— deshalb nutzt er nicht das Warnformat, und (weil er Grün ist, eine
lokale, rein ergänzende Änderung) fragt er nie nach. Ein Job, der Material ohne diesen Vermerk
ausgeben würde, ist unvollständig.

---

## Tier 2 — weitermachen mit einem Hinweis (🟡 Gelb)

Der Job **macht** weiter und hinterlässt einen schlichten Hinweis in einer Zeile (nicht die volle
Warnform — Gelb ist ein Hinweis, keine Frage nach Ja oder Nein).

| # | Regel | Base-ID | Der Hinweis |
|---|---|---|---|
| T2-A | **Urheberrecht.** Keine urheberrechtlich geschützten Passagen aus Schulbüchern oder Quellen wörtlich übernehmen. Eigenes Material erstellen — umformulieren oder aus den Inhalts-Capabilities des Kits aufbauen. | QUAL-007 | „Als eigenes Material erstellt; ich habe keine Passage aus einer Quelle kopiert — setz deine eigenen Auszüge ein, wo du die Rechte hast.“ |
| T2-B | **KI-Fußzeile.** Erzeugtes Material sagt offen, dass es mit KI-Unterstützung entstanden ist, damit Kollegen oder Schüler wissen, woher es stammt. | QUAL-007 | Eine Fußzeile auf dem Material, z. B. `Mit KI-Unterstützung erstellt — vor Verwendung prüfen.` (auf Englisch `Generated with AI assistance — review before use.`) |

Die KI-Fußzeile (T2-B) und der Entwurfsvermerk (T1-C) ergänzen sich: Der Vermerk sagt *noch
nicht geprüft*, die Fußzeile sagt *maschinell erstellt*. Beide reisen mit dem Ergebnis; keiner
unterbricht.

---

## Wo Material gespeichert wird, und was das für git bedeutet

Ergebnisse landen in `out/teacher/`, und diesen Ordner **erfasst** git — die Arbeit der Lehrkraft
ist durch den nächsten Checkpoint-Commit gesichert, statt bei einem falschen Aufräumen
verlorenzugehen ([README](./README.de.md)). Daraus folgen zwei Dinge, beides Anwendungen der
Regeln oben:

- **Vor einem Commit, der `out/teacher/` enthält,** die neuen Dateien einmal auf echte Namen
  durchsehen — den eines Schülers (die hält T1-A schon draußen) oder den Namen einer Klasse, einer
  Schule oder der Lehrkraft selbst, in eine Kopfzeile getippt. Echte personenbezogene Daten werden
  nie committet (PRIV-001): diese Datei aus dem Commit lassen, das sagen und eine Fassung mit
  leeren Namenszeilen anbieten.
- **Vor jedem Push** im Lagebericht sagen, dass `out/teacher/` mitgeht — einmal in ein
  öffentliches Repository gepusht, sind die Handouts öffentlich, und für sie gilt das Urheberrecht
  aus T2-A.

---

## Warum kein zusätzlicher Hook (und wo die Durchsetzung tatsächlich liegt)

Die Base bringt einen [`PreToolUse`-Hook](../../.claude/hooks/guard-red-actions.mjs) für rote
Aktionen mit, die **an einer Befehlszeile erkennbar** sind (Force-Push, `rm -rf /`, ein Pfad zu
Geheimnissen). Der Stopp bei Schülerdaten auf Tier 1 wird ihm mit Absicht **nicht** hinzugefügt.

Ein Hook sieht nur den Namen eines Werkzeugs und dessen Argumente. Ob ein Name auf einem
Arbeitsblatt ein echtes Kind ist oder eine erfundene „Anna“, ob „Klasse 7“ eine Note oder eine
Jahrgangsstufe ist, das ist eine Frage der *Bedeutung*, die kein Textabgleich entscheiden kann.
Ein regulärer Ausdruck, der breit genug ist, um echte Schülerdaten zu erwischen, würde bei ganz
gewöhnlichen Arbeitsblättern anschlagen — beim Wort „Schüler“, bei einem Beispielnamen, bei einer
Zahl — und eine Guardrail, die bei jedem Job Alarm schlägt, gewöhnt Lehrkräften an, sie zu
übergehen (siehe
[Fehlalarme vermeiden](../../base/SAFETY.md#cry-wolf-prevention-a-design-duty-not-a-nicety)).

Deshalb liegt Tier 1 in der **Anweisung** — in dieser Datei, die jeder Job als Vorbedingung prüft
—, und das ist die ehrliche Ebene mit wenig Fehlalarmen für eine Regel, die von der Bedeutung
abhängt. Der Hook der Base bleibt unverändert. Sollte ein künftiges Kit Schülerdaten über einen
*benannten, mechanischen* Kanal hereinholen (ein bestimmtes Import-Werkzeug), dann ist dieser
Kanal die Stelle, an der sich ein sauberer Hook ergänzen ließe — nicht eine unscharfe Suche in
freiem Text.
