# Vercel Blob Cache (Beginner-Friendly)

This document explains what **Vercel Blob** is, why we use it in this project, and how the caching workflow works.

## What is Vercel Blob?

**Vercel Blob** is a managed object storage service (similar to S3). It lets you store “files” (objects) such as JSON, text, or images and retrieve them later via URLs.

Key characteristics:
- **Persistent**: Data remains available across deployments.
- **Shared**: All server instances can read the same stored objects.
- **Simple**: You `put()` an object, and you can later fetch it by URL.

## Why do we need it?

This site gets its content from **Notion** (profile, settings, blog, movies, books). Fetching from Notion on every page load is not ideal because:
- It can be slow or rate-limited.
- It increases API calls.
- It makes page loads depend on Notion availability.

So we use a cache: fetch from Notion once (on sync), store the result, and serve pages from the cached data.

### Why not just `.cache/` in production?

Local file caching (like `.cache/*.json`) is great in development. But in serverless environments (like Vercel), the file system is not a reliable place for persistent storage:
- A deployment can replace instances.
- Different instances may not share the same disk state.

Blob solves this by providing a **durable, shared cache**.

## How it works in this repo

We implemented caching behind a single interface in:
- `lib/utils/cache.ts`

This file chooses the storage backend based on environment variables:
- If `BLOB_READ_WRITE_TOKEN` exists → use **Vercel Blob**
- Otherwise → fall back to local file cache in `.cache/`

### Cache keys and paths

We store JSON objects in Blob using a stable path per key:
- `eco-cache/<key>.json`

Examples:
- `eco-cache/movies.json`
- `eco-cache/books.json`
- `eco-cache/settings.json`

## The main cache functions

### `getCachedData(key)`

Reads cached JSON for a given key.

- **Blob enabled**: finds the object URL via `list()`, then `fetch()` the JSON.
- **Blob disabled**: reads `.cache/<key>.json` from disk.

### `setCachedData(key, data)`

Writes fresh JSON to the cache.

- **Blob enabled**: `put("eco-cache/<key>.json", JSON.stringify(data))`
  - Uses `addRandomSuffix: false` so the path is overwritten deterministically.
- **Blob disabled**: writes `.cache/<key>.json` to disk.

### `clearCache(key?)`

Clears the cache.

- With a key: deletes only that single cached object.
- Without a key: deletes all objects under the `eco-cache/` prefix (or all local `.cache/*.json` files).

## When does the cache update?

### 1) Manual sync

`POST /api/notion/sync`

This endpoint:
- clears the cache
- fetches fresh data from Notion (`forceFetch: true`)
- writes it back to the cache (Blob or `.cache/`)
- triggers Next.js revalidation

### 2) Automatic cron sync

`GET /api/cron`

This is designed for scheduled jobs (for example, Vercel Cron):
- clears the cache
- fetches fresh data from Notion (`forceFetch: true`)
- writes it back to the cache
- revalidates pages

### 3) Post-deploy warm-up (GitHub Actions)

Because Vercel Webhooks require a paid plan, we use GitHub Actions to warm the cache after a push:
- it waits until production is reachable
- then it calls `POST /api/notion/sync`

Workflow file:
- `.github/workflows/warm-cache.yml`

## Security model

Both `/api/cron` and `/api/notion/sync` are protected by `CRON_SECRET`.

Recommended approach:
- GitHub Actions uses `Authorization: Bearer <CRON_SECRET>` headers (no secret in URL).

The token query parameter is still supported (useful for cron systems that cannot set headers).

## Quick checklist (Production)

1. Create a Blob store in Vercel.
2. Generate a Read/Write token.
3. Add it to your Vercel project env vars:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```

4. Trigger a sync once:
- `POST /api/notion/sync` (with auth)

After that, pages should load from Blob cache instead of hitting Notion on every request.


