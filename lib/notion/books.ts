import { queryDatabase } from "./client";
import { Book } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";
import { NOTION_PROPERTIES } from "./constants";

export async function getBooks(forceFetch = false): Promise<Book[]> {
  const cacheKey = "books";
  if (!forceFetch) {
    const cached = await getCachedData<Book[]>(cacheKey);
    if (cached) return cached;
  }

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
      ],
      forceFetch
    );

    const books: Book[] = results.map((page) => {
      const statusValue = (extractProperty(page, NOTION_PROPERTIES.STATUS, "select") || "").toLowerCase();
      const status: Book["status"] =
        statusValue === "reading" || statusValue === "in progress"
          ? "reading"
          : statusValue === "readlist" || statusValue === "to read" || statusValue === "to-read"
            ? "readlist"
            : "read";

      return {
        id: page.id,
        title: extractProperty(page, NOTION_PROPERTIES.TITLE, "title") || "",
        author: extractProperty(page, NOTION_PROPERTIES.AUTHOR, "rich_text") || "",
        status,
        rating: extractProperty(page, NOTION_PROPERTIES.RATING, "number") || 0,
        readDate: extractProperty(page, NOTION_PROPERTIES.READ_DATE, "date") || "",
        cover: extractProperty(page, NOTION_PROPERTIES.COVER, "url") || undefined,
        genre: (() => { const g = extractProperty(page, NOTION_PROPERTIES.GENRE, "multi_select"); return g && g.length > 0 ? g : undefined; })(),
        pages: extractProperty(page, NOTION_PROPERTIES.PAGES, "number") || undefined,
        year: extractProperty(page, NOTION_PROPERTIES.YEAR, "number") || undefined,
      };
    });

    await setCachedData(cacheKey, books);
    return books;
  } catch {
    return [];
  }
}

