/**
 * static-server.mjs — the tiny local static server the gates and the kit tools share.
 *
 * WHAT: serves one folder on 127.0.0.1 (port 0 = any free one): a file, a directory's
 * index.html, and — with `spa` on — the folder's index.html for any path that is not a
 * file, which is how a single-page app answers a deep route. A path that leaves the
 * folder (`/../x`, or a link inside it that points elsewhere) is 403. Nothing listens
 * beyond the loopback interface, and a request whose Host is not this server's own
 * loopback address is 403 too: a web page in the user's browser that points its own
 * domain name at 127.0.0.1 (DNS rebinding) cannot read the served files.
 *
 * Node core only.
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

export const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
};

/** Starts the server; resolves to the listening http.Server. */
export function serve(root, { spa = true, port = 0 } = {}) {
  const ROOT = realpathSync(resolve(root));
  const shell = join(ROOT, 'index.html');
  const fold = (p) => (process.platform === 'win32' ? p.toLowerCase() : p);
  const inside = (p) => fold(p) === fold(ROOT) || fold(p).startsWith(fold(ROOT + sep));
  const server = createServer((req, res) => {
    const { port: own } = server.address();
    if (![`127.0.0.1:${own}`, `localhost:${own}`].includes((req.headers.host || '').toLowerCase())) {
      res.writeHead(403).end();
      return;
    }
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    let file = normalize(join(ROOT, path));
    if (!inside(file)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) {
      if (!spa || !existsSync(shell)) {
        res.writeHead(404).end();
        return;
      }
      file = shell;
    }
    if (!inside(realpathSync(file))) {
      res.writeHead(403).end();
      return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((ok, fail) => {
    server.once('error', fail);
    server.listen(port, '127.0.0.1', () => ok(server));
  });
}

/** `http://127.0.0.1:<port>` of a listening server. */
export const originOf = (server) => `http://127.0.0.1:${server.address().port}`;
