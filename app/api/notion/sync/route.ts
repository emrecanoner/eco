import { NextResponse } from "next/server";
import { getProfile } from "@/lib/notion/profile";
import { getBlogPosts } from "@/lib/notion/blog";
import { getMovies } from "@/lib/notion/movies";
import { getBooks } from "@/lib/notion/books";
import { getSettings } from "@/lib/notion/settings";
import { clearCache } from "@/lib/utils/cache";
import { revalidateAllPages } from "@/lib/utils/revalidation";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await clearCache();

    await Promise.all([
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
      message: "Notion data synced successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error syncing Notion data:", error);
    return NextResponse.json(
      { error: "Failed to sync Notion data" },
      { status: 500 }
    );
  }
}

