"use client";

import { Profile } from "@/lib/utils/types";
import { motion } from "framer-motion";

interface ContactProps {
  profile: Profile;
}

const socialIcons: Record<string, { label: string }> = {
  github: { label: "GitHub" },
  linkedin: { label: "LinkedIn" },
  twitter: { label: "Twitter" },
  website: { label: "Website" },
};

export function Contact({ profile }: ContactProps) {
  const socialLinks = Object.entries(profile.socialLinks).filter(
    ([, url]) => url
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-xl">
        Contact
      </h2>
      <div className="space-y-4">
        {profile.email && (
          <motion.a
            href={`mailto:${profile.email}`}
            className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 focus-ring dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Send email to ${profile.email}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <svg
                className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">Email</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{profile.email}</p>
            </div>
          </motion.a>
        )}
        {socialLinks.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {socialLinks.map(([platform, url]) => (
              <motion.a
                key={platform}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 rounded-lg border border-zinc-200 bg-white p-4 text-center transition-all hover:border-zinc-300 focus-ring dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                aria-label={`Visit ${socialIcons[platform]?.label || platform} profile`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <span className="text-lg font-bold text-zinc-600 dark:text-zinc-400">
                    {platform === "github" && "G"}
                    {platform === "linkedin" && "L"}
                    {platform === "twitter" && "T"}
                    {platform === "website" && "W"}
                  </span>
                </div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 sm:text-sm">
                  {socialIcons[platform]?.label || platform}
                </span>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

