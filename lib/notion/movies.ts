import { queryDatabase } from "./client";
import { Movie } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";

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
          property: "Watched Date",
          direction: "descending",
        },
      ]
    );

    const movies: Movie[] = results.map((page: any) => {
      const typeValue = extractProperty(page, "Type", "select")?.toLowerCase() || "movie";
      return {
        id: page.id,
        title: extractProperty(page, "Title", "title") || "",
        type: typeValue === "series" ? "series" : "movie",
        rating: extractProperty(page, "Rating", "number") || 0,
        watchedDate: extractProperty(page, "Watched Date", "date") || "",
        poster: extractProperty(page, "Poster", "url") || undefined,
        year: extractProperty(page, "Year", "number") || undefined,
        genre: extractProperty(page, "Genre", "multi_select") || undefined,
      };
    });

    await setCachedData(cacheKey, movies);
    return movies;
  } catch {
    return [];
  }
}

