import { NextResponse } from "next/server";
import { getSettings } from "@/lib/notion/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSettings();
    if (!settings) {
      return NextResponse.json({ title: "Portfolio" }, { status: 200 });
    }
    return NextResponse.json({ title: settings.title || "Portfolio" });
  } catch {
    return NextResponse.json({ title: "Portfolio" }, { status: 200 });
  }
}

