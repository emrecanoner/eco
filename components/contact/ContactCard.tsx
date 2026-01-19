"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ContactCardProps {
  type: "email" | "twitter" | "github";
  icon: React.ReactNode;
  value: string;
  label: string;
  href: string;
}

export function ContactCard({ icon, value, label, href }: ContactCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group block focus-ring"
        aria-label={`Visit ${label}`}
      >
            <div className="flex w-48 flex-col items-center rounded-lg border border-zinc-200 bg-white p-4 text-center transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 sm:w-56 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 sm:mb-4 sm:h-12 sm:w-12">
                {icon}
              </div>
              <p className="mb-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 sm:text-sm">
                {value}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{label}</p>
            </div>
      </Link>
    </motion.div>
  );
}

