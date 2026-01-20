import { queryDatabase } from "./client";
import { Settings } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";
import { NOTION_PROPERTIES } from "./constants";

export async function getSettings(forceFetch = false): Promise<Settings | null> {
  if (!process.env.NOTION_SETTINGS_DB) {
    return null;
  }

  const cacheKey = "settings";
  
  if (!forceFetch) {
    const cached = await getCachedData<Settings>(cacheKey);
    if (cached) return cached;
  }

  try {
    const results = await queryDatabase(process.env.NOTION_SETTINGS_DB, undefined, undefined, forceFetch);
    if (results.length === 0) {
      return null;
    }

    const page = results[0];
    const settings: Settings = {
      title: extractProperty(page, NOTION_PROPERTIES.TITLE, "title") || "",
      favicon: extractProperty(page, NOTION_PROPERTIES.FAVICON, "files") || extractProperty(page, NOTION_PROPERTIES.FAVICON, "url") || undefined,
      siteName: extractProperty(page, NOTION_PROPERTIES.SITE_NAME, "rich_text") || "",
      description: extractProperty(page, NOTION_PROPERTIES.DESCRIPTION, "rich_text") || "",
      metaTags: extractProperty(page, NOTION_PROPERTIES.META_TAGS, "rich_text") || undefined,
    };

    await setCachedData(cacheKey, settings);
    return settings;
  } catch {
    return null;
  }
}

