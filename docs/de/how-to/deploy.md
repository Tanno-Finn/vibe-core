<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/how-to/deploy.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 6eccd62b92c8ec87503dc317cf013464f12f3a4aac1c880bc2530fa4b6770d3f
-->

# Die gebaute Seite deployen

Dein Ziel: einen Produktions-Build nehmen und online stellen. Dieses Kit erzeugt eine reine
statische Seite, Deployment bedeutet also meist „einen Ordner auf einen Webhost kopieren“ —
mit einer Anforderung, die du unbedingt richtig machen musst, sonst brechen tiefe Links.

## 1. Deine Site-URL setzen

Mach das **vor** dem Build — der Wert wird ins Bundle kompiliert, ihn später zu ändern bedeutet
also, neu zu bauen.

Öffne `src/environments/environment.prod.ts` und setze `siteUrl` auf den absoluten Origin, von
dem aus die Seite ausgeliefert wird, ohne abschließenden Schrägstrich:

```ts
siteUrl: 'https://deine-domain.example',
```

Der Browser kennt seinen eigenen Origin, das hier zählt also nur für das vorgerenderte HTML —
die Fassung, die Suchmaschinen und Link-Vorschauen in sozialen Netzen lesen. Daraus werden
`<link rel="canonical">`, `og:url`, `og:image` und die `hreflang`-Alternativen gefüllt.

Der Wert ist **absichtlich leer** ausgeliefert, und solange er leer ist, werden diese Tags in den
vorgerenderten Seiten schlicht weggelassen, statt mit einer Platzhalter-Domain gefüllt zu werden.
Das ist die sicherere Voreinstellung: Ein Canonical, das auf eine Domain zeigt, die dir nicht
gehört, sagt Suchmaschinen, sie sollen *jene* URL indexieren statt deiner — das ist schlimmer
als gar kein Canonical.

Der Sitemap-Generator liest denselben Wert aus einer Umgebungsvariable, setze die also beim
Bauen mit:

```bash
SITE_BASE_URL=https://deine-domain.example npm run build:prod
```

## 2. Impressum und Datenschutzerklärung ausfüllen

Das Kit liefert unter `/impressum` ein Impressum und eine Datenschutzerklärung mit — mit
**Platzhaltern**, denn wer deine Seite betreibt, weißt nur du. Für eine deutschsprachige Seite
sind beide Pflicht: das Impressum nach § 5 DDG, die Datenschutzinformationen nach Art. 13 DSGVO.
Ersetze sie, bevor die Seite online geht. Sie stehen an zwei Stellen, und nur dort:

- **`src/config/site.json`**, der Block `operator` — die Fakten: dein Name (oder der deiner
  Organisation), eine ladungsfähige Postanschrift, eine Kontakt-E-Mail und die für dich zuständige
  Datenschutz-Aufsichtsbehörde. Eine Datei, weil diese Angaben in jeder Sprache gleich sind; der
  Name deiner Seite steht in derselben Datei.
- **`src/assets/i18n/modules/<lang>/impressum.json`** (alle vier: `de`, `de-easy`, `en`,
  `en-easy`) — der Fließtext. Jeder Satz in eckigen Klammern, der dir sagt, was du schreiben
  sollst — die Rechtsgrundlage deiner Datenverarbeitung, deine Speicherfristen, was die optionale
  Statistik erfasst —, ist eine Anweisung an dich, kein Text für deine Besucher. Ersetze ihn
  durch dein tatsächliches Setup.

Der Vorlagentext um diese Lücken herum ist ein Ausgangspunkt, keine Rechtsberatung: Lies ihn gegen
das, was deine Seite tatsächlich tut, und lass ihn prüfen, wenn du unsicher bist.

**Der Build prüft das für dich.** `npm run build:prod` führt `scripts/check-imprint.mjs` aus
(über `scripts/verify-build.js`). Sobald der Build für eine echte Seite gedacht ist — `siteUrl`
aus Schritt 1 oder `SITE_BASE_URL` nennt eine echte Domain, also alles außer leer, `localhost`,
`example.com`/`.org`/`.net` oder einem reservierten `.example`/`.test`/`.invalid`-Namen —,
**scheitert** der Build, solange eines der folgenden Dinge übrig ist, und nennt jedes mit Datei
und Zeile:

- eine E-Mail-Adresse oder URL bei `example.com`, `example.org` oder `example.net`;
- der Name des Kits als Rechteinhaber in einer Lizenz-Namensnennung (`by vibecore`,
  `von vibecore`). Das Beispiel für die Namensnennung auf der Impressum-Seite setzt deinen
  Betreibernamen und die Adresse deiner Seite selbst ein (`{operator}` und `{siteUrl}` in
  `impressum.json`); die Prüfung schlägt also nur an, wenn eine Übersetzung die alte Zeile
  wieder fest einträgt;
- die Platzhalter-Adressteile `Your Street`, `Your City`, `Authority Street`, `Authority City`;
- der Platzhalter-Name `[NAME]`;
- eine Ausfüll-Anweisung in eckigen Klammern — `[Trage hier …]`, `[Beschreibe hier …]`,
  `[Hier muss der Betreiber …]`, `[Enter …]`, `[Describe here …]`, `[Here the operator …]`,
  `[Your competent …]`, `[Ihre zuständige …]`;
- das Thema der Website in den Texten zu Zweck und Zielgruppe, `[Thema der Website]` /
  `[subject of the site]`;
- der Hinweis des Datenschutzabschnitts, er sei eine Vorlage (`Platzhalter-Template`,
  `nur ein Muster`, `placeholder template`, `only a template`), und die Hinweise an dich ohne
  eckige Klammern, die neben den Ausfüll-Anweisungen stehen (`Der Seitenbetreiber muss sie an …`,
  `Diese Angaben müssen an das konkrete Setup …`, `The site operator must adapt …`,
  `This information must be adapted …`) — lösch oder ersetze diese Sätze, sobald dein eigener
  Text dort steht.

Geprüft werden der Block `operator` in `site.json`, die vier Quell-`impressum.json`, die
Einfache-Sprache-Vorschau des Impressums in den vier `easyLanguage.json` und, sobald ein Build
existiert, der `impressum`-Namespace der gebauten i18n-Bundles unter
`dist/vibecore/browser/assets/i18n/`. Ohne echte Domain erscheinen dieselben Funde als einzeiliger
Hinweis, und der Build bleibt grün — ein frischer Checkout baut also weiterhin. Einen Override gibt
es nicht: Die Lösung sind die Daten. Um die Prüfung einzeln so laufen zu lassen, als würdest du
deployen, nutze `node scripts/check-imprint.mjs --strict`.

Daneben nennt die Prüfung, ohne je einen Build anzuhalten, die Sätze, die sagen, dass ein Mensch
die Texte liest („ein Mensch hat sie durchgelesen“, „Ein Mensch liest die Texte danach durch“
und ihre englischen Fassungen in `accessibility.json` und `easyLanguage.json`, dazu die älteren
„redaktionell begleitet“, „Menschen prüfen die Texte“). Sie beschreiben die Demo des Kits;
mach sie für deine Website wahr oder schreib sie um ([Das Kit zu deinem eigenen Portal
machen](make-it-yours.md), „Bevor du online gehst“).

## 3. Den Build erzeugen

Vom Projekt-Root aus:

```bash
npm run build:prod
```

Das führt die vollständige Produktions-Pipeline aus (Content-Bundles, i18n, Prerender,
Integritätsprüfungen) und erzeugt eine statische Seite — reines HTML, JavaScript, CSS und
Assets — in:

```
dist/vibecore/browser/
```

Dieser Ordner ist das gesamte auslieferbare Artefakt. Es gibt keinen Serverprozess, der laufen
muss, und nichts, was auf dem Host installiert werden müsste; alles, was die Seite braucht, ist
eine Datei darin.

> Baue immer mit `npm run build:prod`, nie mit einem nackten `ng build`. Ein roher Build
> überspringt die Integritätsprüfungen; das Projekt verweigert `npm run ng -- build`, kann aber ein
> direkt eingetipptes `ng build` nicht aufhalten.

## 4. Den Ordner hochladen

Kopiere den **Inhalt** von `dist/vibecore/browser/` dorthin, von wo aus dein Host Dateien
ausliefert. Das Kit macht keine Annahme darüber, wo das ist — alles, was ein Verzeichnis
statischer Dateien ausliefern kann, funktioniert:

- ein statischer Datei-Host / eine Static-Site-Plattform,
- Objektspeicher mit aktiviertem statischem Website-Serving,
- dein eigener Webserver (Apache, nginx, Caddy, …), der ein Site-Root auf den Ordner zeigen
  lässt.

Lade die Dateien selbst hoch, nicht den umschließenden `dist/`-Pfad — `index.html` sollte an der
Wurzel deiner Seite landen.

## 5. Die eine harte Anforderung: SPA-Fallback

Das ist eine **Single-Page-App**. Der Server sendet einmal eine HTML-Seite, und ab dann rendert
der Router der App jede Route im Browser. Viele Routen — `/de/glossary/`, `/de/ai-timeline/`, die
Artikel — werden zusätzlich beim Build in ein eigenes `<route>/index.html` **vorgerendert**
(`scripts/generate-prerender-routes.js` entscheidet, welche), und ein Host, der die `index.html`
eines Verzeichnisses ausliefert, beantwortet diese direkt. Der Rest — die einzelnen interaktiven
Demos und Routen, die das Prerender-Tier einer Sprache auslässt — existiert nur im Router.

Dein Host muss also **für jede unbekannte Route `index.html` ausliefern**, statt einen 404
zurückzugeben. Das nennt sich verschieden je nach Host: *SPA-Fallback*, *History-API-Fallback*
oder ein *Catch-all-Rewrite auf `index.html`*.

**Was ohne das kaputtgeht:** Die Seite funktioniert, solange sich Besucher von der Startseite
aus durchklicken, weil der Router die Navigation clientseitig übernimmt. Aber sobald jemand
einen tiefen Link direkt öffnet — eine gespeicherte Seite, eine geteilte URL, oder einfach
**Neu laden** drückt — sucht der Host bei einer Route ohne vorgerenderte Datei nach einer
Datei an diesem Pfad, findet keine und gibt einen 404 zurück.

Wie du den Fallback konfigurierst, hängt vom Host ab: Static-Site-Plattformen haben meist eine
Einstellung „alles auf `index.html` umschreiben“ oder „Single Page App“, Objektspeicher lässt
dich das Fehlerdokument auf `index.html` setzen, und ein selbstverwalteter Server braucht eine
`try_files`-artige Regel (nginx) oder ein entsprechendes Rewrite (Apache `.htaccess`, Caddy).
Prüfe, ob deiner aktiv ist, indem du einen tiefen Link lädst und neu lädst — übersteht die Seite
das Neuladen, funktioniert der Fallback.

**Ordner sind die Falle.** Die Sprachwurzeln `/de/` und `/en/` und Ordner wie
`/de/articles/` gibt es im Build, aber sie enthalten keine eigene `index.html` (die
vorgerenderten Seiten liegen eine Ebene tiefer, z. B. `/de/home/index.html`). Ein Fallback, der
jeden vorhandenen Ordner überspringt — die übliche `!-d`-Regel —, gibt diese Anfragen an den
Server zurück, und Apache beantwortet einen Ordner ohne `index.html` mit **403 Forbidden**
(manche Hosts zeigen stattdessen ihre eigene Parkseite). Dann wirkt die Seite
ausgerechnet unter ihren meistbesuchten Adressen kaputt.

Bei Apache gehört das in eine `.htaccess` im Wurzelverzeichnis der Seite, neben `index.html`:

```apache
RewriteEngine On
Options -Indexes
DirectoryIndex index.html

# SPA-Fallback: nur GET/HEAD; unbekannte Pfade bekommen das App-Gerüst.
RewriteCond %{REQUEST_METHOD} !^(GET|HEAD)$
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ - [R=405,L]

# Einstiege führen auf dem Server zu einer vorgerenderten Startseite:
# /de und /en sind Ordner ohne index.html, die Apache (Options -Indexes) mit 403 beantwortet
# und manche Hosts mit ihrer Parkseite; / geht denselben Weg, damit die erste Seite
# vorgerendertes HTML ist und nicht das nackte App-Gerüst.
RewriteCond %{HTTP:Accept-Language} ^\s*en [NC]
RewriteRule ^$ /en/home/ [R=302,L]
RewriteRule ^$ /de/home/ [R=302,L]
RewriteRule ^(de|en)/?$ /$1/home/ [R=302,L]

# Ein Ordner zählt nur als Seite, wenn er eine index.html enthält; jeder andere Ordner
# (z. B. /de/articles/) bekommt das App-Gerüst statt eines 403.
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html !-f
RewriteCond %{REQUEST_URI} !\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|json|xml|txt)$
RewriteRule ^ /index.html [L]
```

`/<lang>/home/` wird immer vorgerendert, egal welche Startseite `src/config/site.json` nennt,
und ist deshalb ein sicheres Ziel. Die Weiterleitungen sind `302`, nicht `301`, weil das Ziel
der Wurzel von der Browsersprache des Besuchers abhängt. Hat deine Seite andere Sprachen als
`de` und `en`, trage jede in `^(de|en)/?$` ein, und lass die einfache Zeile `RewriteRule ^$`
deine Standardsprache nennen. Prüfe es nach dem Hochladen: `/`, `/de/` und `/en/` müssen auf
eine `…/home/`-Seite weiterleiten, und ein Ordner wie `/de/articles/` muss die Seite zeigen,
keine Fehlerseite.

**Zwei Details, die du bei der Gelegenheit richtig machen solltest** (beide hat ein externes
Security-Assessment einer Seite mit diesem Code gefunden):

- **Den Fallback nur für `GET` und `HEAD` beantworten.** Ein Catch-all, das auch `POST`,
  `OPTIONS` oder `PUT` auf `index.html` umschreibt, liefert für jede Methode auf jedem Pfad
  `200` — an sich harmlos, aber es bewirbt Schreibmethoden, die die Seite nicht hat, und
  verdeckt echte Fehlkonfiguration. Bei Apache ist das die `R=405`-Regel oben im Block
  darüber, vor dem Rewrite.
  nginx: `limit_except GET HEAD { deny all; }` in der Location, die den Fallback ausliefert.
- **ETags für umgeschriebene Antworten abschalten.** Apache hängt an den ETag ein Suffix an,
  wenn Rewrite und `mod_deflate` zusammenkommen — das erzeugt fehlerhafte Werte; die gehashten
  Asset-Namen sind ohnehin `immutable`, alles andere validiert sauber über `Last-Modified`.
  `FileETag None` plus `Header unset ETag` im Block, der HTML ausliefert; nginx: `etag off;`.

## 6. HTTPS und Caching sind Sache des Hosts

Zwei Dinge entscheidet der Build **nicht** für dich, weil sie zum Host gehören:

- **HTTPS.** Liefere die Seite über TLS aus. Die meisten Hosts stellen dafür automatisch ein
  Zertifikat aus und erneuern es; ein selbstverwalteter Server braucht eines konfiguriert.
- **Caching-Header.** Fingerprinted Assets (Dateien mit einem Hash im Namen) können aggressiv
  und nahezu dauerhaft gecacht werden; `index.html` sollte revalidiert werden, damit Besucher
  neue Deploys mitbekommen. Setze diese Header auf Host- oder CDN-Ebene.

Keines von beidem betrifft die Build-Ausgabe — derselbe Ordner wird gleich deployt, egal wie du
damit umgehst.

## 7. Security-Header

Statisches Hosting sendet keine Security-Header, solange du nicht darum bittest. Vier davon sind
billig und bedingungslos; der fünfte — die Content Security Policy — braucht einen pro Build neu
erzeugten Wert.

### Die vier bedingungslosen

| Header | Wert | Was er bringt |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Verhindert, dass der Browser einen MIME-Typ errät und ein Asset als Skript ausführt. |
| `X-Frame-Options` | `DENY` | Kein Framing, die Seite lässt sich also nicht für Clickjacking missbrauchen. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Ausgehende Links verraten deinen Origin, nicht den vollen Pfad, den jemand gerade gelesen hat. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Das Kit nutzt keine dieser APIs, also verbiete sie rundweg. |

### Content Security Policy

Die CSP ist die, bei der sich echter Aufwand lohnt — sie macht aus „eine `javascript:`-URL hat
sich in eine Content-Datei geschlichen“ statt eines Skript-Bugs eine blockierte Anfrage. Sie ist
auch die, die du nicht blind kopieren kannst, denn eine strikte Policy muss jedes Inline-Skript
per Hash benennen — und **die Inline-Skripte dieser Seite sind nicht nur die, die du in
`src/index.html` sehen kannst.**

Als Beispiel, womit du rechnen musst: Ein gemessener Produktions-Build dieses Kits hatte **7
verschiedene ausführbare Inline-Skripte** in den HTML-Dateien unter `dist/vibecore/browser/` —
deine Zahl weicht ab, sobald sich Seiten oder die Angular-Version ändern:

- **3 selbst geschriebene** in `src/index.html` — der Anti-FOUC-Theme-Bootstrap, das
  Glossar-Deeplink-Gate und der Sprach-Präfix-Redirect.
- **4 vom Build erzeugte** auf den vorgerenderten Seiten — ein Event-Replay-Dispatcher plus drei
  `__jsaction_bootstrap`-Aufrufe, die sich von Seite zu Seite unterscheiden, weil die Event-Liste
  davon abhängt, welche Events die jeweilige Seite tatsächlich nutzt.

Dazu **ein Inline-Event-Handler**: `onload="this.media='all'"`, den das Inlining des kritischen
CSS im Produktions-Build an den Stylesheet-Link hängt. Inline-Handler werden von gewöhnlichen
Skript-Hashes überhaupt nicht abgedeckt — sie brauchen `'unsafe-hashes'` zusammen mit einem Hash
des Handler-Inhalts.

Also: **erzeuge die Hashes aus der Build-Ausgabe, niemals von Hand aus `src/index.html`.** In dem
gemessenen Build hatten das Redirect-Skript der Quelldatei und das gebaute bereits verschiedene
Hashes, weil der Build die Sprachliste darin umschreibt.

#### Die Hashes erzeugen

Speichere das hier als `csp-hashes.mjs` neben deinem Build und führe nach jedem
`npm run build:prod` `node csp-hashes.mjs` aus. Es gibt die fertige `script-src`-Direktive aus:

```js
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = 'dist/vibecore/browser';
const JS_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);
const sha = (s) => "'sha256-" + createHash('sha256').update(s, 'utf8').digest('base64') + "'";

function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const scripts = new Set(), handlers = new Set();
for (const file of walk(ROOT)) {
  const html = readFileSync(file, 'utf8');
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs) || !body.trim()) continue;          // extern oder leer
    const type = ((attrs.match(/type=["']?([^"'\s>]+)/) || [])[1] || '').toLowerCase();
    if (!JS_TYPES.has(type)) continue;                            // ld+json etc. laufen nie
    scripts.add(sha(body));
  }
  for (const [, handler] of html.matchAll(/\son[a-z]+="([^"]*)"/g)) handlers.add(sha(handler));
}

console.log("script-src 'self' " + [...scripts].join(' ') +
            (handlers.size ? " 'unsafe-hashes' " + [...handlers].join(' ') : ''));
```

Gib dessen Ausgabe in die Snippets unten. **Führe es bei jedem Build erneut aus.** Ein veralteter
Hash degradiert nicht sanft: Der Browser verweigert das Skript, und der Theme-Bootstrap, der
Sprach-Redirect oder das Event-Replay hören still auf zu funktionieren. Alles, was ein
Inline-Skript verändert, verändert seinen Hash — eine Änderung an `src/index.html`, eine neue
Sprache oder ein Angular-Upgrade (das den Event-Replay-Code neu erzeugt).

#### Apache — `.htaccess`

Leg das in das Site-Root, neben `index.html`. Ersetze die `script-src`-Zeile durch die, die dein
Generator ausgegeben hat; die Hashes unten stammen aus einem bestimmten Build und **werden zu
deinem nicht passen**.

```apache
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"

  # Die sha256-Werte nach jedem Build mit csp-hashes.mjs neu erzeugen.
  Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'sha256-lqcBjnUL6FsDYkV5jpTHAI66LFXEtZOjK/6ok9JmrJY=' 'sha256-oXRS3D08T86AD/C340cAkJn2NvQKUo5dTkHnXXATls4=' 'sha256-7FGfyVrfuOg3yD5jagycMPrEqcu0vpG39RUr7pYlSGI=' 'sha256-VM2mZqyEQZoLzoTrp5EigFvzQ0+f1wSeBuoOn95WHCg=' 'sha256-RRe63E0peDoj4lJF05pZSrNXzwVWUJWnWQYJUy06yrI=' 'sha256-dCS4rpUZWrP02TQxebWtvIRH8pG/8rcwFhPKgOARtCU=' 'sha256-mVhuqUXE2LQrVwpPwt9GfRrLW6bzuxyuVVbOt6OsweU=' 'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc='; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'"
</IfModule>
```

#### nginx

In den `server`-Block. Derselbe Vorbehalt zu den Hashes.

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;

# Die sha256-Werte nach jedem Build mit csp-hashes.mjs neu erzeugen.
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'sha256-lqcBjnUL6FsDYkV5jpTHAI66LFXEtZOjK/6ok9JmrJY=' 'sha256-oXRS3D08T86AD/C340cAkJn2NvQKUo5dTkHnXXATls4=' 'sha256-7FGfyVrfuOg3yD5jagycMPrEqcu0vpG39RUr7pYlSGI=' 'sha256-VM2mZqyEQZoLzoTrp5EigFvzQ0+f1wSeBuoOn95WHCg=' 'sha256-RRe63E0peDoj4lJF05pZSrNXzwVWUJWnWQYJUy06yrI=' 'sha256-dCS4rpUZWrP02TQxebWtvIRH8pG/8rcwFhPKgOARtCU=' 'sha256-mVhuqUXE2LQrVwpPwt9GfRrLW6bzuxyuVVbOt6OsweU=' 'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc='; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'" always;
```

Beachte: nginx' `add_header` vererbt sich nicht in einen `location`-Block, der eigene Header
setzt — wenn du Caching-Header pro Location setzt, wiederhole diese dort.

#### Was diese Policy zulässt, und warum

- **`style-src` behält `'unsafe-inline'`.** Angular setzt Element-Styles im normalen Rendering
  inline. Das auf `'self'` zu verschärfen wurde an der gebauten Seite gemessen: Allein die
  Startseite erzeugte einen Strom von „Applying inline style violates … style-src 'self'“-
  Ablehnungen. Hashing ist auch keine Option, weil die Styles zur Laufzeit erzeugt werden. Das
  ist eine echte Schwächung — sie macht CSS-basierte Datenexfiltration im Prinzip möglich — und
  sie ist der Preis des Frameworks, keine Entscheidung, die dieses Kit treffen kann.
- **`'unsafe-hashes'` ist eng gefasst.** Es erlaubt den *konkret gehashten* Event-Handler und
  nichts sonst; es ist kein `'unsafe-inline'` für Handler.
- **`connect-src 'self'`** funktioniert, weil das Kit mit leeren Backend-Endpunkten ausgeliefert
  wird. Sobald du `analyticsEndpoint`, `feedback.endpoint` oder
  `timeGateEndpoint` auf einen Host zeigen lässt, trage diesen Origin hier ein, sonst werden die
  Anfragen blockiert.
- **`frame-ancestors 'none'`** ist das moderne Äquivalent zu `X-Frame-Options: DENY`. Beide
  stehen drin, weil alte Browser nur letzteres verstehen.
- **`img-src` erlaubt `data:`** für eingebettete Thumbnails; Schriften sind selbst gehostet,
  `font-src 'self'` genügt also ohne externes Font-CDN.

#### Nachprüfen

Lade ein paar vorgerenderte Seiten mit aktiven Headern und beobachte die Browser-Konsole. Die
ganze Policy oben wurde genau so gegen `/de/`, `/de/ai-timeline/`, `/de/glossary/`,
`/de/catalog/` und `/de/demos/` geprüft: Jede Seite rendert ohne CSP-Verstoß und ohne
Seitenfehler. Was du falsch gemacht hast, taucht dort als „Refused to …“-Zeile auf, nicht als
stiller Fehlschlag.

### `security.txt`

RFC 9116 gibt Sicherheitsforschern einen festen Ort, an dem sie erfahren, wem sie Bescheid sagen
sollen. Ohne ihn erreicht dich eine Meldung entweder nie oder landet in einem öffentlichen Issue.
Liefere die Datei mit dem Build aus, damit sie jedes Deploy überlebt — lege sie unter
`public/.well-known/security.txt` ab (der SPA-Fallback aus §5 greift nur für Pfade, die nicht
existieren, die Datei wird also unverändert ausgeliefert):

```text
Contact: mailto:security@deine-domain.example
Expires: 2027-01-01T00:00:00.000Z
Preferred-Languages: de, en
Canonical: https://deine-domain.example/.well-known/security.txt
```

`Contact` und `Expires` sind die beiden Pflichtfelder; halte `Expires` innerhalb eines Jahres und
erneuere es. Prüfen mit `curl -sI https://deine-domain.example/.well-known/security.txt` — die
Antwort muss `200` mit `text/plain` sein, nicht das SPA-Fallback-HTML.

## Zusammenfassung

1. `siteUrl` in `environment.prod.ts` setzen (und `SITE_BASE_URL` für die Sitemap).
2. Impressum und Datenschutzerklärung ausfüllen (`operator` in `src/config/site.json` und die
   Klammer-Anweisungen in jeder `impressum.json`) — für eine echte Domain verweigert der Build
   Platzhalter.
3. `npm run build:prod` → statische Dateien in `dist/vibecore/browser/`.
4. Den Inhalt des Ordners hochladen, sodass `index.html` an der Wurzel deiner Seite liegt.
5. SPA-Fallback konfigurieren (unbekannte Routen → `index.html`).
6. HTTPS terminieren und Caching-Header auf dem Host setzen.
7. Die Security-Header setzen und dabei die CSP-Hashes aus dem Build neu erzeugen.

Das ist das gesamte Deployment. Das Kit bleibt bewusst werkzeugunabhängig: Es gibt dir einen
Ordner statischer Dateien und macht keine Annahme darüber, wo dieser lebt.
