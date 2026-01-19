"use client";

import { Profile } from "@/lib/utils/types";
import { motion } from "framer-motion";

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-xl">
        About
      </h2>
      <p className="text-sm leading-normal text-zinc-600 dark:text-zinc-400 sm:text-base">
        {profile.bio}
      </p>
    </motion.div>
  );
}

