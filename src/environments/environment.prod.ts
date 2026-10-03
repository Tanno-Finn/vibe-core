export const environment = {
  production: true,
  // Absolute origin of your deployment, e.g. 'https://your-domain.example'.
  // Empty means prerendered pages omit canonical/og:url/hreflang instead of
  // shipping a placeholder domain. Set this before you deploy — see
  // environment.ts and docs/how-to/deploy.md ("Set your site URL").
  siteUrl: '',
  // Analytics endpoint — empty disables analytics (no backend ships with the kit).
  analyticsEndpoint: '',
  // Time gate endpoint — empty uses client time.
  timeGateEndpoint: '',
  // Feedback submission — empty endpoint hides the feedback FAB entirely.
  // See environment.ts and docs/how-to/add-a-backend.md ("Feedback endpoint").
  feedback: {
    endpoint: '',
  },
};
