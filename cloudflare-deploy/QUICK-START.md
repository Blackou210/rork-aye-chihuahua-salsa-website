# Quick Start - Cloudflare Deployment

## Step-by-Step Instructions

### 1. Export Your Web App
```bash
npx expo export --platform web
```
This creates a `dist` folder.

### 2. Deploy to Cloudflare Pages (Frontend)

**Easiest Method - Drag & Drop:**
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" in sidebar
3. Click "Create application" > "Pages" > "Upload assets"
4. Drag the `dist` folder or click to upload
5. Name it: `aye-chihuahua-salsa`
6. Click "Deploy site"

Your site will be live at: `https://aye-chihuahua-salsa.pages.dev`

### 3. Deploy Backend (API) - If Needed

**For the backend API:**
1. Install Wrangler globally:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Copy backend files:
```bash
# You'll need to manually copy your backend folder structure
# The worker.ts file in cloudflare-deploy shows the structure
```

4. Deploy:
```bash
cd cloudflare-deploy
npm install
wrangler deploy
```

### 4. Connect Frontend to Backend

After backend is deployed, you'll get a URL like:
`https://aye-chihuahua-api.workers.dev`

Update your frontend's API URL and redeploy.

---

## Alternative: GitHub Integration (Recommended)

Instead of manual uploads, connect your GitHub repo:

1. Push your code to GitHub
2. In Cloudflare Dashboard > Pages > "Connect to Git"
3. Select your repository
4. Build settings:
   - **Build command:** `npx expo export --platform web`
   - **Build output directory:** `dist`
5. Click "Save and Deploy"

Now every git push automatically deploys! 🚀

---

## Need Help?

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
