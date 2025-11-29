# Quick Start - Cloudflare Deployment

## Frontend Deployment (Cloudflare Pages)

### Option 1: Drag & Drop (Simplest)

1. **Export your web app:**
```bash
npx expo export:web --output-dir docs
```

2. **Deploy to Cloudflare:**
   - Go to https://dash.cloudflare.com
   - Click "Workers & Pages" → "Create application" → "Pages" → "Upload assets"
   - Drag the `docs` folder
   - Name: `aye-chihuahua-salsa`
   - Click "Deploy site"

✅ Your site will be live at: `https://aye-chihuahua-salsa.pages.dev`

### Option 2: GitHub Integration (Auto-deploy on push)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy setup"
git push
```

2. **Connect to Cloudflare:**
   - Cloudflare Dashboard → Pages → "Connect to Git"
   - Select your repository
   - Build settings:
     - **Build command:** `npx expo export:web --output-dir docs`
     - **Build output directory:** `docs`
   - Click "Save and Deploy"

✅ Now every git push auto-deploys!

---

## Backend Deployment (Cloudflare Workers)

### Deploy Your API

1. **Install Wrangler:**
```bash
npm install -g wrangler
```

2. **Login to Cloudflare:**
```bash
wrangler login
```

3. **Install dependencies:**
```bash
cd cloudflare-deploy
npm install
```

4. **Deploy:**
```bash
wrangler deploy
```

✅ Your API will be at: `https://YOUR-WORKER-NAME.workers.dev`

### Update CORS Settings

After frontend is deployed, update `worker.ts` line 10:
```typescript
origin: ['https://aye-chihuahua-salsa.pages.dev', 'https://your-actual-domain.com'],
```

Then redeploy:
```bash
wrangler deploy
```

---

## Complete Folder Structure

Everything you need for Cloudflare deployment is in this folder:

```
cloudflare-deploy/
├── worker.ts              ← Main worker file
├── wrangler.toml          ← Cloudflare config
├── _headers               ← Security headers
├── backend/               ← All backend code
│   └── trpc/
│       ├── app-router.ts
│       ├── create-context.ts
│       └── routes/
│           └── example/
│               └── hi/
│                   └── route.ts
└── package.json           ← Dependencies
```

---

## Troubleshooting

**"Module not found" errors?**
- All backend files are already copied to `cloudflare-deploy/backend/`
- Run `npm install` in the cloudflare-deploy folder

**CORS errors?**
- Update the `origin` array in `worker.ts` with your actual domain
- Redeploy with `wrangler deploy`

**Need help?**
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Cloudflare Workers: https://developers.cloudflare.com/workers/

---


