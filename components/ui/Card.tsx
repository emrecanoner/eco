"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5 ${className} ${
        hover
          ? "hover:border-zinc-300 dark:hover:border-zinc-700"
          : ""
      }`}
      whileHover={hover ? { y: -1 } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

