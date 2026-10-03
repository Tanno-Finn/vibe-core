<!-- base -->
# lang-es — Spanish (español) — setup & sources

> **The translation guide itself is [`es.md`](es.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Note that
Spanish, unlike English, has an explicit prescriptive authority network.

- **Real Academia Española (RAE) + Asociación de Academias de la Lengua Española (ASALE)** — the
  pan-Hispanic authority. The joint ***Ortografía de la lengua española*** (spelling, accents,
  punctuation incl. `¿ ¡`, the 27-letter alphabet) and the ***Diccionario panhispánico de dudas*
  (DPD)** are the core prescriptive references; the **RAE *Diccionario de la lengua española*
  (DLE)** and the RAE/ASALE ***Libro de estilo de la lengua española*** back editorial usage.
  <https://www.rae.es/> · <https://www.rae.es/ortografía/> · <https://www.rae.es/dpd/>
  *(RAE pages return 403 to automated fetching; the orthographic rules cited below — mandatory
  opening `¿¡`, the 27-letter alphabet with `ñ`, `ch`/`ll` no longer separate letters since 2010
  — are canonical RAE orthography, corroborated via independent references, not re-fetched.)*
- **FundéuRAE (Fundación del Español Urgente, backed by the RAE)** — the practical authority for
  contemporary/technical usage recommendations (the AI terminology in §6 leans on its *fichas*).
  <https://www.fundeu.es/> *(host blocks the crawler; the *inteligencia artificial* ficha was
  independently confirmed — see §6 provenance.)*
- **The Unicode Standard — Latin ranges.** Basic Latin **U+0000–U+007F** and Latin-1 Supplement
  **U+0080–U+00FF** (home of `¿ U+00BF`, `¡ U+00A1`, `ñ/Ñ`, the accented vowels, `ü`, and `« »`
  U+00AB/U+00BB). <https://www.unicode.org/charts/PDF/U0080.pdf>
- **Unicode CLDR — `es` and `es-419` locales** (digits, decimal/grouping separators, date/time
  formats, collation). Values checked against **CLDR 48.2 (2026-03-17)**; the chart link is
  Unicode's version-agnostic *latest* permalink, so it tracks the current release rather than
  freezing a version number. `es` resolves to a Spain-default; **`es-419`** is the neutral
  Latin-American reference. <https://www.unicode.org/cldr/charts/latest/summary/es.html> ·
  release history: <https://cldr.unicode.org/downloads/cldr-48>
- **Plain-/easy-language standards (see §8).** **UNE 153101:2018 EX** *Lectura Fácil. Pautas y
  recomendaciones para la elaboración de documentos* (with validation companion **UNE
  153102:2018 EX**); **UNE-ISO 24495-1:2024** *Lenguaje claro. Parte 1: Principios rectores y
  directrices*, Spain's adoption of **ISO 24495-1:2023**.
  <https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0060036> ·
  <https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0072523> ·
  <https://www.iso.org/standard/78907.html>
- **Noto Sans / Noto Serif** — open web fonts with complete Latin + Spanish diacritic coverage.
  <https://fonts.google.com/noto/specimen/Noto+Sans>

**Register-source note.** The recorded register (§4) traces to a **neutral-Spanish localization
style guide (localization source)** — a translation-industry style tier, **not** an academy
ruling. The RAE/ASALE standardize spelling, grammar, and vocabulary but **do not govern
register/address choice**; that is an editorial decision. The specific vendor style guide's name
and URL are **withheld under the kit's source-neutrality rule**; it is cited only as a
localization-tier source.

**Provenance caveat.** Several authorities above (RAE, Fundéu, ISO, UNE) block automated
fetching; where a claim rests on them it was corroborated through independent standards
catalogs and references rather than a direct fetch, and that is marked at point of use.

Sources: <https://www.rae.es/> · <https://www.rae.es/dpd/> · <https://www.fundeu.es/> ·
<https://www.unicode.org/charts/PDF/U0080.pdf> ·
<https://www.unicode.org/cldr/charts/latest/summary/es.html> ·
<https://cldr.unicode.org/downloads/cldr-48> ·
<https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0060036> ·
<https://www.iso.org/standard/78907.html> ·
<https://fonts.google.com/noto/specimen/Noto+Sans>
(RAE, Fundéu, UNE, and ISO block automated fetching — listed as authorities of record, not as
fetched evidence; the register-source style guide is withheld under the source-neutrality rule.)

---

## 3. Script & typography

**Character inventory & Unicode range.** Spanish uses the **Latin script**. Beyond Basic Latin it
needs: the five accented vowels **`á é í ó ú`** (acute accent / *tilde diacrítica*), **`ü`**
(diaeresis, in *güe/güi*: *pingüino*, *vergüenza*), and the letter **`ñ`** (U+00F1) — a distinct
letter, **not** an `n` with a decoration. The **inverted marks `¿` (U+00BF)** and **`¡` (U+00A1)**
open questions and exclamations. All live in **Latin-1 Supplement (U+0080–U+00FF)**.

**The 27-letter alphabet.** The Spanish alphabet has **27 letters: A–Z plus Ñ**. Since the
2010 RAE reform, **`ch` and `ll` are no longer independent letters** (they are digraphs), and
**`ñ` collates between `n` and `o`** — this governs the glossary index (§10).

**Direction & tokenization.** Spanish is **LTR**; **words are whitespace-separated**, so ordinary
tokenization, word-boundary highlighting, and locale-aware hyphenation all work. **No RTL/bidi and
no contextual shaping** — the load Arabic/Indic scripts carry is simply absent here.

**Paired punctuation (mandatory — the highest-frequency Spanish typographic defect).** Questions
and exclamations are **opened *and* closed**: `¿…?` and `¡…!`. The opening inverted mark is
**not optional** in standard written Spanish (RAE *Ortografía*). English-trained input routinely
drops it.

- ✅ **¿Quieres continuar?** · **¡Bien hecho!**
- ❌ **Quieres continuar?** · **Bien hecho!** (missing the opening `¿`/`¡` — wrong in standard
  Spanish; a deterministic check for this is in §11.)
- The opening mark goes where the *question/exclamation* starts, not necessarily the sentence:
  ✅ **Si terminas, ¿puedes avisarme?**

**Quotation marks.** Formal Spanish prefers **angular guillemets «…»** (*comillas latinas /
angulares*), with English-style double `“…”` (*comillas inglesas*, U+201C/U+201D) for nested
material, then single `‘…’` (*comillas simples*, U+2018/U+2019) at the third level. The RAE order,
outer to inner: **«…» → “…” → ‘…’**.

- ✅ **«El profesor dijo: “haz clic aquí” y continuó.»**
- ❌ Using `“…”` as the default outer quote in formal Spanish (style-marked as anglicized; the
  angular form is the formal default, though `“…”` is widespread in the press and online).

**Romanization.** Not applicable — Spanish is already Latin-script. Romanization appears in the UI
only for transliterating foreign proper names that have no established Spanish form; it is **never**
a display substitute for a Spanish word.

Sources: <https://www.unicode.org/charts/PDF/U0080.pdf> ·
<https://www.rae.es/ortografía/> (mandatory `¿¡`, 27-letter alphabet, `«…» → “…” → ‘…’` order — canonical
RAE orthography; RAE pages 403 to the crawler, corroborated via independent references) ·
<https://www.unicode.org/cldr/charts/latest/summary/es.html>

---

## 10. Technical integration checklist

Spanish is LTR Latin script, so this checklist is short — the risks are diacritics, punctuation,
and number formatting, not shaping or bidi.

- **Fonts to ship:** any font with **complete Latin + Spanish diacritic coverage** — must render
  `á é í ó ú`, `ü`, **`ñ/Ñ`**, `¿ ¡`, and `« »`. **Noto Sans / Noto Serif** are safe defaults.
  Known pitfall: a **fallback font that drops or mis-places the tilde on `ñ`** or the acute accents
  — test the full diacritic set before relying on a build.
- **`lang` / `dir` attributes:** `lang="es"` (base) / `lang="es-easy"` (simplified variant,
  subject to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and
  per foreign passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)**. Use finer tags
  (`es-ES`, `es-MX`, `es-419`) where number/currency formatting is locale-driven (§5).
- **Encoding:** **UTF-8 end to end.** The classic Spanish defect is mojibake / ASCII-flattening of
  diacritics (`ñ`→`n`, `á`→`a`, or `Ã±`-style double-encoding). Never store or emit digraph
  substitutes; never let a pipeline "normalize" accents away.
- **Tokenization / highlighting:** whitespace word separation applies — standard word tokenizers
  and word-boundary highlighting work. Locale-aware **hyphenation is syllable-based** and safe to
  leave to the layout engine; do not hand-insert hyphens.
- **Index alphabet for glossary navigation:** the **27-letter Spanish alphabet A–Z + Ñ**, with
  **`ñ` sorted between `n` and `o`**; **`ch` and `ll` are not separate index buckets** (2010 RAE
  reform). Drive collation from **CLDR `es` collation data**, not a hard-coded Latin A–Z that
  misfiles `ñ`.
- **Numbers & currency:** display per §5 (decimal comma + dot/thin-space grouping for `es-ES`;
  decimal point + comma grouping for `es-MX`/`es-419`); **parameterize the separator convention and
  currency symbol per deployment** — do not hard-code one. Keep Western digits and ISO 8601 in
  backends/identifiers.
- **Paired punctuation is structural:** editing/normalization passes must **not** strip a leading
  `¿`/`¡`; a "smart-quote" or trimming step that removes them corrupts valid Spanish (§3, §11).

Sources: <https://fonts.google.com/noto/specimen/Noto+Sans> ·
<https://www.unicode.org/cldr/charts/latest/summary/es.html> ·
<https://www.rae.es/ortografía/> (27-letter alphabet, `ñ` collation, 2010 digraph reform —
canonical RAE, corroborated indirectly).

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio.** The large majority of characters in `es` content are **Basic Latin +
  Latin-1 Supplement**; a run of non-Latin codepoints (or long stretches of untranslated source)
  is a leak signal.
- **Paired-punctuation check (high-value, Spanish-specific).** Every `?` that closes a question
  must have a matching **opening `¿`** earlier in the same sentence, and every `!` a matching
  **`¡`**. Flag any `?`/`!` with no opening inverted mark — the single most common Spanish
  typographic defect (§3).
- **Diacritic integrity.** Flag likely accent-stripping: words that should carry a written accent
  appearing bare (e.g. **`solucion`** for *solución*, **`n`/`nino`** for *ñ*/*niño*), any
  **digraph substitute** for `ñ`, and mojibake sequences (`Ã±`, `Ã©`, `â€œ`) from double-encoding.
- **Digit / separator consistency.** Within one locale build, decimal and grouping separators are
  consistent — **comma-decimal for `es-ES`**, **point-decimal for `es-MX`/`es-419`** — and never
  mixed inside a single number or page (e.g. `1.234,5` and `1,234.5` co-occurring is a defect).
- **Register consistency (the recorded tú/ustedes).** Scan for **vosotros** leakage — pronoun **os**,
  possessive **vuestro/vuestra**, and 2nd-person-plural verb endings **-áis / -éis / -ís**
  (*hacéis*, *tenéis*, *haced*) — and for unmarked **voseo** (*vos tenés/hacé*). Any of these
  breaks the pan-Hispanic neutral register (§4).
- **Quotation-style consistency.** Angular **«…»** used consistently for formal quoting per house
  style, rather than defaulting to `"…"` (§3) — style-level, not a hard error.
- **Source-language leak scan (EN/DE → ES).** Left-in English function words (*the, and, you,
  please*), English-order object pronouns, missing subjunctive after triggers, and English number
  formatting (`1,234.5` where a `es-ES` build expects `1.234,5`).

Sources: <https://www.rae.es/ortografía/> (paired `¿¡`, accents — canonical RAE, corroborated
indirectly) · <https://www.unicode.org/cldr/charts/latest/summary/es.html> ·
<https://www.unicode.org/charts/PDF/U0080.pdf>

---

*Provenance note:* this guide is built solely from external desk research (a standard pass plus one
targeted follow-up), re-verified in a **cite-verify transform pass (2026-07-24)** that
independently confirmed the load-bearing standards anchors (ISO 24495-1:2023, UNE-ISO
24495-1:2024, UNE 153101:2018 EX, the FundéuRAE *inteligencia artificial* recommendation, CLDR 48.2
`es`). Several authority sites (RAE, Fundéu, ISO, UNE) block automated fetching; claims resting on
them were corroborated via independent catalogs and are marked at point of use rather than shown
as fresh fetches. The idiom table (§7) and the regional-vocabulary pairs (§9) are localization
judgment and ship **gap-flagged for native-speaker confirmation**. The register decision (§4) is a
recorded project decision sourced to a **neutral-Spanish localization style guide
(localization source)**, whose vendor name and URL are withheld under the kit's source-neutrality
rule. A native-speaker review against the §2 sources is still outstanding (see Status in the
header).
