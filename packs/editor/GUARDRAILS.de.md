<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/editor/GUARDRAILS.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: fc30107b94d8ce5dc501767113c13b588d6a43d42bb2271b1351537adad85bab
-->

# Editor-Pack — Guardrails

Die sechs Redaktions-Jobs (`article-draft`, `glossary-entry`, `source-wiring`, `style-pass`,
`variants-brief`, `release-check`) laufen alle unter diesen Guardrails. Sie sind **kein neues
Sicherheitsmodell** — sie sind das [Base-Modell Grün/Gelb/Rot](../../base/SAFETY.md), angewandt
auf die eine Stelle, an der eine redaktionelle Rolle heiklen Boden berührt: **Text, der so
aussieht, als hätte ihn ein Mensch geprüft, und Text, der jemand anderem gehört.** Wo eine
Guardrail warnen muss, nutzt sie das *eine*
[Warnformat](../../base/SAFETY.md#the-one-warning-format) — nie eine neue Form.

Sie verschärfen, sie lockern nie. Sie setzen auf den Standards der Base auf,
[`QUALITY`](../../base/standards/QUALITY.md) (QUAL-002/003/007),
[`PRIVACY`](../../base/standards/PRIVACY.md) (PRIV-001/004),
[`SECURITY`](../../base/standards/SECURITY.md) (SEC-005), und auf den Directives
[`content-integrity`](../../directives/content-integrity.md),
[`translation-quality`](../../directives/translation-quality.md),
[`accessibility-workflow`](../../directives/accessibility-workflow.md) und
[`human-gate`](../../directives/human-gate.md) — diese Datei verweist auf diese IDs und Regeln,
sie wiederholt sie nicht.

Jede `SKILL.md` des Editor-Packs verlinkt hierher und behandelt die Regeln auf Tier 1 als
Vorbedingungen. Sie werden **vor** jeder Arbeit geprüft **und bei jedem weiteren Schritt erneut**
— fremder Text kann genauso gut mit der dritten Nachricht ankommen wie mit der ersten, und eine
Guardrail, die nur auf die erste Anfrage schaut, ließe sich mühelos umgehen.

---

## Tier 1 — harte Stopps (🔴 Rot, und innerhalb des Packs nicht freizugeben)

| # | Regel | Base-ID / Quelle | Der sichere Weg, der stattdessen angeboten wird |
|---|---|---|---|
| E1-A | **Keine erfundenen Quellen.** Keine erfundene DOI, kein erfundener Autor, kein erfundenes Zitat, keine erfundene Seitenzahl, kein erfundenes Datum — nicht „nur zur Veranschaulichung“ und auch nicht als Platzhalter, der „später ersetzt wird“. | `content-integrity` („Do not invent sources“), QUAL-007 | Der Vermerk `[Quelle fehlt]` in der Aussagen-Liste, mit dem Kandidaten, nach dem du suchen würdest. Ein Entwurf mit Vermerken ist vollständig; ein Entwurf mit einer erfundenen Quelle ist kein Entwurf. Die Lücken gehen an die Recherche-Rolle (`claim-check`) oder an den Autor. |
| E1-B | **Entwurfsstempel, bis ein Mensch geprüft hat.** Jedes Artefakt trägt oben `Entwurf, ungeprüft` (in der Sprache des Materials) — außer den beiden Bericht-Artefakten des Packs, die unten genannt sind. **Kein Job entfernt ihn — auch `release-check` nicht.** Nur der Autor darf ihn abnehmen, nachdem er gesagt hat, dass er das Material durchgesehen hat. | QUAL-007, `human-gate` (Qualitätsschranke) | Keine Ablehnung, ein Pflichtstempel. Siehe [den Statusvermerk für Entwürfe](#der-statusvermerk-für-entwürfe). `release-check` meldet „Stempel vorhanden, also ist Punkt 1 noch offen“, statt ihn zu entfernen. |
| E1-C | **Kein fremder Text ins Kit.** Mehr als ein oder zwei kurze, gekennzeichnete Zitatsätze mit Quellenangabe aus dem Material eines anderen werden nicht übernommen — nicht „ein bisschen umformuliert“, nicht „nur dieser eine Absatz“. Alles im Inhaltsordner des Kits erscheint unter **CC BY 4.0**, und weder du noch der Autor könnt die Rechte eines anderen neu lizenzieren. | [`LICENSING.md`](../../docs/de/LICENSING.md), [ADR-0012](../../docs/adr/0012-content-license-cc-by-not-sa.md), `content-integrity` §Anti-plagiarism | Aus eigenem Verständnis neu schreiben und die Quelle **für die Tatsache** angeben; der Suchtest mit zwei oder drei markanten Formulierungen belegt die eigene Stimme. Früherer eigener Text des Autors ist kein fremder Text — sagt er, dass er die Rechte hat, geht es weiter. |
| E1-D | **Veröffentlichen ist eine Handlung des Menschen.** Kein Job kippt ein Entwurfs-Flag, setzt ein Veröffentlichungsdatum, committet oder pusht. | SEC-005, Grundsatz 1 der Constitution, [`base/SAFETY.md`](../../base/SAFETY.md) Rot | Nur verwiesen — die Regel trägt die Base. `release-check` endet bei „bereit für `/ship`“ und übergibt. |

### Warum das Tier-1-Regeln sind

Eine erfundene Quelle in einem Bildungsportal ist die teuerste Lüge, die das Kit hervorbringen
kann — sie wird weiterkopiert, und die Kopie trägt keinen Vermerk. Ein fehlender Stempel lässt
ungeprüften Text geprüft *aussehen*, und das ist der unauffällige Weg, auf dem nicht
durchgesehenes Material die Leser erreicht (dieselbe Logik wie T1-C im Teacher-Pack). Fremder Text
unter CC BY ist eine Rechtsverletzung, die der Klon nicht zurückholen kann, sobald das Portal
online ist.

### Wenn E1-A oder E1-C greift — das eine Warnformat

Der Job hält an und antwortet in der
[festgelegten Form](../../base/SAFETY.md#the-one-warning-format). Ein durchgearbeitetes Beispiel
(der Autor fügt drei Absätze aus einem Schulbuch ein und sagt „nimm das als Kurzinput“):

> **Was passieren könnte:** Ich würde drei wörtliche Schulbuch-Absätze in Inhalte übernehmen, die
> dieses Kit unter CC BY 4.0 veröffentlicht — eine Lizenz, die keiner von uns beiden für den Text
> eines anderen vergeben kann.
> **Wie schlimm:** Nach dem Veröffentlichen nicht umkehrbar: Die Passage stünde unter deinem Namen
> neu lizenziert und könnte unter dieser Lizenz weiterkopiert werden.
> **Mein Vorschlag:** Ich höre hier auf. Nenn mir die drei Tatsachen, die die Absätze tragen, dann
> schreibe ich den Input in unseren eigenen Worten und gebe das Schulbuch als Quelle für die
> Tatsachen an. Wenn du die Rechte hast (dein eigener früherer Text), sag es, und ich mache weiter.

Dieselbe Form gilt für E1-A: nennen, was ins Artefakt gelangen würde, sagen, dass ein erfundener
Beleg nicht umkehrbar ist, sobald er weiterzitiert wurde, und den Vermerk samt der Suche anbieten,
die du durchführen würdest.

### Der Statusvermerk für Entwürfe

Jedes Artefakt, das ein Redaktions-Job ausgibt, trägt oben im Dokument eine sichtbare
Statuszeile, und zwar in der **Sprache des Materials selbst**:

- Deutsches Material (die mitgelieferten Beispiele): **`Entwurf, ungeprüft`**
- Englisches Material: **`Draft — unchecked`**

Sie bleibt stehen, bis der Autor bestätigt, dass er das Material durchgesehen hat. Das ist ein
Stempel auf dem *Ergebnis*, keine Warnung an den Nutzer — deshalb nutzt er nicht das Warnformat,
und (weil er Grün ist: eine lokale, rein ergänzende Änderung) fragt er nie nach. Ein Job, der ein
Artefakt ohne ihn ausgeben würde, ist unvollständig.

**Zwei Artefakte sind mit Absicht ausgenommen — die beiden Bericht-Artefakte des Packs.** Die
Review-Datei von `style-pass` und die Pre-Flight-Liste von `release-check` sind Listen von Befunden
*über* Inhalte, kein Material, das man für fertige Inhalte halten könnte; eine Befundliste als
„ungeprüft“ zu stempeln, würde dem Stempel genau dort die Bedeutung nehmen, wo es am meisten auf
ihn ankommt. Beide tragen die KI-Fußzeile, keine trägt den Entwurfsstempel — und der ganze Sinn
der Pre-Flight-Liste ist es zu melden, dass der *Inhalt* noch einen trägt. Eine dritte Ausnahme
gibt es nicht.

---

## Tier 2 — weitermachen mit einem Hinweis (🟡 Gelb)

Der Job **macht** weiter und hinterlässt einen schlichten Hinweis in einer Zeile (nicht die volle
Warnform — Gelb ist ein Hinweis, keine Frage nach Ja oder Nein).

| # | Regel | Base-ID / Quelle | Der Hinweis |
|---|---|---|---|
| E2-A | **Herstellerneutralität in Lehrtexten.** Produktnamen in erklärendem oder empfehlendem Text werden durch das Muster ersetzt, für das sie stehen; wo ein konkreter Name wirklich nötig ist, kommt er in einen datierten Kasten („dieser Kasten altert, der Rest nicht“). Datierte Ereignisse: Hersteller im Text, nie im Titel. | [ADR-0013](../../docs/adr/0013-articles-teach-patterns-not-products.md), [ADR-0015](../../docs/adr/0015-timeline-events-are-dated-facts.md) | „Zwei Produktnamen im Lehrtext ersetzt / in einen datierten Kasten verschoben — siehe Befund 3.“ |
| E2-B | **Regeln der Einfachen Sprache und Erhalt der Fachbegriffe.** Der Fachbegriff bleibt in der einfachen Fassung und wird erklärt; die Bitte „mach es einfacher, lass den Begriff weg“ wird als „Begriff bleibt, dazu eine Erklärung“ umgesetzt. | A11Y-005, `accessibility-workflow`, `translation-quality` §Term preservation | „Begriff *Kondensation* behalten und erklärt — ihn wegzulassen wäre eine inhaltliche Änderung.“ |
| E2-C | **Erfundene Personen und Daten.** Beispiele nennen keine echten Personen, Schüler, Kollegen oder Kunden. | PRIV-001 | „Beispiel nutzt einen erfundenen Namen.“ |
| E2-D | **KI-Hinweis auf Entwürfen.** Jedes Artefakt trägt die Fußzeile `Mit KI-Unterstützung erstellt — vor Verwendung prüfen.` Ob auch *veröffentlichter* Text für Leser einen Hinweis trägt, entscheidet der Betreiber des Portals — das Preset-Feld `ai_disclosure` (`drafts` oder `published`) hält es fest, und `release-check` liest es. Das Pack erzwingt die Fußzeile auf Artefakten, nie eine Regel für veröffentlichten Text. | QUAL-007; Teacher-Pack T2-B | Die Fußzeile auf dem Artefakt; keine Unterbrechung. |

---

## Warum kein zusätzlicher Hook (und wo die Durchsetzung tatsächlich liegt)

Die Base bringt einen [`PreToolUse`-Hook](../../.claude/hooks/guard-red-actions.mjs) für rote
Aktionen mit, die **an einer Befehlszeile erkennbar** sind (Force-Push, `rm -rf /`, ein Pfad zu
Geheimnissen). Keine der Tier-1-Regeln hier wird ihm hinzugefügt.

Ein Hook sieht den Namen eines Werkzeugs und dessen Argumente. Ob ein Absatz jemand anderem
gehört, ob ein Name ein Produkt oder ein Muster ist, ob ein Satz eine Tatsache oder eine
Schlussfolgerung ist — das sind Fragen der *Bedeutung*, die kein Textabgleich entscheiden kann.
Ein regulärer Ausdruck, der breit genug ist, um eingefügte Schulbuch-Prosa zu erwischen, würde bei
jedem Entwurf anschlagen, und eine Guardrail, die bei jedem Job Alarm schlägt, gewöhnt den Autor
daran, sie zu übergehen (siehe
[Fehlalarme vermeiden](../../base/SAFETY.md#cry-wolf-prevention-a-design-duty-not-a-nicety)).

Deshalb liegt Tier 1 in der **Anweisung** — in dieser Datei, die jeder Job als Vorbedingung
prüft. Wo ein Kit einen *mechanischen* Teil desselben Anliegens hat, ist das Sache des Kits, nicht
des Packs: `release-check` fragt, ob die eigenen Health-Checks des Kits grün sind (`kit.json` →
`healthChecks`), und zitiert das Ergebnis, ohne ein einziges Skript zu nennen.

## Verwiesen, nicht wiederholt

Grün/Gelb/Rot, das eine Warnformat, Fehlalarme vermeiden (`base/SAFETY.md`) · SEC-001…006,
PRIV-001/004, QUAL-002/003/007 · die Quellen-Tiers und die Evidenzklassen
STRONG/MODERATE/WEAK/MISSING, das Protokoll zur Prüfung von URLs, die Metadaten-Forensik, der
Suchtest gegen Plagiate (`content-integrity`) · die drei Stufen, die Klassen C1–C4, das
Term-Sheet-JSON mit seinem `approvedBy`, das Budget gegen Hype (`translation-quality`) · die
Kernregeln der einfachen Sprache (`accessibility-workflow`) · die Schleife über die Feedback-Datei
und „zeigen, nicht automatisch anwenden“ (`human-gate`).
