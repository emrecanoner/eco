import { queryDatabase, getPageContent } from "./client";
import { BlogPost } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";
import { NOTION_PROPERTIES } from "./constants";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export async function getBlogPosts(forceFetch = false): Promise<BlogPost[]> {
  const cacheKey = "blog-posts";
  if (!forceFetch) {
    const cached = await getCachedData<BlogPost[]>(cacheKey);
    if (cached) return cached;
  }

  if (!process.env.NOTION_BLOG_DB) {
    return [];
  }

  try {
    const results = await queryDatabase(
      process.env.NOTION_BLOG_DB,
      {
        property: NOTION_PROPERTIES.STATUS,
        select: {
          equals: "published",
        },
      },
      [
        {
          property: NOTION_PROPERTIES.PUBLISHED_DATE,
          direction: "descending",
        },
      ],
      forceFetch
    );

    const posts: BlogPost[] = await Promise.all(
      results.map(async (page) => {
        const post: BlogPost = {
          id: page.id,
          slug: extractProperty(page, NOTION_PROPERTIES.SLUG, "title") || "",
          title: extractProperty(page, NOTION_PROPERTIES.TITLE, "rich_text") || "",
          publishedDate: extractProperty(page, NOTION_PROPERTIES.PUBLISHED_DATE, "date") || "",
          status: (extractProperty(page, NOTION_PROPERTIES.STATUS, "select") || "draft") as "published" | "draft",
          excerpt: extractProperty(page, NOTION_PROPERTIES.EXCERPT, "rich_text") || undefined,
          coverImage: extractProperty(page, NOTION_PROPERTIES.COVER_IMAGE, "url") || undefined,
          content: null as BlockObjectResponse[] | null,
        };
        return post;
      })
    );

    await setCachedData(cacheKey, posts);
    return posts;
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!process.env.NOTION_BLOG_DB) {
    return null;
  }

  try {
    const results = await queryDatabase(
      process.env.NOTION_BLOG_DB,
      {
        property: NOTION_PROPERTIES.SLUG,
        title: {
          equals: slug,
        },
      }
    );

    // Filter by status manually
    const publishedResults = results.filter((page) => {
      const status = extractProperty(page, NOTION_PROPERTIES.STATUS, "select");
      return status?.toLowerCase() === "published";
    });

    if (publishedResults.length === 0) return null;

    const page = publishedResults[0];
    const content = await getPageContent(page.id);

    const post: BlogPost = {
      id: page.id,
      title: extractProperty(page, NOTION_PROPERTIES.TITLE, "rich_text") || "",
      slug: extractProperty(page, NOTION_PROPERTIES.SLUG, "title") || "",
      publishedDate: extractProperty(page, NOTION_PROPERTIES.PUBLISHED_DATE, "date") || "",
      status: (extractProperty(page, NOTION_PROPERTIES.STATUS, "select") || "draft") as "published" | "draft",
      excerpt: extractProperty(page, NOTION_PROPERTIES.EXCERPT, "rich_text") || undefined,
      coverImage: extractProperty(page, NOTION_PROPERTIES.COVER_IMAGE, "url") || undefined,
      content,
    };

    return post;
  } catch {
    return null;
  }
}

