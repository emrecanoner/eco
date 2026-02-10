import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { del, list, put } from "@vercel/blob";

const CACHE_DIR = join(process.cwd(), ".cache");
const BLOB_CACHE_PREFIX = "eco-cache";

function isBlobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function blobPathname(key: string): string {
  return `${BLOB_CACHE_PREFIX}/${key}.json`;
}

async function findBlobUrlByKey(key: string): Promise<string | null> {
  const targetPathname = blobPathname(key);
  const { blobs } = await list({ prefix: targetPathname, limit: 10 });
  const exact = blobs.find((b) => b.pathname === targetPathname);
  return exact?.url ?? null;
}

export async function ensureCacheDir() {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    if (isBlobEnabled()) {
      const url = await findBlobUrlByKey(key);
      if (!url) return null;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) return null;
      return (await response.json()) as T;
    }

    await ensureCacheDir();
    const filePath = join(CACHE_DIR, `${key}.json`);
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    if (isBlobEnabled()) {
      const json = JSON.stringify(data, null, 2);
      await put(blobPathname(key), json, {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });
      return;
    }

    await ensureCacheDir();
    const filePath = join(CACHE_DIR, `${key}.json`);
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Cache write failed, continue without caching
  }
}

export async function clearCache(key?: string): Promise<void> {
  try {
    if (isBlobEnabled()) {
      if (key) {
        const url = await findBlobUrlByKey(key);
        if (url) {
          await del(url);
        }
        return;
      }

      const { blobs } = await list({ prefix: `${BLOB_CACHE_PREFIX}/`, limit: 1000 });
      if (blobs.length > 0) {
        await del(blobs.map((b) => b.url));
      }
      return;
    }

    await ensureCacheDir();
    if (key) {
      const filePath = join(CACHE_DIR, `${key}.json`);
      await import("fs/promises").then((fs) => fs.unlink(filePath).catch(() => {}));
    } else {
      const fs = await import("fs/promises");
      const files = await fs.readdir(CACHE_DIR);
      await Promise.all(
        files
          .filter((file) => file.endsWith(".json"))
          .map((file) => fs.unlink(join(CACHE_DIR, file)).catch(() => {}))
      );
    }
  } catch {
    // Cache clear failed, continue
  }
}

