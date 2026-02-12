"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StatsModal } from "./StatsModal";
import { Book } from "@/lib/utils/types";

interface StatsButtonProps {
  books: Book[];
}

export function StatsButton({ books }: StatsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const readBooks = books.filter((b) => b.status === "read");

  if (readBooks.length === 0) {
    return null;
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:px-4 sm:py-2 sm:text-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        aria-label="View statistics"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span>Stats</span>
      </motion.button>
      <StatsModal isOpen={isOpen} onClose={() => setIsOpen(false)} books={readBooks} />
    </>
  );
}


