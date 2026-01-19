"use client";

import Link from "next/link";
import { Profile } from "@/lib/utils/types";

interface HeroProps {
  profile: Profile;
  title?: string;
}

export function Hero({ profile, title }: HeroProps) {
  const displayTitle = title || profile.name;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
        <Link href="/portfolio" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-ring">
          Portfolio
        </Link>
        <span className="text-zinc-400 dark:text-zinc-500">·</span>
        <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-ring">
          Contact
        </Link>
      </div>
      <div className="space-y-4">
        <h1 className="text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-7xl md:text-8xl lg:text-9xl">
          {displayTitle}
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
          {profile.title}
        </p>
      </div>
    </div>
  );
}

