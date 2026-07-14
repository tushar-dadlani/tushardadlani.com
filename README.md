# tushardadlani.com

Personal consulting landing page for Tushar Dadlani — fractional CTO and product
leadership for companies building with AI.

Single-page Next.js 14 (App Router) site with Tailwind CSS. Typography: Fraunces
(display), Inter (body), IBM Plex Mono (labels). Clay + rust palette.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

Analytics (PostHog) reads `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST`
from `.env.local`.

## Build & deploy

```bash
npm run build
```

Deployed on Vercel; push to `main` to deploy. Production domain: `tushardadlani.com`.
