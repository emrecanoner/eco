import { NextResponse } from "next/server";
import { getProfile } from "@/lib/notion/profile";
import { getBlogPosts } from "@/lib/notion/blog";
import { getMovies } from "@/lib/notion/movies";
import { getBooks } from "@/lib/notion/books";
import { getSettings } from "@/lib/notion/settings";
import { clearCache } from "@/lib/utils/cache";

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
    await clearCache();

    await Promise.all([
      getProfile(true),
      getBlogPosts(true),
      getMovies(true),
      getBooks(true),
      getSettings(true),
    ]);

    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}

