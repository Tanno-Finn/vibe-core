export const environment = {
  production: false,
  // Absolute origin of your deployment, e.g. 'https://your-domain.example'.
  // Empty is the honest default: nobody knows your domain but you.
  //
  // The browser reads its own origin from window.location, so this only
  // matters for server-rendered/prerendered HTML, where there is no window.
  // While it is empty, the prerendered pages simply omit <link rel=canonical>,
  // og:url and the hreflang links rather than inventing a placeholder domain —
  // a wrong canonical is far worse for indexing than a missing one.
  // Set it before you deploy; see docs/how-to/deploy.md ("Set your site URL").
  // The sitemap generator reads the same value from the SITE_BASE_URL env var.
  siteUrl: '',
  // Analytics endpoint — empty disables analytics (no backend ships with the kit).
  analyticsEndpoint: '',
  // Time gate endpoint — empty uses client time.
  timeGateEndpoint: '',
  // Feedback submission. Empty endpoint disables the feature entirely: the
  // feedback FAB is not shown at all (no dead button, no broken submit), since
  // no backend ships with the kit. Point `endpoint` at a URL that accepts the
  // feedback POST to switch it on — see docs/how-to/add-a-backend.md
  // ("Feedback endpoint") for the request contract.
  feedback: {
    endpoint: '',
  },
};
