<!-- base -->
# Deploy the built site

Your goal: take a production build and put it online. This kit produces a plain static site, so
deployment is mostly "copy a folder to a web host" — with one requirement you must get right, or
deep links break.

## 1. Set your site URL

Do this **before** you build — the value is compiled into the bundle, so changing it later means
rebuilding.

Open `src/environments/environment.prod.ts` and set `siteUrl` to the absolute origin the site will
be served from, no trailing slash:

```ts
siteUrl: 'https://your-domain.example',
```

The browser knows its own origin, so this only matters for the prerendered HTML — the copy search
engines and social-link previews read. It is what fills `<link rel="canonical">`, `og:url`,
`og:image` and the `hreflang` alternates.

It ships **empty on purpose**, and while it is empty those tags are simply left out of the
prerendered pages rather than being filled with a placeholder domain. That is the safer default: a
canonical pointing at a domain you do not own tells search engines to index *that* URL instead of
yours, which is worse than having no canonical at all.

The sitemap generator reads the same value from an environment variable, so set that too when you
build:

```bash
SITE_BASE_URL=https://your-domain.example npm run build:prod
```

## 2. Fill in the imprint and privacy notice

The kit ships an imprint (Impressum) and a privacy notice at `/impressum` — with **placeholders**,
because nobody knows who runs your site but you. For a German-language site both are a legal
duty: the imprint under § 5 DDG, the privacy information under Art. 13 GDPR (DSGVO). Replace them
before the site goes online. They live in two places, and only there:

- **`src/config/site.json`**, the `operator` block — the facts: your name (or organization), a
  postal address that can receive mail, a contact e-mail, and the data-protection supervisory
  authority responsible for you. One file, because these are the same in every language; your
  site's name stands in the same file.
- **`src/assets/i18n/modules/<lang>/impressum.json`** (all four: `de`, `de-easy`, `en`,
  `en-easy`) — the prose. Every sentence in square brackets that tells you what to write — the
  legal basis of your data processing, your retention periods, what the optional statistics
  collect — is an instruction to you, not text for your visitors. Replace it with your actual
  setup.

The template text around those gaps is a starting point, not legal advice: read it against what
your site actually does, and have it checked if you are unsure.

**The build checks this for you.** `npm run build:prod` runs `scripts/check-imprint.mjs` (from
`scripts/verify-build.js`). As soon as the build is meant for a real site — `siteUrl` from step 1
or `SITE_BASE_URL` names a real domain, i.e. anything other than empty, `localhost`,
`example.com`/`.org`/`.net` or a reserved `.example`/`.test`/`.invalid` name — the build **fails**
while any of these remain, and lists each one with file and line:

- an e-mail address or URL at `example.com`, `example.org` or `example.net`;
- the kit's name as the holder in a license attribution (`by vibecore`, `von vibecore`). The
  attribution sample on the imprint page fills in your operator name and site URL by itself
  (`{operator}` and `{siteUrl}` in `impressum.json`), so this only fires if a translation
  hard-codes the old line again;
- the placeholder address parts `Your Street`, `Your City`, `Authority Street`, `Authority City`;
- the placeholder name `[NAME]`;
- a bracketed fill-in instruction — `[Trage hier …]`, `[Beschreibe hier …]`,
  `[Hier muss der Betreiber …]`, `[Enter …]`, `[Describe here …]`, `[Here the operator …]`,
  `[Your competent …]`, `[Ihre zuständige …]`;
- the site's subject in the purpose and audience texts, `[subject of the site]` /
  `[Thema der Website]`;
- the privacy section's note that it is a template (`Platzhalter-Template`, `nur ein Muster`,
  `placeholder template`, `only a template`) and the unbracketed notes to you that sit next to
  the fill-in instructions (`Der Seitenbetreiber muss sie an …`, `Diese Angaben müssen an das
  konkrete Setup …`, `The site operator must adapt …`, `This information must be adapted …`)
  — delete or rewrite those sentences once your own text stands there.

It scans the `operator` block of `site.json`, the four source `impressum.json` files, the
imprint's Easy-Language preview in the four `easyLanguage.json` files and, once a build exists, the
`impressum` namespace of the built i18n bundles under `dist/vibecore/browser/assets/i18n/`.
Without a real domain the same findings are printed as a one-line advisory and the build stays
green, so a fresh checkout still builds. There is no override: the fix is the data. To run the
check on its own as if you were deploying, use `node scripts/check-imprint.mjs --strict`.

Next to that, and without ever stopping a build, the check names the sentences that say a
person reads the texts ("ein Mensch hat sie durchgelesen", "Ein Mensch liest die Texte danach
durch" and their English versions in `accessibility.json` and `easyLanguage.json`, and the
older "redaktionell begleitet", "Menschen prüfen die Texte"). They describe the kit's demo; make
them true for your site or rewrite them ([Make the kit your own portal](make-it-yours.md),
"Before you go live").

## 3. Produce the build

From the project root:

```bash
npm run build:prod
```

This runs the full production pipeline (content bundles, i18n, prerender, integrity checks) and
emits a static site — plain HTML, JavaScript, CSS, and assets — into:

```
dist/vibecore/browser/
```

That folder is the entire deployable artifact. There is no server process to run and nothing to
install on the host; everything the site needs is a file inside it.

> Always build with `npm run build:prod`, never a bare `ng build`. A raw build skips the integrity
> checks; the project refuses `npm run ng -- build`, but it cannot stop an `ng build` typed
> directly.

## 4. Upload the folder

Copy the **contents** of `dist/vibecore/browser/` to wherever your host serves files from. The
kit makes no assumption about where that is — anything that can serve a directory of static files
works:

- a static file host / static-site platform,
- object storage with static-website serving enabled,
- your own web server (Apache, nginx, Caddy, …) pointing a site root at the folder.

Upload the files themselves, not the enclosing `dist/` path — `index.html` should land at the root
of your site.

## 5. The one hard requirement: SPA fallback

This is a **single-page app**. The server sends an HTML page once, and from then on the app's
router renders every route in the browser. Many routes — `/de/glossary/`, `/de/ai-timeline/`, the
articles — are also **prerendered** at build time into their own `<route>/index.html`
(`scripts/generate-prerender-routes.js` decides which), and a host that serves a directory's
`index.html` answers those directly. The rest — the individual interactive demos, and routes a
language's prerender tier leaves out — exist only in the router.

So your host must **serve `index.html` for any unknown route** instead of returning a 404. This is
variously called *SPA fallback*, *history-API fallback*, or a *catch-all rewrite to `index.html`*.

**What breaks without it:** the site works as long as visitors click their way in from the
homepage, because the router handles navigation client-side. But the moment someone opens a deep
link directly — a bookmarked page, a shared URL, or just pressing **refresh** — on a route that has no
prerendered file, the host looks for a file at that path, doesn't find one, and returns 404.

How you configure the fallback depends on the host: static-site platforms usually have a "rewrite
all to `index.html`" or "single-page app" setting, object storage lets you set the error document
to `index.html`, and a self-managed server needs a `try_files`-style rule (nginx) or equivalent
rewrite (Apache `.htaccess`, Caddy). Check that yours is on by loading a deep link and refreshing —
if the page survives a refresh, the fallback is working.

**Folders are the trap.** The language roots `/de/` and `/en/`, and folders such as
`/de/articles/`, exist in the build but hold no `index.html` of their own (the prerendered
pages sit one level deeper, e.g. `/de/home/index.html`). A fallback that skips every existing
folder — the common `!-d` rule — hands those requests back to the server, and Apache answers
a folder without `index.html` with **403 Forbidden** (some hosts show their own parking page
instead). The site then looks broken on its most-visited addresses.

On Apache, put this in an `.htaccess` in the site root, alongside `index.html`:

```apache
RewriteEngine On
Options -Indexes
DirectoryIndex index.html

# SPA fallback: only GET/HEAD; unknown paths get the app shell.
RewriteCond %{REQUEST_METHOD} !^(GET|HEAD)$
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ - [R=405,L]

# Entry points go to a prerendered start page on the server:
# /de and /en are folders without an index.html, which Apache (Options -Indexes) answers
# with 403 and some hosts with their parking page; / goes the same way, so the
# first page a visitor gets is prerendered HTML, not the bare app shell.
RewriteCond %{HTTP:Accept-Language} ^\s*en [NC]
RewriteRule ^$ /en/home/ [R=302,L]
RewriteRule ^$ /de/home/ [R=302,L]
RewriteRule ^(de|en)/?$ /$1/home/ [R=302,L]

# A folder only counts as a page when it holds an index.html; any other folder
# (e.g. /de/articles/) gets the app shell instead of a 403.
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html !-f
RewriteCond %{REQUEST_URI} !\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|json|xml|txt)$
RewriteRule ^ /index.html [L]
```

`/<lang>/home/` is always prerendered, whatever start page `src/config/site.json` names, so
it is a safe landing point. The redirects are `302`, not `301`, because the root's target
depends on the visitor's browser language. If your site has other languages than `de` and
`en`, list each one in `^(de|en)/?$`, and let the bare `RewriteRule ^$` line name your default
language. Check it after the upload: `/`, `/de/` and `/en/` must redirect to a `…/home/` page,
and a folder like `/de/articles/` must show the site, not an error page.

**Two details worth getting right while you are there** (both found by an external security
assessment of a site running this code):

- **Answer the fallback for `GET` and `HEAD` only.** A catch-all that also rewrites `POST`,
  `OPTIONS` or `PUT` to `index.html` returns `200` for any method on any path — harmless in
  itself, but it advertises write methods the site does not have and hides real misconfiguration.
  On Apache, that is the `R=405` rule at the top of the block above, in front of the rewrite.
  nginx: `limit_except GET HEAD { deny all; }` inside the location that serves the fallback.
- **Switch ETags off for rewritten responses.** Apache appends a suffix to the ETag when a
  rewrite and `mod_deflate` meet, which produces malformed values; the hashed asset names are
  `immutable` anyway and everything else validates fine on `Last-Modified`. `FileETag None` plus
  `Header unset ETag` in the block that serves HTML; nginx: `etag off;`.

## 6. HTTPS and caching are the host's job

Two things the build does **not** decide for you, because they belong to the host:

- **HTTPS.** Serve the site over TLS. Most hosts provision and renew a certificate for you; a
  self-managed server needs one configured.
- **Caching headers.** Fingerprinted assets (files with a hash in their name) can be cached
  aggressively and near-permanently; `index.html` should be revalidated so visitors pick up new
  deploys. Set these headers at the host or CDN layer.

Neither affects the build output — the same folder deploys the same way regardless of how you
handle them.

## 7. Security headers

Static hosting sends no security headers unless you ask for them. Four are cheap and unconditional;
the fifth — Content Security Policy — needs one generated value per build.

### The four unconditional ones

| Header | Value | What it buys |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Stops the browser guessing a MIME type and executing an asset as script. |
| `X-Frame-Options` | `DENY` | No framing, so the site cannot be used for clickjacking. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Outbound links leak your origin, not the full path someone was reading. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | The kit uses none of these APIs, so deny them outright. |

### Content Security Policy

CSP is the one that repays real effort — it is what turns "a `javascript:` URL slipped into a
content file" from a scripting bug into a blocked request. It is also the one you cannot copy
blindly, because a strict policy has to name every inline script by hash, and **this site's inline
scripts are not only the ones you can see in `src/index.html`.**

As an example of what to expect: one measured production build of this kit had **7 distinct
executable inline scripts** across the HTML files in `dist/vibecore/browser/` — your count will
differ as pages and the Angular version change:

- **3 authored**, in `src/index.html` — the anti-FOUC theme bootstrap, the glossary deep-link gate,
  and the language-prefix redirect.
- **4 generated by the build**, on the prerendered pages — one event-replay dispatcher plus three
  `__jsaction_bootstrap` calls that differ from page to page, because the event list depends on
  which events that page actually uses.

Plus **one inline event handler**: `onload="this.media='all'"`, which the production build's
critical-CSS inlining adds to the stylesheet link. Inline handlers are not covered by ordinary
script hashes at all — they need `'unsafe-hashes'` together with a hash of the handler body.

So: **generate the hashes from the built output, never by hand from `src/index.html`.** In the
build that was measured, the source file's redirect script and the built one already had different
hashes, because the build rewrites the language list inside it.

#### Generating the hashes

Save this as `csp-hashes.mjs` next to your build and run `node csp-hashes.mjs` after every
`npm run build:prod`. It prints the finished `script-src` directive:

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
    if (/\bsrc=/.test(attrs) || !body.trim()) continue;          // external or empty
    const type = ((attrs.match(/type=["']?([^"'\s>]+)/) || [])[1] || '').toLowerCase();
    if (!JS_TYPES.has(type)) continue;                            // ld+json etc. never execute
    scripts.add(sha(body));
  }
  for (const [, handler] of html.matchAll(/\son[a-z]+="([^"]*)"/g)) handlers.add(sha(handler));
}

console.log("script-src 'self' " + [...scripts].join(' ') +
            (handlers.size ? " 'unsafe-hashes' " + [...handlers].join(' ') : ''));
```

Feed its output into the snippets below. **Re-run it on every build.** A stale hash does not
degrade gracefully: the browser refuses the script and the theme bootstrap, the language redirect,
or the event replay silently stops working. Anything that changes an inline script changes its
hash — editing `src/index.html`, adding a language, or upgrading Angular (which regenerates the
event-replay code).

#### Apache — `.htaccess`

Place this in the site root, alongside `index.html`. Replace the `script-src` line with the one
your generator printed; the hashes below are from one specific build and **will not match yours**.

```apache
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"

  # Regenerate the sha256 values with csp-hashes.mjs after every build.
  Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'sha256-lqcBjnUL6FsDYkV5jpTHAI66LFXEtZOjK/6ok9JmrJY=' 'sha256-oXRS3D08T86AD/C340cAkJn2NvQKUo5dTkHnXXATls4=' 'sha256-7FGfyVrfuOg3yD5jagycMPrEqcu0vpG39RUr7pYlSGI=' 'sha256-VM2mZqyEQZoLzoTrp5EigFvzQ0+f1wSeBuoOn95WHCg=' 'sha256-RRe63E0peDoj4lJF05pZSrNXzwVWUJWnWQYJUy06yrI=' 'sha256-dCS4rpUZWrP02TQxebWtvIRH8pG/8rcwFhPKgOARtCU=' 'sha256-mVhuqUXE2LQrVwpPwt9GfRrLW6bzuxyuVVbOt6OsweU=' 'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc='; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'"
</IfModule>
```

#### nginx

Inside the `server` block. Same caveat about the hashes.

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;

# Regenerate the sha256 values with csp-hashes.mjs after every build.
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'sha256-lqcBjnUL6FsDYkV5jpTHAI66LFXEtZOjK/6ok9JmrJY=' 'sha256-oXRS3D08T86AD/C340cAkJn2NvQKUo5dTkHnXXATls4=' 'sha256-7FGfyVrfuOg3yD5jagycMPrEqcu0vpG39RUr7pYlSGI=' 'sha256-VM2mZqyEQZoLzoTrp5EigFvzQ0+f1wSeBuoOn95WHCg=' 'sha256-RRe63E0peDoj4lJF05pZSrNXzwVWUJWnWQYJUy06yrI=' 'sha256-dCS4rpUZWrP02TQxebWtvIRH8pG/8rcwFhPKgOARtCU=' 'sha256-mVhuqUXE2LQrVwpPwt9GfRrLW6bzuxyuVVbOt6OsweU=' 'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc='; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'" always;
```

Note that nginx's `add_header` does not inherit into a `location` block that adds headers of its
own — if you set caching headers per location, repeat these there.

#### What this policy admits, and why

- **`style-src` keeps `'unsafe-inline'`.** Angular sets element styles inline as part of normal
  rendering. Tightening this to `'self'` was measured against the built site: the home page alone
  produced a stream of *"Applying inline style violates … style-src 'self'"* refusals. Hashing is
  not an option either, because the styles are generated at runtime. This is a real weakening —
  it is what makes CSS-based data exfiltration possible in principle — and it is the price of the
  framework, not a choice this kit gets to make.
- **`'unsafe-hashes'` is narrow.** It permits the *specific hashed* event handler and nothing else;
  it is not `'unsafe-inline'` for handlers.
- **`connect-src 'self'`** works because the kit ships with every backend endpoint empty. The
  moment you point `analyticsEndpoint`, `feedback.endpoint` or `timeGateEndpoint`
  at a host, add that origin here or the requests are blocked.
- **`frame-ancestors 'none'`** is the modern equivalent of `X-Frame-Options: DENY`. Both are listed
  because old browsers only understand the latter.
- **`img-src` allows `data:`** for inlined thumbnails; fonts are self-hosted, so `font-src 'self'`
  suffices with no external font CDN.

#### Verify it

Load a few prerendered pages with the headers live and watch the browser console. The whole policy
above was checked that way against `/de/`, `/de/ai-timeline/`, `/de/glossary/`, `/de/catalog/` and
`/de/demos/`: every page rendered with no CSP violation and no page error. Anything you got wrong
shows up there as a "Refused to …" line, not as a silent failure.

### `security.txt`

RFC 9116 gives security researchers one well-known place to find out whom to tell. Without it, a
report either never reaches you or lands in a public issue. Ship the file with the build so it
survives every deploy — put it in `public/.well-known/security.txt` (the SPA fallback in §5 only
fires for paths that do not exist, so the file is served as is):

```text
Contact: mailto:security@your-domain.example
Expires: 2027-01-01T00:00:00.000Z
Preferred-Languages: en, de
Canonical: https://your-domain.example/.well-known/security.txt
```

`Contact` and `Expires` are the two required fields; keep `Expires` within a year and renew it.
Verify with `curl -sI https://your-domain.example/.well-known/security.txt` — it must answer
`200` with `text/plain`, not the SPA fallback HTML.

## Summary

1. Set `siteUrl` in `environment.prod.ts` (and `SITE_BASE_URL` for the sitemap).
2. Fill in the imprint and privacy notice (`operator` in `src/config/site.json` and the bracketed
   instructions in every `impressum.json`) — the build refuses placeholders for a real domain.
3. `npm run build:prod` → static files in `dist/vibecore/browser/`.
4. Upload the folder's contents so `index.html` is at your site root.
5. Configure SPA fallback (unknown routes → `index.html`).
6. Terminate HTTPS and set caching headers at the host.
7. Set the security headers, regenerating the CSP hashes from the build.

That's the whole deployment. The kit stays tool-agnostic on purpose: it hands you a folder of
static files and makes no assumption about where it lives.
