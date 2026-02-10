# Sync Endpoints (Cron vs Manual Sync)

This project includes two server endpoints that **refresh the Notion data cache** and **revalidate pages** so the website can update without redeploying.

Both endpoints do the same core work:
- clear the cache (Vercel Blob if `BLOB_READ_WRITE_TOKEN` is set; otherwise `.cache/`)
- fetch fresh data from Notion (`forceFetch: true`)
- write the new data back to cache
- trigger Next.js revalidation for pages

They exist as two endpoints because different systems have different constraints (HTTP method, headers, scheduling).

## 1) Manual Sync: `POST /api/notion/sync`

### Purpose
Use this endpoint when you want to **sync immediately**:
- after updating Notion and you want changes reflected now
- after a deployment (warm the cache before the first visitor)
- from automation tools that can send a POST request

### Authentication
This endpoint is protected by `CRON_SECRET`.

Recommended (preferred):
- send a header:
  - `Authorization: Bearer <CRON_SECRET>`

Fallback (useful if you can’t set headers):
- use a query parameter:
  - `?token=<CRON_SECRET>`

### Example requests

Using Authorization header:

```bash
curl -sS --fail-with-body -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  "https://YOUR_DOMAIN.vercel.app/api/notion/sync"
```

Using query parameter:

```bash
curl -sS --fail-with-body -X POST \
  "https://YOUR_DOMAIN.vercel.app/api/notion/sync?token=$CRON_SECRET"
```

### Who uses it in this repo?
- **GitHub Actions warm-cache workflow**: `.github/workflows/warm-cache.yml`
  - waits until production is reachable
  - calls `POST /api/notion/sync` to warm the Blob cache

## 2) Scheduled Sync (Cron): `GET /api/cron`

### Purpose
Use this endpoint for **scheduled** refreshes (cron jobs), typically:
- Vercel Cron Jobs
- other schedulers that are easiest to configure with a GET request

### Authentication
Same as above (`CRON_SECRET`), supported in two ways:

Preferred:
- `Authorization: Bearer <CRON_SECRET>`

Fallback:
- `?token=<CRON_SECRET>`

### Example requests

Using query parameter (common for cron systems):

```bash
curl -sS --fail-with-body \
  "https://YOUR_DOMAIN.vercel.app/api/cron?token=$CRON_SECRET"
```

Using Authorization header:

```bash
curl -sS --fail-with-body \
  -H "Authorization: Bearer $CRON_SECRET" \
  "https://YOUR_DOMAIN.vercel.app/api/cron"
```

### Who uses it in this repo?
- **Vercel Cron Jobs** (recommended) for periodic updates (e.g., daily at 18:00 UTC)

## Cache behavior (important)

### Where the cache is stored
The cache backend is chosen automatically:
- If `BLOB_READ_WRITE_TOKEN` is set → cache is stored in **Vercel Blob**
- If not set → cache is stored in local file-system `.cache/`

Implementation:
- `lib/utils/cache.ts`

### What happens during sync
Both endpoints:
1. call `clearCache()`
2. fetch Notion data with `forceFetch: true`:
   - `getProfile(true)`
   - `getSettings(true)`
   - `getBlogPosts(true)`
   - `getMovies(true)`
   - `getBooks(true)`
3. revalidate site pages via `revalidateAllPages()`

## Which one should you use?

- Use **`POST /api/notion/sync`** when you want a **manual or post-deploy** refresh.
- Use **`GET /api/cron`** for **scheduled refreshes**.

It’s completely fine to use both:
- cron keeps your site fresh daily
- manual sync (or GitHub Actions) ensures cache is warm right after deploy


