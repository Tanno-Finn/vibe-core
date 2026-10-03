<!-- base -->
# lang-pt — Portuguese (português) — language guide

> **Setup & sources live in [`pt.setup.md`](pt.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** português / Portuguese.
**BCP 47 code (base):** `pt` — this guide's base text is written in **AO90 orthography**
(*Acordo Ortográfico da Língua Portuguesa*, 1990), the legal school and official spelling in both
Portugal and Brazil.
**BCP 47 code (simplified variant):** `pt-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`pt-x-simple`), but the kit token `pt-easy` is the one
that counts here.
**Market tags for forked strings:** `pt-BR` and `pt-PT` — see §9. Never ship bare `pt` to a
formatting library and expect European conventions; bare `pt` resolves to **Brazilian** defaults
(§5, §10).
**Speaker reach:** ≈**260 million native / ≈300 million total** speakers — the citable range.
Portuguese is the official language of **nine sovereign states** (Brazil, Portugal, Angola,
Mozambique, Cape Verde, Guinea-Bissau, Equatorial Guinea, São Tomé and Príncipe, Timor-Leste) plus
the Macau SAR, and the working language of the **CPLP** (*Comunidade dos Países de Língua
Portuguesa*). The Portuguese-language reference encyclopedia gives «Com aproximadamente 300 milhões
de falantes, o português é a 5.ª língua mais falada no mundo», with the infobox «Nativa: 260
milhões» / «Total: 300 milhões». ⚠ Estimates vary by source and methodology; a widely-cited
alternative range (260–265 M total) could not be fetched from its primary publisher and is **not**
carried here.
**Demographic asymmetry — read this before anything else.** Brazil alone accounts for roughly
**three quarters** of all speakers. "Neutral Portuguese" therefore *drifts toward Brazilian* unless a
project deliberately counterweights it — which is exactly what §4 (register) and §9 (divergence) do.
**Script + direction:** **Latin script, left-to-right, whitespace-separated words.** The
non-ASCII repertoire is small and entirely inside Latin-1 Supplement: `ç ã õ á é í ó ú â ê ô à` (plus
`ü` in loans/proper names only). No shaping, no bidi, no segmentation logic.
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single **agent-native
research dossier** (self-fetched, quote-per-claim), then **independently reviewed against its cited
sources**. Six load-bearing anchors were **re-fetched and confirmed in this authoring session** —
CLDR `pt` and `pt-PT` `numbers.json`, CLDR `pt-PT` `delimiters.json`, the Ciberdúvidas consultation
on *redes neuronais artificiais*, the Ciberdúvidas article on *colocação pronominal*, and the
Portuguese-language encyclopedia article on *aprendizado de máquina* (see §2). Covers base `pt` and
the `pt-easy` pendant.
**Strong vs thin sections.** **Strong:** §3 typography (CLDR + treaty text), §5 numbers/dates/
currency (CLDR, fetched JSON), §8 plain language for Brazil (federal + municipal statute text),
§9 regional variation (treaty text + Ciberdúvidas + CLDR — the best-sourced section in the guide).
**Mixed:** §2 authorities (ACL, AO90, Ciberdúvidas, Priberam fetched; **ABL/VOLP was HTTP 403** and
**Portugal's DL 83/2018 page returned an empty body**), §4 grammar (four of five features sourced,
one `⚠ quote-unverified`), §6 terminology (**9 of 15 terms have no codifying authority — marked `⚠`**;
usage is stable in the field but not codified). **Thin:** §7 idioms — **craft-tier**, no authority
publishes such a list; §8's formal→everyday table is applied editorial work.
**Easy or hard for this kit:** technically **easy**, editorially **hard**. Latin script, LTR,
whitespace tokenization, no shaping — the engineering surface is trivial. What actually bites:
(1) **the pt-BR / pt-PT fork**, which in an AI/ML educational platform is not a corner case but every
third heading (`aprendizado`/`aprendizagem`, `rede neural`/`rede neuronal`, `treino`/`treinamento`);
(2) **decimal comma + variant-specific grouping and currency placement**, non-neutralizable; and
(3) **gender agreement propagating across the sentence**, which breaks every concatenated UI string.

Sources: <https://pt.wikipedia.org/wiki/L%C3%ADngua_portuguesa> ·
<https://pt.wikisource.org/wiki/Acordo_Ortogr%C3%A1fico_da_L%C3%ADngua_Portuguesa_(1990)> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pt/numbers.json>

---

## 1. Header block

See above. One-line orientation: Portuguese is a Romance, SVO, LTR, Latin-script language with a
small diacritic inventory and no scripting complexity — the localization risk sits almost entirely in
**variant divergence (pt-BR vs pt-PT)**, **grammatical gender agreement**, and **number/currency
formatting**, not in rendering.

**Scope decision, stated plainly:** this is **one guide**, with **AO90 as the base orthography** and a
**substantial divergence block in §9**. That decision has a hard limit which §9 spells out: **AO90 did
not abolish variant spelling, it only reduced it.** Writing "in AO90 spelling" does **not** make a
text variant-neutral.

---

## 4. Grammar for translators

**(Mixed section — four of five breakage features carry fetched quotes; one is `⚠ quote-unverified`.)**

**Word order.** Portuguese is **SVO** with far more flexibility than English. Two habits separate
translated-sounding Portuguese from written-in-Portuguese Portuguese:

**(a) Adjectives follow nouns** by default. Pre-posing is possible but **changes register or
meaning** — `um grande modelo` = *a great/important model*; `um modelo grande` = *a large-sized
model*. This bites directly on *large language model* (§6 #14).

- ✅ **`inteligência artificial`** · **`rede neural`/`rede neuronal`** · **`aprendizado profundo`**
- ❌ **`artificial inteligência`** · **`neural rede`** (English order cloned)

**(b) English noun-stacks must be unpacked with prepositions.**

- ✅ **`qualidade dos dados de treino/treinamento`**
- ❌ **`qualidade dados treino`**

### Register — the project's decided base register

> **Register decision (decided — apply, do not re-litigate): dropped-subject 3rd-person-singular**,
> supported by **impersonal** and **infinitive** constructions. Use explicit **`você` only for
> contrast or clarity**. **Never use `tu` forms** in the base text. **Binding for all second-person
> copy** in `pt` and `pt-easy`.

**Why this and not `você`, and not `tu`.** The *same word* carries *different social temperature* in
the two variants, which makes the naive choices both wrong:

- **Brazil:** `você` is the unmarked general-purpose address across almost all contexts, including
  educational and commercial content. `tu` occurs regionally but is not the written standard.
- **Portugal:** `tu` is the informal/familiar address with genuine 2nd-person-singular morphology
  (`tens`, `queres`, `fazes`, `podes`). **`você` is *not* the neutral informal form it is in Brazil**
  — it is semi-formal and distancing. Ciberdúvidas documents both the older stigma and the modern
  softening: «você ser visto de um modo depreciativo para o interlocutor», alongside «é cada vez mais
  frequente ouvir pessoas tratar outras pessoas por você, sem qualquer intenção pejorativa».

**The mechanism that makes the decision work.** The same source states the grammatical fact:
«você conjuga-se com a 3.ª pessoa do singular dos verbos». Because `você` takes **3sg** morphology, a
sentence written **with no pronoun at all** is **morphologically identical** to a `você` sentence —
and the pronoun-less version reads **natively in both markets**.

| Strategy | Text | BR | PT | Verdict |
|---|---|---|---|---|
| `você` explicit | `Você pode ajustar o modelo.` | natural | slightly distant/foreign | contrast only |
| `tu` explicit | `Podes ajustar o modelo.` | wrong variant | natural | **never** |
| **Pronoun dropped (3sg)** | **`Pode ajustar o modelo.`** | **natural** | **natural** | ✅ **default** |
| Impersonal | `É possível ajustar o modelo.` | natural | natural | ✅ |
| Infinitive (UI/instructions) | `Ajustar o modelo` | natural | natural | ✅ |
| Imperative 3sg | `Ajuste o modelo.` / `Selecione uma opção.` | natural | acceptable | ✅ |

- ✅ **`Pode ajustar o modelo.`** · **`É possível treinar um modelo.`** · **`Selecionar um conjunto de
  dados`** · **`Ajuste os parâmetros.`**
- ❌ **`Você pode ajustar o modelo.`** repeated in every sentence — the **single loudest marker of
  machine-ish translation from English** (English `you` is obligatory; Portuguese is pro-drop).
- ❌ **`Podes ajustar o modelo.`** / **`Ajusta o modelo.`** — `tu` morphology, variant-marking.

⚠ The observation that pan-lusophone products "almost always land on the dropped-subject strategy" is
**editorial synthesis** of the sourced facts above, not a separately sourced market survey. The
grammatical mechanism (3sg agreement) **is** sourced.

### The five features most likely to break a naive EN → PT translation

**(1) Gender agreement propagates across the sentence — and English has no gender at all.**
Every noun is masculine or feminine; articles, adjectives, past participles, and some pronouns must
agree.

- ✅ **`O modelo selecionado está pronto.`** (m.)
- ✅ **`A rede selecionada está pronta.`** (f.)
- ❌ **`A rede selecionado está pronto.`** (agreement broken)

*Breakage mode:* **string concatenation and placeholders.** A UI template like `{item} selecionado` is
broken for half of all nouns. Domain nouns split unpredictably:

| Masculine | Feminine |
|---|---|
| `o modelo`, `o algoritmo`, `o conjunto de dados`, `o token`, `o viés` | `a rede`, `a camada`, `a inferência`, `a alucinação`, `a inteligência`, `a aprendizagem` |

**Rule: never build sentences by concatenation.** Use a full sentence per case, or ICU `select` on
gender.

**(2) `ser` vs `estar` — English "to be" is two verbs.** `ser` = inherent/defining; `estar` =
state/temporary.

- ✅ **`O modelo é preciso.`** (accuracy as a property of it)
- ✅ **`O modelo está pronto.`** (current state)
- ❌ **`O modelo é pronto.`** (ungrammatical-sounding)

Note the meaning shift: `A resposta está correta` (this one, right now) vs `A resposta é correta`
(correctness as a property). **Training/UI states — `carregando`, `pronto`, `disponível`, `em
execução` — almost always take `estar`.**

**(3) Personal infinitive — a Portuguese category with no English counterpart.** The infinitive
**inflects for person**, and no English source text will cue it. Triggered after prepositions
(`para`, `após`, `antes de`, `até`, `por`) when the infinitive has its own subject.

- ✅ **`Trouxemos dados para testarmos.`** (subject marked — *for us to test*)
- ❌ **`Trouxemos dados para testar.`** *(grammatical, but flat and ambiguous about who tests —
  illustrative of the failure mode, not an ungrammatical form.)*
- ✅ neutral 3sg: **`Antes de executar o modelo…`** · ⚠ `tu`, PT-only, **not** our register:
  `Antes de executares o modelo…`

*Breakage mode:* a translator who never inflects the infinitive produces text that is grammatical but
**subtly flat and ambiguous about who does what** — especially in multi-clause instructional prose,
which is exactly what an educational platform is made of.

**(4) Clitic pronoun placement — proclisis vs enclisis, and the variants disagree. `⚠ HIGH RISK`**
This is **the most reliable grammatical fingerprint of variant** and is treated in full in §9. Short
form, sourced (Ciberdúvidas, re-fetched this session): **Brazil favors proclisis** (`Te amo`,
`Eles se reuniram`); **Portugal favors enclisis** (`Amo-te`, `Eles reuniram-se`).

- ✅ **Neutral by paraphrase:** **`Criar conta`** · **`Está disponível.`** · **`É um caso de…`**
- ❌ PT-marked in neutral text: `Registe-se`, `Encontra-se disponível`, `Trata-se de`
- ❌ BR-marked in neutral text: `Se registre`, `Se encontra`

**(5) Progressive aspect splits by variant — `estar a` + infinitive vs gerund.**

- PT: **`O modelo está a treinar.`** · BR: **`O modelo está treinando.`**
- ✅ **Neutral mitigation — use the simple present:** **`O modelo treina.`** · **`O sistema processa
  os dados.`** In technical prose this is usually better style anyway.

**`⚠ quote-unverified`** — this contrast is uncontroversial and was consistently reported, but the
dossier fetched **no page carrying a directly quotable sentence** for it, and it was not re-fetched
here. Fallback candidate: a Ciberdúvidas article on the gerund. **Correct-form-only:** the two forms
above are the standard renderings; the mitigation is what the guide actually asks for.

Sources: <https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/o-uso-do-pronome-voce/10695> ·
<https://ciberduvidas.iscte-iul.pt/artigos/rubricas/idioma/colocacao-pronominal-portugues-do-brasil-x-portugues-europeu/5754> ·
<https://pt.wikipedia.org/wiki/Aprendizado_de_m%C3%A1quina> (gender/`ser`-`estar`/personal-infinitive
example pairs are standard-grammar illustrations authored for this guide; the progressive-aspect row
is `⚠ quote-unverified`)

---

## 5. Numbers, dates, currency

**(Strong section — Unicode CLDR JSON, fetched; `pt` and `pt-PT` `numbers.json` re-fetched this
session.)**

**Digits:** Western Arabic digits `0–9` in both variants. No native digit system.

### Numbers — decimal comma in both; **grouping separator differs**

| | `pt` (Brazilian base) | `pt-PT` |
|---|---|---|
| Decimal separator | **`,`** (U+002C) | **`,`** (U+002C) |
| Group separator | **`.`** (period, U+002E) | **` `** — **U+00A0 NO-BREAK SPACE** |
| Decimal pattern | `"#,##0.###"` | `"#,##0.###"` |
| Rendered | **`1.234.567,89`** | **`1 234 567,89`** |

> **⚠ Value corrected 2026-07-27 when the citation was pinned to the CLDR 48.2 release.** This table
> previously read *"space — use a narrow no-break space"* for `pt-PT`. Re-read at the pin, CLDR
> `pt-PT` gives **U+00A0 NO-BREAK SPACE** — ✅ `1 234`; it is **not** ❌ `1 234` (U+202F NARROW NO-BREAK SPACE)
> and **not** ❌ `1 234` (U+0020 SPACE). The
> narrow form was a recommendation the guide did not source; it is removed rather than replaced. Emit
> what the locale data gives, or let the formatter emit it. Note also that `pt-PT` sets
> `minimumGroupingDigits: 2`, so a four-digit number is **not** grouped: **`1234`**, not `1 234`.

> **The decimal comma is the highest-frequency numeric error in EN → PT.** An accuracy of `0.85` must
> become **`0,85`**. Written `0.85` in Portuguese it reads as *eighty-five* to a careless reader and
> as an untranslated string to a careful one.

- ✅ **`0,85`** · **`1.234.567,89`** (BR) · **`1 234 567,89`** (PT)
- ❌ **`0.85`** · **`1,234,567.89`** (English format left in place)

**Percentages:** **`85,3 %`** — a space before `%` is standard in Portugal; Brazil commonly writes
`85,3%` closed-up. Minor; tolerable either way, but be consistent within a project.

### Currency — **the sharpest formatting divergence**

| | `pt` (Brazilian base) | `pt-PT` |
|---|---|---|
| Currency pattern | **`"¤ #,##0.00"`** (symbol **before**) | **`"#,##0.00 ¤"`** (symbol **after**) |
| Currency | Real, **`R$`** | Euro, **`€`** |
| Rendered | **`R$ 1.234,56`** | **`1 234,56 €`** |

The **symbol**, its **position** *and* the **grouping** all differ — a currency string is **triply
variant-marked**. **This cannot be neutralized** (§9). If prices must appear: localize per market, or
keep concrete amounts out of the shared base text.

- ✅ pt-BR: **`R$ 1.234,56`** · ✅ pt-PT: **`1 234,56 €`**
- ❌ **`€ 1.234,56`** (Brazilian pattern with a euro sign — variant-mixed and wrong on both counts)

### Dates and times

| | `pt` (Brazilian base) | `pt-PT` |
|---|---|---|
| full | `"EEEE, d 'de' MMMM 'de' y"` | `"EEEE, d 'de' MMMM 'de' y"` |
| long | `"d 'de' MMMM 'de' y"` | `"d 'de' MMMM 'de' y"` |
| medium | `"d 'de' MMM 'de' y"` | **`"dd/MM/y"`** |
| short | **`"dd/MM/y"`** | **`"dd/MM/yy"`** |

- **Day-first everywhere.** `03/04/2026` = **April 3**, never March 4. US `MM/DD` is a serious,
  **silent** defect.
- **Long form uses `de` twice:** **`26 de julho de 2026`**.
- **Month and weekday names are lowercase:** `janeiro, fevereiro, março, abril, maio, junho, julho,
  agosto, setembro, outubro, novembro, dezembro`. This is an **AO90-era change for European
  Portuguese** (Brazil already lowercased); pre-2009 PT sources will show `Janeiro` (§9).
- **Time is 24-hour in both variants:** `"HH:mm"` short, `"HH:mm:ss"` medium, `"HH:mm:ss z"` long.
- The medium/short divergence is **minor and low-risk** compared to currency.

- ✅ **`26 de julho de 2026`** · **`14:30`** · numeric **`26/07/2026`**
- ❌ **`26 de Julho de 2026`** (capitalized month — pre-AO90 European form)
- ❌ **`07/26/2026`** (US month-first) · ❌ **`2:30 PM`** (12-hour clock in end-user copy)

### Practical rules

1. **Never hard-code** number or date formatting; use locale-aware formatting keyed on the **full
   tag** (`pt-BR` / `pt-PT`), **not bare `pt`**.
2. **Bare `pt` in CLDR resolves to the *Brazilian* defaults** — dot grouping, symbol-first currency.
   A project that ships `pt` expecting European conventions **silently ships Brazilian ones**. This is
   a very common misconfiguration; it is called out again in §9 and §10.
3. **Large numbers in prose split by scale.** ⚠ *editorial:* Portugal uses the **long scale**
   (`mil milhões` = 10⁹), Brazil the **short scale** (`bilhão` = 10⁹). For neutral text, **rephrase to
   avoid the scale entirely** — prefer numerals: **`175 × 10⁹ parâmetros`** — or fork the string
   (`175 mil milhões` PT / `175 bilhões` BR).
4. Keep **ISO 8601 (`YYYY-MM-DD`)** and Western digits for backends, identifiers, and code; the rules
   above are **display-layer only**.

Sources:
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pt/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pt-PT/numbers.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/pt/ca-gregorian.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/pt-PT/ca-gregorian.json>
(the long/short-scale row is editorial)

---

## 6. Terminology strategy

**(Mixed section — 6 of 15 terms carry a fetched quote; **9 of 15 have no codifying authority** and
are marked `⚠`: usage is stable in the field but not fixed by any academy, dictionary, or standards
body.)**

**Loanword policy.** Conceptual terms are **translated or calqued** (`inteligência artificial`,
`aprendizado/aprendizagem automática`, `rede neural/neuronal`, `ajuste fino`, `conjunto de dados`);
**hands-on terms stay English loanwords** (`prompt`, `token`, `pipeline`), are **masculine**, and take
a regular plural in `-s` (`o prompt` → `os prompts`; `o token` → `os tokens`). **Keep the loanword and
gloss it once** — attempting `instrução` for *prompt* or `unidade lexical` for *token* reads as
pedantic and hurts searchability.

**`IA`, not `AI`, and not `I.A.`** The dictionary entry gives the abbreviation with periods
(`sigla: I.A.`), but **current usage overwhelmingly writes `IA`**; standardize on **`IA`**. `AI` must
**never** be left untranslated — `IA` is universal in both variants.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of an
established domain term (class **C3**), give target term + original + one short plain clause, then use
the target term alone afterwards:

> **inteligência artificial (IA)** — *artificial intelligence* — ramo da ciência da computação que
> estuda o desenvolvimento de sistemas computacionais capazes de simular capacidades associadas à
> inteligência humana. *(The definitional clause is adapted from the sourced dictionary entry quoted
> in §2; the sandwich framing is the kit's format.)* Then **IA** alone on every later mention.

**Seed field vocabulary (AI/ML).** **SPLIT** marks a genuine pt-BR / pt-PT fork — see §9, where these
rows become the fork list.

| # | English | Recommended (AO90) | pt-BR | pt-PT | Evidence |
|---|---|---|---|---|---|
| 1 | artificial intelligence | **inteligência artificial (IA)** | same | same | ✅ dictionary |
| 2 | machine learning | **SPLIT** | **aprendizado de máquina** / aprendizado automático | **aprendizagem automática** / aprendizagem de máquina | ✅ encyclopedia, explicit variant labels |
| 3 | neural network | **SPLIT** | **rede neural** (artificial) | **rede neuronal** (artificial) | ✅ Ciberdúvidas |
| 4 | training data | **SPLIT** | **dados de treinamento** | **dados de treino** | ✅ (BR attested) / `⚠` (PT by pattern) |
| 5 | model | **modelo** (m.) | same | same | `⚠` |
| 6 | dataset | **conjunto de dados** (m.) | conjunto de dados / *dataset* | conjunto de dados | `⚠` |
| 7 | prompt | **prompt** (m.) | prompt | prompt / *comando* | `⚠` |
| 8 | token | **token** (m.), pl. **tokens** | token | token | `⚠` |
| 9 | fine-tuning | **ajuste fino** (m.) | ajuste fino / *afinação* | ajuste fino / *afinação* | `⚠` |
| 10 | inference | **inferência** (f.) | same | same | `⚠` |
| 11 | algorithm | **algoritmo** (m.) | same | same | ✅ indirect |
| 12 | deep learning | **SPLIT** | **aprendizado profundo** | **aprendizagem profunda** | `⚠` (pattern from #2) |
| 13 | supervised / unsupervised | **supervisionado / não supervisionado** (agreeing) | same | same | ✅ encyclopedia |
| 14 | large language model (LLM) | **modelo de linguagem de grande porte** (BR) / **de grande dimensão** (PT) | de grande porte | de grande dimensão | `⚠` |
| 15 | hallucination | **alucinação** (f.) | same | same | ✅ encyclopedia |
| — | label | **etiqueta** (f.) | same | same | ✅ (attested in #13's definition) |
| — | bias | **viés** (m.) | viés | enviesamento / viés | `⚠` **SPLIT** |

**Evidence detail on the sourced rows.**

- **#2 — the flagship split, fully sourced.** The encyclopedia's opening sentence spells out all four
  forms **with explicit variant labels**: «O aprendizado automático (português brasileiro) ou a
  aprendizagem automática (português europeu) ou também aprendizado de máquina (português brasileiro)
  ou aprendizagem de máquina (português europeu)» (**re-fetched and confirmed this session**). The
  generalizable rule — **BR `aprendizado`, PT `aprendizagem`** — is the most productive single
  terminological divergence in the domain (§9).
- **#3 — sourced and counter-intuitive.** Ciberdúvidas: «Em Portugal, prefere-se «rede neuronal
  artifical», incluindo «rede neuronal»» (**re-fetched and confirmed**; *artifical* is the source's own
  misspelling). The consultation rests the preference on the translation consecrated for Portugal by
  the European reference dictionary (*rede neuronal artificial*, attested second-hand — §2), and notes
  that Brazil's demographic weight makes `neural` far more frequent overall. **A translator producing
  pt-PT who writes `rede neural` is not wrong-wrong, but is writing Brazilian-flavored Portuguese.**
- **#4 — BR attested, PT by pattern.** The encyclopedic definition of AI hallucination uses the
  Brazilian form: «uma resposta confiante por parte da IA que não parece ser justificada pelos dados
  de treinamento». The PT form `dados de treino` is `⚠` by the same nominalization pattern as #2.
- **#13 — attested with definitions:** «São apresentadas ao computador exemplos de entradas e saídas
  desejadas» (supervisionado) and «Nenhum tipo de etiqueta é dado ao algoritmo de aprendizado» (não
  supervisionado) (**re-fetched and confirmed**). The second quote also attests **`etiqueta`** for
  *label* and **`algoritmo`** (#11).
- **#15 — attested:** «uma alucinação ou alucinação artificial é uma resposta confiante por parte da
  IA». The metaphor transfers directly; both variants agree.

**#14 — the trap worth spelling out.** English *large* modifies *model* (size of the model), not
*language*. Portuguese adjective-after-noun makes the naive **`modelo de linguagem grande`** ambiguous
and clumsy, and **`grande modelo de linguagem`** reads as *great/important model*, because pre-posed
`grande` means *great*, not *large* (§4). The idiomatic solutions are **`modelo de linguagem de grande
porte`** (BR-favored) and **`modelo de linguagem de grande dimensão`** (PT-favored). The acronym
**`LLM`** is widely used untranslated in both variants and is acceptable on second mention. `⚠` — no
fetchable authority; domain-usage synthesis.

- ✅ **`modelo de linguagem de grande porte`** / **`… de grande dimensão`** · **`LLM`** on later mention
- ❌ **`grande modelo de linguagem`** (reads *great model*) · ❌ **`modelo de linguagem grande`**

**Agreement follows the variant's noun gender — a frequent, ugly error in mixed-variant texts:**

- ✅ BR: **`aprendizado supervisionado`** (m.) · ✅ PT: **`aprendizagem supervisionada`** (f.)
- ❌ **`aprendizagem supervisionado`** / **`aprendizado supervisionada`** (variant and gender mixed)

Project coinages (**C1**) keep their original spelling in Portuguese text and are owned by the
term-sheet, not this table.

Sources: <https://pt.wikipedia.org/wiki/Aprendizado_de_m%C3%A1quina> ·
<https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/redes-neuronais-artificiais/38009> ·
<https://pt.wikipedia.org/wiki/Alucina%C3%A7%C3%A3o_(intelig%C3%AAncia_artificial)> ·
<https://dicionario.priberam.org/inteligencia%20artificial> (rows #5–#10, #12, #14, and *bias* are
field usage with **no codifying authority** — `⚠`)

---

## 7. Idiom anti-patterns

**⚠ Craft-tier section, native-speaker confirmation pending.** **No authority publishes such a
list** — this is applied translation craft, not sourced fact. The grammatical mechanisms behind the
recommendations (pro-drop, clitic avoidance, adjective position) **are** sourced in §4 and §9. Prefer
the idiomatic column; the calque column is the naive output to avoid.

| # | English | ✅ Idiomatic Portuguese | ❌ Literal calque (WRONG) | Notes |
|---|---|---|---|---|
| 1 | Let's get started. | **Vamos começar.** | *Vamos ficar começados.* | Identical in both. `Vamos lá` is warmer, slightly BR-flavored. |
| 2 | Keep in mind that… | **É importante notar que…** (neutral) / Tenha em conta que… / Lembre-se de que… | *Mantenha na mente que…* | `Tenha em conta` is PT-leaning; `Lembre-se` uses a clitic — prefer the neutral form (§9). |
| 3 | In a nutshell / In short | **Em resumo.** / **Em poucas palavras.** | *Numa casca de noz.* | Both neutral. `Resumindo` is fine and shorter. |
| 4 | Under the hood | **Nos bastidores.** / **Por dentro.** / **Como funciona por trás.** | *Debaixo do capô.* | The calque is understood but reads as a translation. `Nos bastidores` is safest. |
| 5 | Rule of thumb | **Regra geral.** / **Regra prática.** | *Regra do polegar.* | The calque is meaningless in Portuguese. |
| 6 | Trial and error | **Tentativa e erro.** | *Julgamento e erro.* | Fixed expression, identical in both. |
| 7 | A good starting point | **Um bom ponto de partida.** | *Um bom ponto de começar.* | Fully idiomatic; no divergence. |
| 8 | It's worth noting that… | **Vale notar que…** / Vale a pena notar que… | *É valor notando que…* | `Note-se que` is a clitic (PT-flavored) — avoid in neutral text. |
| 9 | Step by step | **Passo a passo.** | *Passo por passo.* | Identical in both; standard for tutorial headings. |
| 10 | Stay tuned / Bear with me | **Fique atento.** | *Suporte comigo.* | **BR/PT split** lurks in `connosco` (PT) / `conosco` (BR) — `Fique atento` sidesteps it. |
| 11 | The takeaway is… | **A conclusão é…** / **O que fica é…** / **A lição é…** | *O leve-embora é…* | In Portugal `takeaway` means *comida para levar*; the calque is actively confusing. |
| 12 | Hands-on (exercise) | **prático** / **exercício prático** / **na prática** | *Mãos-em.* | `Mão na massa` is idiomatic but distinctly BR-colloquial; `prático` is neutral. |
| 13 | Out of the box | **Pronto a usar** (PT) / **pronto para usar** (BR) / **De origem.** | *Fora da caixa.* | **BR/PT split** in the `a`/`para` + infinitive construction. `Fora da caixa` in Portuguese means *unconventional thinking* — the opposite sense. |
| 14 | Cutting-edge / state of the art | **De ponta.** (`tecnologia de ponta`) / **Estado da arte.** | *Borda cortante.* | Both idiomatic; `estado da arte` is an established calque, fine in academic register. |

**Cross-cutting idiom rules.**
- **Do not calque metaphors.** English technical writing is metaphor-dense (*under the hood*, *out of
  the box*, *pipeline*, *black box*). Portuguese tolerates far fewer of them; when in doubt, **state
  the meaning plainly** — which also satisfies §8.
- **`black box` → `caixa preta`** *is* established in both variants — keep it.
- **`pipeline`** → keep as **`pipeline`** (m.) in technical contexts; **`fluxo`** or **`cadeia de
  processamento`** in educational prose.
- **False friends that survive review undetected.** These appear constantly in this domain:

| English | ❌ Looks like | Actual Portuguese meaning | ✅ Use |
|---|---|---|---|
| actually | *atualmente* | *currently* | **na verdade** |
| eventually | *eventualmente* | *occasionally* | **por fim**, **acabará por** |
| library | *livraria* | *bookshop* | **biblioteca** |
| to pretend | *pretender* | *to intend* | **fingir** |
| parents | *parentes* | *relatives* | **pais** |
| to realize (understand) | *realizar* | *to carry out* | **perceber**, **dar-se conta** |

`atualmente` and `eventualmente` are the two that most often survive review undetected.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: none — **this section carries no authority citation by construction** (§7 is craft-tier).
Its grammatical premises are sourced at
<https://ciberduvidas.iscte-iul.pt/artigos/rubricas/idioma/colocacao-pronominal-portugues-do-brasil-x-portugues-europeu/5754>
(clitic avoidance) and <https://pt.wikipedia.org/wiki/Aprendizado_de_m%C3%A1quina> (adjective
position, via the term forms).

---

## 8. Simplified-language pendant (`pt-easy`)

**(Strong for Brazil — plain language is *codified in federal law*, with quotable statute text. `⚠`
for Portugal — accessibility law only, and its text was unfetchable. The vocabulary layer is now
**measured** rather than asserted — and of 25 probed substitutions only **3** survive on both sides,
while **2** turn out to run backwards.)**

Portuguese is unusual among European languages: **the plain-language obligation is now national law in
Brazil**, while Portugal's route runs through **accessibility legislation** rather than a language
statute. Both are usable; **they are not symmetrical, and this guide will not imply parity.** What the
Brazilian law does *not* supply is a list of which Portuguese words are the plain ones — it says
«palavras comuns» and stops. §8c counts a Brazilian corpus pair to find out, and §8d records which of
this section's own substitutions that count destroys. The subsections follow the kit's uniform 8a–8g
order, so a translator moving between languages finds the same seven answers in the same seven places.

### 8a. The standard that does exist ✅

#### Brazil — *linguagem simples* is federal law ✅

**Lei 15.263/2025 — Política Nacional de Linguagem Simples.** The Federal Senate's news service
reports: «Lei 15.263, publicada nesta segunda-feira (17) no Diário Oficial da União».

**Scope — extremely broad:** «A regra vale para todos os órgãos e entidades da administração pública
direta e indireta de todos os Poderes da União, dos estados, do Distrito Federal e dos municípios» —
all three branches, all four federative levels.

**Quotable techniques** (same source): «usar frases curtas e em ordem direta» · «preferir palavras
comuns, de fácil compreensão» · «evitar palavras estrangeiras».

> **The tension, and its resolution.** «evitar palavras estrangeiras» sits in direct conflict with the
> domain's reliance on `prompt`, `token`, `dataset`, `LLM` (§6). For an educational platform the
> resolution is **keep the term, gloss it in Portuguese on first use** — which is exactly what the
> municipal law prescribes: «evitar o uso de termos técnicos e explicá-los quando necessário».

**Municipal precedent — São Paulo, Lei nº 17.316, de 6 de março de 2020.** Its *objetivos* include
«garantir que a administração pública municipal utilize uma linguagem simples e clara» and
«possibilitar que as pessoas e as empresas consigam com facilidade **localizar, entender e utilizar**
as informações» — note the *find / understand / use* triad, the same test the international standard
uses.

Its **diretrizes** are the most directly reusable editorial rules found anywhere in this research
(all verbatim from the fetched city portal):
- «usar linguagem respeitosa, amigável, simples e de fácil compreensão»
- «usar palavras comuns e que as pessoas entendam com facilidade»
- «evitar o uso de jargões e palavras estrangeiras»
- «evitar o uso de termos técnicos e explicá-los quando necessário»
- «usar elementos não textuais, como imagens, tabelas e gráficos»
- «não usar termos discriminatórios»

**Organization — Rede Linguagem Simples Brasil.** «Lançada no dia 11 de março de 2021», it exists to
«reunir as iniciativas em Linguagem Simples que existem no Brasil», and reports «Hoje, mais de 830
pessoas, de dentro e fora do setor público, fazem parte da Rede». Coordinated jointly by federal
digital-government, state (Ceará) and municipal (São Paulo) innovation labs.

**Honest limitation — no quantitative thresholds.** **None** of the Brazilian instruments specify a
maximum sentence length in words or a target readability index. The rules are **qualitative**
(«frases curtas», «palavras comuns»). **Any numeric rule in this project — e.g. the kit's ~8–12-word
sentence target — is a project convention, not a legal requirement**, and must be presented as such.
§8c is the first numeric evidence this guide has, and §8f says exactly how far it reaches.

#### Portugal — accessibility law, not a language law `⚠ partially unverified`

Portugal has **no** equivalent plain-language statute. The binding instrument is **Decreto-Lei n.º
83/2018, de 19 de outubro**, transposing EU Directive 2016/2102 and setting accessibility requirements
for public-sector websites and mobile applications, supervised by the **AMA**. Reported requirements:
conformity with **WCAG 2.1 level AA** via **EN 301 549**, plus a published accessibility statement on
an AMA-approved model. **`⚠ unverified`: the official Diário da República page returned an empty
response body, so no verbatim quote could be extracted**, and it was not retried here. Fallback
candidates: `diariodarepublica.pt/dr/detalhe/decreto-lei/83-2018-116734769` and
`acessibilidade.gov.pt`.

**Relevant limitation, stated honestly.** **WCAG 2.1 AA does not include the reading-level
criterion** — Success Criterion 3.1.5 *Reading Level* is **AAA**, not AA. So Portuguese public-sector
sites are **not legally required** to hit a plain-language reading level. Portugal's plain-language
practice is **voluntary/professional**, not statutory, unlike Brazil's.

#### International anchor

**ISO 24495-1:2023, *Plain language — Part 1: Governing principles and guidelines*** (published 2023)
is the neutral, variant-independent standard a pan-lusophone guide can cite, and it aligns with the
*find / understand / use* triad quoted from the São Paulo law. **`⚠ 403`** — the standards body's page
returned **HTTP 403**; title, number, and year come from consistent search-result metadata and could
**not** be quoted from a fetched page. Not retried.

### 8b. Name the axis — **structure carries the register; vocabulary barely moves**

The law names two levers in one clause — «usar frases curtas e em ordem direta» (structure) and
«preferir palavras comuns» (vocabulary) — and gives no way to tell which one does the work. The
measurement in §8c separates them, and they behave completely differently.

**The structural contrast is large and consistent.**

| | A — plainer | B — standard | Contrast |
|---|---|---|---|
| Mean sentence length (words) | **19.36** | **24.68** | **−21.6 %** |
| Median sentence length | **18** | **22** | −4 words |
| Sentences under 16 words | **39 %** | **26.9 %** | **1.45×** |
| Tokens longer than 11 characters | **2.8 %** | **4.2 %** | **1.5×** |

**The lexical contrast is a row-by-row lottery.** Of 25 formal→everyday pairs probed in the same two
corpora, only **3 clear the tolerance band on both sides**; **9 clear it on one side only**, **2 run
backwards**, **6 are flat**, **4 are too thin to judge**, and **1 was untestable** (§8c, §8d). There
is no clean "formal word → everyday word" ladder in Brazilian Portuguese that this measurement can
support: the plainer-sounding replacement is usually **no commoner** in the plainer corpus, and twice
it is the **rarer** word.

**So the axis for `pt-easy` is sentence architecture, not word etymology.** Shorter sentences,
`ordem direta`, one idea per sentence, fewer very long word forms **in aggregate** — that is where the
measured difference lives, and it is also the part the federal law actually quotes. Vocabulary
substitution is a **last, per-row** operation, permitted only for the rows §8c confirms.

> ⚠ **One structural number is not usable as a contrast.** Type–token ratio reads 0.1087 (A) against
> 0.0832 (B), but TTR falls mechanically as a corpus grows and B is 1.8× the size of A. It is reported
> in §8c for completeness and **carries no register claim**.

### 8c. Measure the axis

**Corpora — one publisher, two editions.** Holding the publisher constant is the strength of this
design; the variable that remains is **the reader's age**, which is also its main weakness (§8e).

| | Publication | Publisher | Documents | Tokens | Types | Sentences |
|---|---|---|---|---|---|---|
| **A — plainer** | *Ciência Hoje das Crianças*, `chc.org.br` | Instituto Ciência Hoje | 300 | **133,981** | 14,570 | 6,921 |
| **B — standard** | *Ciência Hoje*, `cienciahoje.org.br` | Instituto Ciência Hoje | 300 | **244,580** | 20,350 | 9,909 |

**Method — reproducible.** Both editions were pulled through their WordPress REST endpoints by
`scripts/corpus-measure.mjs` (this repository, added 2026-07-27), which refuses a host whose
`robots.txt` disallows the fetch; both hosts allowed it. HTML was stripped locally, recurring
license/credit lines removed (**2 lines, in B only**), text case-folded and tokenized on Unicode
letter runs. Rates below are **per 100,000 tokens**. Keyness is **log-likelihood**, minimum 40
occurrences. Tokenizer sanity anchor: «não» counts 917 (A) / 1,575 (B), i.e. ~684 vs ~644 per 100k —
the expected order of magnitude for a Portuguese function word, so the tokenizer is not silently
dropping or splitting text.

**Reading the rates back into occurrences.** One occurrence ≈ **0.75 per 100k in A** and ≈ **0.41 per
100k in B**. Every row below resting on roughly one or two occurrences is marked **⚠ thin**; a thin
row is a hint, not a finding.

> ⚠ **Five limitations that travel with every number in §8c–§8e.**
>
> 1. **There is no adult easy-read Portuguese corpus here.** A is a **children's** science magazine —
>    a proxy for *linguagem simples*, not an instance of it. Anything the measurement shows may be a
>    property of writing for children rather than of writing plainly for adults. This is decisive for
>    §8e.
> 2. **Brazilian Portuguese only.** European Portuguese is **unmeasured**; §9 carries the double norm,
>    and no row here may be read as evidence about `pt-PT`.
> 3. **Topic differs between the two editions.** The keyness list is full of subject-matter, not
>    register: *ciência*, *científica*, *células*, *câncer* (B) and *bichos* (A) are **topic**
>    differences and are **not** used as register evidence anywhere in this section.
> 4. **No lemmatization.** Word *forms* were counted, not lexemes. Inflected forms of a pair member
>    can shift a row, and the probe is blind to that.
> 5. **Frequency is not comprehension.** No Portuguese comprehension study was located. Nothing here
>    shows that the commoner word is the better-understood one.

**⚠ Tokens excluded as page furniture — not language findings.** The keyness list's top ranks include
`foto`, `flickr`, `href` and `i` (A: caption and photo-credit lines from the magazine's image
furniture, plus a residue of escaped markup — `href` alone is ~0.12 % of A's tokens) and `ch` (B: an
abbreviation/formula residue). **None of these are cited as register evidence.** Remaining unknown
HTML entities in the B fetch: `&ordm;` ×18, `&ordf;` ×3, `&alpha;` ×3 — ordinal and Greek signs, no
word-splitting risk.

**Keyness — the rows that survive both filters** (topic-neutral, not furniture). Only two
register-relevant families remain large enough to name:

| word | A /100k | B /100k | LL | favors |
|---|---|---|---|---|
| você | **263.5** | **31.9** | **393.8** | A — the largest value in the whole table (§8e) |
| eles | 229.1 | 90.8 | 112.1 | A — explicit pronouns, ⚠ interpretation, see §8g |
| bem | 190.3 | 69.9 | 105.2 | A |
| sabe | 60.5 | 12.7 | 63.2 | A |
| dia | 122.4 | 40.9 | 77.7 | A |
| cientistas | 215.7 | 88.3 | 99.6 | A |
| pesquisa | 73.9 | **172.9** | 68.1 | B |
| desenvolvimento | 16.4 | **98.5** | 105.0 | B |
| resultados | 14.2 | 86.7 | 93.4 | B |
| dados | 21.6 | 99.8 | 88.6 | B |
| on-line | 0 | 46.6 | 99.6 | B |

The B side of this list is the abstract-noun family — *desenvolvimento*, *resultados*, *dados*,
*pesquisa*. ⚠ Reading that as "the standard edition nominalizes more" is **interpretation, not a
measured claim**; it is consistent with the sentence-length gap in §8b but was not tested separately.

**How to read a verdict — the tolerance band, stated so you can disagree with the cutoff.** A raw
difference is not a direction. Three rules turn rates into verdicts:

- **Band — 1.25×.** A word counts as *concentrated* in one corpus only if its rate there is at least
  **1.25×** its rate in the other. Anything between **0.8× and 1.25× is flat**: measured, and measured
  to be no different.
- **Thin floor — 3 per 100k in both corpora.** If the word that decides a row runs under **3 per 100k
  on both sides** (≈4 occurrences in A, ≈7 in B), it is **too thin to judge** and gets no verdict in
  either direction.
- **The two members are judged separately.** The **formal** member must be concentrated in **B** to be
  a formality marker worth deleting; the **everyday** member must be concentrated in **A** to be the
  plainer word worth reaching for. They fail independently — which is why *partial* exists.

| verdict | what it means |
|---|---|
| ✅ **holds** | both sides clear the band — formal word concentrated in B **and** replacement concentrated in A |
| 🟡 **partial (replacement confirmed)** | the replacement really is the plainer word; the formal member is **not** a formality marker (flat, or under the floor) |
| 🟡 **partial (drop confirmed)** | the formal word really is concentrated in the standard corpus — delete it — but the replacement is **not** itself a plainness marker |
| ⚪ **flat / no signal** | neither side clears the band. The swap **buys nothing measurable**. That is **not** the same as the swap being harmful |
| ⚠ **thin** | the deciding word is under the floor in both corpora — no verdict either way |
| 🔴 **reversed** | the "everyday" member is concentrated in the **standard** corpus: making the swap reaches for the *rarer* word |
| ❌ **untestable** | the probe could not measure the row at all |

⚠ **The band is a judgment call, not a derivation, and several rows sit close to it** — see §8g.

**The probe — every pair this section used to assert, plus the pairs the probe added.**

| # | formal → everyday | formal A / B | everyday A / B | verdict |
|---|---|---|---|---|
| 1 | proceder → fazer | 0 / 0.8 | 96.3 / 79.7 | ⚠ **thin** — *proceder* ≈2 occurrences, all in B; *fazer* 1.21×, inside the band |
| 2 | utilizar → **usar** | 4.5 / 9 | 26.1 / 21.3 | 🟡 **partial (drop confirmed)** — *utilizar* 2.0× B-concentrated; *usar* 1.23×, inside the band |
| 3 | viabilizar → **deixar** | 0 / 1.6 | 10.4 / 7.8 | 🟡 **partial (replacement confirmed)** — *deixar* 1.33×; *viabilizar* under the floor |
| 4 | posteriormente → **depois** | 2.2 / 3.3 | 81.4 / 58.5 | ✅ **holds** — 1.5× / 1.39× |
| 5 | anteriormente → **antes** | 3 / 3.7 | 61.9 / 48.2 | 🟡 **partial (replacement confirmed)** — *antes* 1.28×; *anteriormente* 1.23×, flat |
| 6 | necessitar → **precisar** | 0 / 0.8 | 5.2 / 3.3 | 🟡 **partial (replacement confirmed)** — *precisar* 1.58×; *necessitar* under the floor |
| 7 | denominado → **chamado** | 0 / 2.5 | 35.8 / 19.2 | 🟡 **partial (replacement confirmed)** — *chamado* 1.86×; *denominado* under the floor |
| 8 | designado → **chamado** | 0 / 0.4 | 35.8 / 19.2 | 🟡 **partial (replacement confirmed)** — *designado* ≈1 occurrence |
| 9 | auxiliar → **ajudar** | 1.5 / 5.7 | 41.8 / 24.5 | ✅ **holds** — 3.8× / 1.71×, the strongest row in the probe |
| 10 | obter → **conseguir** | 1.5 / 14.3 | 12.7 / 10.2 | 🟡 **partial (drop confirmed)** — *obter* 9.5× B-concentrated; *conseguir* 1.24×, inside the band |
| 11 | iniciar → **começar** | 1.5 / 3.7 | 15.7 / 9.4 | ✅ **holds** — 2.5× / 1.67× ⚠ the formal side rests on ≈2 (A) and ≈9 (B) occurrences |
| 12 | compreender → **entender** | 9 / 10.6 | 47.8 / 31.9 | 🟡 **partial (replacement confirmed)** — *entender* 1.50×; *compreender* 1.18×, flat |
| 13 | possibilitar → permitir | 0.7 / 1.6 | **3.7 / 8.2** | 🔴 **reversed** — *permitir* 2.2× concentrated in the standard corpus, see §8d |
| 14 | acerca → sobre | **0 / 7.8** | 213.5 / 260.4 | ⚪ **flat on the swap** — *sobre* 1.22×, inside the band. ⚠ Deleting *acerca* is a separate and supported finding (0 in A vs 7.8 in B) — §8d |
| 15 | adquirir → comprar | 1.5 / 0 | 3 / 3.3 | ⚠ **thin** — *adquirir* ≈2 occurrences; *comprar* 1.1×, flat |
| 16 | demonstrar → mostrar | 0.7 / 1.6 | **8.2 / 10.6** | 🔴 **reversed** — *mostrar* 1.29× concentrated in the standard corpus, see §8d |
| 17 | necessário → preciso | 13.4 / 15.9 | 32.8 / 36 | ⚪ **flat** — 1.19× / 1.10×, both inside the band |
| 18 | utilizar → empregar | 4.5 / 9 | **0 / 1.2** | ⚠ **thin** — *empregar* ≈3 occurrences, all in B |
| 19 | efetuar → fazer | **0 / 0** | 96.3 / 79.7 | ⚪ **flat** — *efetuar* absent from both corpora; *fazer* 1.21× |
| 20 | efetuar → realizar | **0 / 0** | 14.2 / 12.7 | ⚪ **flat** — neither member discriminates |
| 21 | ulteriormente → **depois** | **0 / 0** | 81.4 / 58.5 | 🟡 **partial (replacement confirmed)** — *depois* 1.39×; *ulteriormente* absent from both |
| 22 | (na) eventualidade → se | **0 / 0** | 732.9 / 607.6 | ⚪ **flat** — *eventualidade* absent from both; *se* 1.21× |
| 23 | realizar → fazer | 14.2 / 12.7 | 96.3 / 79.7 | ⚪ **flat** — 1.12× / 1.21×, neither clears the band |
| 24 | elaborar → fazer | 3 / 1.2 | 96.3 / 79.7 | ⚠ **thin** — *elaborar* ≈4 (A) vs ≈3 (B) occurrences |
| 25 | iniciar → comecar *(unaccented)* | 1.5 / 3.7 | **0 / 0** | ❌ **untestable** — probe artifact, see §8d |

**Rows this section asserts that the probe could not test at all.** Four of the old table's rows are
**multi-word phrases**, and the probe measured single word forms only. They are kept in §8f because
they are **word-count reductions**, which is the structural axis §8b confirms — but they carry
**⚠ unmeasured** and must never be cited as measured:

- `no que diz respeito a` / `relativamente a` → **sobre**, **quanto a** — ⚠ unmeasured
- `a fim de` / `com o objetivo de` → **para** — ⚠ unmeasured
- `em virtude de` / `devido ao facto de` → **porque**, **por** — ⚠ unmeasured (`facto` PT / `fato` BR, §9)
- `caso` → **se** for conditions — ⚠ unmeasured; only *eventualidade* was probed (row 22), and `caso`
  itself was never counted. The old claim "shorter and commoner" has **no evidence behind it here**.

### 8d. 🔴 The do-NOT-simplify list — where the measurement contradicts the instinct

**This is the highest-value table in §8, and it is deliberately small.** Only **two** rows are
actively wrong — rows where the "everyday" member is the word the *standard* corpus prefers, so a
translator making the swap reaches for the rarer word. Everything else that fails is a *weaker*
finding and is listed separately, because **"no measured benefit" and "harmful" are not the same
claim** and must not be blurred.

#### 🔴 Reversed — two rows, and only two

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**possibilitar** → **permitir**~~ | *permitir* runs **3.7 (A) vs 8.2 (B)** — **2.2× concentrated in the standard corpus**, well past the band, and both rates are above the thin floor. It is the more formal member of its own row. **Rewrite to *deixar*, which goes the right way (10.4 vs 7.8, 1.33×, row 3), not to *permitir*.** Dropping *possibilitar* itself is ⚠ thin (0.7 / 1.6) and carries no separate weight. |
| ~~**demonstrar** → **mostrar**~~ | *mostrar* runs **8.2 (A) vs 10.6 (B)** — **1.29×** toward the standard corpus, just past the band, both rates above the floor. And the drop side gives you nothing either: *demonstrar* is ⚠ thin (0.7 / 1.6, ≈1 and ≈4 occurrences). **The row is unusable at both ends.** |

> **→ The rule that follows.** In Portuguese, **do not simplify by etymology, by Latin roots, or by
> how "bureaucratic" a word sounds.** Change a word only where §8c shows the plainer corpus actually
> uses the replacement more. Of 25 probed pairs that is **3 outright and 9 on one side only** — and
> in the two reversed rows above, the "plain" replacement this section used to recommend is the
> **rarer** word. **Rarity, not etymology, is what makes a word hard.**

#### ⚪ Measured, no signal — the swap buys nothing, which is **not** the same as harmful

Four pairs are **not** reversals: their difference falls inside the 1.25× band, or the deciding word
is under the thin floor. Correct them in both directions — do not cite them as evidence, and do not
treat them as traps either.

| Row | Numbers | Corrected verdict |
|---|---|---|
| *acerca de* → *sobre* | *sobre* **213.5 / 260.4** = 1.22× | ⚪ **flat.** The swap is not a measured plainness gain. ⚠ Separately, **deleting *acerca* is supported** — it is absent from the plainer corpus and runs 7.8 in the standard one. Keep the deletion, drop the claim that *sobre* is the easier word (§8f row 12). |
| *necessário* → *preciso* | *necessário* 13.4 / 15.9 = 1.19×; *preciso* **32.8 / 36** = 1.10× | ⚪ **flat.** Neither member moves. Harmless as style, worthless as evidence. |
| *adquirir* → *comprar* | *adquirir* **1.5 / 0** (≈2 occurrences); *comprar* 3 / 3.3 = 1.1× | ⚠ **thin.** Under the floor — **no verdict in either direction.** |
| *utilizar* → *empregar* | *empregar* **0 / 1.2** (≈3 occurrences, all standard) | ⚠ **thin.** Under the floor. The usable form of this pair is **utilizar → usar** (row 2), where the *drop* side is confirmed at 2.0×. |

#### ⚪ The remaining rows with nothing in them

| Row | Numbers | What it means |
|---|---|---|
| *efetuar* → *fazer* / *realizar* | *efetuar* **0 / 0** | *efetuar* does not occur in either corpus. Nothing to remove; the rule is harmless and unevidenced. |
| *na eventualidade de* → *se* | *eventualidade* **0 / 0** | Same. *se* itself is very frequent in both (732.9 / 607.6, 1.21×) but is a general function word, not a substitution win. |
| *realizar* → *fazer* | *realizar* **14.2 / 12.7** = 1.12× | *realizar* is **not** a formality marker here — it barely moves, and *fazer* (1.21×) does not clear the band either. Neither half of the old rule survives. |
| *elaborar* → *fazer* | *elaborar* **3 / 1.2** | ⚠ **thin** — ≈4 vs ≈3 occurrences. Earlier drafts of this section read a direction into it; at these counts there is none. |
| *ulteriormente* → *depois* | *ulteriormente* **0 / 0**; *depois* 81.4 / 58.5 = 1.39× | Not flat after all: the **replacement is confirmed**, the formal word simply never appears (§8c row 21). Reach for *depois* on its own merits, not because *ulteriormente* was measured to be hard. |

#### ❌ Untestable — and this one is a probe artifact, not a language fact

| Row | Numbers | What it means |
|---|---|---|
| *iniciar* → *comecar* (unaccented) | replacement **0 / 0** | The replacement was queried **without its cedilla**, so it matched nothing. **This is a tooling artifact, not a finding:** the same pair queried as *iniciar* → **começar** returns 15.7 / 9.4 and **holds** (row 11). Recorded so nobody re-derives a false negative from it — and as a standing warning that an ASCII-flattened query against a Portuguese corpus silently returns zero. |

### 8e. 🔑 The address decision — `pt-easy` keeps §4's register, and the measurement does *not* overturn it

> **Decision, recorded so that nobody "fixes" it: `pt-easy` uses the same address as `pt` — the
> dropped-subject 3rd-person-singular register of §4, with explicit `você` for contrast or clarity
> only, and **never** `tu`. §8c does not change this.**

- ✅ **`Pode ajustar o modelo.`** · **`É possível treinar um modelo.`** · **`Ajuste os parâmetros.`** — in `pt` and `pt-easy` alike
- ❌ **`Você pode ajustar o modelo.`** in every sentence — the loudest marker of English-shaped translation (§4)
- ❌ **`Podes ajustar o modelo.`** — `tu` morphology, variant-marking

**What the measurement shows.** `você` is the **single largest keyness value in the entire table**:
**263.5 per 100k in A against 31.9 in B, LL 393.8** — an 8× contrast. Corpus A addresses its reader
directly and constantly; corpus B barely does. Taken at face value this looks like a mandate to
flood `pt-easy` with `você`.

**Why it is not taken at face value.** **Corpus A is a children's magazine.** The French case in this
kit established the exact confusion at issue: *address tracks the reader's age, not the text's
difficulty* — there, the form that collapsed to the familiar pronoun was the **children's** register,
while adult easy-read publishing used the polite form exclusively. Portuguese reproduces the same
design flaw and cannot distinguish the two, because age is the only variable separating A from B.

**So, exactly what this evidence does and does not support:**

- ✅ **Supported:** plainer/younger-audience Portuguese science writing **addresses the reader in the
  second person far more often** than the standard edition does. Direct address is a real feature of
  the register, and `pt-easy` should not write everything impersonally.
- ✅ **Compatible with §4, not in conflict with it:** because `você` takes **3sg morphology** (§4,
  sourced), a pronoun-less sentence is *morphologically identical* to a `você` sentence. The measured
  signal is about **second-person orientation**, which the dropped-subject register delivers in full.
  Nothing in the count requires the pronoun to be written out.
- ⚠ **Not supported:** that explicit `você` on every sentence is a *plainness* gain. On this corpus
  design it is at least as likely to be a children's-magazine trait, and §4 already rules that
  repeated explicit `você` is the loudest translationese marker.
- ❌ **Not addressed at all:** `tu`. The keyness table contains no `tu` row and the corpus is
  Brazilian only, so **the measurement says nothing about European Portuguese address**. §4's
  "never `tu`" stands on its own sources (§4, §9) and is untouched here.

**Practical rule for `pt-easy`:** keep §4's register, and spend the direct-address budget on
**imperatives and questions in 3sg** (`Ajuste…`, `Veja…`, `Sabe o que isso quer dizer?`) rather than
on pronouns. ⚠ The `sabe` row (60.5 vs 12.7) is consistent with a direct-question habit in A, but
reading it that way is **interpretation, not a measured claim**.

### 8f. What the pendant is built on — structure first, vocabulary last

`pt-easy` **inherits the kit's base simplified-language rules** from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) — one idea
per sentence, everyday words, say what *is* not what *isn't*, active voice, a one-line "what is this"
opener, a consistent literal tone. In order of leverage for Portuguese:

**1. Sentence architecture. This is the main lever, it is sourced *and* measured.**
«usar frases curtas e em ordem direta» (federal law, §8a) is also the only place §8c finds a large,
consistent contrast: **mean 19.36 vs 24.68 words, 39 % vs 26.9 % of sentences under 16 words.**
Subject–verb–object, one idea per sentence, active voice.

> **Base rule this measurement bounds — the ~8–12-word sentence target.** The plainer corpus measured
> here runs a **mean of 19.36 and a median of 18 words**, i.e. **well above** the kit's target. The
> measurement therefore **confirms the direction** (shorter is the plain register) and **does not
> confirm the threshold**. The ~8–12-word target remains what §8a already says it is: **a project
> convention, stricter than both the law (which sets no number) and than observed plain practice in
> this corpus.** State it as a convention, never as a norm.

**2. Keep the technical term and gloss it — do not swap it.**
Binding, and §8d is the reason it ranks above vocabulary substitution. In `pt-easy` keep
**`inteligência artificial`**, then «isso quer dizer: …», then a concrete example. This is the
municipal law's «evitar o uso de termos técnicos e explicá-los quando necessário» applied to §6's
domain vocabulary, and it is what resolves the «evitar palavras estrangeiras» tension in §8a. It is
distinct from the substitution list below, which targets **non-technical** bureaucratic vocabulary.

**3. Non-textual support.** «usar elementos não textuais, como imagens, tabelas e gráficos» —
explicitly endorsed by a legal instrument, unusual, and worth using.

**4. Expand every acronym on first use** — **`IA (inteligência artificial)`**. ⚠ editorial application
of «palavras comuns», not a quoted rule.

**5. Register overlay.** Hold the **dropped-subject 3sg register (§4)** steadily; see §8e for what the
`você` count does and does not license.

**6. Vocabulary substitution — last, and only as strongly as §8c actually supports it.** The
*Evidence* column carries the §8c verdict, so a row can be read for exactly what it is worth.

| # | Formal / bureaucratic | Everyday equivalent | Evidence |
|---|---|---|---|
| 1 | proceder a | **fazer** | ⚠ **thin**, row 1 — *proceder* ≈2 occurrences. Style, not evidence |
| 2 | utilizar | **usar** | 🟡 **drop confirmed**, row 2 — *utilizar* 2.0× B-concentrated; *usar* itself is flat (1.23×) but is 3–6× the commoner word in absolute terms (26.1 vs 4.5 in A). ⚠ The old note that European Portuguese "tolerates *utilizar* better" is **unmeasured** — the corpus is Brazilian only (§9) |
| 3 | possibilitar / viabilizar | **deixar** | 🟡 **replacement confirmed**, row 3 — *deixar* 1.33×. **Not *permitir***, which runs backwards — §8d |
| 4 | posteriormente | **depois** | ✅ **holds**, row 4 — the cleanest row in the table |
| 5 | anteriormente | **antes** | 🟡 **replacement confirmed**, row 5 — *antes* 1.28×; *anteriormente* is not a formality marker |
| 6 | necessitar de | **precisar de** | 🟡 **replacement confirmed**, row 6 — *precisar* 1.58×; *necessitar* under the thin floor |
| 7 | denominado / designado por | **chamado** | 🟡 **replacement confirmed**, rows 7–8 — *chamado* 1.86×; both formal forms under the floor |
| 8 | auxiliar | **ajudar** | ✅ **holds**, row 9 — 3.8× / 1.71×, the strongest row |
| 9 | obter | **conseguir** | 🟡 **drop confirmed**, row 10 — *obter* 9.5× B-concentrated; *conseguir* flat (1.24×) |
| 10 | iniciar | **começar** | ✅ **holds**, row 11 |
| 11 | compreender | **entender** | 🟡 **replacement confirmed**, row 12 — *entender* 1.50× |
| 12 | acerca de | **sobre** | 🟡 **drop confirmed**, row 14 — *acerca* absent from A, 7.8 in B. ⚠ *sobre* is **not** itself a plain marker (1.22×, flat) — §8d |
| 13 | no que diz respeito a / relativamente a | **sobre**, **quanto a** | ⚠ **unmeasured** — kept as a word-count reduction only |
| 14 | a fim de / com o objetivo de | **para** | ⚠ **unmeasured** — biggest single word-count win, but not probed |
| 15 | em virtude de / devido ao facto de | **porque**, **por** | ⚠ **unmeasured**. **`facto` (PT) / `fato` (BR)** — dupla grafia, §9 |
| 16 | caso / na eventualidade de | **se** | ⚠ **unmeasured** — *eventualidade* absent from both corpora; `caso` never counted |

**Removed from this table by the measurement.** Two replacements are removed because they **run
backwards** — **permitir** and **mostrar** (🔴 §8d); do not re-add either without new evidence. Four
formal words are removed because they carry **no measured signal at all** — *efetuar*, *realizar*,
*elaborar*, *eventualidade* (⚪/⚠ §8d): deleting them is harmless, but this guide will not present the
deletion as evidence-backed. *ulteriormente* is gone from the table for the same reason, though its
replacement *depois* is confirmed on its own (row 21). Three further replacements — *comprar*,
*preciso*, *empregar* — are **not** listed as traps: they are simply unsupported (⚠/⚪ §8d).

**Worked example — the win is length and word order, not word-swapping.**

- ✅ **`Para treinar o modelo, use dados de qualidade.`** — 8 words, `ordem direta`, verb instead of
  nominalization, imperative 3sg per §4
- ❌ **`Com o objetivo de efetuar o treino do modelo, é necessário proceder à utilização de dados que
  possuam qualidade.`** — 19 words, three nominalizations, subordinate chain

⚠ The rewrite `efetuar o treino` → **`treinar`** is kept as an illustration of **de-nominalization**,
which is a structural move (§8b). It is **editorial**: *efetuar* itself is absent from both corpora and
carries no measured signal (§8d).

### 8g. What is still open

1. **No adult easy-read Portuguese corpus was measured.** A is a children's magazine standing in for
   *linguagem simples*. A corpus of adult plain-language public-sector text — the Rede Linguagem
   Simples network, or federal-agency material published under Lei 15.263/2025 — would separate
   "written for children" from "written plainly", and would settle §8e properly.
2. **European Portuguese is entirely unmeasured.** Every number in §8c is Brazilian. A `pt-PT` pair
   would test whether any confirmed row survives the variant boundary (§9), and would give the
   *utilizar* tolerance note in §8f row 2 something to rest on.
3. **Four multi-word rows were never probed** (§8c, §8f rows 13–16), including `caso` → `se`, which
   this guide has asserted without evidence. A phrase-level probe would close them.
4. **No lemmatization.** Word forms were counted, not lexemes; several thin rows (*proceder*,
   *designado*, *adquirir*, *elaborar*) might change sign once inflected forms are pooled.
5. **The pro-drop question is open and it bears on §4.** `eles` runs 229.1 vs 90.8 and `você` 263.5 vs
   31.9 in the plainer corpus. Whether plainer Portuguese genuinely writes **more explicit pronouns**
   — which would sit in tension with §4's dropped-subject default — or whether this is the children's
   register again, is untested.
6. **The nominalization hypothesis is unmeasured.** The B-favoring keyness rows are abstract nouns
   (*desenvolvimento*, *resultados*, *dados*, *pesquisa*), but no `-ção`/`-mento` suffix count was run,
   so "standard Portuguese nominalizes more" stays a hypothesis.
7. **Topic is not controlled.** The two editions differ in subject matter (§8c), and a topic-matched
   pair would strengthen every keyness row.
8. **No comprehension evidence at all.** Everything in §8c is frequency. Whether the confirmed
   replacements are actually *understood* better by Portuguese readers was not established, and the
   Brazilian instruments set no readability index against which to check.
9. **The tolerance band is a judgment call, not a derivation — and it decides verdicts.** The
   **1.25× ratio** and the **3-per-100k thin floor** in §8c are defensible cutoffs chosen to stop
   small differences being read as directions; **nothing in the corpus fixes them at those values.**
   Several rows sit close to the line — *usar* 1.23×, *conseguir* 1.24×, *sobre* 1.22×, *antes*
   1.28×, *mostrar* 1.29× — so a reviewer who places the band at 1.15× or at 1.5× moves them between
   *holds*, *partial*, *flat*, and *reversed*. **A native reviewer may legitimately place it
   differently.** Whenever a §8c verdict is quoted elsewhere, quote the band with it. An earlier
   draft of this section ran without any band and reported **six** reversals where the banded
   re-evaluation finds **two** — the correction is recorded here rather than silently absorbed.

Sources: <https://www12.senado.leg.br/noticias/materias/2025/11/17/linguagem-simples-em-mensagens-de-orgaos-publicos-agora-e-obrigatoria> ·
<https://legislacao.prefeitura.sp.gov.br/leis/lei-17316-de-6-de-marco-de-2020> ·
<https://linguagemsimples.prefeitura.sp.gov.br/rede-linguagem-simples-brasil/>
(Portugal's DL 83/2018 and ISO 24495-1 are **`⚠` unquotable**) ·
**Plainer corpus (§8c)** — *Ciência Hoje das Crianças*, <https://chc.org.br/> ·
**Standard corpus (§8c)** — *Ciência Hoje*, <https://cienciahoje.org.br/> — both fetched through their
WordPress REST post endpoints under each host's `robots.txt`, 300 documents each, by
`scripts/corpus-measure.mjs` (this repository, added 2026-07-27). The §8b–§8e frequencies are this
guide's **own count**, reproducible from those URLs; the ⚠-marked substitution rows in §8f are
editorial and were **not** measured.

---

## 9. Regional variation — **the pt-BR vs pt-PT block**

**(Strong section — AO90 treaty text + Ciberdúvidas + CLDR, all fetched; three of its anchors
re-fetched this session. This is the load-bearing section of the guide: the single-guide decision
stands or falls here.)**

### 9.1 The constraint that defines this guide: **dupla grafia survived AO90**

**Say this plainly, because it is the key limitation of the one-guide decision: writing a text "in
AO90 spelling" does *NOT* make it variant-neutral.**

AO90 **unified the mute consonants**. Base IV of the treaty: «Eliminam-se nos casos em que são
invariavelmente mudos nas pronúncias cultas da língua: ação, acionar, afetivo, aflição, aflito, ato».
So European Portuguese lost the `c`/`p` in `acção → ação`, `óptimo → ótimo`, `director → diretor`,
`actividade → atividade` — **converging on forms Brazil already used**.

But **where the consonant is actually pronounced in one variant and not the other, both spellings
remain legal**. This is **dupla grafia**, and the treaty did not abolish it:

| pt-PT | pt-BR | Why |
|---|---|---|
| **`facto`** | **`fato`** | `c` pronounced in PT |
| **`contacto`** | **`contato`** | `c` pronounced in PT |
| **`receção`** | **`recepção`** | `p` pronounced in BR |
| **`aceção`** | **`acepção`** | `p` pronounced in BR |
| **`académico`** | **`acadêmico`** | `é` vs `ê` — vowel quality |
| **`neurónio`** | **`neurônio`** | **directly relevant to §6 #3** |
| **`económico`** | **`econômico`** | |
| **`António`** | **`Antônio`** | |
| **`connosco`** | **`conosco`** | ⚠ dupla-grafia-*adjacent* (fixed spelling per variant, not an AO90 dupla grafia); under-known; §7 #10 |

**AO90 did not abolish variant spelling. It reduced it.** For these words **a variant must be
chosen** — there is no AO90-compliant form that serves both.

**Other AO90 changes, both variants:** accents removed (`idéia → ideia`, `vôo → voo`, `lêem → leem`);
the trema abolished in native words; **capitalization lowered** (`Janeiro → janeiro`, `Primavera →
primavera`, `Norte → norte`), matching Base XIX: «Nos nomes dos dias, meses, estações do ano:
segunda-feira; outubro; primavera». Brazil already lowercased months — **this change hit European
Portuguese, and pre-2009 PT sources will show `Janeiro`.**

**Legal status, precisely.** Ratified by «Portugal (em 23 de agosto de 1991), Brasil (em 18 de abril
de 1995) e Cabo Verde», later joined by others; **Angola** remains the signatory that has not
ratified (⚠ Mozambique is commonly listed as not having completed ratification either — the fetched
page's phrasing centers on Angola, so treat Mozambique's status as **reported, not quotable**). The
**Segundo Protocolo Modificativo (2004)** made entry into force possible by providing that «três
membros da CPLP ratificassem o Acordo Ortográfico para que este entrasse em vigor», replacing the
original unanimity requirement. ⚠ The end-of-transition dates (Portugal May 13, 2015, Brazil January 1,
2016) are **`quote-unverified`** — reported consistently but not extractable as a verbatim quote.
**The practical consequence is not in doubt: AO90 is the mandatory school and official orthography in
both Portugal and Brazil today.**

**Asymmetric impact, and why the politics differ.** The change affects «cerca de 1,6% do total de
palavras (lemas)» for Portugal and the African countries, versus «aproximadamente 0,8% do total de
palavras (lemas)» for Brazil. **AO90 disturbed European Portuguese roughly twice as much as
Brazilian Portuguese** — which is why it remains politically contested in Portugal and essentially
uncontroversial in Brazil. State this without taking sides: **AO90 is the legal standard in both
markets; some Portuguese publishers and writers still decline to apply it.**

### 9.2 Divergence 1 — **`aprendizado` (BR) vs `aprendizagem` (PT)**, the most productive split

This is **the** terminological fork of the domain. The encyclopedia states all four forms with
explicit variant labels (**re-fetched and confirmed this session**): «O aprendizado automático
(português brasileiro) ou a aprendizagem automática (português europeu) ou também aprendizado de
máquina (português brasileiro) ou aprendizagem de máquina (português europeu)».

**Rule: BR prefers the noun `aprendizado`; PT prefers `aprendizagem`.** It **propagates to every
`-learning` compound**:

| English | pt-BR | pt-PT |
|---|---|---|
| machine learning | **aprendizado de máquina** / aprendizado automático | **aprendizagem automática** / aprendizagem de máquina |
| deep learning | **aprendizado profundo** | **aprendizagem profunda** |
| reinforcement learning | **aprendizado por reforço** | **aprendizagem por reforço** |
| supervised learning | **aprendizado supervisionado** | **aprendizagem supervisionada** |
| transfer learning | **aprendizado por transferência** | **aprendizagem por transferência** |

**And it drags adjective gender with it.** `aprendizado` is **masculine**; `aprendizagem` is
**feminine**. Every modifier must follow:

- ✅ pt-BR: **`aprendizado supervisionado`** · **`aprendizado profundo`** · **`o aprendizado`**
- ✅ pt-PT: **`aprendizagem supervisionada`** · **`aprendizagem profunda`** · **`a aprendizagem`**
- ❌ **`aprendizagem supervisionado`** · ❌ **`aprendizado profunda`** · ❌ **`o aprendizagem`**

The same nominalization pattern produces **`treinamento` (BR) / `treino` (PT)** — `dados de
treinamento` vs `dados de treino` (§6 #4).

### 9.3 Divergence 2 — **`rede neural` (BR) vs `rede neuronal` (PT)**

Ciberdúvidas states it plainly (**re-fetched and confirmed this session**): «Em Portugal, prefere-se
«rede neuronal artifical», incluindo «rede neuronal»» (*artifical* is the source's own misspelling).
The consultation grounds the preference in the translation consecrated for Portugal by the European
reference dictionary (*rede neuronal artificial*, attested second-hand — §2). It also notes that
**Brazil's demographic weight makes `neural` far more frequent overall** — so search-engine frequency
is *not* evidence of European usage. ⚠ A tidier rationale that circulated in the research dossier —
*neural* as medical terminology, *neuronal* as biology — is **not** on the cited page (a review
re-fetch found no such explanation there) and is not carried as sourced.

- ✅ pt-BR: **`rede neural`** / **`rede neural artificial`** · **`neurônio`**
- ✅ pt-PT: **`rede neuronal`** / **`rede neuronal artificial`** · **`neurónio`**
- ❌ pt-PT copy written as **`rede neural`** — not *wrong-wrong*, but **Brazilian-flavored
  Portuguese** in a European-market text, and it pairs badly with the `neurónio` spelling around it.

Note how this divergence **compounds with dupla grafia**: a European text says `rede neuronal` **and**
`neurónio`; a Brazilian text says `rede neural` **and** `neurônio`. Mixing them is the classic
mixed-variant tell.

### 9.4 Divergence 3 — **numbers and currency: not neutralizable, and a real integration trap**

| | pt-BR | pt-PT |
|---|---|---|
| Group separator | **`.`** period | **` `** space |
| Currency symbol + position | **`R$`, before** | **`€`, after** |
| Rendered | **`R$ 1.234,56`** | **`1 234,56 €`** |

The decimal comma is shared; **everything else about a money string differs** — symbol, position, and
grouping. **A currency string is triply variant-marked and cannot be neutralized.**

- ✅ **`R$ 1.234,56`** (BR) · ✅ **`1 234,56 €`** (PT)
- ❌ **`R$ 1 234,56`** · ❌ **`1.234,56 €`** (grouping and pattern crossed between variants)

> **⚠ Integration trap — bare `pt` silently resolves to Brazilian defaults.** In CLDR, the `pt` locale
> **is** the Brazilian base: **dot grouping, symbol-first currency**. A project that ships `pt`
> expecting European conventions **silently ships Brazilian ones** — no error, no warning, wrong
> output. **Always key locale-aware formatting on the full tag (`pt-BR` / `pt-PT`), never bare `pt`.**
> This is repeated in §5 and §10 because it is the single most common Portuguese misconfiguration.

Date formats also diverge in the medium/short patterns (§5), but that divergence is **minor and
low-risk** by comparison — both variants are day-first and both use the `d 'de' MMMM 'de' y` long
form, which is the form educational prose actually uses.

### 9.5 Divergence 4 — **quotation marks: no third option**

CLDR, both files fetched (`pt-PT` re-fetched this session):

| Locale | Primary | Alternate |
|---|---|---|
| **`pt`** (Brazilian base) | **“ … ”** (U+201C / U+201D) | **‘ … ’** (U+2018 / U+2019) |
| **`pt-PT`** | **« … »** (U+00AB / U+00BB) | **“ … ”** (U+201C / U+201D) |

- ✅ pt-BR: **“aprendizado supervisionado”** · ✅ pt-PT: **«aprendizagem supervisionada»**
- ❌ **"aprendizado supervisionado"** — straight ASCII (U+0022), wrong in **both** variants
- ❌ **«aprendizado supervisionado»** in a Brazilian text · ❌ **“aprendizagem supervisionada”** as the
  *primary* mark in a European text

**There is no third glyph that serves both.** The project must **pick one** for the shared base build
and accept that it reads as that variant, or fork the quote glyph along with the fork list (§9.8).

### 9.6 Divergence 5 — **clitic placement, and the mitigation that actually works**

Ciberdúvidas, **re-fetched and confirmed this session**:

- **Brazil favors proclisis** — pronoun **before** the verb: **`Te amo`**, **`Eles se reuniram`**.
- **Portugal favors enclisis** — pronoun **after**, hyphenated: **`Amo-te`**, **`Eles reuniram-se`**.

| Context | pt-PT | pt-BR |
|---|---|---|
| after a demonstrative | `Isso interessou-lhe` | `Isso lhe interessou` |
| after an explicit subject | `Carlos chamou-a` | `Carlos a chamou` |
| reciprocal | `Os dois amam-se` | `Os dois se amam` |

*(The third pair is **not in the source dossier** — it was found in the page during this session's
re-fetch and is carried on that basis.)*

The source's own conclusion is worth carrying: **in formal written Portuguese the two norms share
more similarities than differences** — the divergence is sharpest in spoken and informal-written
registers, and the article counts only a handful of genuinely divergent cases. ⚠ Carried as
**substance**, not as a verbatim Portuguese quote: the re-fetch returned this conclusion in paraphrase.
**Educational web copy sits uncomfortably in the middle** of that formal/informal line, which is why
this is `HIGH RISK` rather than academic.

*Breakage mode:* a text full of `Registe-se`, `Encontra-se disponível`, `Trata-se de` reads as
**European**; a text full of `Se registre`, `Se encontra` reads as **Brazilian**. Either way the
reader on the other side of the Atlantic notices.

> **Mitigation — the single most effective neutralization tactic available: paraphrase the clitics
> away entirely.** Not "choose the right clitic" — **remove the construction**.

| Clitic form (variant-marked) | ✅ Neutral paraphrase |
|---|---|
| `Registe-se` (PT) / `Se cadastre` (BR) | **`Criar conta`** · **`Faça o seu registo/cadastro`** |
| `Encontra-se disponível` (PT) / `Se encontra disponível` (BR) | **`Está disponível`** |
| `Trata-se de um modelo…` | **`É um modelo…`** |
| `Note-se que…` (PT) | **`Vale notar que…`** |
| `Lembre-se de que…` | **`É importante notar que…`** |
| `Pode-se treinar o modelo` | **`É possível treinar o modelo`** |

- ✅ **`Criar conta`** · **`Está disponível.`** · **`É possível treinar o modelo.`**
- ❌ **`Registe-se`** (PT-marked) · ❌ **`Se cadastre`** (BR-marked)

Two related grammar splits neutralize the same way (§4): **progressive aspect** — PT `está a treinar`
/ BR `está treinando` → use the **simple present** `O modelo treina`; and **second-person address** —
PT `tu` / BR `você` → **drop the subject pronoun** (the §4 register decision).

### 9.7 The rest of the divergence surface

**Everyday and computing vocabulary diverges far more than spelling — and AO90 does not touch
vocabulary at all.**

| English | pt-PT | pt-BR |
|---|---|---|
| screen | **ecrã** | **tela** |
| file | **ficheiro** | **arquivo** |
| mouse | **rato** | **mouse** |
| user | **utilizador** | **usuário** |
| team | equipa | equipe |
| registration / signup | registo | cadastro / registro |
| to save (data) | guardar | salvar |
| to download | descarregar / transferir | baixar |
| training (noun) | **treino** | **treinamento** |
| learning (noun) | **aprendizagem** | **aprendizado** |

**⚠ Partially verified.** The `treino`/`treinamento` and `aprendizagem`/`aprendizado` rows **are** ✅
sourced (§6, §9.2). The `ecrã`/`tela`, `ficheiro`/`arquivo`, `rato`/`mouse` and `utilizador`/`usuário`
rows were consistently reported but the dossier's targeted fetch **did not** land a page attesting the
specific pairs — the Ciberdúvidas page it reached attests the *problem* of English→Portuguese
computing-term translation, not the pairs. Fallback candidates: the Ciberdúvidas consultation on
`ecrã` and per-word dictionary entries. **Correct-form-only:** the forms above are the standard
renderings in their respective markets; no "wrong form" is asserted, because none was verified.

**None of these can be neutralized.** There is **no pan-lusophone word for *screen***. `Ecrã` is
opaque to a Brazilian reader; `tela` means *canvas/cloth* to a Portuguese reader before it means
*screen*.

**Consolidated neutralizability table:**

| Feature | pt-PT | pt-BR | Neutralizable? |
|---|---|---|---|
| 2nd-person address | **tu** (+2sg verbs); `você` = distant | **você** (+3sg verbs) | **YES** — drop the subject pronoun (§4) |
| clitic placement | **enclisis**: `Amo-te`, `reuniram-se` | **proclisis**: `Te amo`, `se reuniram` | **MOSTLY** — paraphrase away (§9.6) |
| progressive aspect | **`estar a`** + inf.: `está a treinar` | **gerund**: `está treinando` | **YES** — simple present |
| orthography (mute consonants) | AO90-unified | AO90-unified | **YES** — apply AO90 |
| month capitalization | AO90-lowered | already lowercase | **YES** — apply AO90 |
| **quotation marks** | **« … »** | **“ … ”** | **NO** |
| **currency** | **`1 234,56 €`** | **`R$ 1.234,56`** | **NO** |
| **number grouping** | **space** | **period** | **NO** |
| **dupla grafia** | `facto`, `neurónio`, `receção` | `fato`, `neurônio`, `recepção` | **NO** |
| **core computing vocabulary** | `ecrã`, `ficheiro`, `utilizador` | `tela`, `arquivo`, `usuário` | **NO** |
| **domain terminology** | `aprendizagem`, `rede neuronal`, `treino` | `aprendizado`, `rede neural`, `treinamento` | **NO** |

### 9.8 The neutrality strategy, stated explicitly

**What a neutral AO90-based text *can* legitimately do:**
- apply **AO90 orthography** throughout — post-reform spellings, lowercase months, current
  hyphenation (§3);
- use **dropped-subject 3sg**, **impersonal** (`é possível`) and **infinitive** constructions, so
  `você`/`tu` never has to be chosen (§4);
- **avoid clitic pronouns** by paraphrase — `Criar conta`, not `Registe-se`/`Se cadastre` (§9.6);
- use the **simple present** instead of the progressive;
- use the **decimal comma** and **day-first dates** in the `d de MMMM de y` long form — identical in
  both;
- prefer **internationally shared loanwords** (`prompt`, `token`, `software`) where a native split
  exists;
- keep sentences short and vocabulary common — satisfying both the Brazilian statutory rules and
  Portuguese accessibility practice (§8).

**What it *cannot* do — you MUST choose, per item:**
1. **Quotation marks** — « » or “ ”. No third option.
2. **Currency** — symbol, position, and grouping all differ.
3. **Number grouping separator** — `1.234` vs `1 234`.
4. **Dupla grafia words** — `facto/fato`, `neurónio/neurônio`, `receção/recepção`, `académico/acadêmico`.
5. **Core computing vocabulary** — `ecrã/tela`, `ficheiro/arquivo`, `utilizador/usuário`.
6. **The domain's own terminology** — `aprendizagem/aprendizado`, `rede neuronal/rede neural`,
   `treino/treinamento`. **In an AI/ML educational platform this is not a corner case; it is every
   third heading.**

**The operating model this guide recommends: one guide + a fork list.**
- **Declare a primary variant** for the fork-required items. Given Brazil's ~75 % share of speakers,
  **pt-BR is the pragmatic default unless the audience says otherwise** — but this is a **project
  decision**, and it must be recorded, not assumed.
- **Apply every neutralization tactic above everywhere else** — register, clitics, aspect,
  orthography, date form.
- **Maintain a short "fork list"** — roughly the ~30 strings in categories 4–6 plus the quote glyph
  and the currency/grouping settings — as the **only** strings needing a genuine per-market override.

That converts a two-guide problem into **one guide plus a small variant table**, which is exactly the
scope decision this guide implements. **It does not make the divergence disappear, and this section is
the honest accounting of what remains.**

Sources: <https://pt.wikisource.org/wiki/Acordo_Ortogr%C3%A1fico_da_L%C3%ADngua_Portuguesa_(1990)> ·
<https://pt.wikipedia.org/wiki/Acordo_Ortogr%C3%A1fico_de_1990> ·
<https://pt.wikipedia.org/wiki/Lista_das_altera%C3%A7%C3%B5es_previstas_pelo_acordo_ortogr%C3%A1fico_de_1990> ·
<https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/redes-neuronais-artificiais/38009> ·
<https://ciberduvidas.iscte-iul.pt/artigos/rubricas/idioma/colocacao-pronominal-portugues-do-brasil-x-portugues-europeu/5754> ·
<https://pt.wikipedia.org/wiki/Aprendizado_de_m%C3%A1quina> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/pt-PT/delimiters.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pt-PT/numbers.json>
(the computing-vocabulary rows other than `treino`/`aprendizagem` are **⚠ partially verified**;
the Mozambique ratification status and the transition-period dates are **⚠ quote-unverified**)

---

