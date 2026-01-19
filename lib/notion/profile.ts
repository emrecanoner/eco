import { queryDatabase } from "./client";
import { Profile } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";
import { NOTION_PROPERTIES } from "./constants";

export async function getProfile(): Promise<Profile | null> {
  const cacheKey = "profile";
  const cached = await getCachedData<Profile>(cacheKey);
  if (cached) return cached;

  if (!process.env.NOTION_PROFILE_DB) {
    return null;
  }

  try {
    const results = await queryDatabase(process.env.NOTION_PROFILE_DB);
    if (results.length === 0) return null;

    const page = results[0];
    const profile: Profile = {
      name: extractProperty(page, NOTION_PROPERTIES.NAME, "title") || "",
      title: extractProperty(page, NOTION_PROPERTIES.TITLE, "rich_text") || "",
      bio: extractProperty(page, NOTION_PROPERTIES.BIO, "rich_text") || "",
      email: extractProperty(page, NOTION_PROPERTIES.EMAIL, "email") || "",
      location: extractProperty(page, NOTION_PROPERTIES.LOCATION, "rich_text") || "",
      skills: extractProperty(page, NOTION_PROPERTIES.SKILLS, "multi_select") || [],
      socialLinks: {
        github: extractProperty(page, NOTION_PROPERTIES.GITHUB, "url") || undefined,
        linkedin: extractProperty(page, NOTION_PROPERTIES.LINKEDIN, "url") || undefined,
        twitter: extractProperty(page, NOTION_PROPERTIES.TWITTER, "url") || undefined,
        website: extractProperty(page, NOTION_PROPERTIES.WEBSITE, "url") || undefined,
      },
    };

    await setCachedData(cacheKey, profile);
    return profile;
  } catch {
    return null;
  }
}

