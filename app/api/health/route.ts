import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
    commitRef: process.env.VERCEL_GIT_COMMIT_REF || null,
    deployedAt: new Date().toISOString(),
  });
}


