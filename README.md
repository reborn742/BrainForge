<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/37bb4351-91dd-4fc6-9ccb-531a4d55e901

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` (optional: without it the built-in dictionary judge is used)
3. Run the app:
   `npm run dev`

## Production

```
npm ci && npm run build && npm start
```

See [SECURITY.md](SECURITY.md) for the hardening notes and tunables.
