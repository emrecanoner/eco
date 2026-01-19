"use client";

import { Profile } from "@/lib/utils/types";
import { motion } from "framer-motion";

interface SkillsProps {
  profile: Profile;
}

export function Skills({ profile }: SkillsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-xl">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill, index) => (
          <motion.span
            key={skill}
            className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 sm:text-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

