<!-- base -->
# lang-it — Italian (italiano) — setup & sources

> **The translation guide itself is [`it.md`](it.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these.

- **Accademia della Crusca** — the oldest linguistic academy (founded 1583) and the reference
  authority for Italian; runs the *Consulenza Linguistica* service and the journal *Italiano
  digitale*. **⚠ Provenance note:** the Crusca website (accademiadellacrusca.it) returned **HTTP
  403 Forbidden on every path tried** during research (the consulenza pages and the
  *norme editoriali* PDF), so **no verbatim Crusca on-page quote could be captured**. Crusca's
  role is confirmed via search metadata and the Crusca-hosted PDF URL that surfaced, but every
  Crusca-specific claim was **rerouted to Treccani** — the other tier-1 Italian authority, which
  was reachable. Treat any Crusca-attributed detail (notably the caporali no-space spacing rule,
  §3) as editorial-but-standard, not academy-fetched.
- **Treccani — Istituto della Enciclopedia Italiana** — the most-cited general reference for
  definitions, grammar, and neologisms; fully reachable and used as the equivalently authoritative
  stand-in for the blocked Crusca. Grammar reference used throughout §3:
  <https://www.treccani.it/enciclopedia/virgolette_(La-grammatica-italiana)/>. Treccani also
  publishes the annual *neologismi*, the source for most of the §6 term definitions.
- **Designers Italia / AGID — "Guida al linguaggio della Pubblica Amministrazione" and the design
  system's *tono di voce*** — the de-facto style guide for Italian institutional/digital content;
  the practical baseline for tone, register, and sentence structure.
  <https://designers.italia.it/design-system/fondamenti/tono-di-voce/> ·
  <https://docs.italia.it/italia/designers-italia/design-linee-guida-docs/it/stabile/doc/content-design/linguaggio.html> ·
  <https://docs.italia.it/italia/designers-italia/writing-toolkit/it/bozza/suggerimenti-di-scrittura/stile-di-scrittura.html>
- **Unicode — Latin-1 Supplement (U+0080–U+00FF)** for the precomposed accented vowels
  (à U+00E0, è U+00E8, é U+00E9, ì U+00EC, ò U+00F2, ù U+00F9) and the caporali guillemets
  (« U+00AB, » U+00BB); the typographic apostrophe is ’ U+2019.
- **Italian free-software localization practice — *Free Translation Project Italia* (tp.linux.it)**,
  the long-running reference point for Italian software translators, with a shared technical
  glossary and a translation-quality page. It is the closest thing Italian has to a community norm
  for EN → IT technical copy, and it states the §7 principle in its own words: "Compito del
  traduttore è di cercare di rimanere il più possibile fedele all'originale: questo non significa
  necessariamente tradurre letteralmente", and "spesso è da considerare migliore una traduzione che
  si distacca dall'originale ma è più scorrevole o più elegante".
  <https://tp.linux.it/buona_traduzione.html> · glossary: <https://tp.linux.it/glossario.html>
  ⚠ Community-tier, not an academy — cited for practice, not for rulings.
- **Bilingual dictionaries and attested Italian running text — the §7 evidence base only.** The
  stock-phrase table in §7 rests on **WordReference en-it** and **Glosbe en-it**, on Treccani's
  *vocabolario* where it carries the phrase, and — for the two phrases no dictionary carries at
  all — on **fetched occurrences in Italian technical and university teaching material**. These sit
  **one tier below** the academy/CLDR sources in this section, so §7 marks the tier **per row**
  rather than inheriting this section's authority wholesale.
  <https://www.wordreference.com/enit/> · <https://it.glosbe.com/en/it>
- **Unicode CLDR — `it` locale** (number, date, time, currency formats). The values in §5 were
  checked against **CLDR 48.2 (2026-03-17)**; the chart link below is Unicode's version-agnostic
  *latest* permalink, so it always resolves to the current release rather than a frozen version.
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/it.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>. CLDR-derived cross-check for `it`
  number/currency/date/time: <https://www.freeformatter.com/italy-standards-code-snippets.html>.

**For an educational web platform:** **Treccani** is the citation authority for terms and
definitions, and the **Designers Italia / AGID writing toolkit** is the practical style baseline
(tone, sentence structure, register).

Sources: <https://www.treccani.it/enciclopedia/virgolette_(La-grammatica-italiana)/> ·
<https://designers.italia.it/design-system/fondamenti/tono-di-voce/> ·
<https://docs.italia.it/italia/designers-italia/design-linee-guida-docs/it/stabile/doc/content-design/linguaggio.html> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/it.html> ·
<https://cldr.unicode.org/downloads/cldr-48>
(Accademia della Crusca is named as the tier-1 authority but returned HTTP 403 on every path — no
Crusca URL is cited as evidence; see the provenance note above.)

---

## 3. Script & typography

**Character inventory & Unicode.** Italian uses the **Latin alphabet**, core 21 letters, with
*j, k, w, x, y* mainly in loanwords. The accented vowels are ordinary orthography. Use
**precomposed NFC forms** (à U+00E0, è U+00E8, é U+00E9, ì U+00EC, ò U+00F2, ù U+00F9) rather than
base letter + combining accent, for search/normalization stability. All live in Latin-1
Supplement, so UTF-8 encoding carries no practical risk. Direction is **LTR**; words are
**whitespace-separated**, so standard tokenization and word-boundary highlighting work with no
bidi or shaping handling.

**Accents — grave vs acute, and the é/è trap (highest editorial risk).**

- **Grave** (mandatory, most common): **à, è, ì, ò, ù** — *città, caffè, così, però, più*.
- **Acute**: **é** (and rarer **ó**) — distinguishes close-e words: *perché, poiché, né, sé,
  affinché*. The **é/è distinction is meaningful**: *é* (close, as in *perché*) vs *è* (open, the
  verb "is"). Writing *perchè* for *perché* is a frequent native-and-machine error.
- Word-final stressed vowels **always carry the accent**: *virtù, gioventù, lunedì*. Never
  substitute an apostrophe for the accent.

- ✅ *perché, è, città, lunedì, virtù, sé*
- ❌ *perchè* (grave for the close-e word) · *e'* / *e´* standing in for *è* · *citta'* /
  *lunedi'* (apostrophe instead of the accent).

The one tolerated fallback: the capital **È** may be typed *E'* only as an emergency when the
glyph is unavailable — but the correct glyph is **È**, and body content should use it.

**Elision & the apostrophe (highest grammatical risk).** Italian elides the final vowel of
certain words before a following vowel, marked with an apostrophe and **no space**: *l'acqua,
un'idea, dell'anno, c'è, dov'è, quell'uomo*. The apostrophe is **grammatically load-bearing**:
**un'** (with apostrophe) is feminine, **un** (no apostrophe) is masculine.

- ✅ *un'idea, un'amica* (feminine, apostrophe) · *un amico, un uomo* (masculine, no apostrophe)
- ❌ *un idea* (missing feminine apostrophe) · *un'amico* (apostrophe forced onto a masculine noun)

**Truncation (*troncamento*) takes no apostrophe** — do not confuse it with elision:

- ✅ *qual è, un buon amico, un po'* (*po'* is a genuine truncation of *poco*, and *does* take the
  apostrophe)
- ❌ *qual'è* (the classic over-apostrophe error)

Use the **typographic apostrophe ’ (U+2019)** in polished copy; the straight `'` (U+0027) is
tolerated on the web (be consistent — do not mix within one document).

**Quotation marks — Italian «caporali».** Treccani lists three types, and the page itself writes
them with the typographic codepoints — **alte (“ ”), basse (« »), apici (‘ ’)** — and makes
caporali the default for direct speech and citation: “Nelle citazioni e con il discorso diretto,
le virgolette più adoperate nell’uso comune sono quelle basse.” High double quotes flag a special
or ironic use of a word: “Le virgolette alte vengono utilizzate soprattutto per segnalare l’uso
particolare di una parola, mentre gli apici sottolineano in genere una singola espressione, o
racchiudono una definizione.”

- **Nesting hierarchy** (outer → inner): **« »** → **“ ”** → **‘ ’**. Treccani's own example
  nests apici directly inside caporali: «È un ambiente molto ‘cheap’».
- **Spacing:** caporali sit **tight** against the enclosed text. ⚠ This no-space rule is standard
  Italian typographic practice stated in Crusca's (403-blocked) consulenza — treat as
  editorial-but-standard, not academy-fetched.
- **Codepoints — all three levels:** « **U+00AB**, » **U+00BB** · “ **U+201C**, ” **U+201D** ·
  ‘ **U+2018**, ’ **U+2019**. The ASCII `"` (U+0022) and `'` (U+0027) are **none** of Treccani's
  three types — they are keyboard fallbacks.

- ✅ «citazione» (tight) · nested «Ha detto “sì” a bassa voce» · «È un ambiente molto ‘cheap’»
- ❌ « citazione » (spaces inside caporali) · "citazione" and 'citazione' (ASCII straight quotes,
  not a Treccani type) · mixing « » and “ ” arbitrarily in one document

**Practical guidance:** caporali (« ») are the register-correct choice for quotations/dialogue in
body prose; the **alte (“ ”)** are acceptable and common on the web and are Treccani's own mark for
a word used in a special or ironic sense (scare quotes). Do not mix the two styles arbitrarily
within a document — and normalize the ASCII `"` to “ ” or « » in polished copy, the same call this
section makes for the apostrophe (’ U+2019).

**Whitespace & hyphenation.** Standard word spacing; Italian does **not** put a space before
punctuation (unlike French). Line-break hyphenation follows syllable rules (open syllables;
digraphs *gl/gn/sc* and mute+liquid clusters kept together). For the web, prefer CSS
`hyphens: auto` with `lang="it"` so the browser uses an Italian hyphenation dictionary. Long
compound anglicisms (*machine learning*) are **not** hyphenated.

**Fonts.** No special script requirements beyond Latin-1; any quality Latin web font with full
accented-vowel coverage (à è é ì ò ù + À È É Ì Ò Ù) works — **Noto Sans** is a safe default
(<https://fonts.google.com/noto/specimen/Noto+Sans>). Two things to **verify before shipping**:
that the font renders **É and È as distinct glyphs**, and that it includes the **« » caporali**
(some display fonts omit guillemets).

**Romanization:** n/a — Italian is natively Latin-script.

Sources: <https://www.treccani.it/enciclopedia/virgolette_(La-grammatica-italiana)/> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/it.html> ·
<https://fonts.google.com/noto/specimen/Noto+Sans> · caporali no-space spacing rule ⚠
editorial-but-standard (Crusca consulenza 403-blocked, rerouted; see §2).

---

## 10. Technical integration checklist

- **`lang` / `dir` attributes.** `lang="it"` (base) and `lang="it-easy"` (simplified variant,
  subject to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and
  per foreign passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)**.
- **Encoding & normalization.** Store **UTF-8, NFC precomposed** accented vowels (à è é ì ò ù,
  not base + combining accent) for search/normalization stability. Do not let a "sanitizer"
  strip accents or downgrade *é/è* — both are meaning-bearing (§3).
- **Fonts to ship.** Any quality Latin web font with full accented-vowel coverage;
  **Noto Sans** is a safe default. **Verify É vs È are distinct glyphs** and that **« » caporali**
  are present before relying on a build.
- **Apostrophe policy.** Pick **one** apostrophe glyph and hold it: typographic **’ (U+2019)** for
  polished copy, or straight **' (U+0027)** on the web — do not mix within a document. The
  apostrophe of elision is grammatically load-bearing (*un'idea* vs *un amico*), not cosmetic.
- **Line breaking / hyphenation.** Use CSS **`hyphens: auto` with `lang="it"`** so the browser
  applies an Italian hyphenation dictionary; do not hand-insert hyphens, and do not hyphenate
  compound anglicisms (*machine learning*).
- **Tokenization / highlighting.** Whitespace word separation applies — standard word tokenizers
  and word-boundary highlighting work; no bidi or shaping handling is needed.
- **Numbers, dates, currency in display vs identifiers.** Display per §5 — decimal `,`, grouping
  `.`, **€ after** the amount with a non-breaking space, **dd/MM/yyyy**, 24-hour **HH:mm**. Keep
  Western digits and ISO 8601 (YYYY-MM-DD) for machine identifiers, backends, and code.
- **it-CH parameterization.** If Switzerland is a target, the group separator is the **apostrophe**
  (1'000), not the dot (§9) — parameterize per deployment; never hard-code one across both.
- **Index alphabet for glossary navigation.** Use a **Latin A–Z index**; accented vowels sort with
  their base letter (à under a, è/é under e, etc.) per **CLDR `it` collation** — drive it from CLDR
  data rather than a hand-rolled list.

Sources: <https://fonts.google.com/noto/specimen/Noto+Sans> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/it.html> ·
<https://cldr.unicode.org/downloads/cldr-48> · CSS `hyphens: auto` / WCAG SC 3.1.1–3.1.2 —
standard web-i18n practice.

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Accent integrity.** Flag word-final stressed vowels written with an apostrophe instead of the
  accent (*citta'*, *lunedi'*, *e'* for *è*), and flag *perchè / poichè / affinchè* (grave for
  the close-e words — should be **perché / poiché / affinché**). Scan that **É and È** both render
  (font check, §3/§10).
- **Elision vs truncation.** Flag *qual'è* (should be *qual è*) and the gender-apostrophe mismatch
  *un'* on a masculine noun (*un'amico*) or missing *un'* on a feminine noun (*un idea*).
- **Number-format check.** Decimal is `,` and grouping is `.` (*1.234,56*), **not** English
  *1,234.56*; `€` sits **after** the amount with an nbsp; dates are **dd/MM/yyyy** or lowercase
  spelled month; time is 24-hour **HH:mm**. Flag any English-formatted number, currency-before, or
  MM/dd date left in place. (Watch the **it-CH apostrophe grouping** *1'000* leaking into it-IT.)
- **Quotation consistency.** Caporali **« »** (U+00AB/U+00BB) sit tight (no inner spaces) and nest
  « » → “ ” (U+201C/U+201D) → ‘ ’ (U+2018/U+2019); flag arbitrary mixing of « » and “ ” within one
  document, and flag the ASCII `"` (U+0022) / `'` (U+0027) anywhere in body copy — neither is one
  of Treccani's three types (§3).
- **Register consistency.** The recorded register is **tu** (§4). Scan second-person copy for
  **Lei** forms (subjunctive imperatives *Salvi / Si iscriva / Si registri*, the pronoun *Lei*)
  and **voi** address, and for the tell-tale **mix** of a tu imperative followed by a Lei one in
  the same flow — each is a register defect.
- **Capitalization.** Flag capitalized languages/nationalities/days/months (*Italiano, Lunedì,
  Gennaio*), capitalized "you" (*Tu*), and Title-Case headings — Italian uses lowercase and
  sentence case (§4).
- **False-friend scan.** Flag *eventualmente* used for "in the end" (want *alla fine*) and
  *attualmente* used for "actually" (want *in realtà / in effetti*).
- **Anglicism plurals.** Flag English plural -s on retained anglicisms (*chatbots, prompts* →
  invariable *i chatbot, i prompt*), and inconsistent **IA vs AI** acronym usage within one build.
- **Source-language leak scan (EN → IT).** Left-in English function words (the, and, you, please),
  gerund-for-infinitive calques (*Imparando è importante*), *stare + gerundio* overuse, and the
  literal stock-phrase calques from §7. The **D**-tier ones are safe to flag deterministically:
  *regola del pollice* (want *regola generale / regola pratica*), *fuori dalla scatola* — and
  *fuori dagli schemi* used for the software sense — (want *pronto all'uso*), *tieni in mente*
  (want *tieni presente / tieni a mente*), *sulla mosca* (want *al volo*), *in un guscio di noce*
  (want *in poche parole / in breve*), *migliori pratiche* (want *buona norma / buone pratiche*),
  *fai sicuro che* (want *assicurati di / verifica che*), *rompere giù* (want *scomporre*),
  *dal graffio* (want *da zero*), *sopporta con me* (want *abbi pazienza / porta pazienza*), and
  *asporto* used for **the takeaway** in the sense of "the point" (want *il punto / la morale*).
  Flag *sotto il cofano* as a **review prompt, not an error** — it is an attested but
  translationese calque of *under the hood*; the educational register wants *dietro le quinte*
  (§7, **T** tier).

Sources: <https://www.treccani.it/enciclopedia/virgolette_(La-grammatica-italiana)/> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/it.html> ·
<https://designers.italia.it/design-system/fondamenti/tono-di-voce/>. Accent/elision/false-friend
checks derive from §3–§4 (editorial-but-standard where those sections are).

---

*Provenance note:* this guide is built almost entirely from an **agent-native external research
dossier** (self-fetched, one verbatim quote per non-trivial claim; then independently reviewed
against its cited sources). A **second research pass** on the same brief **returned a refusal** and
contributed exactly one thing: the speaker-profile paragraph in the header, which corrects an
earlier and false "the dossier did not supply a speaker count" note. It contributed **nothing to
§7**, which is why §7 stood for a while as a declared open gap rather than the on-domain
stock-phrase table the authoring directive asks for.
**That gap has since been closed by a dedicated Italian-only research pass** (§7): nineteen
educational/technical stock phrases, each with a fetched source and a quote, tiered **D**
(dictionary or named §2 authority), **T** (no dictionary entry — attested in running Italian
technical/educational text) or **C** (this guide's craft, marked as such and never lint-able). The
twelve unsourced general idioms it replaced were deleted. **Two phrases stayed open on purpose** —
*sanity check* (no Italian rendering could be evidenced anywhere) and *good enough* (attested, but
no calque trap could be evidenced) — and are named in §7 rather than filled in.
The same pass verified the previously removed **Swiss-canton claim** against the two cantonal
constitutions and restored it in the accurate, non-flattened form (header, §9): Italian is an
official cantonal language **of Grigioni by name** (Cost. GR Art. 3), while **Ticino** is
constitutionally an Italian-language canton without using the phrase *lingua ufficiale*
(Cost. TI Art. 1).
The single biggest reroute is **Accademia della
Crusca → Treccani**: the Crusca website returned **HTTP 403 on every path**, so Crusca-specific
claims (notably the caporali no-space spacing rule, §3) were routed to Treccani, an equivalently
authoritative Italian source, or marked editorial-but-standard. **Strong sections** (§3
typography, §5 numbers, §4 register, terms 1–7 in §6, and the cantonal facts in the header/§9)
rest on Treccani / CLDR 48.2 / Designers Italia / cantonal law with verbatim quotes. **Weaker,
⚠-marked** are the word-count target and burocratese pairs (§8), the regional synthesis (§9, only
the it-CH grouping is CLDR-backed and only the cantonal law is primary), the false-friend traps
(§4), and the 8 §6 terms without individual fetches — all standard/editorial usage with
**native-speaker confirmation pending**. §7 now carries its own evidence but sits a tier below the
academy sources by construction (bilingual dictionaries and attested usage), and its
native-speaker confirmation is likewise pending. A second-model and native-speaker review against
the §2 sources is still outstanding (see Status in the header).
