import { queryDatabase } from "./client";
import { Book } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";

export async function getBooks(): Promise<Book[]> {
  const cacheKey = "books";
  const cached = await getCachedData<Book[]>(cacheKey);
  if (cached) return cached;

  if (!process.env.NOTION_BOOKS_DB) {
    return [];
  }

  try {
    const results = await queryDatabase(
      process.env.NOTION_BOOKS_DB,
      undefined,
      [
        {
          property: "Read Date",
          direction: "descending",
        },
      ]
    );

    const books: Book[] = results.map((page: any) => ({
      id: page.id,
      title: extractProperty(page, "Title", "title") || "",
      author: extractProperty(page, "Author", "rich_text") || "",
      rating: extractProperty(page, "Rating", "number") || 0,
      readDate: extractProperty(page, "Read Date", "date") || "",
      cover: extractProperty(page, "Cover", "url") || undefined,
      genre: extractProperty(page, "Genre", "multi_select") || undefined,
      pages: extractProperty(page, "Pages", "number") || undefined,
    }));

    await setCachedData(cacheKey, books);
    return books;
  } catch {
    return [];
  }
}

