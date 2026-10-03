<!-- kit -->
<!-- TRANSLATION-MIRROR
source: docs/how-to/add-a-page.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: c4eaad2e59e26f4a944b5db7d9c2ed803350373ae6fcf2c2d78c5ee14b073217
-->

# Eine Seite hinzufügen

Ziel: eine neue geroutete Seite — erreichbar, übersetzt, navigierbar, prerender-sicher und
mit Tests, die tatsächlich laufen. Jeder Schritt unten existiert, weil sein Auslassen
entweder laut scheitert (Build) oder, schlimmer, still (Tests, staler Prerender).
Geschrieben, nachdem eine echte Bau-Session all das aus dem Quellcode rekonstruieren
musste; jetzt ist es ein Rezept.

Durchgehendes Beispiel: eine Seite unter `/my-page`, Komponente `MyPageComponent`.

**Abkürzung:** `node tools/new-page.mjs my-page --kind page --strings <datei.json>` erledigt
die Schritte 1, 3 und 6 und gibt die Zeilen für die Schritte 2 und 4 zum Einfügen aus ([Die Werkzeuge des Kits benutzen](use-the-kit-tools.md#eine-neue-seite-im-portal-anlegen)).

## 1 · Komponente

`src/app/pages/my-page/my-page.component.ts` — standalone, `@if`/`@for`, und jeder
Zugriff auf `window`/`document`/`localStorage`/`navigator` hinter `isPlatformBrowser(...)`
(ungeschützte Browser-Globals crashen den Prerender-Build; siehe `AGENTS.md` → Code
style). Nimm eine bestehende Seite als Vorlage —
`src/app/pages/accessibility/accessibility-statement.component.ts` ist eine kleine,
aktuelle. Bevor du UI baust, folge
[`directives/design-system.md`](../../../directives/design-system.md) (der CLI-first-Lesepfad).

## 2 · Route (`src/app/app.routes.ts`)

Füge einen `ExtendedRoute`-Eintrag hinzu — das Interface am Dateianfang dokumentiert jedes
Feld. Die immer nötigen:

```ts
{
  path: 'my-page',
  titleKey: 'app.nav.myPage',        // Übersetzungs-Key, kein Literal-Text
  icon: 'pi pi-star',
  group: 'portal',                    // Nav-Dropdown-Gruppe (Optionen: siehe Nachbarn)
  groupTitleKey: 'app.nav.group.portal',
  pageId: 'mypg',                     // eindeutige 4-Zeichen-ID — vorher app.routes.ts greppen!
  showByDefault: true,                // im ungefilterten Nav-Dropdown sichtbar?
  loadComponent: () => import('./pages/my-page/my-page.component').then(m => m.MyPageComponent)
}
```

`pageId` speist `generatePageIdRedirects` — sie wird eine Kurz-URL (`/mypg`) für QR-/
Buch-Links und muss deshalb eindeutig sein. Wenn die Seite unter Node nicht rendern darf
(Canvas, Animations-Loops), gib ihr zusätzlich `RenderMode.Client` in
`src/app/app.routes.server.ts`; sonst greift der Default.

## 3 · i18n — alle vier Sprachen, keine Registrierung

Lege `src/assets/i18n/modules/<lang>/myPage.json` an, für **`de`, `en`, `de-easy`,
`en-easy`** (der Modulname wird der Key-Namespace), dazu jede seither hinzugefügte Sprache
([Eine Sprache hinzufügen](add-a-language.md)). Module werden automatisch aus dem
Verzeichnis entdeckt — es gibt kein Register zu pflegen. `scripts/check-i18n-keys.mjs`
schlägt fehl, wenn einer Sprache ein Key fehlt, den Englisch hat, und wenn ein literaler
`translate('…')`-Aufruf oder eine `*Key:`-Property in den **englischen** Modulen nicht
auflöst; Keys, die über den einzeiligen `t()`-Helper der Seiten laufen, liegen außerhalb
dieses zweiten Netzes. Es schlägt auch in der Gegenrichtung fehl, wenn ein Modul einen Key
bekommt, den keine Quelle referenziert: Lösch, was die Seite nicht mehr nutzt, und trag für
einen Key, der zur Laufzeit gebaut wird (`translate('myPage.kind.' + kind)`), sein Präfix
samt Begründung in `DYNAMIC_PREFIXES` im Skript ein.

Ein neuer Namespace landet im kleinen **Core**-Bundle, das jede Seite vorab lädt. Ist er
seitengroß (etwa der Text eines Artikels), trag ihn unter `lazyNamespaces` in
`src/config/i18n-bundles.json` ein — `article<Name>`-Namespaces passen bereits —, dann wird
er ein Chunk, der nur mit der Seite geladen wird. Den Namespace von `titleKey`/
`descriptionKey` der Route lädt der Route-Guard von selbst; jeden weiteren Lazy-Namespace,
den die Seite liest, nennst du in der `i18n: [...]`-Liste der Route, sonst zeigt der Browser
kurz dessen rohe Keys.

Der Navigationstitel ist der eine Key, der **nicht** in dein neues Modul gehört: der
Modul-Basename *ist* der Namespace, also liegt `app.nav.myPage` unter `nav` in
`src/assets/i18n/modules/<lang>/app.json` — in allen vier Sprachen, wie oben. Eine
`nav.json` gibt es nicht.

## 4 · Prerender-Tier (`scripts/generate-prerender-routes.js`)

Entscheide das Tier und trag den Pfad ins passende Array ein (`TIER_0_ROUTES` /
`TIER_1_ROUTES`); die Kommentare der Datei definieren die Tiers. Faustregel: **jede
statisch sichtbare Seite kommt in T1** — nicht wegen SEO, sondern weil Prerendering der
Beweis ist, dass die Seite unter Node überlebt: Crasht sie beim SSR, scheitert
`build:prod` laut, statt eine kaputte Seite auszuliefern.

Die beiden Schalter sind **unabhängig**: diese Liste entscheidet, was zur Build-Zeit
gerendert wird, während `RenderMode.Client` in `src/app/app.routes.server.ts` entscheidet,
wie eine *nicht* prerenderte Route ausgeliefert wird. `RenderMode.Client` allein hält eine
Seite also **nicht** aus dem Prerender heraus — `demos` ist Client-Mode *und* steht in
`TIER_1_ROUTES`, und `dist/vibecore/browser/de/demos/index.html` enthält den echt
gerenderten Inhalt. Draußen bleiben die Seiten, die unter Node wirklich nicht überleben —
die einzelnen interaktiven Demos (Canvas, `requestAnimationFrame`, Animations-Loops). Die
bekommen beides: `RenderMode.Client` *und* keinen Eintrag hier.

## 5 · Sitemap (`scripts/generate-sitemap.js`) — meistens nein

Prerender und Sitemap sind getrennte Entscheidungen. Eine Seite kommt nur in die Sitemap,
wenn sie **ranken** soll: Inhaltsseiten ja; Formulare, Einstellungen und Rechtsseiten
nein. (Eine Seite kann prerendern, ohne in der Sitemap zu stehen — das ist der Normalfall
für Utility-Seiten.)

## 6 · Tests — die stille Falle

`angular.json → projects → … → test → options → include` ist eine **explizite
Allowlist**. Eine neue `.spec.ts`, die dort nicht steht, wird schlicht nie ausgeführt —
die Suite bleibt grün und sagt dir nichts. Trag jede neue Spec-Datei im selben Commit in
dieses Array ein, der sie anlegt.

Unter Windows führe `npm run test:ci` in **PowerShell** aus — unter Git Bash kann es mit
einem npm-Segfault sterben, der wie ein Codefehler aussieht, aber keiner ist.

## 7 · Verifizieren

- `npm run test:ci` — und prüfe, dass deine neuen Specs in der Lauf-Zählung auftauchen.
- `node scripts/verify-harness.mjs` — die Agent-Harness-Gates. Es prüft die
  Harness-Dateien selbst, startet weitere Gates als Kindprozesse (darunter
  `check-design-system.mjs`, `check-design-guides.mjs`, `check-contrast.mjs`,
  `check-packs.mjs` und `check-doc-drift.mjs`) und die Selbsttests anderer Gates (Impressum,
  Overrides, Hausstil); sein Dateikopf listet alle auf. Für eine neue
  Seite relevant: Check 11, der `angular.json`s `test.include`-Allowlist und die Specs auf
  der Platte in beide Richtungen abgleicht.
- `npm run build:verify` — die breitere Gate-Kette. Das i18n-Key-Gate
  (`check-i18n-keys.mjs`), das Inline-Template-Gate und das Genericity-Gate leben hier,
  nicht in der Harness. (Sie ruft die Harness ebenfalls auf und übergibt `--skip` für die
  drei Design-Gates, die sie selbst startet — nichts läuft doppelt.)
- `npm run build:prod` — dann bestätige, dass `dist/vibecore/browser/.build-manifest.json`
  `verification.passed: true` und `tests.gate: "passed"` hat (die kuratierte Suite läuft nach
  dem Build und seiner Gate-Kette, bevor das Manifest geschrieben wird; `verify-build.js`
  prüft dieses Manifest zuletzt) und dass `dist/vibecore/browser/de/my-page/index.html`
  deinen echten Inhalt enthält (diese Datei ist der Beweis, dass die Seite prerendert).

Doku und der Journal-Eintrag reisen im selben Commit (`base/BOOKKEEPING.md`).
