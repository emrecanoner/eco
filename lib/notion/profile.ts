import { queryDatabase } from "./client";
import { Profile } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";

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
      name: extractProperty(page, "Name", "title") || "",
      title: extractProperty(page, "Title", "rich_text") || "",
      bio: extractProperty(page, "Bio", "rich_text") || "",
      email: extractProperty(page, "Email", "email") || "",
      location: extractProperty(page, "Location", "rich_text") || "",
      skills: extractProperty(page, "Skills", "multi_select") || [],
      socialLinks: {
        github: extractProperty(page, "GitHub", "url") || undefined,
        linkedin: extractProperty(page, "LinkedIn", "url") || undefined,
        twitter: extractProperty(page, "Twitter", "url") || undefined,
        website: extractProperty(page, "Website", "url") || undefined,
      },
      avatar: extractProperty(page, "Avatar", "url") || undefined,
    };

    await setCachedData(cacheKey, profile);
    return profile;
  } catch {
    return null;
  }
}

