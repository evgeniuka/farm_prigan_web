# Prigan Guide Deployment

## Vercel

Use Vercel as a static Vite deployment.

Recommended settings:

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

The project includes `vercel.json` so direct React Router links such as `/route`, `/map`, and `/recommended` open correctly after deployment.

## Environment Variables

PostHog is optional and disabled unless explicitly enabled.

For the classroom analytics demo, add these variables in Vercel:

```txt
VITE_POSTHOG_ENABLED=true
VITE_POSTHOG_KEY=<your PostHog project key>
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

For a clean prototype demo without analytics, either omit these variables or set:

```txt
VITE_POSTHOG_ENABLED=false
```

## Local Checks Before Deploy

Run:

```bash
npm run lint
npm run build
```

Then import the GitHub repository in Vercel and deploy from the main branch.
