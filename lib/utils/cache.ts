import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const CACHE_DIR = join(process.cwd(), ".cache");

export async function ensureCacheDir() {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
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
    await ensureCacheDir();
    const filePath = join(CACHE_DIR, `${key}.json`);
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Cache write failed, continue without caching
  }
}

export async function clearCache(key?: string): Promise<void> {
  try {
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

