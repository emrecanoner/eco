import { queryDatabase, getPageContent } from "./client";
import { BlogPost } from "@/lib/utils/types";
import { getCachedData, setCachedData } from "@/lib/utils/cache";
import { extractProperty } from "./utils";

export async function getBlogPosts(): Promise<BlogPost[]> {
  const cacheKey = "blog-posts";
  const cached = await getCachedData<BlogPost[]>(cacheKey);
  if (cached) return cached;

  if (!process.env.NOTION_BLOG_DB) {
    return [];
  }

  try {
    const results = await queryDatabase(
      process.env.NOTION_BLOG_DB,
      {
        property: "Status",
        select: {
          equals: "published",
        },
      },
      [
        {
          property: "Published Date",
          direction: "descending",
        },
      ]
    );

    const posts: BlogPost[] = await Promise.all(
      results.map(async (page: any) => {
        const post: BlogPost = {
          id: page.id,
          title: extractProperty(page, "Title", "title") || "",
          slug: extractProperty(page, "Slug", "rich_text") || "",
          publishedDate: extractProperty(page, "Published Date", "date") || "",
          status: (extractProperty(page, "Status", "select") || "draft") as "published" | "draft",
          excerpt: extractProperty(page, "Excerpt", "rich_text") || undefined,
          coverImage: extractProperty(page, "Cover Image", "url") || undefined,
          content: null,
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
    const results = await queryDatabase(process.env.NOTION_BLOG_DB, {
      property: "Slug",
      rich_text: {
        equals: slug,
      },
    });

    if (results.length === 0) return null;

    const page = results[0];
    const content = await getPageContent(page.id);

    const post: BlogPost = {
      id: page.id,
      title: extractProperty(page, "Title", "title") || "",
      slug: extractProperty(page, "Slug", "rich_text") || "",
      publishedDate: extractProperty(page, "Published Date", "date") || "",
      status: (extractProperty(page, "Status", "select") || "draft") as "published" | "draft",
      excerpt: extractProperty(page, "Excerpt", "rich_text") || undefined,
      coverImage: extractProperty(page, "Cover Image", "url") || undefined,
      content,
    };

    return post;
  } catch {
    return null;
  }
}

