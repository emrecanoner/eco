import { queryDatabase } from "./client";
import { Book } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";
import { NOTION_PROPERTIES } from "./constants";

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
          property: NOTION_PROPERTIES.READ_DATE,
          direction: "descending",
        },
      ]
    );

    const books: Book[] = results.map((page: any) => ({
      id: page.id,
      title: extractProperty(page, NOTION_PROPERTIES.TITLE, "title") || "",
      author: extractProperty(page, NOTION_PROPERTIES.AUTHOR, "rich_text") || "",
      rating: extractProperty(page, NOTION_PROPERTIES.RATING, "number") || 0,
      readDate: extractProperty(page, NOTION_PROPERTIES.READ_DATE, "date") || "",
      cover: extractProperty(page, NOTION_PROPERTIES.COVER, "url") || undefined,
      genre: extractProperty(page, NOTION_PROPERTIES.GENRE, "multi_select") || undefined,
      pages: extractProperty(page, NOTION_PROPERTIES.PAGES, "number") || undefined,
    }));

    await setCachedData(cacheKey, books);
    return books;
  } catch {
    return [];
  }
}

