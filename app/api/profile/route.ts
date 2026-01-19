import { NextResponse } from "next/server";
import { getProfile } from "@/lib/notion/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

