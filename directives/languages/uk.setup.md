<!-- base -->
# lang-uk — Ukrainian (українська мова) — setup & sources

> **The translation guide itself is [`uk.md`](uk.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. **Fidelity note
up front:** the two load-bearing authorities in this section — the **Institute of the Ukrainian
Language (НАНУ)** and the **Cabinet of Ministers** transliteration table — carry **verbatim
quotes** and are the strongest tier here. The **2019 *Правопис* body rules are cited-not-quoted**:
the canonical PDF is non-textual (image/compressed), so its §-level rules could not be machine-quoted
this session. See the reroute note directly below.

- **Institute of the Ukrainian Language, NAS of Ukraine (Інститут української мови НАНУ / ІУМ
  НАНУ)** — **a** state codification body for Ukrainian norms (see the Orthography Commission
  bullet below — the codifying work is shared, not this Institute's alone). **Verbatim:** "провідна
  науково-дослідна установа й основний в Україні координаційний центр із проблем українського
  мовознавства." Its remit covers the "нормативності, структури, історії" of Ukrainian and the
  "кодифікації норм української літературної мови."
  <https://iul-nasu.org.ua/>
- **Ukrainian National Orthography Commission (Українська національна комісія з питань правопису)**
  — the body that **prepared** the 2019 edition, which was then approved by the Cabinet of
  Ministers; the Institute of Linguistics named after O. O. Potebnia and the Institute of the
  Ukrainian Language (NANU) were both involved. ⚠ **secondary-source tier** — this attribution
  reaches the guide through a second desk-research dossier's summary of the official PDF's own
  front matter, not through a fetch of the Commission's own pages. Treat the Institute of the
  Ukrainian Language as **a** state codification body rather than **the** only one.
  <https://www.uaredactor.com.ua/ukrayinskyj-pravopys-elektronna-versiya-oficzijnogo-vydannya/>
- **The 2019 Ukrainian Orthography (Український правопис 2019)** — the current official spelling
  standard, approved by Cabinet of Ministers Resolution No. 437 (22.05.2019). §7 «Апостроф» and the
  punctuation section («Лапки») are the relevant chapters. **Community-tier / cited-not-quoted:** the
  canonical full-text PDF is non-textual, so its section text is **not machine-quotable this
  session**; a mirror's table of contents confirms "§7. Апостроф" exists.
  **⚠ Currency caveat:** a second desk-research dossier records that "in **2026**, a state-language
  standard 'Ukrainian Orthography' was also reported as coming into force, indicating that current
  practice should be checked against the newest state standard where possible." This guide is dated
  2026-07 and states the 2019 edition as current; **verify against the newest state standard before
  treating any orthography rule below as settled.**
  <https://nus.org.ua/wp-content/uploads/2019/05/Ukr.-pravopys-2019-1.pdf> ·
  <https://2019.pravopys.net/> (ToC confirms §7) ·
  <https://www.uaredactor.com.ua/ukrayinskyj-pravopys-elektronna-versiya-oficzijnogo-vydannya/>
  (2026-standard report — ⚠ a secondary summary, not the standard itself)
- **Національний словник термінів зі штучного інтелекту (Словник ШІ 2.0)** — a **Ministry-linked
  national AI-terminology dictionary**, explicitly aimed at unifying Ukrainian AI vocabulary. This
  is the **terminology authority** for §6 and the natural place to settle a disputed AI term before
  it is frozen in the project glossary. ⚠ **listed, not fetched** — the dictionary's own entries were
  not opened for this guide, so no §6 row below is cited to it; it is named here as the authority a
  terminology question should be routed to, not as evidence for a rendering already in the table.
  <https://www.tsatu.edu.ua/biblioteka/nacionalnyj-slovnyk-terminiv-zi-shtuchnoho-intelektu-slovnyk-shi-2-0-ai-dictionary-2-0/>
- **Cabinet of Ministers — 2010 official Latin transliteration** (Resolution No. 55, 27.01.2010,
  "Про впорядкування транслітерації українського алфавіту латиницею"). Used for passports/signage,
  **never for body text**. **Verbatim:** "М'який знак і апостроф латиницею не відтворюються."
  <https://www.kmu.gov.ua/npas/243262567> (table — verbatim) ·
  <https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF> (Resolution metadata; body non-textual)
- **Unicode — Cyrillic block U+0400–U+04FF.** Home of all Ukrainian letters, including the four
  diagnostic Ukrainian letters (і ї є ґ) and their capitals. **Reference-grade, not quote-grade:**
  the Cyrillic chart PDF is non-textual, so codepoints are stated from standard Unicode chart data,
  not re-fetched verbatim this session.
- **CLDR — `uk` locale** (number, decimal/group separators, currency pattern). **Quote-grade
  (direct fetch), re-checked against CLDR 48.2 (2026-03-17):** decimal `,`, group = **no-break
  space (U+00A0)**, currency pattern `#,##0.00 ¤`. The chart link is Unicode's version-agnostic
  *latest* permalink; it replaces the guide's earlier raw-JSON link to the `main` development
  branch, which tracked unreleased data rather than a release. Values unchanged.
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/uk.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>
- **Community typography reference — typography.org.ua** (dashes, apostrophe, quotation marks,
  наголос). ⚠ widely-used community reference, **not a state authority**; listed via search, not
  fetched verbatim.
  <https://typography.org.ua/>

**Reroute note — how the *Правопис* body-rule quotes were sourced (documented per the transform
brief).** The verbatim §-level text of the 2019 *Правопис* could not be captured from its own
domains this session:

- **slovnyk.ua** (official-orthography §7 apostrophe & §164 quotation-mark pages) — **HTTP 403
  Forbidden**.
- **vue.gov.ua** (Велика українська енциклопедія, «Апостроф» entry) — **HTTP 403 Forbidden**.
- **nus.org.ua PDF** — reachable but **non-textual** (image/compressed), so section text is not
  machine-quotable.

With the primary and encyclopedic routes blocked, the verbatim quotations for the apostrophe rule,
the quotation-mark hierarchy, and the vocative were **rerouted to `uk.wikipedia.org`** (articles
«Апостроф», «Лапки», «Кличний відмінок»). Those Wikipedia quotes are genuine and load-bearing for
the *rule statements* in §3–§4, **but they are community-tier corroboration of the codified
*Правопис* rule, not the codified text itself** — the underlying rule is the 2019 orthography's, and
this guide flags every place it leans on the Wikipedia reroute.

**Provenance tiers at a glance.** **STRONG (verbatim):** §B Institute-of-Ukrainian-Language mission,
§A Cabinet Res. 55/2010 transliteration (verbatim via kmu.gov.ua), §D CLDR `uk`
separators/currency-pattern. **Community-tier (marked):** the 2019 *Правопис* body rules (cited-not-quoted, verbatim
rerouted to uk.wikipedia). **Editorial (marked ⚠):** §E terminology beyond the sourced four, §F
plain-language derived rules, §G русизм examples. §H idiom renderings arrived editorial and have
since been **re-sourced row by row** (goroh/СУМ, r2u, usage handbooks); each §7 row now carries its
own tier and four wrong-calque cells now rest on verbatim rulings.

Sources: <https://iul-nasu.org.ua/> · <https://www.kmu.gov.ua/npas/243262567> ·
<https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF> ·
<https://nus.org.ua/wp-content/uploads/2019/05/Ukr.-pravopys-2019-1.pdf> ·
<https://2019.pravopys.net/> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/uk.html> ·
<https://typography.org.ua/> ·
<https://www.uaredactor.com.ua/ukrayinskyj-pravopys-elektronna-versiya-oficzijnogo-vydannya/>
(Orthography Commission attribution + the 2026-standard caveat — ⚠ secondary summary) ·
<https://www.tsatu.edu.ua/biblioteka/nacionalnyj-slovnyk-terminiv-zi-shtuchnoho-intelektu-slovnyk-shi-2-0-ai-dictionary-2-0/>
(national AI-terminology dictionary — ⚠ listed as the terminology authority, entries not fetched)
(reroute targets: <https://uk.wikipedia.org/wiki/Апостроф> · <https://uk.wikipedia.org/wiki/Лапки> ·
<https://uk.wikipedia.org/wiki/Кличний_відмінок>)

---

## 3. Script & typography

**Character inventory & Unicode range.** Ukrainian is written in a Ukrainian-specific Cyrillic
alphabet of **33 letters**, all inside the Cyrillic block **U+0400–U+04FF**. Four letters are
**diagnostic of Ukrainian and absent from Russian**, plus the apostrophe:

| Letter | Codepoints (cap / small) | Note |
|---|---|---|
| **І і** | U+0406 / U+0456 | dotted I |
| **Ї ї** | U+0407 / U+0457 | yi |
| **Є є** | U+0404 / U+0454 | ye |
| **Ґ ґ** | U+0490 / U+0491 | hard g — the glyph "Russian-only" fonts drop |
| **апостроф** | ʼ U+02BC / ’ U+2019 (ASCII ' U+0027 in practice) | see below |

Ukrainian does **not** use the Russian-only letters **ё, ъ, ы, э** — their presence in `uk` text is
a wrong-script/RU-contamination signal (see §11). (Codepoints are stated from standard Unicode
Cyrillic chart data; ⚠ the chart PDF is non-textual and was not re-fetched verbatim this session —
treat as reference-grade, not quote-grade.)

**Direction & tokenization.** Ukrainian is **LTR**; words are **whitespace-separated**, so ordinary
tokenization and word-boundary highlighting work. No RTL/bidi handling is required.

**The apostrophe (апостроф) — a real rule with a failure mode.** The apostrophe marks a
hard/separated pronunciation: it is written **before я, ю, є, ї** after a **labial consonant
(б, п, в, м, ф)** and **after р**. **Verbatim (uk.wikipedia reroute — corroborates *Правопис* §7):**
"За допомогою апострофа в українській мові відокремлюються йотовані голосні літери від попередніх
губних приголосних."

- ✅ Right: **п'ять, м'ясо, б'ю, бур'ян, пір'я** (apostrophe present after labial / after р).
- ❌ Wrong: **пять, мясо, бю, бурян, піря** (apostrophe dropped — a spelling error, and the ASCII
  `'` is a lesser-of-evils fallback but the typographic form ʼ/’ is preferred).

**Quotation marks — guillemets are the default.** Primary Ukrainian quotation marks are the angular
guillemets **« »** («лапки-ялинки»); nested/inner quotes use **„ “** («лапки-ла́пки»). **Verbatim
(uk.wikipedia reroute):** "У функції перших рекомендовано вживати кутові лапки, або «лапки-ялинки»
(«…»), у функції внутрішніх — «лапки-ла́пки» („…“)." The 2019 orthography permits «…», “…”, and
„…“, but the guillemet system is the typographic default; unlike English, **straight `"` are
discouraged in body text**.

- ✅ Right: **«Натисніть кнопку „Зберегти“, щоб продовжити.»** (outer «», inner „“).
- ❌ Wrong: **"Натисніть кнопку "Зберегти", щоб продовжити."** (straight ASCII quotes, no
  guillemet hierarchy).

**Whitespace / hyphenation.** Standard word spacing; the numeric group separator is a
**(non-breaking) space** (§5). Hyphenation follows syllable boundaries (Ukrainian is highly
syllabic); on the web, set `lang="uk"` so the engine applies Ukrainian line-breaking, and use
`&shy;` only where a manual break is genuinely needed. ⚠ No single authority was fetched for the
hyphenation algorithm this session — treat as editorial / standard-CSS guidance, and prefer engine
hyphenation over hand-inserted soft hyphens (§10).

**Fonts & known pitfalls.** Any shipped font must carry **full Ukrainian Cyrillic coverage,
including ґ/Ґ (U+0490/U+0491)** and a real apostrophe glyph — some "Cyrillic" fonts cover Russian
only and silently drop ґ/Ґ. **Verify і ї є ґ and the apostrophe render** before relying on a build.
⚠ editorial (no authority fetched) — but this is the single most common real-world Ukrainian
web-font defect. **Noto Sans** / **Noto Serif** (Google Fonts) carry full Ukrainian Cyrillic and are
safe defaults: <https://fonts.google.com/noto/specimen/Noto+Sans> ·
<https://fonts.google.com/noto/specimen/Noto+Serif>.

**Romanization in native-script text — never in the UI.** Ukraine has an **official Latin
transliteration** (Cabinet Res. 55, 2010) for names and geographic names — passports, signage —
**not for body text**; running Ukrainian is never romanized. **Verbatim (kmu.gov.ua):** "М'який знак
і апостроф латиницею не відтворюються." Positional rules: я → **ya** (word-initial) / **ia**;
ї → **yi** / **i**; є → **ye** / **ie**; the digraph зг → **zgh** (vs ж → **zh**), e.g. *Згорани →
Zghorany*, *Розгон → Rozghon*. Working UI rule: **body content is Ukrainian Cyrillic; romanization
is confined to slugs/identifiers (§10) and to established Latin acronyms — never a display substitute
for a Ukrainian word.**

Sources: <https://uk.wikipedia.org/wiki/Апостроф> · <https://uk.wikipedia.org/wiki/Лапки> ·
<https://www.kmu.gov.ua/npas/243262567> · <https://fonts.google.com/noto/specimen/Noto+Sans> ·
Unicode Cyrillic block U+0400–U+04FF (reference-grade, chart non-textual) ·
2019 *Правопис* §7 «Апостроф» (cited-not-quoted — see §2 reroute note)

---

## 10. Technical integration checklist

- **Fonts to ship:** a Cyrillic font with **full Ukrainian coverage including ґ/Ґ (U+0490/U+0491)**
  and a real apostrophe glyph — **Noto Sans / Noto Serif** (Google Fonts) are safe defaults. **Test
  і ї є ґ and the apostrophe** render; reject any "Russian-only Cyrillic" font that drops ґ/Ґ (§3).
- **`lang` / `dir` attributes:** `lang="uk"` (base) and `lang="uk-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA).
- **Tokenization / highlighting:** whitespace word separation applies — standard word tokenizers and
  word-boundary highlighting work. No bidi handling required.
- **Line breaking / hyphenation:** set `lang="uk"` so the engine applies Ukrainian syllable-based
  line-breaking; prefer engine hyphenation over hand-inserted `&shy;` (⚠ no hyphenation authority
  fetched — §3).
- **Index alphabet for glossary navigation:** use the **Ukrainian Cyrillic alphabet order**
  (а б в г ґ д … я), **not** an A–Z Latin index, and **not** a Russian collation (Ukrainian orders
  ґ after г and includes і ї є at their Ukrainian positions). Drive the index from **CLDR `uk`
  collation data** rather than a hard-coded list.
- **Digits in display vs identifiers:** display numbers per §5 (Western 0–9, comma decimal, space
  grouping, ₴/грн postfix); keep Western digits and ISO 8601 (YYYY-MM-DD) for machine identifiers,
  backends, and code.
- **4-way plural is load-bearing.** Every `{n}`-count string routes through the **CLDR `uk` plural
  categories one / few / many / other** (§5a) — four authored messages, never `{n} lesson(s)` and
  never a two-branch English shape. Remember that **0 selects `many`**, so the empty state is not a
  separate hard-coded string. Ordinal labels use the **ordinal** rule set (`type: 'ordinal'`, two
  categories), not the cardinal one.
- **Apostrophe in data:** prefer the typographic apostrophe (ʼ U+02BC or ’ U+2019) in stored text;
  if a pipeline forces ASCII `'` (U+0027), keep it **consistent** — do not let a "smart-quotes" pass
  mangle м'ясо/бур'ян into a wrong glyph or drop the apostrophe (§3, §11).
- **Quotation marks:** use guillemets **« »** (outer) and **„ “** (inner) in body copy, not straight
  ASCII `"` (§3).

Sources: <https://fonts.google.com/noto/specimen/Noto+Sans> ·
<https://www.kmu.gov.ua/npas/243262567> (transliteration for slugs) ·
CLDR `uk` (collation/number data) · Unicode Cyrillic block U+0400–U+04FF (reference-grade) ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/plurals.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/ordinals.json> (plural/ordinal categories — §5a)

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio.** The large majority of letters in `uk` content must fall in the **Cyrillic block
  U+0400–U+04FF**. A low Cyrillic-codepoint ratio signals untranslated source text left in place.
- **RU-contamination / forbidden-character scan (Ukrainian-specific, mandatory).** Flag any of the
  **Russian-only letters ё, ъ, ы, э** (both cases) in `uk` text — they do not occur in Ukrainian and
  their presence is a Russian-contamination or wrong-script signal. **Exception:** an explicit
  "avoid these" note or a linguistic example naming the letters (like this one) may contain them; body
  content may not. Also scan for **Russian authority names / Russian source domains** and for AI terms
  in their **Russian** rather than Ukrainian form — `uk` must use the Ukrainian native/calque terms
  (штучний інтелект, машинне навчання, нейронна мережа, глибоке навчання), never their Russian
  equivalents.
- **Ukrainian-letter presence.** Genuine Ukrainian body text will normally contain the diagnostic
  letters **і, ї, є, ґ** and apostrophes; a `uk` document with **zero** і/ї/є across substantial text
  is suspect (often Russian text mis-tagged as Ukrainian).
- **Apostrophe integrity.** Words requiring the apostrophe (labial/р + я/ю/є/ї — п'ять, м'ясо,
  бур'ян) must keep it; flag a normalization/"smart-quotes" pass that dropped or mangled it (§3, §10).
- **Digit / separator consistency.** Western digits 0–9; **decimal = comma** (3,14), **grouping = a
  space and specifically U+00A0** (`1&nbsp;000&nbsp;000`), **currency ₴/грн postfix**
  (`1&nbsp;250,00 ₴`). Flag period-decimals, comma-grouping, or symbol-first placement as English
  leakage (§5) — and run the U+00A0 half as a **codepoint** check: a grouped figure separated by
  U+0020 renders correctly but wraps mid-number, so it cannot be caught by eye.
- **Plural-category check.** Any message with a `{n}` count must carry **four** `uk` branches
  (one / few / many / other — §5a). Flag: a `uk` message bundle whose count strings expose only
  `one`/`other` (the English shape); a separate hard-coded zero string (0 belongs in `many`); a
  bracketed "1 урок(и)" fallback; and an ordinal label selected with the cardinal rule set instead
  of `type: 'ordinal'`. This is decidable from the message bundle alone — no Ukrainian reading
  required.
- **Quotation-mark consistency.** Guillemets **« »** / inner **„ “** in body copy; flag straight
  ASCII `"` (§3).
- **Register consistency.** The recorded register is **lowercase ви** by default (§4). Scan
  second-person copy for **capital Ви** in running UI (reserved for personal formal letters) and for
  **ти/ви drift** within one surface; if a warm **ти** surface was deliberately chosen, flag any
  mid-flow switch back to ви. A register mismatch is both a social and a consistency defect.
- **Case / vocative check.** In direct address, flag a **nominative** where the **vocative** is
  required (друг → друже); flag one noun form reused across contexts that need different cases
  (§4).
- **Source-language leak scan (EN → UK).** Left-in English function words (the, a, and, you, please),
  English articles surviving in Ukrainian, or accusative-after-negation calques (не маю час instead
  of не маю часу) surfacing in Ukrainian sentences.

**RU-contamination verification note (this build).** The source dossier's own RU-contamination
self-check returned **PASS**: it uses only Ukrainian letters/orthography (і ї є ґ, apostrophe), no
Russian-only characters (ё ъ ы э), all cited authorities are Ukrainian (ІУМ НАНУ, Cabinet of
Ministers, uk.wikipedia, CLDR `uk`), and AI terms are the Ukrainian native/calque forms, not Russian
equivalents. This transform pass preserved that property — no ё/ъ/ы/э were introduced into any
example, and no Russian authority or Russian AI-term form was added. The scan above institutionalizes
that check for every future `uk` string.

Sources: Unicode Cyrillic block U+0400–U+04FF (reference-grade) ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/uk.html>
(separators/currency — verbatim) · dossier RU-contamination self-check (PASS) ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/plurals.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/ordinals.json> (plural-category check — §5a)

---

*Provenance note:* this guide is built from an **agent-native external research dossier**
(self-fetched, quote-per-claim, then independently reviewed against the cited sources;
RU-contamination self-check clean). Its strongest tier — the **Institute of the Ukrainian Language** mission, the
**Cabinet Res. 55/2010** transliteration (verbatim via kmu.gov.ua), and the **CLDR `uk`**
separators/currency pattern — carries **verbatim quotes**. The **2019 *Правопис* body rules are
cited-not-quoted**: the canonical PDF is non-textual, and the verbatim rule statements in §3–§4 were
**rerouted to uk.wikipedia** after **slovnyk.ua** and **vue.gov.ua** returned **HTTP 403** (documented
in §2) — those Wikipedia quotes corroborate the codified rule but are community-tier, not the codified
text. Sections **E/F/G/H** lean **editorial** and are marked ⚠ at point of use. The register decision
(**lowercase ви**, with ти as an optional warm peer-tone) was **taken and recorded**
(§4). A second-model and native-speaker review against the §2 sources is still outstanding (see Status
in the header).

*Merge pass (second dossier + NBSP encoding, 2026-07-27).* A companion research dossier had never
been folded in; four things came out of it. (1) The header declared that the research supplied **no
speaker count** — it did, with a citation, and the cited 30–34 M range plus the sole-state-language
status now stand in place of the false provenance clause. (2) §2 never named a **terminology
authority**; the Ministry-linked *Національний словник термінів зі штучного інтелекту (Словник ШІ
2.0)* is now listed and §6 routes contested renderings to it — named, **not** fetched, so no §6 row
rests on it. (3) §2 gained the **Ukrainian National Orthography Commission** as the body that
prepared the 2019 edition (so the Institute of the Ukrainian Language is **a**, not **the**,
codification body), and a **⚠ currency caveat** that a 2026 state-language orthography standard was
reported as coming into force. (4) §7 shipped a general ESL idiom list where the authoring brief
asks for stock phrases of educational/technical writing; the on-domain table from that dossier
replaced it, with its weak per-row citations honestly downgraded rather than laundered, and the
earlier table's ти-form row flagged against the guide's own ви register. Separately, §5/§11 had
**declared U+00A0 grouping and shipped U+0020**; the examples are now written as `&nbsp;`, with one
literal U+00A0 in §5 so the file contains the byte it names.

*Evidence pass (§7 idiom table + §5a plural coverage, 2026-07-27).* Two things.

(1) **§7 was re-sourced.** Every ✅ now carries a tier from goroh.pp.ua (СУМ tlumachennia,
фразеологія, *Слововживання*), r2u.org.ua (Вирган–Пилинська 1959; Кримський–Єфремов 1924–33) or
Ukrainian corpus, and the tier decides whether a row may inform a §11 check. The wrong-calque column
was the weak half, and this is where the pass paid: **four cells were upgraded from invented
strawmen to verbatim usage-handbook rulings** — *з іншої сторони* (rows 7), *взад і вперед* (8),
*один за другим* (9) and *як можна швидше* (10), the last of which makes the row's ✅ literally the
prescribed repair of its ❌. **Two cells were removed** because they condemned prescribed Ukrainian
or nothing at all: *для прикладу* is a СУМ set phrase that the antisurzhyk handbook actively
recommends — it puts this guide's ✅ on its left column and this guide's ❌ on its recommended right
— and *зробіть впевнено* has zero attestation of any kind. *Крок по кроку* was reworded from wrong
to rare, because no ruling exists against it and the Russian-interference story does not hold (the
Russian source phrase is *шаг за шагом*, which maps onto the ✅). Row 11's restriction
("correct only where a literal shelter is meant") was **refuted** by 336 institutional corpus hits
and dropped, and the empty-❌ "under the hood" row was moved out of the table into a register note.
A source caution is recorded inline and must not be lost: «Мова – не калька» is **not** an error
list — its left column is ordinary vocabulary, so left-column membership never proves a form wrong.

(2) **§5a is new: CLDR plural coverage.** The guide previously made no plural claim at all, which
would let an implementer ship two-form English pluralization into a four-category Slavic locale.
All four `uk` cardinal rules and both ordinal rules are now quoted verbatim from the pinned release
`cldr-core@48.2.0`, with what each category means for interface strings, a worked counted-noun
example, and a §10 wiring rule plus a §11 check. The category boundaries are sourced; the four
Ukrainian word forms of the example noun are marked ⚠ editorial.
