# TOSCOCORNICI Web — Project Context

## What this is
A Next.js 15 door configurator for TOSCOCORNICI (Torrita di Siena). Customers configure doors (model, dimensions, finishes, handles, hinges) and submit an order request. Staff receive PDF documents (client summary + factory technical sheet).

## Stack
- Next.js 15 App Router, TypeScript, Tailwind CSS
- `output: 'export'` for GitHub Pages static deployment
- Puppeteer for server-side PDF generation (API routes only — not used in static export)
- GitHub Actions workflow for auto-deploy on push to `main`

## Deployment
- **GitHub repo**: https://github.com/kamilo16jc/toscocornici-web
- **Live demo URL**: https://kamilo16jc.github.io/toscocornici-web/
- **GitHub username**: kamilo16jc
- **Collaborator**: leonardobove (leonardo.bove01@gmail.com) — already added

## Architecture notes
- `basePath: '/toscocornici-web'` in production — plain `<img>` tags need `assetPath()` helper (`src/lib/asset-path.ts`)
- API routes (`/api/orders`, `/api/pdf2`) use `export const dynamic = 'force-static'` for static build compatibility; they only work at runtime on a real server
- **Demo mode**: when deployed statically, `fetch()` throws TypeError → OrderForm falls back to `onSuccess('demo', 'TC-DEMO-XXXX')` → SuccessScreen shows amber banner instead of PDF buttons
- PDF route is `/api/pdf2?orderId=XXX&type=client|factory` (flat query params, not dynamic segment)
- `.npmrc` has `puppeteer_skip_download=true` so CI doesn't try to download Chrome

## Key files
- `src/components/configurator/DoorConfigurator.tsx` — main 5-step flow
- `src/components/configurator/OrderForm.tsx` — customer contact form (step 5)
- `src/components/configurator/SuccessScreen.tsx` — post-order screen with PDF links
- `src/data/models.ts` — 19 door models with photos
- `src/lib/pdf-generator.ts` — Puppeteer PDF generation (clientHtml, factoryHtml)
- `src/app/api/orders/route.ts` — POST saves order JSON to `data/orders/`
- `src/app/api/pdf2/route.ts` — GET generates and streams PDF
- `.github/workflows/deploy.yml` — GitHub Actions Pages deploy
- `data/orders/` — runtime order storage (gitignored)

## Running locally
```bash
cd C:\Users\Julic\toscocornici-web
npm run dev        # development server
npm run build      # static export to out/
```

## Preview server (Claude Code)
Uses `start-server.js` launcher with node.exe directly (npm.cmd can't be spawned on Windows by the preview tool).
Port: 3002
