# Pre-Flight — Der Wasserkreislauf · Zieldatum: 2026-09-12

Umfang: der Artikel „Der Wasserkreislauf“ und der Glossar-Eintrag „Kondensation“.

| # | Prüfpunkt | Status | Beleg |
|---|---|---|---|
| 1 | Entwurfsstempel entfernt (durch Menschen bestätigt) | ❌ | Beide Artefakte tragen „Entwurf, ungeprüft“; eine Prüfung wurde nicht bestätigt. Der Stempel bleibt — dieser Job entfernt ihn nicht (E1-B). |
| 2 | Aussagen-Liste ohne MISSING · Quellenkarte vorhanden | ❌ | Quellenkarte vom 2026-09-05 liegt vor; A5, A6 und A7 stehen auf MISSING. Der Glossar-Eintrag trägt einen Marker für die allgemeine Definition. |
| 3 | Varianten vollständig (de, de-easy, en, en-easy) oder dokumentierter Override | ❌ | de: Entwurf. de-easy: Adaption vorhanden, Selbstcheck fehlt noch. en, en-easy: nicht begonnen, Term-Sheet nicht freigegeben (`approvedBy` leer). Kein Override unter `overrides/`. |
| 4 | Vendor-Check (ADR-0013) | ✅ | Stil-Durchsicht 2026-09-05: „Produktnamen — kein Befund.“ Keine Timeline-Ereignisse im Umfang, ADR-0015 nicht einschlägig. |
| 5 | Verwandte Inhalte verdrahtet | — | Keiner der vier Begriffe des Artikels steht im Glossar; „Kondensation“ existiert als Entwurf, ist aber nicht abgelegt. Es gibt also nichts zu verdrahten, was existiert — nach der Ablage des Glossar-Eintrags wird aus dem „—“ ein echter Prüfpunkt. |
| 6 | Datum / Zeitschaltung · Lizenz · KI-Hinweis-Politik | ✅ | Gewünscht: 2026-09-12, Zeitschaltung. Kein Fremdtext: Stil-Durchsicht hat drei Phrasen exakt gesucht, keine Treffer (E1-C). Preset `ai_disclosure: drafts` → der KI-Hinweis reist auf den Artefakten mit; der veröffentlichte Text trägt keinen Leser-Hinweis, das ist die eingetragene Politik. |
| 7 | News-Eintrag entworfen | ✅ | Siehe unten. Dieses Kit deklariert `content:news` → die Übergabe an den News-Builder ist angeboten; abgelegt wird sie erst, wenn Punkt 1–3 stehen (ein News-Eintrag zu unveröffentlichtem Inhalt wäre ein Vorgriff). |
| 8 | Kit-Gates (kit.json → healthChecks) grün | — | Nicht ausgeführt: Der Inhalt liegt noch nicht im Kit, die Gates prüfen also nichts, was mit diesem Release zu tun hätte. Nach der Ablage erneut laufen lassen und die Ausgabe hier zitieren — nicht „grün“ behaupten. |
| 9 | Posture-Absatz | — | Wird von `/ship` erzeugt; dieses Pre-Flight dupliziert ihn nicht. |

**Nicht bereit für `/ship`: Punkte 1, 2, 3.**

Reihenfolge, weil die Punkte voneinander abhängen: erst A5, A6 und A7 belegen oder den Wortlaut
endgültig abschwächen (Punkt 2) → dann die Stil-Befunde 1 und 2 abarbeiten → dann die
menschliche Prüfung bestätigen und den Stempel entfernen (Punkt 1) → dann das Term-Sheet
freigeben und die Übersetzungen erzeugen (Punkt 3) → dann Ablage im Kit, Gates laufen lassen
(Punkt 8) → erneut `release-check`.

## News-Entwurf

Typ: article · Datum: 2026-09-12 · Titel: „Neuer Artikel: Der Wasserkreislauf“ ·
Text: „Warum Regen nie neu ist: die vier Stationen des Wassers zwischen Meer, Luft und Land —
mit Selbstcheck und einer Fassung in Leichter Sprache.“

_Mit KI-Unterstützung erstellt — vor Verwendung prüfen._
