# Vercel Deployment Guide

This guide contains all the steps needed to deploy the project to Vercel.

## Prerequisites

### 1. Create GitHub Repository

1. Create a new repository on GitHub
2. Push the project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### 2. Notion Integration Setup

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a "New integration"
3. Give your integration a name (e.g., "Portfolio Website")
4. After creating the integration, copy the **Internal Integration Token**
5. Share each database (Settings, Profile, Blog, Movies, Books) with this integration:
   - Open the database
   - Click "..." menu in the top right
   - Select "Add connections"
   - Choose your integration

### 3. Find Database IDs

Find the ID for each database:
1. Open the database in Notion
2. Copy the ID from the URL: `https://www.notion.so/WORKSPACE/DATABASE_ID?v=...`
3. The Database ID is the 32-character UUID (with dashes) before `?v=` in the URL

## Vercel Deployment

### Method 1: Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project" in the dashboard
   - Select your GitHub repository from the list
   - Click "Import"
   
   **Important**: Vercel does NOT clone your repository. It creates a connection to your existing GitHub repository. When you select your repo, Vercel will:
   - Link to your existing GitHub repository (not create a new one)
   - Set up automatic deployments (every push to main branch triggers a deployment)
   - You keep working with the same repository - no need to clone or create a new one
   
   If you see a message about cloning, it's likely referring to Vercel's internal process of downloading your code for the first build. Your repository stays the same on GitHub.

3. **Build Settings**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables**
   - Go to "Environment Variables" section
   - Add the following variables:

```
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SETTINGS_DB=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_PROFILE_DB=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_BLOG_DB=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_MOVIES_DB=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_BOOKS_DB=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CRON_SECRET=your-secret-token-here-minimum-32-characters
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxx
```

   - For each variable:
     - Select **Production**, **Preview**, and **Development** environments
     - Click "Save"

5. **Deploy**
   - Click "Deploy" button
   - Wait for the build to complete (2-5 minutes)

### Method 2: Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Add Environment Variables**
```bash
vercel env add NOTION_API_KEY
vercel env add NOTION_SETTINGS_DB
vercel env add NOTION_PROFILE_DB
vercel env add NOTION_BLOG_DB
vercel env add NOTION_MOVIES_DB
vercel env add NOTION_BOOKS_DB
vercel env add CRON_SECRET
vercel env add BLOB_READ_WRITE_TOKEN
```

You'll be prompted to enter the value for each command.

5. **Production Deploy**
```bash
vercel --prod
```

## CRON_SECRET Generation

**CRON_SECRET** is a security token that you need to create yourself. It's used to protect your cron job and sync endpoints from unauthorized access.

### How to Generate CRON_SECRET

You can generate a secure random token using one of these methods:

**Option 1: Using Node.js (Recommended)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Using Online Generator**
- Visit [randomkeygen.com](https://randomkeygen.com/)
- Use the "CodeIgniter Encryption Keys" generator
- Copy a 64-character key

**Option 4: Manual Generation**
- Create a random string of at least 32 characters
- Use a mix of letters, numbers, and special characters
- Example: `my-super-secret-cron-token-2024-xyz123`

### Important Notes

- **Minimum Length**: At least 32 characters (64+ recommended)
- **Security**: Use a strong, random token - don't use simple passwords
- **Storage**: Store it securely - you'll need it for manual sync requests
- **Uniqueness**: Use a different token for each environment (production, preview, development)

### Usage

After setting `CRON_SECRET` in Vercel environment variables:
- The cron job at `/api/cron` will automatically use it
- For manual sync, use it in the Authorization header:
  ```bash
  Authorization: Bearer YOUR_CRON_SECRET
  ```
- Or as a query parameter:
  ```bash
  GET /api/cron?token=YOUR_CRON_SECRET
  ```
- And for manual sync (deploy hooks friendly):
  ```bash
  POST /api/notion/sync?token=YOUR_CRON_SECRET
  ```

## Post-Deployment Checks

### 1. Site Access
- Click on your project in Vercel dashboard
- Check the auto-generated domain in "Domains" section
- Test if the site loads correctly

### 2. Notion Connection Check
- Are profile information visible on the homepage?
- Do Blog, Movies, Books pages work?
- Check for errors in the console (Browser DevTools)

### 3. Cron Job Check
- Vercel dashboard → Project → Settings → Cron Jobs
- Verify that the cron job is active
- The cron job runs **once daily at 6:00 PM (18:00) UTC**
- Or test manually:
  ```
  GET https://YOUR_DOMAIN.vercel.app/api/cron?token=YOUR_CRON_SECRET
  ```

### 4. Persistent Cache (Recommended): Vercel Blob

Local development uses file-system cache in `.cache/`. In production, you can enable a persistent cache with **Vercel Blob** so data is kept across deployments and instances.

1. Vercel Dashboard → **Storage** → **Blob** → Create a store
2. Create a **Read/Write token**
3. Add it as an environment variable:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```

When `BLOB_READ_WRITE_TOKEN` is set, the app automatically uses Blob for caching. If it is not set, it falls back to `.cache/`.

## Warm Cache After Deployment (Recommended)

Your Git integration already triggers a deploy automatically on every push. The remaining goal is: **when the deployment is READY**, trigger a Notion sync to warm the Blob cache.

Important: Vercel **Deploy Hooks** (like `https://api.vercel.com/v1/integrations/deploy/...`) are used to **start a deployment**. They are not a post-deploy callback.

### Option 1 (Best): Vercel Webhook on “Deployment Ready”

If your Vercel project has **Webhooks** (deployment events), create a webhook for the “deployment ready/succeeded” event and set the target URL to:

`https://YOUR_DOMAIN.vercel.app/api/notion/sync?token=YOUR_CRON_SECRET`

This is the cleanest post-deploy warming solution.

### Option 2: GitHub Actions (Post-deploy HTTP call)

If you don't have Vercel deployment webhooks, you can call the sync endpoint from GitHub Actions after a push to your default branch (`main` or `master`). You can either:
- wait a short time and call the production URL, or
- poll until the deployment responds 200, then call sync.

Target URL:
`https://YOUR_DOMAIN.vercel.app/api/notion/sync?token=YOUR_CRON_SECRET`

This repository includes a ready-to-use workflow:
- `.github/workflows/warm-cache.yml`

Setup in GitHub:
1. Repository → Settings → Secrets and variables → Actions → New repository secret
2. Add:
   - `PROD_BASE_URL` (example: `https://YOUR_DOMAIN.vercel.app`)
   - `CRON_SECRET` (same value as in Vercel env vars)

Note: GitHub Actions can send request headers. The workflow uses `Authorization: Bearer CRON_SECRET` (preferred) to avoid putting the secret in the URL.

## Troubleshooting

### Build Errors
- **Error**: "Module not found"
  - **Solution**: Ensure all dependencies in `package.json` are correct
  - Run `npm install` locally and test

- **Error**: "TypeScript errors"
  - **Solution**: Run `npm run build` locally and fix errors

### Environment Variables Errors
- **Error**: "Profile data not available"
  - **Solution**: 
    1. Check that environment variables are correctly added in Vercel dashboard
    2. Ensure database IDs are in correct format (UUID format)
    3. Verify that Notion integration has access to all databases

### Cron Job Not Working
- **Check**: Vercel dashboard → Project → Settings → Cron Jobs
- **Solution**: 
  1. Verify `vercel.json` is correctly configured
  2. Pro plan may be required (cron jobs are limited on free plan)
  3. Use manual sync endpoint: `/api/notion/sync`

### Image Loading Errors
- **Error**: "Invalid src prop"
  - **Solution**: Check `remotePatterns` configuration in `next.config.js`
  - Add image hostnames if needed

## Custom Domain Setup

1. Vercel dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain
4. Configure DNS settings (Vercel will provide instructions)
5. SSL certificate will be automatically created

## Automatic Deployment

Vercel automatically deploys when you push to your GitHub repository:
- `main` branch → Production
- Other branches → Preview deployments

## Important Notes

1. **Environment Variables**: Never commit `.env` files to git
2. **CRON_SECRET**: Use a strong secret token (minimum 32 characters)
3. **Notion API Limits**: Notion API has rate limits, don't make excessive requests
4. **Cache**: Cache is automatically managed on Vercel, but you can use `/api/notion/sync` endpoint for manual sync

## Related Files

- `vercel.json`: Cron job configuration
- `next.config.js`: Next.js configuration (image domains)
- `.gitignore`: Git ignore settings (includes env files)

## Help

If you encounter issues:
1. Check build logs in Vercel dashboard
2. Check for errors in browser console
3. Review Vercel [documentation](https://vercel.com/docs)
