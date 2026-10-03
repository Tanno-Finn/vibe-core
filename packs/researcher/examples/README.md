<!-- pack -->
**Deutsch:** [Diese Seite auf Deutsch](README.de.md)

# `researcher` pack — worked examples

Each of the five researcher jobs was **run once** on the same input —
[`_input-aussagen-wasserkreislauf.md`](./_input-aussagen-wasserkreislauf.md), the claim list
`A1 … A7` exactly as it arrives from the editorial side (the editor pack's own worked example,
[`packs/editor/examples/wasserkreislauf.entwurf.md`](../../editor/examples/wasserkreislauf.entwurf.md)).
The artifacts below are the **actual output** each job produces, so a reviewer can see the real
thing rather than a promise — including the parts where the research came back empty.

| Job | Output | Path |
|---|---|---|
| `source-dossier` | Fünf Quellen mit Tier, Provenienz, Zitatsatz, Abrufstatus + generische Datensätze | [`wasserkreislauf.dossier.md`](./wasserkreislauf.dossier.md) |
| `claim-check` | Verdikt je Aussage A1–A7 + Konfidenz-Zusammenfassung | [`wasserkreislauf.claimcheck.md`](./wasserkreislauf.claimcheck.md) |
| `reading-map` | Einstieg, Vertiefung, Primärquellen — mit der Notiz, welche Titel gelesen sind | [`wasserkreislauf.lesekarte.md`](./wasserkreislauf.lesekarte.md) |
| `dated-event` | Ereignisdatensatz **ohne** Datum, weil der Belegsatz fehlt | [`halley-verdunstung.ereignis.md`](./halley-verdunstung.ereignis.md) |
| `conflict-log` | Positionstabelle 1686 gegen 1687, Einordnung als Inferenz, Formulierungsvorschlag | [`halley-datum.widerspruch.md`](./halley-datum.widerspruch.md) |

## What the examples deliberately show

**Two sources read, two sources not.** The USGS and NASA pages were fetched and read on
2026-09-05 and are quoted verbatim, with the access date as the only reliable dating because
neither page carries one. The two historical primary sources — Halley's estimate of evaporation
and Perrault's book on the origin of springs — were **not** reachable: the DOI resolves, but the
publisher page answered 403, and the library's catalog interface did too. They stay
`[unverified]`, their titles and years marked as coming from secondary mentions rather than from
the sources themselves, and the dossier says what would close each gap. Those four lines are the
pack's actual lesson; a dossier without them would teach the opposite of what it claims to.

**A claim that was true and still unsourced.** A7 ("the sun's warmth drives evaporation") rode
along inside A2's sentence on the editorial side until it was split out. The NASA quote says
water evaporates and rises; it does not say what drives it. `claim-check` records MISSING — for
a statement no one doubts. That is the single most useful thing this pack does, and the example
exists to show it happening rather than to describe it.

**An event with no date.** `halley-verdunstung.ereignis.md` leaves `date` empty and refuses the
handover to the timeline builder, even though this kit declares `content:timeline` and even
though "1687" would look entirely plausible. No dating sentence, no date (R1-B) — the record
says exactly what is missing and what would supply it.

**A conflict logged, not settled — and honest about how thin it is.** The 1686/1687 discrepancy
gets a position table with *two rows and every quote column empty*, because not one source was
read for it: what is compared is a DOI string that was observed and a year that came in with the
request. Neither row is given a tier, since a tier rates a document and there is none. An
explicitly prefixed `Inference:` about volume years, a recommended wording, and a list of what
would close it complete the log. The tempting version of this file — "Lehrbücher nennen 1687" as
a cross-reference row — is named in the log as the thing it is not.

**A source removed rather than kept for appearances.** The dossier's Q5 slot is a deleted
encyclopedia entry: it would have been a legitimate springboard, but nobody opened it in this
run, so it is not listed as a source. The number stays as a visible gap.

**Two sources read out of five names on the page.** That ratio is the honest result of one
research pass, and the artifacts say so in their confidence summaries rather than burying it.

**Scrub note:** no real people beyond the historical authors named in their bibliographic role,
no pupil or customer data, no product names. Two cited sources are genuine and public; nothing
else in these files is presented as evidence.
