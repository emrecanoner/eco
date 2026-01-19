import { queryDatabase } from "./client";
import { Movie } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";
import { NOTION_PROPERTIES } from "./constants";

export async function getMovies(): Promise<Movie[]> {
  const cacheKey = "movies";
  const cached = await getCachedData<Movie[]>(cacheKey);
  if (cached) return cached;

  if (!process.env.NOTION_MOVIES_DB) {
    return [];
  }

  try {
    const results = await queryDatabase(
      process.env.NOTION_MOVIES_DB,
      undefined,
      [
        {
          property: NOTION_PROPERTIES.WATCHED_DATE,
          direction: "descending",
        },
      ]
    );

    const movies: Movie[] = results.map((page) => {
      const typeValue = extractProperty(page, NOTION_PROPERTIES.TYPE, "select")?.toLowerCase() || "movie";
      return {
        id: page.id,
        title: extractProperty(page, NOTION_PROPERTIES.TITLE, "title") || "",
        type: typeValue === "series" ? "series" : "movie",
        rating: extractProperty(page, NOTION_PROPERTIES.RATING, "number") || 0,
        watchedDate: extractProperty(page, NOTION_PROPERTIES.WATCHED_DATE, "date") || "",
        poster: extractProperty(page, NOTION_PROPERTIES.POSTER, "url") || undefined,
        year: extractProperty(page, NOTION_PROPERTIES.YEAR, "number") || undefined,
        genre: extractProperty(page, NOTION_PROPERTIES.GENRE, "multi_select") || undefined,
      };
    });

    await setCachedData(cacheKey, movies);
    return movies;
  } catch {
    return [];
  }
}

