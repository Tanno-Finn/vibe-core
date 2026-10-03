<!-- base -->
# Add a backend (if you need one)

Your goal: add dynamic behavior — a contact form that actually sends, saved user accounts,
server-side analytics, gated content — to a kit that ships without a server. This guide helps you
decide **whether** you need a backend, and shows you **where** to attach one if you do. It does not
prescribe a language, framework, or database.

## The kit is frontend-only on purpose

Out of the box, vibecore has no server and no database. Content lives in files, the production
build is a folder of static files (see [Deploy the built site](deploy.md)), and everything the
visitor sees is rendered in their browser. That is a deliberate design choice, and it buys you:

- **Deployability.** A static site hosts anywhere, cheaply, with nothing to keep running or patch.
- **No secrets to leak.** With no server, there is no API key or database password involved in
  serving the site — so there is nothing to accidentally expose.
- **Low maintenance.** No runtime to monitor, scale, or keep alive at 3am.

Adding a backend trades some of that away. Before you do, check whether you actually need one.

## First, decide whether you need a backend at all

Many things people reach for a backend to do can be done **without running your own server** — by
having the frontend call a third-party service directly, or by staying client-side entirely:

- **A contact form** → point it at a form-handling / email-delivery service that accepts a POST
  from the browser. No server of yours required.
- **Simple analytics** → a hosted analytics provider you include as a client snippet.
- **Comments** → an embeddable third-party comments widget.
- **Search over your own content** → often doable client-side, since the content is already
  shipped as files.

**You actually need your own backend when one or more of these is true:**

- **A secret must stay secret.** A call needs an API key, token, or credential that must *not* be
  visible to the visitor. Anything the browser can see, everyone can see (more on this below) —
  so the secret has to live on a server you control that makes the call on the browser's behalf.
- **You own persistent state.** User accounts, saved progress across devices, submitted records,
  anything that must survive and be trusted between visits and users.
- **You must enforce rules, not just display them.** Gated content, rate limits, payments,
  permissions — anything where a determined user must be *prevented* from doing something, not
  merely *not shown* the button.
- **No third-party service fits**, and the logic genuinely has to run somewhere you control.

If none of these apply, prefer a hosted service the frontend calls — you keep the static-hosting
advantages above. If one does, read on.

## Where the seams are

The kit was exported with the server-dependent pieces removed but their **frontend seams left in
place**, so you have clean spots to attach an API. These are the natural integration points:

- **Deliberate no-op service stubs** in `src/app/services/`. Each was a real, backend-talking
  service in the application this kit was distilled from; the export replaced the body with a stub that compiles and runs but
  does nothing. Their file headers say so explicitly. The main ones:
  - **`analytics.service.ts`** (`AnalyticsService`) — `initialize()` and `trackConsentDecision()`
    are no-ops. This is where you'd emit telemetry to an analytics endpoint.
- **A frontend-only feature with no persistence behind it:** `user-progress.service.ts`
  (`UserProgressService`) tracks learning progress — completed quizzes, checkpoints, and learning
  paths — but the state lives in `localStorage` and goes no further, and only once the visitor has
  agreed to progress storage (`PrivacyConsentService.hasProgressConsent()`; before that it stays in
  memory). This is the natural seam for syncing progress to an account; keep the consent gate when
  you do.
- **A real client with no server behind it:** `feedback.service.ts` (`FeedbackService`) already
  builds and POSTs a payload to a contact/feedback endpoint — it's fully wired on the frontend and
  just needs an endpoint that accepts it. It's a good model for what "the browser calls your API"
  looks like in this codebase.
- **Endpoint configuration** in `src/environments/environment.ts`. Fields like
  `analyticsEndpoint` and `timeGateEndpoint` are intentionally empty strings —
  an empty value disables the corresponding call. Point them at your own URLs to switch the
  behavior on.
- **The kit contract** `kit.json` declares the app's `capabilities` (content and page types the
  kit provides). Read it to understand what surfaces exist before you extend one — a backend should
  serve an existing seam, not bolt a parallel one alongside it.

The pattern in every case is the same: the browser makes a request to a URL you own, and your
backend answers it. You are filling in the far side of a call the frontend already knows how to
make.

## Worked example: the feedback endpoint

The feedback dialog is the one seam that is fully wired on the frontend and just waits for a
server. It is off by default and configured exactly like the endpoints above:

- **Configure it** by setting `feedback.endpoint` in `src/environments/environment.ts` (and
  `environment.prod.ts`) to a URL you own. While it is the empty string, the feedback button
  (the megaphone FAB) is not shown at all — no dead button, no failing submit. Set the URL and the
  button appears and starts posting.
- **What your endpoint must accept:** an HTTP `POST` with a JSON body. The frontend never sets
  any auth header, so the endpoint is public — see the spam and secrets notes below. The shape,
  taken from `FeedbackService`, is:

  ```jsonc
  {
    "type": "positive | negative | idea | bug",
    "message": "string (optional)",
    "email": "string (optional)",
    "screenshot": "string (optional)",
    "honeypot": "",          // anti-spam: reject the request if this is non-empty
    "metadata": {            // collected automatically
      "pageUrl": "string", "pageTitle": "string", "language": "string",
      "theme": "string", "viewport": { "width": 0, "height": 0 },
      "browser": "string", "timestamp": "ISO-8601 string",
      "category": "string (optional)", "rating": 0
    }
  }
  ```

- **What it must return:** JSON `{ "success": true }` on success. Return HTTP `429` when you
  rate-limit a client (the dialog shows a dedicated "too many messages" message for it); any other
  non-2xx surfaces as a generic error.
- **Sketch (framework-agnostic).** Whatever stack you pick, the handler is roughly:

  ```
  on POST /feedback:
    if body.honeypot is not empty:   return 200 { success: true }   # silently drop bots
    if rate_limit_exceeded(client):  return 429
    validate(body); sanitize(body.message, body.email)              # never trust the client
    store_or_email(body)                                            # DB row, ticket, or email
    return 200 { success: true }
  ```

Keep the anti-spam handling server-side: the `honeypot` field and any rate limiting are only
meaningful if the server enforces them. And note the general rule below — the endpoint takes no
secret from the browser, so any credential it needs (a mail-API key, a database password) lives on
the server only.

## Non-negotiables, whatever stack you choose

These hold regardless of the language, framework, or database you pick. They are not style
preferences — getting them wrong is how sites get breached.

- **Secrets never ship in the frontend.** Everything under `src/` — every service, config value,
  and environment file — is compiled into the public bundle and readable by anyone who opens the
  site. API keys, tokens, and passwords must live **only** on your server and never be placed in
  frontend code or `environment*.ts`. If the browser can reach a secret, it is not secret.
- **The browser cannot be trusted.** Anything sent from the client can be inspected, modified, or
  forged — request bodies, headers, hidden fields, "disabled" buttons, client-side checks. Treat
  every incoming request as potentially hostile, no matter how your own UI would have produced it.
- **Validate and authorize on the server.** Re-check every input, and enforce every permission and
  limit, on the server side. Client-side validation is a convenience for honest users; it is not
  security. If a rule matters, the server must enforce it.

## Summary

1. Ask whether you need a backend at all — many wants are met by a third-party service the
   frontend calls.
2. You need your own backend when a secret must stay hidden, you own persistent state, or you must
   *enforce* a rule rather than just display it.
3. Attach it at the existing seams: the no-op service stubs in `src/app/services/`, the empty
   endpoint fields in `environment.ts`, and the capabilities declared in `kit.json`.
4. Whatever you build: keep secrets off the client, trust nothing from the browser, validate on the
   server.
