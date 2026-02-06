"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function ContactCard({ icon, label, href }: ContactCardProps) {
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
        className="group block"
        aria-label={`Visit ${label}`}
      >
            <div className="flex w-48 min-w-0 min-h-[140px] flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-5 text-center transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 sm:w-56 sm:min-h-[160px] sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 sm:mb-4 sm:h-12 sm:w-12">
                {icon}
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</p>
            </div>
      </Link>
    </motion.div>
  );
}

