import { queryDatabase } from "./client";
import { Movie } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";
import { NOTION_PROPERTIES } from "./constants";

export async function getMovies(forceFetch = false): Promise<Movie[]> {
  const cacheKey = "movies";
  if (!forceFetch) {
    const cached = await getCachedData<Movie[]>(cacheKey);
    if (cached) return cached;
  }

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
      ],
      forceFetch
    );

    const movies: Movie[] = results.map((page) => {
      const typeValue = extractProperty(page, NOTION_PROPERTIES.TYPE, "select")?.toLowerCase() || "movie";
      const statusValue = extractProperty(page, NOTION_PROPERTIES.STATUS, "select")?.toLowerCase() || "watched";
      return {
        id: page.id,
        title: extractProperty(page, NOTION_PROPERTIES.TITLE, "title") || "",
        type: typeValue === "series" ? "series" : "movie",
        status: statusValue === "watchlist" ? "watchlist" : "watched",
        director: extractProperty(page, NOTION_PROPERTIES.DIRECTOR, "rich_text") || undefined,
        rating: extractProperty(page, NOTION_PROPERTIES.RATING, "number") || 0,
        watchedDate: extractProperty(page, NOTION_PROPERTIES.WATCHED_DATE, "date") || "",
        poster: extractProperty(page, NOTION_PROPERTIES.POSTER, "url") || undefined,
        year: extractProperty(page, NOTION_PROPERTIES.YEAR, "number") || undefined,
        genre: (() => { const g = extractProperty(page, NOTION_PROPERTIES.GENRE, "multi_select"); return g && g.length > 0 ? g : undefined; })(),
      };
    });

    await setCachedData(cacheKey, movies);
    return movies;
  } catch {
    return [];
  }
}

