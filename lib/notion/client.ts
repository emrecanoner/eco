import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NOTION_API_VERSION } from "./constants";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not set");
}

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

type NotionFilter = {
  property?: string;
  select?: { equals?: string };
  rich_text?: { equals?: string };
  title?: { equals?: string };
  [key: string]: unknown;
};

type NotionSort = {
  property?: string;
  direction?: "ascending" | "descending";
  [key: string]: unknown;
};

export async function queryDatabase(
  databaseId: string,
  filter?: NotionFilter,
  sorts?: NotionSort[],
  forceFetch?: boolean
): Promise<PageObjectResponse[]> {
  const baseBody: {
    filter?: NotionFilter;
    sorts?: NotionSort[];
  } = {};

  if (filter) baseBody.filter = filter;
  if (sorts) baseBody.sorts = sorts;

  const url = `https://api.notion.com/v1/databases/${databaseId.trim()}/query`;

  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;
  let hasMore = true;
  let guard = 0;

  while (hasMore) {
    guard += 1;
    if (guard > 1000) {
      throw new Error("Notion API pagination exceeded safe limit.");
    }

    const body = cursor ? { ...baseBody, start_cursor: cursor } : baseBody;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": NOTION_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: forceFetch ? "no-store" : "force-cache",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        throw new Error(
          "Database not found. Please check your database ID and ensure the database is shared with your Notion integration."
        );
      }
      if (response.status === 401) {
        throw new Error("Notion API authentication failed.");
      }
      throw new Error(`Notion API error: ${errorData.message || response.statusText}`);
    }

    const data: {
      results?: PageObjectResponse[];
      has_more?: boolean;
      next_cursor?: string | null;
    } = await response.json();

    if (Array.isArray(data.results)) {
      results.push(...data.results);
    }

    hasMore = Boolean(data.has_more);
    cursor = data.next_cursor || undefined;
  }

  return results;
}

export async function getPage(pageId: string) {
  return await notionClient.pages.retrieve({ page_id: pageId });
}

export async function getPageContent(pageId: string) {
  const blocks = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notionClient.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    cursor = response.next_cursor || undefined;
  } while (cursor);

  return blocks;
}

