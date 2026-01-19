import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not set");
}

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function queryDatabase(
  databaseId: string,
  filter?: any,
  sorts?: any[]
) {
  const requestBody: any = {};
  if (filter) requestBody.filter = filter;
  if (sorts) requestBody.sorts = sorts;
  
  const url = `https://api.notion.com/v1/databases/${databaseId.trim()}/query`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 404) {
      throw new Error(`Database not found. Please check your database ID and ensure the database is shared with your Notion integration.`);
    }
    if (response.status === 401) {
      throw new Error(`Notion API authentication failed.`);
    }
    throw new Error(`Notion API error: ${errorData.message || response.statusText}`);
  }
  
  const data = await response.json();
  return data.results || [];
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

