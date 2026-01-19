import { queryDatabase } from "./client";
import { Settings } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";

export async function getSettings(): Promise<Settings | null> {
  if (!process.env.NOTION_SETTINGS_DB) {
    return null;
  }

  const cacheKey = "settings";
  
  const cached = await getCachedData<Settings>(cacheKey);
  if (cached) return cached;

  try {
    const results = await queryDatabase(process.env.NOTION_SETTINGS_DB);
    if (results.length === 0) {
      return null;
    }

    const page = results[0];
    const settings: Settings = {
      title: extractProperty(page, "Title", "title") || "",
      favicon: extractProperty(page, "Favicon", "url") || undefined,
      siteName: extractProperty(page, "Site Name", "rich_text") || "",
      description: extractProperty(page, "Description", "rich_text") || "",
      metaTags: extractProperty(page, "Meta Tags", "rich_text") || undefined,
    };

    await setCachedData(cacheKey, settings);
    return settings;
  } catch (error) {
    return null;
  }
}

