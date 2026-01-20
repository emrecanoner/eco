import { NextResponse } from "next/server";
import { getProfile } from "@/lib/notion/profile";
import { getBlogPosts } from "@/lib/notion/blog";
import { getMovies } from "@/lib/notion/movies";
import { getBooks } from "@/lib/notion/books";
import { getSettings } from "@/lib/notion/settings";
import { clearCache } from "@/lib/utils/cache";
import { revalidateAllPages } from "@/lib/utils/revalidation";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (token !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // Clear file-system cache
    await clearCache();

    // Fetch fresh data from Notion with forceFetch: true
    const [profile, blogPosts, movies, books, settings] = await Promise.all([
      getProfile(true),
      getBlogPosts(true),
      getMovies(true),
      getBooks(true),
      getSettings(true),
    ]);

    // Revalidate all pages to ensure fresh data is shown
    revalidateAllPages();

    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
      timestamp: new Date().toISOString(),
      data: {
        profile: profile ? "fetched" : "not found",
        blogPosts: blogPosts.length,
        movies: movies.length,
        books: books.length,
        settings: settings ? "fetched" : "not found",
      },
    });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { 
        error: "Cron job failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

